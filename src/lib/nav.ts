/**
 * Site navigation — the locked header order (CLAUDE.md URL structure).
 * Destinations ▾ · Journeys · Luxury Trains · Corporate · Travel Guide ·
 * About · Reviews · [Plan My Trip]
 *
 * `collapsible: true` marks the two items that fold into a "More ▾" group
 * between 1024–1200px, where the full row would otherwise crowd.
 */
export interface NavItem {
  label: string;
  href: string;
  collapsible?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Journeys', href: '/journeys/' },
  { label: 'Luxury Trains', href: '/luxury-trains/' },
  { label: 'Corporate', href: '/corporate/' },
  { label: 'Travel Guide', href: '/travel-guide/' },
  { label: 'About', href: '/about/', collapsible: true },
  { label: 'Reviews', href: '/reviews/', collapsible: true },
];

/** Footer-only utility links. */
export const POLICY_ITEMS: NavItem[] = [
  { label: 'Privacy Policy', href: '/privacy/' },
  { label: 'Terms', href: '/terms/' },
  { label: 'Cancellation Policy', href: '/cancellation/' },
  { label: 'Booking Terms', href: '/booking-terms/' },
];
