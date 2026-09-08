/**
 * siteSettings — M1 typed stub.
 * ---------------------------------------------------------------------------
 * CLAUDE.md invariant #1: nothing user-editable is hardcoded. Every phone
 * number, link target, tag ID and trust figure on the site resolves through
 * this object. If you are about to type a phone number into a component,
 * stop and read it from here instead.
 *
 * SCOPE OF THIS FILE: M1 only. In M2 this is promoted to a Zod-validated
 * `siteSettings` content-collection singleton with the identical field names,
 * so components written against it now keep working unchanged. The field
 * shape below is deliberately the full invariant-#1 list, not just what M1
 * renders, so the M2 promotion is a move rather than a redesign.
 *
 * EVERY PLACEHOLDER VALUE CARRIES A `DUMMY DATA` COMMENT so a pre-launch
 * `npm run audit:hardcoded` (or a plain grep) finds all of them:
 *     grep -rn "DUMMY DATA" src/
 */

export interface SiteSettings {
  siteName: string;
  tagline: string;

  /** Contact channels — every CTA on the site resolves to one of these. */
  phone: string;
  phoneHref: string;
  whatsappNumber: string;
  /** Default prefill; per-page components append their own context. */
  whatsappDefaultMessage: string;
  email: string;
  address: string;

  socials: {
    instagram: string | null;
    facebook: string | null;
    youtube: string | null;
    linkedin: string | null;
  };

  /** Tag IDs — managed by the client in the GTM UI, never in code. */
  gtmContainerId: string | null;
  metaPixelId: string | null;

  /**
   * Trust figures — NULLABLE ON PURPOSE (PRD Open Question #2).
   * null means the stat is not rendered at all. Never publish an
   * unverified number and never ship a placeholder one.
   * Launch set is the verifiable pair: "20+ Years" and "24/7 On-Trip Support".
   */
  foundingYear: number | null;
  travellerCount: number | null;
  destinationCount: number | null;
  aggregateRating: number | null;
  yearsExperience: number;
  supportPromise: string;

  /**
   * Pricing (PRD Open Question #1). Journeys carry an optional `priceFrom`;
   * this flag globally gates whether any of it renders. Train pages are
   * exempt regardless — operator tariffs are never published.
   */
  showPrices: boolean;

  /** Response-time promise shown on form success states (Open Question #12). */
  responseSla: string | null;
}

export const siteSettings: SiteSettings = {
  siteName: 'India Visit',
  tagline: 'Curated journeys across India and beyond',

  phone: '+91 0000000000', // DUMMY DATA — real number arrives in M5, verified in M9
  phoneHref: 'tel:+910000000000', // DUMMY DATA — must match `phone`
  whatsappNumber: '+91 0000000000', // DUMMY DATA — real number arrives in M5
  whatsappDefaultMessage:
    "Hello India Visit, I'd like help planning a trip.", // DUMMY DATA — client to approve wording
  email: 'hello@example.com', // DUMMY DATA — real address arrives in M5
  address: 'Dummy Address, New Delhi', // DUMMY DATA — real address arrives in M5

  socials: {
    instagram: null, // DUMMY DATA — handles pending (PRD Open Question #7)
    facebook: null, // DUMMY DATA — handles pending
    youtube: null, // DUMMY DATA — handles pending
    linkedin: null, // DUMMY DATA — handles pending
  },

  gtmContainerId: null, // DUMMY DATA — container ID pending; null = no GTM emitted
  metaPixelId: null, // DUMMY DATA — pixel managed inside GTM, not in code

  // Verified claims only. The two non-null values below are the launch set.
  foundingYear: null, // BLOCKED — PRD Open Question #2 (never guess the year)
  travellerCount: null, // BLOCKED — PRD Open Question #2
  destinationCount: null, // BLOCKED — PRD Open Question #2
  aggregateRating: null, // BLOCKED — PRD Open Question #3 (testimonials + consent)
  yearsExperience: 20, // Verified: the anchor claim, "20+ years" (CONTEXT.md)
  supportPromise: '24/7 On-Trip Support', // Verified: core service promise

  showPrices: false, // Default OFF until PRD Open Question #1 is decided

  responseSla: null, // BLOCKED — PRD Open Question #12
};

/**
 * WhatsApp deep link with page context.
 * Kept here rather than in a component so the number and the default message
 * have exactly one home.
 */
export function whatsappLink(context?: string): string {
  const digits = siteSettings.whatsappNumber.replace(/[^\d]/g, '');
  const message = context
    ? `${siteSettings.whatsappDefaultMessage} (${context})`
    : siteSettings.whatsappDefaultMessage;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/**
 * The trust stats that actually have verified values.
 * CounterStat renders whatever this returns — 2 to 4 items — so an
 * unanswered open question simply means one fewer stat, never a placeholder.
 */
export function verifiedTrustStats(): Array<{ value: string; label: string }> {
  const stats: Array<{ value: string; label: string }> = [
    { value: `${siteSettings.yearsExperience}+`, label: 'Years of Experience' },
  ];

  if (siteSettings.travellerCount !== null) {
    stats.push({
      value: `${siteSettings.travellerCount.toLocaleString('en-IN')}+`,
      label: 'Travellers Hosted',
    });
  }

  if (siteSettings.destinationCount !== null) {
    stats.push({
      value: `${siteSettings.destinationCount}+`,
      label: 'Destinations',
    });
  }

  stats.push({ value: '24/7', label: 'On-Trip Support' });

  return stats;
}
