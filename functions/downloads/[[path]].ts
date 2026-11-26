/**
 * GET /downloads/* — the itinerary PDFs, released only through a signed link.
 * ---------------------------------------------------------------------------
 * The PDF build writes /downloads/<journey-slug>.pdf into the static output,
 * and until the PDF release (26 Nov 2026) anyone with the path could fetch
 * one. A Pages Function on a route takes precedence over the static file, so
 * every request now comes through here:
 *   · a link signed by the lead function (src/lib/pdf-link.ts), unexpired →
 *     the file, read from the static assets
 *   · anything else (no signature, a forged or expired one, a guessed path) →
 *     a temporary redirect to that journey's page, where the form is
 * The redirect is a 302, never a 301: the same URL answers differently with a
 * signature, and a browser must not remember the redirect.
 */
import { PDF_SLUG, verifyPdfLink } from '../../src/lib/pdf-link';

interface Env {
  PDF_LINK_SECRET?: string;
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

interface Context {
  request: Request;
  env: Env;
  params: { path?: string | string[] };
}

const FILE = /^([a-z0-9]+(?:-[a-z0-9]+)*)\.pdf$/;

export const onRequestGet = async ({ request, env, params }: Context): Promise<Response> => {
  const url = new URL(request.url);
  const segments = Array.isArray(params.path) ? params.path : params.path ? [params.path] : [];
  const only = segments.length === 1 ? segments[0] : undefined;
  const match = only ? FILE.exec(only) : null;
  const slug = match?.[1] ?? '';

  const toJourney = () =>
    new Response(null, {
      status: 302,
      headers: {
        location: PDF_SLUG.test(slug) ? `/journeys/${slug}/` : '/journeys/',
        'cache-control': 'no-store',
      },
    });

  if (!slug || !env.PDF_LINK_SECRET) return toJourney();
  const verdict = await verifyPdfLink(slug, url.searchParams.get('e'), url.searchParams.get('s'), env.PDF_LINK_SECRET);
  if (verdict !== 'ok') {
    console.log(JSON.stringify({ download: `refused: ${verdict}`, journey: slug }));
    return toJourney();
  }

  const file = await env.ASSETS.fetch(new Request(new URL(`/downloads/${slug}.pdf`, url.origin)));
  if (!file.ok) return toJourney();
  console.log(JSON.stringify({ download: 'served', journey: slug }));
  return new Response(file.body, {
    status: 200,
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `inline; filename="India-Visit-${slug}.pdf"`,
      'cache-control': 'private, no-store',
      'x-robots-tag': 'noindex',
    },
  });
};

/** A HEAD is answered exactly as a GET would be (the runtime drops the body). */
export const onRequestHead = onRequestGet;
