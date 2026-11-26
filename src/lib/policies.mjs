/**
 * The policy pages still waiting for the client's legal copy.
 * ---------------------------------------------------------------------------
 * ONE switch for launch day (LAUNCH_DAY.md, step 1). A path in this list:
 *   · renders the provisional notice and `noindex, nofollow` (layouts/Policy.astro)
 *   · is left out of the sitemap (astro.config.mjs)
 * Publishing a policy is: paste the approved copy into its page, then delete
 * its path here. Nothing else changes. `/booking-terms/` left the list on
 * 13 Nov 2026 (its text is APPROVED, COPY_REGISTER K3).
 *
 * Plain .mjs so astro.config.mjs can import it as well as the pages.
 * @type {readonly string[]}
 */
export const PROVISIONAL_POLICY_PATHS = ['/privacy/', '/terms/', '/cancellation/'];
