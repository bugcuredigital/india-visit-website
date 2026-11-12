/**
 * Lead capture is not live until M6.
 * ---------------------------------------------------------------------------
 * Every form on the site posts to `/api/lead`, the Cloudflare Pages Function
 * that M6 builds. Until it exists that POST answers 405, so a submit would
 * navigate to an error page. While `FORMS_LIVE` is false every submit button
 * renders disabled and says why — the client's instruction for the 2026-11-12
 * demo: a dead form click is worse than no form.
 *
 * The other option offered, a "we'll call you" success state, is deliberately
 * not used: with nothing behind the form it would promise a call to a real
 * visitor that never comes, and the production URL is public.
 *
 * M6 flips this to true in the same commit that adds `functions/api/lead.ts`.
 * Read by EnquiryForm.astro, plan-my-trip.astro and travel-guide/index.astro —
 * every <form> on the site.
 */
export const FORMS_LIVE = false;

/** The disabled button's label — the client's own words. */
export const FORMS_PENDING_LABEL = 'Launching shortly';
