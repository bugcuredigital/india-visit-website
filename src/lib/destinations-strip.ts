/**
 * The homepage destination strip — 7 curated tiles — and the locked nine.
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
 * `shortLabel` and `heroImage` whenever that entry exists; the values below are
 * the fallback for the M4 window, while eight of the nine destination entries
 * are still to be written in M5.
 *
 * Once M5 seeds all nine, every tile resolves from content and these fallbacks
 * stop being read at all — at which point the TEMP-PHOTO imports go too.
 *
 * The images are TEMP-PHOTO files: temporary Unsplash photography for design
 * review only, replaced by the client's archive in M5. Provenance is in
 * docs/brand/processed/TEMP-PHOTO-PROVENANCE.md.
 */
import type { ImageMetadata } from 'astro';

import rajasthan from '../assets/temp-photos/TEMP-PHOTO-dest-rajasthan.jpg';
import kerala from '../assets/temp-photos/TEMP-PHOTO-dest-kerala.jpg';
import southWest from '../assets/temp-photos/TEMP-PHOTO-dest-south-west.jpg';
import ladakh from '../assets/temp-photos/TEMP-PHOTO-dest-ladakh.jpg';
import northEast from '../assets/temp-photos/TEMP-PHOTO-dest-north-east.jpg';
import wildlife from '../assets/temp-photos/TEMP-PHOTO-dest-wildlife.jpg';
import bhutan from '../assets/temp-photos/TEMP-PHOTO-dest-bhutan.jpg';
import bali from '../assets/temp-photos/TEMP-PHOTO-dest-bali.jpg';
import vietnam from '../assets/temp-photos/TEMP-PHOTO-dest-vietnam.jpg';

export interface StripTile {
  slug: string;
  /** Fallback only — CLAUDE.md's locked short label. */
  fallbackLabel: string;
  /** Fallback only — a TEMP-PHOTO stand-in until the entry exists. */
  fallbackImage: ImageMetadata;
  fallbackAlt: string;
}

/**
 * All nine locked destinations, in display order. `REGION_COUNT` is derived
 * from this, so the "9 Regions" trust stat can never drift from the actual
 * information architecture.
 */
export const DESTINATIONS: StripTile[] = [
  {
    slug: 'rajasthan-golden-triangle',
    fallbackLabel: 'Rajasthan',
    fallbackImage: rajasthan,
    fallbackAlt: 'Sandstone rooftops and fort walls of Jaisalmer seen from above',
  },
  {
    slug: 'kerala',
    fallbackLabel: 'Kerala',
    fallbackImage: kerala,
    fallbackAlt: 'A traditional houseboat on a palm-lined Kerala backwater',
  },
  {
    slug: 'south-west-india',
    fallbackLabel: 'South & West',
    fallbackImage: southWest,
    fallbackAlt: 'Stone temple ruins standing across open ground at Hampi',
  },
  {
    slug: 'ladakh',
    fallbackLabel: 'Ladakh',
    fallbackImage: ladakh,
    fallbackAlt: 'A turquoise high-altitude lake below bare Himalayan peaks',
  },
  {
    slug: 'north-east-india',
    fallbackLabel: 'North East',
    fallbackImage: northEast,
    fallbackAlt: 'Green hills of Meghalaya under low cloud',
  },
  {
    slug: 'wildlife',
    fallbackLabel: 'Wildlife',
    fallbackImage: wildlife,
    fallbackAlt: 'A tiger resting in warm light on dry grass',
  },
  {
    slug: 'bhutan',
    fallbackLabel: 'Bhutan',
    fallbackImage: bhutan,
    fallbackAlt: "The Tiger's Nest monastery built into a Bhutanese cliff face",
  },
  {
    slug: 'bali',
    fallbackLabel: 'Bali',
    fallbackImage: bali,
    fallbackAlt: 'Terraced rice paddies and palms in Bali',
  },
  {
    slug: 'vietnam',
    fallbackLabel: 'Vietnam',
    fallbackImage: vietnam,
    fallbackAlt: 'Boats among the limestone karsts of Ha Long Bay',
  },
];

/** Nine regions — a structural fact, derived rather than typed. */
export const REGION_COUNT = DESTINATIONS.length;

/** The homepage shows seven of the nine; "View all destinations" carries the rest. */
const STRIP_SLUGS = [
  'rajasthan-golden-triangle',
  'kerala',
  'ladakh',
  'north-east-india',
  'bhutan',
  'bali',
  'vietnam',
];

export const DESTINATION_STRIP: StripTile[] = STRIP_SLUGS.map((slug) => {
  const tile = DESTINATIONS.find((entry) => entry.slug === slug);
  if (!tile) throw new Error(`Homepage strip references unknown destination slug: ${slug}`);
  return tile;
});
