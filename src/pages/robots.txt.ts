/**
 * robots.txt — generated, so the Sitemap line follows SITE_URL.
 * ---------------------------------------------------------------------------
 * Until this existed, production served only Cloudflare's managed
 * content-signals preamble (comments, no rules). Cloudflare may still prepend
 * that preamble on the custom domain; the rules below are ours.
 *
 * Disallowed, because none of them is a page anyone should land on from a
 * search: the CMS (/admin/), the component library (/dev/), the lead endpoint
 * (/api/) and the gated itinerary PDFs (/downloads/, served only through a
 * signed link since the PDF release).
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /dev/',
    'Disallow: /api/',
    'Disallow: /downloads/',
    '',
    `Sitemap: ${sitemap}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
