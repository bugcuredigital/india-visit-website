/**
 * POST /api/lead — the lead endpoint, M6-minimal (2026-11-12, demo build).
 * ---------------------------------------------------------------------------
 * Validation, honeypot, one email through Resend to the address in Site
 * settings, and a JSON answer the form turns into its success state. Turnstile
 * and the Google Sheet webhook follow after the demo (runbook M6 step 2); the
 * PDF gate and the newsletter stay "Launching shortly" until then.
 *
 * The recipient is read from src/content/siteSettings/settings.json at build
 * time (invariant #1 — nothing editable is hardcoded): change the email in the
 * CMS and the next deploy re-bundles this function with it.
 *
 * Environment (Cloudflare Pages → Settings → Variables, Production + Preview):
 *   RESEND_API_KEY   required — a Resend key with sending access
 *   LEAD_FROM        optional — defaults to "India Visit website <enquiries@india-visit.com>";
 *                    the domain must be verified in Resend
 */
import siteSettings from '../../src/content/siteSettings/settings.json';
import { LEAD_SUCCESS as SUCCESS } from '../../src/lib/forms';

interface Env {
  RESEND_API_KEY?: string;
  LEAD_FROM?: string;
}

interface Context {
  request: Request;
  env: Env;
}

const RECIPIENT = siteSettings.settings.email;
const DEFAULT_FROM = 'India Visit website <enquiries@india-visit.com>';

/** Both honeypots: EnquiryForm's and Plan-My-Trip's. Real people never fill them. */
const HONEYPOTS = ['companyUrl', 'companyWebsite'];

const LIMITS: Record<string, number> = { name: 120, phone: 40, email: 160, message: 3000, notes: 3000 };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

function answer(request: Request, status: number, body: { ok: boolean; message?: string; errors?: Record<string, string> }) {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  if (wantsJson) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
  // No JavaScript: a plain page with the same message and a way back.
  const back = request.headers.get('referer') ?? '/';
  const text = body.ok ? SUCCESS : 'Sorry, that did not go through. Please call or WhatsApp us.';
  return new Response(
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>India Visit</title>` +
      `<body style="font-family:system-ui,sans-serif;max-width:36rem;margin:15vh auto;padding:0 1rem;color:#1A1523">` +
      `<p style="font-size:1.25rem">${escapeHtml(text)}</p><p><a href="${escapeHtml(back)}" style="color:#C3163A">Back to the page</a></p></body></html>`,
    { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } },
  );
}

export const onRequestPost = async ({ request, env }: Context): Promise<Response> => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return answer(request, 400, { ok: false, message: 'Unreadable form.' });
  }
  const get = (key: string) => String(form.get(key) ?? '').trim();

  // A filled honeypot gets the success answer and no email, so a bot learns nothing.
  if (HONEYPOTS.some((key) => get(key))) return answer(request, 200, { ok: true, message: SUCCESS });

  if (get('intent') === 'newsletter' || get('leadType') === 'pdf') {
    return answer(request, 409, { ok: false, message: 'This form is not live yet.' });
  }

  const errors: Record<string, string> = {};
  const name = get('name');
  const phone = get('phone');
  const email = get('email');
  if (!name) errors.name = 'Please tell us your name.';
  if (phone.replace(/\D/g, '').length < 7) errors.phone = 'Please give a phone or WhatsApp number.';
  if (email && !EMAIL.test(email)) errors.email = 'That email address does not look right.';
  if (!form.get('consent')) errors.consent = 'Please tick the consent box.';
  for (const [key, max] of Object.entries(LIMITS)) if (get(key).length > max) errors[key] = 'That is longer than we can take.';
  if (Object.keys(errors).length) return answer(request, 422, { ok: false, errors });

  if (!env.RESEND_API_KEY) return answer(request, 503, { ok: false, message: 'Email is not configured.' });

  // Everything the visitor sent, in a stable order, so the inbox reads the same every time.
  const skip = new Set([...HONEYPOTS, 'consent']);
  const lines: string[] = [];
  for (const key of new Set(form.keys())) {
    if (skip.has(key)) continue;
    const values = form.getAll(key).map((v) => String(v).trim()).filter(Boolean);
    if (values.length) lines.push(`${key}: ${values.join(', ')}`);
  }
  const journey = get('journeyTitle');
  const subject = `New enquiry: ${name}${journey ? ` · ${journey}` : ''}`;

  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.LEAD_FROM || DEFAULT_FROM,
      to: [RECIPIENT],
      ...(email && EMAIL.test(email) ? { reply_to: email } : {}),
      subject,
      text: `${lines.join('\n')}\n\nSent from the website form at ${get('pageUrl') || 'an unknown page'}.`,
    }),
  });

  if (!sent.ok) {
    console.log('resend error', sent.status, (await sent.text()).slice(0, 300));
    return answer(request, 502, { ok: false, message: 'Sending failed.' });
  }
  return answer(request, 200, { ok: true, message: SUCCESS });
};
