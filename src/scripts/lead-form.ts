/**
 * Live lead forms: validate, submit in place, then show the success state.
 * ---------------------------------------------------------------------------
 * Applies only to forms marked `data-live` (src/lib/forms.ts decides which).
 * Without JavaScript the same form still posts to /api/lead, which answers a
 * plain page: the thank-you, or the reasons it was refused. (Once Turnstile is
 * switched on, a visitor without JavaScript cannot pass it, and that page
 * tells them to call or WhatsApp instead.)
 *
 * ONE submit listener on the document, never one per form. Astro's
 * ClientRouter swaps the page on every navigation but evaluates this module
 * once per visit, so forms bound at load time left every form reached through
 * a link without a handler, and the router then posted it as a page
 * navigation, raw and unvalidated (2026-11-12, Plan My Trip accepted an
 * unticked consent box). A delegated listener covers every live form on every
 * page, however the visitor arrived. It listens in the CAPTURE phase: the
 * router's own submit listener sits on the document too, skips only a submit
 * that is already prevented, and would otherwise win. The forms also carry
 * `data-astro-reload`, so if this script never loads the router still leaves
 * them alone and the browser posts them as an ordinary page.
 *
 * The forms carry `novalidate` so the browser does not interrupt a half-filled
 * stepper. Validity is checked here, on submit, and every refusal is written
 * out under the button: the browser's own bubble does not show on every phone.
 * The server validates again regardless, and its reasons are shown the same way.
 *
 * Turnstile (26 Nov 2026). Only when PUBLIC_TURNSTILE_SITE_KEY was set at build
 * time. Its script is fetched the first time a visitor touches a live form,
 * never on page load, so it costs the page nothing until someone starts to
 * enquire. The widget is "interaction-only": invisible unless Cloudflare wants
 * a click, and then it appears in the form's `[data-turnstile]` box. Its token
 * travels in the form as `cf-turnstile-response`; a token is single-use, so
 * the widget is reset after every answer that is not a success.
 */
import { fieldMessage } from '../lib/forms';
import { campaign, track } from './tracking';

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

interface TurnstileApi {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const LIVE = 'form[data-lead-form][data-live]';
const SITE_KEY = (import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined) ?? '';
const TURNSTILE_API = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
/** How long a submit waits for the token before saying so. */
const TOKEN_WAIT_MS = 15000;

const isField = (el: unknown): el is Field =>
  el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement;

/* ------------------------------------------------------------- Turnstile -- */

interface Widget {
  id?: string;
  token: string;
  waiting: Array<(token: string) => void>;
}

const widgets = new WeakMap<HTMLFormElement, Widget>();
const rendered = new Set<string>();
let api: Promise<TurnstileApi> | null = null;

function loadTurnstile(): Promise<TurnstileApi> {
  api ??= new Promise<TurnstileApi>((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const script = document.createElement('script');
    script.src = TURNSTILE_API;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile')));
    script.onerror = () => {
      api = null;
      reject(new Error('turnstile'));
    };
    document.head.append(script);
  });
  return api;
}

function settle(widget: Widget, token: string) {
  widget.token = token;
  if (!token) return;
  for (const resolve of widget.waiting.splice(0)) resolve(token);
}

/** The form's widget, rendered on first use. Null when Turnstile is off. */
function widgetFor(form: HTMLFormElement): Widget | null {
  if (!SITE_KEY) return null;
  const known = widgets.get(form);
  if (known) return known;
  const box = form.querySelector<HTMLElement>('[data-turnstile]');
  if (!box) return null;
  const widget: Widget = { token: '', waiting: [] };
  widgets.set(form, widget);
  const leadType = (form.elements.namedItem('leadType') as HTMLInputElement | null)?.value ?? 'lead';
  loadTurnstile()
    .then((turnstile) => {
      widget.id = turnstile.render(box, {
        sitekey: SITE_KEY,
        appearance: 'interaction-only',
        action: leadType.replace(/[^a-z0-9_-]/gi, '').slice(0, 32) || 'lead',
        'refresh-expired': 'auto',
        callback: (token: string) => settle(widget, token),
        'expired-callback': () => settle(widget, ''),
        'error-callback': () => settle(widget, ''),
      });
      rendered.add(widget.id);
    })
    .catch(() => {
      // The script could not load. The submit goes ahead without a token and
      // the server refuses it with the "please call or WhatsApp" line.
      for (const resolve of widget.waiting.splice(0)) resolve('');
    });
  return widget;
}

function tokenFor(widget: Widget): Promise<string> {
  if (widget.token) return Promise.resolve(widget.token);
  return new Promise((resolve) => {
    widget.waiting.push(resolve);
    setTimeout(() => resolve(widget.token), TOKEN_WAIT_MS);
  });
}

function resetWidget(widget: Widget | null) {
  if (!widget?.id || !window.turnstile) return;
  widget.token = '';
  try {
    window.turnstile.reset(widget.id);
  } catch {
    /* the widget left with its page */
  }
}

// Start Turnstile as soon as someone begins a form, so the token is usually
// ready before they reach the button.
const warm = (event: Event) => {
  const form = event.target instanceof Element ? event.target.closest<HTMLFormElement>(LIVE) : null;
  if (form) widgetFor(form);
};
document.addEventListener('focusin', warm);
document.addEventListener('pointerdown', warm);

// Widgets belong to the page they were drawn on.
document.addEventListener('astro:before-swap', () => {
  if (!window.turnstile) return;
  for (const id of rendered) {
    try {
      window.turnstile.remove(id);
    } catch {
      /* already gone */
    }
  }
  rendered.clear();
});

/* ------------------------------------------------------------- the form -- */

/** Say what is wrong in words, mark the fields, and move focus to the first. */
function refuse(form: HTMLFormElement, status: HTMLElement | null, problems: Record<string, string>) {
  const fields = Object.keys(problems)
    .map((name) => form.elements.namedItem(name))
    .filter(isField);
  for (const field of fields) field.setAttribute('aria-invalid', 'true');
  if (status) status.textContent = [...new Set(Object.values(problems))].join(' ');
  fields[0]?.focus();
}

/** The event GTM receives for an accepted lead (src/scripts/tracking.ts). */
function eventFor(leadType: string): string {
  if (leadType === 'corporate') return 'corporate_submit';
  if (leadType === 'pdf') return 'pdf_download';
  return 'lead_form_submit';
}

document.addEventListener('submit', async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.matches(LIVE)) return;
  event.preventDefault();
  if (form.dataset.leadSending) return;

  const status = form.querySelector<HTMLElement>('[data-lead-status]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const label = button?.querySelector<HTMLElement>('.btn__label');

  for (const el of form.querySelectorAll('[aria-invalid]')) el.removeAttribute('aria-invalid');
  if (status) status.textContent = '';

  const problems: Record<string, string> = {};
  for (const el of Array.from(form.elements)) {
    if (isField(el) && !el.validity.valid && !(el.name in problems)) {
      problems[el.name] = fieldMessage(el.name);
    }
  }
  if (Object.keys(problems).length) {
    refuse(form, status, problems);
    return;
  }

  form.dataset.leadSending = '1';
  const idle = label?.textContent ?? '';
  if (button) button.disabled = true;
  if (label) label.textContent = 'Sending…';

  // The campaign this visit came from, for the email and the Sheet.
  const utm = form.querySelector<HTMLInputElement>('input[data-utm]');
  if (utm && !utm.value) utm.value = campaign();

  const widget = widgetFor(form);
  if (widget) await tokenFor(widget);

  const leadType = (form.elements.namedItem('leadType') as HTMLInputElement | null)?.value ?? '';
  const journeySlug = (form.elements.namedItem('journeySlug') as HTMLInputElement | null)?.value;

  let ok = false;
  let download = '';
  let errors: Record<string, string> = {};
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { accept: 'application/json' },
    });
    const data = await response.json().catch(() => ({}));
    ok = response.ok && data.ok === true;
    if (typeof data.download === 'string' && data.download.startsWith('/downloads/')) download = data.download;
    if (data && typeof data.errors === 'object' && data.errors) errors = data.errors;
  } catch {
    ok = false;
  }

  if (ok) {
    track(eventFor(leadType), { lead_type: leadType || undefined, journey_slug: journeySlug });
    const done = document.createElement('p');
    done.className = 'form__done';
    done.setAttribute('role', 'status');
    done.tabIndex = -1;
    done.textContent = download ? (form.dataset.downloadText ?? '') : (form.dataset.successText ?? '');
    const parts: HTMLElement[] = [done];
    if (download) {
      const link = document.createElement('a');
      link.className = 'form__download';
      link.href = download;
      link.textContent = form.dataset.downloadLabel ?? '';
      parts.push(link);
    }
    form.replaceChildren(...parts);
    done.focus({ preventScroll: false });
    return;
  }

  // A real refusal never looks like success: the reasons, or the fallback line.
  resetWidget(widget);
  delete form.dataset.leadSending;
  if (button) button.disabled = false;
  if (label) label.textContent = idle;
  if (Object.keys(errors).length) refuse(form, status, errors);
  else if (status) status.textContent = form.dataset.errorText ?? '';
}, true);

// Fixing a field clears its mark; fixing the last one clears the message.
const clear = (event: Event) => {
  const field = event.target;
  if (!(field instanceof Element) || field.getAttribute('aria-invalid') !== 'true') return;
  const form = field.closest<HTMLFormElement>(LIVE);
  if (!form) return;
  field.removeAttribute('aria-invalid');
  if (!form.querySelector('[aria-invalid="true"]')) {
    const status = form.querySelector<HTMLElement>('[data-lead-status]');
    if (status) status.textContent = '';
  }
};
document.addEventListener('input', clear);
document.addEventListener('change', clear);
