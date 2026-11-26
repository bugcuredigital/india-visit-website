/**
 * POST /api/lead — every form on the site posts here.
 * ---------------------------------------------------------------------------
 * M6-minimal went live on 2026-11-12 (validation, honeypot, one email through
 * Resend). The launch-prep session (26 Nov) added the rest of runbook M6
 * step 2: Turnstile verified server-side, a copy of every lead in a Google
 * Sheet, the UTM capture, and the itinerary-PDF release.
 *
 * In order, for one submission:
 *   1. honeypot      a filled trap gets the success answer and nothing else
 *   2. which form    the newsletter is refused; the PDF form only while
 *                    PDF_GATE_LIVE (src/lib/forms.ts) is on
 *   3. validation    the same messages the browser shows (src/lib/forms.ts)
 *   4. Turnstile     after validation, so a typo never burns the visitor's
 *                    single-use token
 *   5. email         to the address in Site settings, reply-to the visitor
 *   6. answer        JSON for the page's script, a plain page without it;
 *                    the PDF form's answer carries a signed download link
 *   7. Sheet         a row per lead, written after the answer has gone
 *
 * Every variable is optional except RESEND_API_KEY, and each one switches its
 * own step on, so the function behaves as before until a key is set
 * (LAUNCH_DAY.md, "Before launch day", lists them).
 *
 * The recipient is read from src/content/siteSettings/settings.json at build
 * time (invariant #1 — nothing editable is hardcoded): change the email in the
 * CMS and the next deploy re-bundles this function with it.
 *
 * Environment (Cloudflare Pages → Settings → Variables and Secrets, Production + Preview):
 *   RESEND_API_KEY        required — a Resend key with sending access
 *   LEAD_FROM             optional — defaults to "India Visit website <enquiries@india-visit.com>";
 *                         the domain must be verified in Resend
 *   TURNSTILE_SECRET_KEY  optional — with it, every lead must carry a valid Turnstile token.
 *                         Its partner PUBLIC_TURNSTILE_SITE_KEY is read at BUILD time by the
 *                         forms' script; set both, then redeploy
 *   SHEET_WEBHOOK_URL     optional — the Apps Script web app (scripts/sheet-webhook/lead-sheet.gs)
 *   SHEET_WEBHOOK_SECRET  optional — must equal the script's SHARED_SECRET property
 *   PDF_LINK_SECRET       required for the PDF release — signs the download links (src/lib/pdf-link.ts)
 */
import siteSettings from '../../src/content/siteSettings/settings.json';
import {
  FIELD_MESSAGES,
  HONEYPOT_FIELD,
  LEAD_ERROR,
  LEAD_SUCCESS as SUCCESS,
  PDF_DOWNLOAD_LABEL,
  PDF_GATE_LIVE,
  PDF_READY,
} from '../../src/lib/forms';
import { PDF_SLUG, signPdfLink } from '../../src/lib/pdf-link';

export interface Env {
  RESEND_API_KEY?: string;
  LEAD_FROM?: string;
  TURNSTILE_SECRET_KEY?: string;
  SHEET_WEBHOOK_URL?: string;
  SHEET_WEBHOOK_SECRET?: string;
  PDF_LINK_SECRET?: string;
  /** Pages' static-asset binding: used to check a PDF exists before linking to it. */
  ASSETS?: { fetch: (request: Request) => Promise<Response> };
}

interface Context {
  request: Request;
  env: Env;
  /** Pages keeps the function alive for this after the answer is sent. */
  waitUntil?: (promise: Promise<unknown>) => void;
}

interface Answer {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
  /** The PDF form only: the signed link to the itinerary. */
  download?: string;
}

const RECIPIENT = siteSettings.settings.email;
const DEFAULT_FROM = 'India Visit website <enquiries@india-visit.com>';
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/** Turnstile's widget adds this field to the form. */
const TURNSTILE_FIELD = 'cf-turnstile-response';

/** The honeypot (src/lib/forms.ts says why its name must mean nothing to AutoFill). */
const HONEYPOTS = [HONEYPOT_FIELD];

const LIMITS: Record<string, number> = {
  name: 120, phone: 40, email: 160, message: 3000, notes: 3000,
  // the corporate brief (round 5, #78)
  company: 160, groupSize: 40, travelDates: 120, budget: 40,
  utm: 300,
};
/** Any field not listed above, and the Turnstile token, which runs to about 2,000 characters. */
const DEFAULT_LIMIT = 3000;
const TOKEN_LIMIT = 4096;
const MAX_FIELDS = 40;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

function answer(request: Request, status: number, body: Answer) {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  if (wantsJson) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
  // No JavaScript: a plain page with the same message, or the reasons it was
  // refused, and a way back. A real refusal never reads as a success.
  const back = request.headers.get('referer') ?? '/';
  const reasons = body.errors ? [...new Set(Object.values(body.errors))].join(' ') : '';
  const text = body.ok ? (body.message ?? SUCCESS) : reasons || LEAD_ERROR;
  const download = body.download
    ? `<p><a href="${escapeHtml(body.download)}" style="color:#C3163A;font-weight:600">${escapeHtml(PDF_DOWNLOAD_LABEL)}</a></p>`
    : '';
  return new Response(
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>India Visit</title>` +
      `<body style="font-family:system-ui,sans-serif;max-width:36rem;margin:15vh auto;padding:0 1rem;color:#1A1523">` +
      `<p style="font-size:1.25rem">${escapeHtml(text)}</p>${download}<p><a href="${escapeHtml(back)}" style="color:#C3163A">Back to the page</a></p></body></html>`,
    { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } },
  );
}

type TurnstileOutcome = 'off' | 'passed' | 'failed' | 'unreachable';

/**
 * Siteverify, once per token. A definite "no" refuses the lead. Siteverify
 * itself being unreachable lets it through and logs it: losing a real
 * traveller's enquiry to a Cloudflare outage is the worse failure, and the
 * honeypot still stands.
 */
async function checkTurnstile(token: string, env: Env, ip: string | null): Promise<{ outcome: TurnstileOutcome; codes?: string[] }> {
  if (!env.TURNSTILE_SECRET_KEY) return { outcome: 'off' };
  if (!token) return { outcome: 'failed', codes: ['missing-input-response'] };
  try {
    const body = new FormData();
    body.append('secret', env.TURNSTILE_SECRET_KEY);
    body.append('response', token);
    if (ip) body.append('remoteip', ip);
    const response = await fetch(SITEVERIFY, { method: 'POST', body });
    if (!response.ok) return { outcome: 'unreachable', codes: [`http-${response.status}`] };
    const data = (await response.json()) as { success?: boolean; 'error-codes'?: string[] };
    const codes = data['error-codes'] ?? [];
    if (data.success) return { outcome: 'passed' };
    return { outcome: codes.includes('internal-error') ? 'unreachable' : 'failed', codes };
  } catch {
    return { outcome: 'unreachable' };
  }
}

/** What the Sheet stores: the columns of scripts/sheet-webhook/lead-sheet.gs. */
type SheetLead = Record<string, string>;

async function copyToSheet(env: Env, lead: SheetLead, log: (outcome: string, detail?: Record<string, unknown>) => void) {
  if (!env.SHEET_WEBHOOK_URL || !env.SHEET_WEBHOOK_SECRET) return;
  try {
    // Apps Script answers a POST with a redirect to its response; fetch follows it.
    const response = await fetch(env.SHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret: env.SHEET_WEBHOOK_SECRET, lead }),
    });
    const data = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    if (data.ok) log('sheet: written');
    else log('sheet: refused', { status: response.status, error: data.error ?? null });
  } catch (error) {
    log('sheet: failed', { error: String(error).slice(0, 200) });
  }
}

/**
 * The handler, with the PDF switch as an option so scripts/test-lead-function.mts
 * can exercise the PDF release while the switch itself stays off.
 */
export const leadHandler = ({ pdfGateLive = PDF_GATE_LIVE }: { pdfGateLive?: boolean } = {}) =>
  async ({ request, env, waitUntil }: Context): Promise<Response> => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return answer(request, 400, { ok: false, message: 'Unreadable form.' });
  }
  const get = (key: string) => String(form.get(key) ?? '').trim();

  // One log line per outcome, never the visitor's details: Cloudflare's
  // real-time logs then say why any submission did or did not become an email.
  const log = (outcome: string, detail: Record<string, unknown> = {}) =>
    console.log(JSON.stringify({ lead: outcome, page: get('pageUrl') || null, ...detail }));

  // 1. A filled honeypot gets the success answer and no email, so a bot learns nothing.
  const trap = HONEYPOTS.find((key) => get(key));
  if (trap) {
    log('dropped: honeypot', { field: trap });
    return answer(request, 200, { ok: true, message: SUCCESS });
  }

  // 2. Which form. The newsletter has no list to send from yet.
  const leadType = get('leadType');
  const isPdf = leadType === 'pdf';
  if (get('intent') === 'newsletter' || (isPdf && !pdfGateLive)) {
    log('refused: form not live');
    return answer(request, 409, { ok: false, message: 'This form is not live yet.' });
  }
  const journeySlug = get('journeySlug');
  if (isPdf && !PDF_SLUG.test(journeySlug)) {
    log('refused: PDF form without a journey');
    return answer(request, 400, { ok: false, message: 'Unreadable form.' });
  }

  // 3. Validation.
  const keys = [...new Set(form.keys())];
  if (keys.length > MAX_FIELDS) {
    log('refused: too many fields', { count: keys.length });
    return answer(request, 400, { ok: false, message: 'Unreadable form.' });
  }
  const errors: Record<string, string> = {};
  const name = get('name');
  const phone = get('phone');
  const email = get('email');
  if (!name) errors.name = FIELD_MESSAGES.name;
  if (phone.replace(/\D/g, '').length < 7) errors.phone = FIELD_MESSAGES.phone;
  // PRD §8.1: the PDF is released against an email AND a phone number.
  if ((email || isPdf) && !EMAIL.test(email)) errors.email = FIELD_MESSAGES.email;
  if (!form.get('consent')) errors.consent = FIELD_MESSAGES.consent;
  // The corporate brief asks for the company first; the browser enforces it
  // too, this covers a visitor without JavaScript.
  const corporate = leadType === 'corporate';
  const company = get('company');
  if (corporate && !company) errors.company = FIELD_MESSAGES.company;
  for (const key of keys) {
    const max = key === TURNSTILE_FIELD ? TOKEN_LIMIT : (LIMITS[key] ?? DEFAULT_LIMIT);
    if (form.getAll(key).some((value) => String(value).length > max)) errors[key] = FIELD_MESSAGES.tooLong;
  }
  if (Object.keys(errors).length) {
    log('refused: invalid', { fields: Object.keys(errors) });
    return answer(request, 422, { ok: false, errors });
  }

  // 4. Turnstile.
  const turnstile = await checkTurnstile(get(TURNSTILE_FIELD), env, request.headers.get('cf-connecting-ip'));
  if (turnstile.outcome === 'failed') {
    log('refused: turnstile', { codes: turnstile.codes ?? [] });
    return answer(request, 403, { ok: false });
  }
  if (turnstile.outcome === 'unreachable') log('turnstile: unreachable, let through', { codes: turnstile.codes ?? [] });

  if (!env.RESEND_API_KEY) {
    log('refused: RESEND_API_KEY not set');
    return answer(request, 503, { ok: false, message: 'Email is not configured.' });
  }
  if (isPdf && !env.PDF_LINK_SECRET) {
    log('refused: PDF_LINK_SECRET not set');
    return answer(request, 503, { ok: false, message: 'Downloads are not configured.' });
  }

  // A journey added through the CMS has no PDF until the next `npm run pdf:build`.
  // Its visitor still reaches us, and is answered like any enquiry.
  let pdfExists = isPdf;
  if (isPdf && env.ASSETS) {
    const probe = await env.ASSETS.fetch(new Request(new URL(`/downloads/${journeySlug}.pdf`, request.url), { method: 'HEAD' }));
    pdfExists = probe.ok;
  }

  // 5. The email: everything the visitor sent, in a stable order, so the inbox reads the same every time.
  const skip = new Set([...HONEYPOTS, 'consent', TURNSTILE_FIELD]);
  const lines: string[] = [];
  const values: Record<string, string> = {};
  for (const key of keys) {
    if (skip.has(key)) continue;
    const entries = form.getAll(key).map((v) => String(v).trim()).filter(Boolean);
    if (!entries.length) continue;
    values[key] = entries.join(', ');
    lines.push(`${key}: ${values[key]}`);
  }
  const journey = get('journeyTitle');
  const subject = isPdf
    ? `Itinerary download: ${name}${journey ? ` · ${journey}` : ''}`
    : `${corporate ? 'New corporate brief' : 'New enquiry'}: ${name}${company ? ` · ${company}` : ''}${journey ? ` · ${journey}` : ''}`;
  const footer = isPdf && !pdfExists ? `\n\nNo PDF is built for "${journeySlug}" yet, so none was released: please reply with the itinerary.` : '';

  let emailStatus = 'sent';
  try {
    const sent = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: env.LEAD_FROM || DEFAULT_FROM,
        to: [RECIPIENT],
        ...(email && EMAIL.test(email) ? { reply_to: email } : {}),
        subject,
        text: `${lines.join('\n')}\n\nSent from the website form at ${get('pageUrl') || 'an unknown page'}.${footer}`,
      }),
    });
    if (sent.ok) {
      const receipt = (await sent.json().catch(() => ({}))) as { id?: string };
      log('sent', { resendId: receipt.id ?? null, turnstile: turnstile.outcome });
    } else {
      emailStatus = `failed (${sent.status})`;
      log('failed: resend', { status: sent.status, body: (await sent.text()).slice(0, 300) });
    }
  } catch (error) {
    emailStatus = 'failed (network)';
    log('failed: resend', { error: String(error).slice(0, 200) });
  }

  // 7. The Sheet row, after the answer: Apps Script takes a second or two.
  const known = new Set(['leadType', 'name', 'phone', 'email', 'company', 'journeyTitle', 'message', 'notes', 'pageUrl', 'utm']);
  const sheetLead: SheetLead = {
    leadType,
    name,
    phone,
    email,
    company,
    journeyTitle: journey,
    message: [get('message'), get('notes')].filter(Boolean).join('\n'),
    details: Object.entries(values)
      .filter(([key]) => !known.has(key))
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n'),
    pageUrl: get('pageUrl'),
    utm: get('utm'),
    emailStatus,
  };
  const sheet = copyToSheet(env, sheetLead, log);
  if (waitUntil) waitUntil(sheet);
  else await sheet;

  // 6. The answer. An enquiry whose email failed is a refusal: the visitor is
  // told to call, because nobody would otherwise see it until the Sheet is
  // read. A PDF is released either way; the Sheet keeps the lead.
  if (isPdf) {
    if (!pdfExists) return answer(request, 200, { ok: true, message: SUCCESS });
    const download = await signPdfLink(journeySlug, env.PDF_LINK_SECRET as string);
    log('pdf: released', { journey: journeySlug });
    return answer(request, 200, { ok: true, message: PDF_READY, download });
  }
  if (emailStatus !== 'sent') return answer(request, 502, { ok: false, message: 'Sending failed.' });
  return answer(request, 200, { ok: true, message: SUCCESS });
};

export const onRequestPost = leadHandler();
