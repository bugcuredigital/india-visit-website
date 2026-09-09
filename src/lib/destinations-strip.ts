/**
 * The homepage destination strip — 7 curated tiles.
 * ---------------------------------------------------------------------------
 * CLAUDE.md locks both the nine destination slugs and the seven the homepage
 * shows, with their short labels: "Rajasthan, Kerala, Ladakh, North East,
 * Bhutan, Bali, Vietnam". The strip is intentionally NOT the full list.
 *
 * Why this list is in code rather than content, when invariant #1 says nothing
 * user-editable is hardcoded: the *selection and order* are a locked
 * information-architecture decision, exactly like `NAV_ITEMS` in ./nav.ts, and
 * changing it is a site-structure change rather than an edit. The label and the
 * photograph ARE editable, so the page prefers the destination entry's own
 * `shortLabel` and `heroImage` whenever that entry exists; the label below is
 * only a fallback for the M4 window, while eight of the nine destination
 * entries are still to be written in M5.
 *
 * Once M5 seeds all nine, every tile resolves from content and the fallback
 * labels stop being read at all.
 */
export interface StripTile {
  slug: string;
  /** Fallback only — CLAUDE.md's locked short label. */
  fallbackLabel: string;
}

export const DESTINATION_STRIP: StripTile[] = [
  { slug: 'rajasthan-golden-triangle', fallbackLabel: 'Rajasthan' },
  { slug: 'kerala', fallbackLabel: 'Kerala' },
  { slug: 'ladakh', fallbackLabel: 'Ladakh' },
  { slug: 'north-east-india', fallbackLabel: 'North East' },
  { slug: 'bhutan', fallbackLabel: 'Bhutan' },
  { slug: 'bali', fallbackLabel: 'Bali' },
  { slug: 'vietnam', fallbackLabel: 'Vietnam' },
];
