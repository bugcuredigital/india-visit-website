import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';
import tailwindcss from '@tailwindcss/vite';

// DUMMY DATA — the production domain is not confirmed yet (PRD Open Question #7).
// Cloudflare Pages can override this with a SITE_URL environment variable, so the
// final domain lands in M9 without a code change.
const SITE_URL = process.env.SITE_URL ?? 'https://india-visit-website.pages.dev';

export default defineConfig({
  site: SITE_URL,
  // Static output only — never SSR/hybrid (CLAUDE.md locked stack).
  output: 'static',
  trailingSlash: 'always',
  build: {
    // Critical CSS: inline everything so the first paint needs no stylesheet round-trip.
    inlineStylesheets: 'always',
  },
  integrations: [
    // GTM is the only tag surface and it runs off the main thread. No direct
    // GA4/Meta script tags anywhere, ever (CLAUDE.md locked stack).
    partytown({
      config: { forward: ['dataLayer.push'] },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
