/**
 * The locked nine destinations — slugs, order and short labels.
 * ---------------------------------------------------------------------------
 * CLAUDE.md locks the nine destination slugs and their short labels. This file
 * is that list, and nothing else.
 *
 * Why it is in code rather than content, when invariant #1 says nothing
 * user-editable is hardcoded: the *selection, order and slug* are a locked
 * information-architecture decision, exactly like `NAV_ITEMS` in ./nav.ts, and
 * changing one is a site-structure change with a 301 attached, not an edit.
 * The short label travels with the slug for the same reason — it is the word
 * the URL means.
 *
 * WHAT IS NO LONGER HERE (design round 3, image control): a `fallbackImage`
 * and `fallbackAlt` per tile, importing nine TEMP-PHOTO files straight out of
 * `src/assets/`. They existed for the M4 window when eight of the nine
 * destination entries had not been written, and they stopped being reachable
 * the moment all nine were seeded — but they were still nine photographs an
 * editor could not touch. Every destination photograph now comes from the
 * destination's own entry, and a missing entry is a build error rather than a
 * silent fallback to a picture nobody chose (invariant #8).
 */

export interface StripTile {
  slug: string;
  /** The locked short label. Travels with the slug, not with the content. */
  label: string;
}

/**
 * All nine locked destinations, in display order. `REGION_COUNT` is derived
 * from this, so the "9 Regions" trust stat can never drift from the actual
 * information architecture.
 */
export const DESTINATIONS: StripTile[] = [
  { slug: 'rajasthan-golden-triangle', label: 'Rajasthan' },
  { slug: 'kerala', label: 'Kerala' },
  { slug: 'south-west-india', label: 'South & West' },
  { slug: 'ladakh', label: 'Ladakh' },
  { slug: 'north-east-india', label: 'North East' },
  { slug: 'wildlife', label: 'Wildlife' },
  { slug: 'bhutan', label: 'Bhutan' },
  { slug: 'bali', label: 'Bali' },
  { slug: 'vietnam', label: 'Vietnam' },
];

/** Nine regions — a structural fact, derived rather than typed. */
export const REGION_COUNT = DESTINATIONS.length;
