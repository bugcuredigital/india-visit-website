/**
 * Signed links to the itinerary PDFs (runbook M6 step 2a, the PDF release).
 * ---------------------------------------------------------------------------
 * The PDFs are built into /downloads/<journey-slug>.pdf, but no request for
 * one is served directly any more: functions/downloads/[[path]].ts answers
 * every /downloads/* URL and releases the file only when the link carries a
 * valid, unexpired signature. The lead function (functions/api/lead.ts)
 * makes that link after a valid, Turnstile-checked submit of the PDF form.
 * That is what makes the gate a gate: the path is no longer enough.
 *
 * A link is `/downloads/<slug>.pdf?e=<unix seconds>&s=<signature>`, the
 * signature an HMAC-SHA256 of "<slug>.<e>" under the PDF_LINK_SECRET
 * environment secret, base64url. Web Crypto only, so the same code runs in
 * both Pages Functions and Node tests.
 */

/** How long a released link works. Long enough to read and save, short enough not to circulate. */
export const PDF_LINK_TTL_SECONDS = 60 * 60;

/** A journey slug as the PDF build names its files. Nothing else is ever signed or served. */
export const PDF_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const encoder = new TextEncoder();

const base64url = (bytes: ArrayBuffer): string => {
  let binary = '';
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const hmac = async (secret: string, message: string): Promise<string> => {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return base64url(await crypto.subtle.sign('HMAC', key, encoder.encode(message)));
};

/** Compare without stopping at the first difference, so timing says nothing about the signature. */
const sameText = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
};

/** The path and query of a link to one journey's PDF, valid for PDF_LINK_TTL_SECONDS from `now`. */
export async function signPdfLink(slug: string, secret: string, now = Date.now()): Promise<string> {
  if (!PDF_SLUG.test(slug)) throw new Error(`Not a journey slug: ${slug}`);
  const expires = Math.floor(now / 1000) + PDF_LINK_TTL_SECONDS;
  const signature = await hmac(secret, `${slug}.${expires}`);
  return `/downloads/${slug}.pdf?e=${expires}&s=${signature}`;
}

/** Why a link was refused, or 'ok'. */
export type PdfLinkVerdict = 'ok' | 'malformed' | 'expired' | 'bad-signature';

/** Checks a link's slug, expiry and signature. */
export async function verifyPdfLink(
  slug: string,
  expires: string | null,
  signature: string | null,
  secret: string,
  now = Date.now(),
): Promise<PdfLinkVerdict> {
  if (!PDF_SLUG.test(slug) || !expires || !/^\d{1,12}$/.test(expires) || !signature) return 'malformed';
  if (Number(expires) * 1000 < now) return 'expired';
  const expected = await hmac(secret, `${slug}.${expires}`);
  return sameText(expected, signature) ? 'ok' : 'bad-signature';
}
