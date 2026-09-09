/**
 * JSON-LD builders.
 * ---------------------------------------------------------------------------
 * CLAUDE.md SEO requirements: TravelAgency (global), TouristTrip (journeys),
 * Article + author (posts), FAQPage (wherever faq[] exists), BreadcrumbList
 * (all inner pages).
 *
 * One rule runs through all of these: **never emit a claim we cannot stand
 * behind.** Placeholder contact details and unverified trust numbers stay OUT
 * of the graph, because structured data is a machine-readable assertion — a
 * dummy phone number in JSON-LD is worse than one on screen, since aggregators
 * may republish it. Every builder therefore drops null/placeholder fields
 * rather than emitting empty strings.
 */
import type { SiteSettings } from './site-settings';

type Json = Record<string, unknown>;

/** Strips keys that are null, undefined or empty so nothing hollow is emitted. */
function compact(obj: Json): Json {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => {
      if (v === null || v === undefined) return false;
      if (typeof v === 'string') return v.trim().length > 0;
      if (Array.isArray(v)) return v.length > 0;
      return true;
    }),
  );
}

/**
 * True while a settings field still holds a placeholder. Contact details are
 * only published once the client's real values are in
 * (`_dummyDataFlags` is the inventory).
 */
function isPlaceholder(settings: SiteSettings, field: string): boolean {
  return settings._dummyDataFlags.some((flag) => flag.startsWith(`${field} `));
}

export function travelAgencySchema(settings: SiteSettings, siteUrl: string): Json {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${siteUrl}#organisation`,
    name: settings.siteName,
    description: settings.tagline,
    url: siteUrl,
    telephone: isPlaceholder(settings, 'phone') ? null : settings.phone,
    email: isPlaceholder(settings, 'email') ? null : settings.email,
    address: isPlaceholder(settings, 'address')
      ? null
      : { '@type': 'PostalAddress', streetAddress: settings.address },
    foundingDate: settings.foundingYear ? String(settings.foundingYear) : null,
    sameAs: Object.values(settings.socials).filter((url): url is string => url !== null),
    aggregateRating: settings.aggregateRating
      ? { '@type': 'AggregateRating', ratingValue: settings.aggregateRating }
      : null,
  });
}

export function touristTripSchema(input: {
  siteUrl: string;
  url: string;
  name: string;
  description: string;
  image?: string;
  days: number;
  nights: number;
  routeCities: string[];
}): Json {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: input.name,
    description: input.description,
    url: input.url,
    image: input.image,
    /** ISO 8601 duration — 12 days reads as P12D. */
    duration: `P${input.days}D`,
    itinerary: {
      '@type': 'ItemList',
      itemListElement: input.routeCities.map((city, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: { '@type': 'City', name: city },
      })),
    },
    provider: { '@id': `${input.siteUrl}#organisation` },
  });
}

export function articleSchema(input: {
  siteUrl: string;
  url: string;
  headline: string;
  description: string;
  image?: string;
  datePublished: Date;
  dateModified?: Date;
  authorName: string;
}): Json {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: input.url,
    image: input.image,
    datePublished: input.datePublished.toISOString(),
    dateModified: (input.dateModified ?? input.datePublished).toISOString(),
    author: { '@type': 'Organization', name: input.authorName, url: input.siteUrl },
    publisher: { '@id': `${input.siteUrl}#organisation` },
  });
}

export function faqSchema(faq: Array<{ question: string; answer: string }>): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function breadcrumbSchema(
  crumbs: Array<{ name: string; url: string }>,
): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export function reviewSchema(input: {
  author: string;
  reviewBody: string;
  itemName: string;
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: { '@type': 'Person', name: input.author },
    reviewBody: input.reviewBody,
    itemReviewed: { '@type': 'TouristTrip', name: input.itemName },
  };
}
