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
import type { PhosphorIconName } from './phosphor-icons';

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
 * The four trust stats for the bar.
 * ---------------------------------------------------------------------------
 * Always exactly four, so the bar never changes shape as open questions close.
 * The first and last are fixed: years of experience, and the support promise.
 *
 * The two middle slots prefer the client's own verified figures and fall back
 * to counts DERIVED FROM OUR OWN CATALOGUE. That fallback is what makes a
 * four-stat bar possible while PRD Open Question #2 is still open: a number we
 * compute cannot be an unverified claim and cannot go stale. `journeyCount` is
 * the count of published journeys, so it reads 2 today and reaches 20 in M5
 * with nobody editing anything; `regionCount` is the length of the locked
 * destination list.
 *
 * A nullable settings figure still never renders as a placeholder — it is
 * simply not preferred until it holds a real value.
 *
 * Each stat carries its OWN icon (design revision round 2). Note that the icon
 * travels with the stat rather than with the slot: when the client's verified
 * traveller count displaces the counted journey total, the glyph changes with
 * it. An icon keyed to "second cell" would quietly start lying at that moment,
 * and it would be the kind of lie nobody notices.
 */
export interface TrustStat {
  value: string;
  label: string;
  icon: PhosphorIconName;
}

export function verifiedTrustStats(
  settings: SiteSettings,
  catalogue?: { journeyCount: number; regionCount: number },
): TrustStat[] {
  const first: TrustStat = {
    value: `${settings.yearsExperience}+`,
    label: 'Years of Experience',
    icon: 'clock',
  };
  const last: TrustStat = {
    value: '24/7',
    label: settings.supportPromise.replace(/^24\/7\s*/i, '') || 'On-Trip Support',
    icon: 'chat-circle',
  };

  /* Client-verified figures come first; catalogue counts fill what is left. */
  const preferred: TrustStat[] = [];

  if (settings.travellerCount !== null) {
    preferred.push({
      value: `${settings.travellerCount.toLocaleString('en-IN')}+`,
      label: 'Travellers Hosted',
      icon: 'users',
    });
  }
  if (settings.destinationCount !== null) {
    preferred.push({
      value: `${settings.destinationCount}+`,
      label: 'Destinations',
      icon: 'map-pin',
    });
  }

  if (catalogue) {
    preferred.push({
      value: `${catalogue.journeyCount}`,
      label: 'Curated Journeys',
      icon: 'map-trifold',
    });
    preferred.push({ value: `${catalogue.regionCount}`, label: 'Regions', icon: 'globe' });
  }

  return [first, ...preferred.slice(0, 2), last];
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
