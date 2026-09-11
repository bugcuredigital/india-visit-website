/**
 * Article category labels — one source, two readers.
 * ---------------------------------------------------------------------------
 * These lived as a private const inside ArticleCard until the Travel Guide
 * index needed the same strings for its filter chips. Two copies of a label
 * map is exactly how a card ends up saying "Guides" while the chip that
 * filters it says "Destination Guides".
 *
 * The wording follows PAGE_TEMPLATES T8, which is the structural source of
 * truth for this page: Planning & Visas · Best Time to Visit · Destination
 * Guides. The card previously said "Best Time to Go" and "Guides"; the spec
 * wins.
 */
export const CATEGORY_LABELS = {
  'planning-visas': 'Planning & Visas',
  'best-time': 'Best Time to Visit',
  guides: 'Destination Guides',
} as const satisfies Record<string, string>;

export type PostCategory = keyof typeof CATEGORY_LABELS;

/** Falls back to the raw key rather than rendering nothing. */
export const categoryLabel = (key: string): string =>
  (CATEGORY_LABELS as Record<string, string>)[key] ?? key;

/**
 * Reading time from the raw markdown body. Deliberately crude — 200 words a
 * minute, rounded up, minimum one — because a reading time is a courtesy and
 * a precise one would be false precision.
 */
export const readingTime = (body: string): number =>
  Math.max(1, Math.round(body.trim().split(/\s+/).length / 200));
