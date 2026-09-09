/**
 * siteSettings accessor.
 * ---------------------------------------------------------------------------
 * CLAUDE.md invariant #1: nothing user-editable is hardcoded. Every phone
 * number, link target, tag ID and trust figure on the site resolves through
 * here. If you are about to type a phone number into a component, stop.
 *
 * M1 shipped this as a typed literal. It is now backed by the Zod-validated
 * `siteSettings` content collection (src/content/siteSettings/settings.json),
 * so a malformed edit fails the build instead of rendering a broken page.
 * The field names did not change in the promotion.
 *
 * Placeholder values are inventoried in the collection's own
 * `_dummyDataFlags` array — JSON cannot carry comments, so that array is where
 * the `DUMMY DATA` markers live. `npm run audit:hardcoded` reports them.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type SiteSettings = CollectionEntry<'siteSettings'>['data'];

let cached: SiteSettings | undefined;

/**
 * Reads the singleton, enforcing that it really is one.
 * A missing or duplicated settings entry is a build-stopping error rather than
 * a silent fallback — a site rendering default contact details would be worse
 * than a site that fails to build.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (cached) return cached;

  const entries = await getCollection('siteSettings');
  if (entries.length !== 1) {
    throw new Error(
      `siteSettings must contain exactly one entry (found ${entries.length}). ` +
        'It is a singleton — see src/content/siteSettings/settings.json.',
    );
  }

  cached = entries[0]!.data;
  return cached;
}

/**
 * WhatsApp deep link with page context.
 * Lives here rather than in a component so the number and the default message
 * have exactly one home.
 */
export function whatsappLink(settings: SiteSettings, context?: string): string {
  const digits = settings.whatsappNumber.replace(/\D/g, '');
  const message = context
    ? `${settings.whatsappDefaultMessage} (${context})`
    : settings.whatsappDefaultMessage;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/**
 * The trust stats that actually have verified values.
 * CounterStat renders whatever this returns — 2 to 4 items — so an unanswered
 * open question simply means one fewer stat, never a placeholder number
 * (PRD Open Question #2).
 */
export function verifiedTrustStats(
  settings: SiteSettings,
): Array<{ value: string; label: string }> {
  const stats: Array<{ value: string; label: string }> = [
    { value: `${settings.yearsExperience}+`, label: 'Years of Experience' },
  ];

  if (settings.travellerCount !== null) {
    stats.push({
      value: `${settings.travellerCount.toLocaleString('en-IN')}+`,
      label: 'Travellers Hosted',
    });
  }

  if (settings.destinationCount !== null) {
    stats.push({ value: `${settings.destinationCount}+`, label: 'Destinations' });
  }

  stats.push({ value: '24/7', label: 'On-Trip Support' });

  return stats;
}

/**
 * Per-journey "from" price, or null when it must not be shown.
 * Gated globally by `showPrices` (PRD Open Question #1), and train pages are
 * exempt regardless — operator tariffs are never published (invariant #6).
 */
export function displayPrice(
  settings: SiteSettings,
  priceFrom: number | undefined,
  variant: 'A' | 'B',
): string | null {
  if (!settings.showPrices || variant === 'B' || priceFrom === undefined) return null;
  return `From ₹${priceFrom.toLocaleString('en-IN')}`;
}
