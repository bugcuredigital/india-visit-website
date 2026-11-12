/**
 * Live lead forms: validate, submit in place, then show the success state.
 * ---------------------------------------------------------------------------
 * Applies only to forms marked `data-live` (src/lib/forms.ts decides which).
 * Without JavaScript the same form still posts to /api/lead, which answers a
 * plain page: the thank-you, or the reasons it was refused.
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
 */
import { FIELD_MESSAGES } from '../lib/forms';

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const LIVE = 'form[data-lead-form][data-live]';

const isField = (el: unknown): el is Field =>
  el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement;

/** Say what is wrong in words, mark the fields, and move focus to the first. */
function refuse(form: HTMLFormElement, status: HTMLElement | null, problems: Record<string, string>) {
  const fields = Object.keys(problems)
    .map((name) => form.elements.namedItem(name))
    .filter(isField);
  for (const field of fields) field.setAttribute('aria-invalid', 'true');
  if (status) status.textContent = [...new Set(Object.values(problems))].join(' ');
  fields[0]?.focus();
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
      problems[el.name] = FIELD_MESSAGES[el.name] ?? FIELD_MESSAGES.fallback;
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

  let ok = false;
  let errors: Record<string, string> = {};
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { accept: 'application/json' },
    });
    const data = await response.json().catch(() => ({}));
    ok = response.ok && data.ok === true;
    if (data && typeof data.errors === 'object' && data.errors) errors = data.errors;
  } catch {
    ok = false;
  }

  if (ok) {
    const done = document.createElement('p');
    done.className = 'form__done';
    done.setAttribute('role', 'status');
    done.tabIndex = -1;
    done.textContent = form.dataset.successText ?? '';
    form.replaceChildren(done);
    done.focus({ preventScroll: false });
    return;
  }

  // A real refusal never looks like success: the reasons, or the fallback line.
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
