/**
 * Tests for the lead function and the PDF downloads function, offline.
 * ---------------------------------------------------------------------------
 * `npm run test:lead`. Every outside service (Turnstile's siteverify, Resend,
 * the Sheet's Apps Script) is replaced by a stub that records what it was
 * sent, so this runs without keys, without a network and without sending a
 * single real email. Static assets (the PDFs) come from a stub ASSETS binding.
 *
 * Turnstile's published test secrets are used for realism only; siteverify
 * itself is stubbed.
 */
import assert from 'node:assert/strict';
import { leadHandler, type Env } from '../functions/api/lead.ts';
import { onRequestGet as downloads } from '../functions/downloads/[[path]].ts';
import { signPdfLink, verifyPdfLink, PDF_LINK_TTL_SECONDS } from '../src/lib/pdf-link.ts';
import { FIELD_MESSAGES, LEAD_SUCCESS, PDF_READY } from '../src/lib/forms.ts';

type Call = { url: string; body: unknown; headers: Record<string, string> };
let calls: Call[] = [];
let siteverify: () => Response | Promise<Response> = () => Response.json({ success: true });
let resend: () => Response | Promise<Response> = () => Response.json({ id: 'test-id' });
let sheet: () => Response | Promise<Response> = () => Response.json({ ok: true });

globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = String(input instanceof Request ? input.url : input);
  let body: unknown = init?.body;
  if (body instanceof FormData) body = Object.fromEntries(body);
  else if (typeof body === 'string') body = JSON.parse(body);
  calls.push({ url, body, headers: Object.fromEntries(new Headers(init?.headers)) });
  if (url.includes('turnstile/v0/siteverify')) return siteverify();
  if (url.includes('api.resend.com')) return resend();
  if (url.includes('script.google.com')) return sheet();
  throw new Error(`unexpected fetch: ${url}`);
}) as typeof fetch;

const PDFS = new Set(['rajasthan-classic-12n-13d']);
const ASSETS = {
  fetch: async (request: Request) => {
    const slug = /\/downloads\/([a-z0-9-]+)\.pdf$/.exec(new URL(request.url).pathname)?.[1] ?? '';
    return PDFS.has(slug)
      ? new Response(request.method === 'HEAD' ? null : '%PDF-1.7 test', { status: 200, headers: { 'content-type': 'application/pdf' } })
      : new Response('not found', { status: 404 });
  },
};

const FULL_ENV: Env = {
  RESEND_API_KEY: 're_test',
  TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
  SHEET_WEBHOOK_URL: 'https://script.google.com/macros/s/TEST/exec',
  SHEET_WEBHOOK_SECRET: 'sheet-secret',
  PDF_LINK_SECRET: 'pdf-secret',
  ASSETS,
};

const ENQUIRY = {
  leadType: 'journey',
  pageUrl: '/journeys/rajasthan-classic-12n-13d/',
  journeySlug: 'rajasthan-classic-12n-13d',
  journeyTitle: 'Rajasthan Classic',
  utm: 'utm_source=test&utm_medium=unit',
  leaveEmpty: '',
  name: 'Test Traveller',
  phone: '+91 98100 00000',
  email: 'traveller@example.com',
  travelMonth: 'March',
  message: 'Testing the lead function.',
  consent: 'on',
  'cf-turnstile-response': 'XXXX.DUMMY.TOKEN.XXXX',
};

async function post(fields: Record<string, string>, env: Env = FULL_ENV, { json = true, pdfGateLive = false } = {}) {
  calls = [];
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.append(key, value);
  const request = new Request('https://india-visit-website.pages.dev/api/lead', {
    method: 'POST',
    body: form,
    headers: { accept: json ? 'application/json' : 'text/html', 'cf-connecting-ip': '203.0.113.9' },
  });
  const pending: Promise<unknown>[] = [];
  const response = await leadHandler({ pdfGateLive })({ request, env, waitUntil: (p) => pending.push(p) });
  await Promise.all(pending);
  const text = await response.text();
  return { status: response.status, text, data: json ? JSON.parse(text) : null };
}

const called = (part: string) => calls.filter((c) => c.url.includes(part));
const without = (key: string) => Object.fromEntries(Object.entries(ENQUIRY).filter(([k]) => k !== key));

let passed = 0;
async function test(name: string, run: () => Promise<void>) {
  siteverify = () => Response.json({ success: true });
  resend = () => Response.json({ id: 'test-id' });
  sheet = () => Response.json({ ok: true });
  try {
    await run();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (error) {
    console.log(`  ✗ ${name}`);
    throw error;
  }
}

console.log('\nLead function');

await test('honeypot: success answer, nothing sent', async () => {
  const r = await post({ ...ENQUIRY, leaveEmpty: 'http://spam.example' });
  assert.equal(r.status, 200);
  assert.equal(r.data.ok, true);
  assert.equal(calls.length, 0);
});

await test('newsletter: refused, not live', async () => {
  const r = await post({ intent: 'newsletter', email: 'a@example.com' });
  assert.equal(r.status, 409);
  assert.equal(calls.length, 0);
});

await test('PDF form while the gate is off: refused, nothing sent', async () => {
  const r = await post({ ...ENQUIRY, leadType: 'pdf' });
  assert.equal(r.status, 409);
  assert.equal(calls.length, 0);
});

await test('invalid fields: 422 with the shared messages, token not spent', async () => {
  const r = await post({ ...without('consent'), name: '', phone: '12', email: 'not-an-email' });
  assert.equal(r.status, 422);
  assert.deepEqual(r.data.errors, {
    name: FIELD_MESSAGES.name,
    phone: FIELD_MESSAGES.phone,
    email: FIELD_MESSAGES.email,
    consent: FIELD_MESSAGES.consent,
  });
  assert.equal(called('siteverify').length, 0, 'validation runs before Turnstile');
});

await test('over-long field and too many fields are refused', async () => {
  assert.equal((await post({ ...ENQUIRY, message: 'x'.repeat(3001) })).status, 422);
  const many = { ...ENQUIRY } as Record<string, string>;
  for (let i = 0; i < 40; i++) many[`f${i}`] = 'x';
  assert.equal((await post(many)).status, 400);
});

await test('Turnstile on, no token: 403 without calling siteverify', async () => {
  const r = await post(without('cf-turnstile-response'));
  assert.equal(r.status, 403);
  assert.equal(r.data.ok, false);
  assert.equal(calls.length, 0);
});

await test('Turnstile says no: 403, nothing sent', async () => {
  siteverify = () => Response.json({ success: false, 'error-codes': ['invalid-input-response'] });
  const r = await post(ENQUIRY);
  assert.equal(r.status, 403);
  assert.equal(called('resend').length, 0);
  assert.equal(called('script.google.com').length, 0);
});

await test('Turnstile passes: siteverify gets secret, token and IP; email and Sheet are sent', async () => {
  const r = await post(ENQUIRY);
  assert.equal(r.status, 200);
  assert.deepEqual(r.data, { ok: true, message: LEAD_SUCCESS });
  const [verify] = called('siteverify');
  assert.deepEqual(verify.body, {
    secret: FULL_ENV.TURNSTILE_SECRET_KEY,
    response: ENQUIRY['cf-turnstile-response'],
    remoteip: '203.0.113.9',
  });
  const [mail] = called('resend');
  const body = mail.body as Record<string, unknown>;
  assert.equal(body.subject, 'New enquiry: Test Traveller · Rajasthan Classic');
  assert.deepEqual(body.to, ['info@india-visit.com']);
  assert.equal(body.reply_to, 'traveller@example.com');
  assert.match(String(body.text), /utm: utm_source=test&utm_medium=unit/);
  assert.doesNotMatch(String(body.text), /cf-turnstile-response|DUMMY\.TOKEN|consent|leaveEmpty/);
  const [row] = called('script.google.com');
  const sent = row.body as { secret: string; lead: Record<string, string> };
  assert.equal(sent.secret, 'sheet-secret');
  assert.equal(sent.lead.leadType, 'journey');
  assert.equal(sent.lead.name, 'Test Traveller');
  assert.equal(sent.lead.phone, '+91 98100 00000');
  assert.equal(sent.lead.journeyTitle, 'Rajasthan Classic');
  assert.equal(sent.lead.utm, 'utm_source=test&utm_medium=unit');
  assert.equal(sent.lead.emailStatus, 'sent');
  assert.match(sent.lead.details, /travelMonth: March/);
  assert.match(sent.lead.details, /journeySlug: rajasthan-classic-12n-13d/);
  assert.doesNotMatch(sent.lead.details, /DUMMY\.TOKEN|leaveEmpty|consent/);
});

await test('siteverify unreachable: the lead goes through (logged)', async () => {
  siteverify = () => {
    throw new Error('network down');
  };
  const r = await post(ENQUIRY);
  assert.equal(r.status, 200);
  assert.equal(called('resend').length, 1);
});

await test('Turnstile off (no secret): works as before, no siteverify', async () => {
  const { TURNSTILE_SECRET_KEY: _drop, ...env } = FULL_ENV;
  const r = await post(without('cf-turnstile-response'), env);
  assert.equal(r.status, 200);
  assert.equal(called('siteverify').length, 0);
});

await test('Sheet not configured: email only', async () => {
  const { SHEET_WEBHOOK_URL: _u, SHEET_WEBHOOK_SECRET: _s, ...env } = FULL_ENV;
  const r = await post(ENQUIRY, env);
  assert.equal(r.status, 200);
  assert.equal(called('script.google.com').length, 0);
});

await test('Sheet failing never fails the lead', async () => {
  sheet = () => {
    throw new Error('apps script down');
  };
  const r = await post(ENQUIRY);
  assert.equal(r.status, 200);
});

await test('Resend fails: 502 for the visitor, the Sheet still gets the row marked failed', async () => {
  resend = () => new Response('boom', { status: 500 });
  const r = await post(ENQUIRY);
  assert.equal(r.status, 502);
  const [row] = called('script.google.com');
  assert.equal((row.body as { lead: Record<string, string> }).lead.emailStatus, 'failed (500)');
});

await test('Resend key missing: 503, nothing sent', async () => {
  const { RESEND_API_KEY: _k, ...env } = FULL_ENV;
  const r = await post(ENQUIRY, env);
  assert.equal(r.status, 503);
  assert.equal(called('resend').length, 0);
});

await test('corporate brief: company required, its own subject', async () => {
  const corporate = { ...ENQUIRY, leadType: 'corporate', company: 'Acme Travel', groupSize: '40' };
  const refused = await post({ ...corporate, company: '' });
  assert.equal(refused.status, 422);
  assert.equal(refused.data.errors.company, FIELD_MESSAGES.company);
  const r = await post(corporate);
  assert.equal(r.status, 200);
  assert.equal((called('resend')[0].body as { subject: string }).subject, 'New corporate brief: Test Traveller · Acme Travel · Rajasthan Classic');
});

await test('no-JS visitor gets a plain page', async () => {
  const r = await post(ENQUIRY, FULL_ENV, { json: false });
  assert.equal(r.status, 200);
  assert.match(r.text, /<!doctype html>/);
  assert.match(r.text, /Back to the page/);
});

console.log('\nPDF release (gate switched on for the test only)');
const PDF = { ...ENQUIRY, leadType: 'pdf' };
const live = { pdfGateLive: true };

await test('PDF: email is required', async () => {
  const r = await post({ ...PDF, email: '' }, FULL_ENV, live);
  assert.equal(r.status, 422);
  assert.equal(r.data.errors.email, FIELD_MESSAGES.email);
});

await test('PDF: a bad journey slug is refused', async () => {
  const r = await post({ ...PDF, journeySlug: '../../etc/passwd' }, FULL_ENV, live);
  assert.equal(r.status, 400);
  assert.equal(calls.length, 0);
});

await test('PDF: without PDF_LINK_SECRET, 503 and nothing sent', async () => {
  const { PDF_LINK_SECRET: _p, ...env } = FULL_ENV;
  const r = await post(PDF, env, live);
  assert.equal(r.status, 503);
  assert.equal(called('resend').length, 0);
});

await test('PDF: released with a signed link that verifies; lead emailed and copied', async () => {
  const r = await post(PDF, FULL_ENV, live);
  assert.equal(r.status, 200);
  assert.equal(r.data.message, PDF_READY);
  const link = new URL(r.data.download, 'https://x.test');
  assert.equal(link.pathname, '/downloads/rajasthan-classic-12n-13d.pdf');
  assert.equal(
    await verifyPdfLink('rajasthan-classic-12n-13d', link.searchParams.get('e'), link.searchParams.get('s'), 'pdf-secret'),
    'ok',
  );
  assert.equal((called('resend')[0].body as { subject: string }).subject, 'Itinerary download: Test Traveller · Rajasthan Classic');
  assert.equal((called('script.google.com')[0].body as { lead: Record<string, string> }).lead.leadType, 'pdf');
});

await test('PDF: released even when the email fails (the Sheet keeps the lead)', async () => {
  resend = () => new Response('boom', { status: 500 });
  const r = await post(PDF, FULL_ENV, live);
  assert.equal(r.status, 200);
  assert.ok(r.data.download);
});

await test('PDF: a journey with no PDF built yet gets the enquiry answer, and the email says so', async () => {
  const r = await post({ ...PDF, journeySlug: 'new-journey-3n-4d', journeyTitle: 'New Journey' }, FULL_ENV, live);
  assert.equal(r.status, 200);
  assert.deepEqual(r.data, { ok: true, message: LEAD_SUCCESS });
  assert.match(String((called('resend')[0].body as { text: string }).text), /No PDF is built for "new-journey-3n-4d"/);
});

await test('PDF: no-JS visitor gets the link on the plain page', async () => {
  const r = await post(PDF, FULL_ENV, { json: false, ...live });
  assert.match(r.text, /href="\/downloads\/rajasthan-classic-12n-13d\.pdf\?e=\d+&amp;s=[\w-]+"/);
  assert.match(r.text, /Download the PDF/);
});

console.log('\nSigned links');

await test('expired, tampered and malformed links are refused', async () => {
  const issued = Date.UTC(2026, 10, 26, 12);
  const link = new URL(await signPdfLink('rajasthan-classic-12n-13d', 's3cret', issued), 'https://x.test');
  const e = link.searchParams.get('e');
  const s = link.searchParams.get('s');
  assert.equal(await verifyPdfLink('rajasthan-classic-12n-13d', e, s, 's3cret', issued + 1000), 'ok');
  assert.equal(await verifyPdfLink('rajasthan-classic-12n-13d', e, s, 's3cret', issued + (PDF_LINK_TTL_SECONDS + 1) * 1000), 'expired');
  assert.equal(await verifyPdfLink('kerala-in-a-week-7n-8d', e, s, 's3cret', issued), 'bad-signature');
  assert.equal(await verifyPdfLink('rajasthan-classic-12n-13d', String(Number(e) + 999), s, 's3cret', issued), 'bad-signature');
  assert.equal(await verifyPdfLink('rajasthan-classic-12n-13d', e, s, 'other-secret', issued), 'bad-signature');
  assert.equal(await verifyPdfLink('rajasthan-classic-12n-13d', e, null, 's3cret', issued), 'malformed');
  assert.equal(await verifyPdfLink('Bad Slug', e, s, 's3cret', issued), 'malformed');
});

console.log('\nDownloads function');

async function get(path: string, env: Partial<Env> = FULL_ENV) {
  const url = new URL(path, 'https://india-visit-website.pages.dev');
  const rest = url.pathname.replace(/^\/downloads\/?/, '');
  const params = { path: rest ? rest.split('/') : [] };
  return downloads({ request: new Request(url), env: { ASSETS, ...env } as never, params });
}

await test('a signed link serves the PDF, private and noindex', async () => {
  const response = await get(await signPdfLink('rajasthan-classic-12n-13d', 'pdf-secret'));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'application/pdf');
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.equal(response.headers.get('x-robots-tag'), 'noindex');
  assert.equal(await response.text(), '%PDF-1.7 test');
});

await test('the bare path goes to the journey page (302, not cached)', async () => {
  const response = await get('/downloads/rajasthan-classic-12n-13d.pdf');
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), '/journeys/rajasthan-classic-12n-13d/');
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

await test('a forged signature, odd paths and a missing secret all redirect', async () => {
  const forged = await get('/downloads/rajasthan-classic-12n-13d.pdf?e=9999999999&s=forged');
  assert.equal(forged.status, 302);
  for (const path of ['/downloads/', '/downloads/a/b.pdf', '/downloads/..%2Fsecret.pdf', '/downloads/x.txt']) {
    const response = await get(path);
    assert.equal(response.status, 302, path);
    assert.equal(response.headers.get('location'), '/journeys/', path);
  }
  const { PDF_LINK_SECRET: _p, ...env } = FULL_ENV;
  const signed = await signPdfLink('rajasthan-classic-12n-13d', 'pdf-secret');
  assert.equal((await get(signed, env)).status, 302);
});

await test('a signed link to a PDF that does not exist redirects', async () => {
  const response = await get(await signPdfLink('no-such-journey-1n-2d', 'pdf-secret'));
  assert.equal(response.status, 302);
});

console.log(`\nPASS: ${passed} tests.`);
