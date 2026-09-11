/**
 * City pages — matching, and linking to them from everywhere else.
 * ---------------------------------------------------------------------------
 * City pages (PAGE_TEMPLATES T15, PRD v1.5) earn their place through internal
 * linking: the itinerary route strips and day entries point at them, and they
 * point back at every journey that visits. Both directions are COMPUTED from
 * the journeys' own `routeCities`, which matters more than it sounds:
 *
 *   · a new journey through Jaipur appears on the Jaipur page without anyone
 *     remembering to edit the Jaipur page, and
 *   · the city set can grow from two to fifteen without touching one line of
 *     journey content.
 *
 * The rule for links is silence by default: a city with a page becomes a link,
 * a city without one stays plain text. Nothing on this site ever links to a
 * page that does not exist, and nothing renders a "coming soon" city.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type City = CollectionEntry<'cities'>;
export type Journey = CollectionEntry<'journeys'>;

/** Case- and punctuation-insensitive, so "Kochi (Cochin)" matches "Kochi". */
const normalise = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export interface CityLink {
  slug: string;
  name: string;
  href: string;
}

let indexCache: Map<string, CityLink> | undefined;

/**
 * Every name a city answers to — its own name plus its aliases — mapped to the
 * page. Built once per build.
 */
export async function getCityIndex(): Promise<Map<string, CityLink>> {
  if (indexCache) return indexCache;

  const cities = await getCollection('cities');
  const index = new Map<string, CityLink>();

  for (const city of cities) {
    const link: CityLink = {
      slug: city.id,
      name: city.data.name,
      href: `/cities/${city.id}/`,
    };
    for (const alias of [city.data.name, ...city.data.routeAliases]) {
      index.set(normalise(alias), link);
    }
  }

  indexCache = index;
  return index;
}

/**
 * Resolves one route-strip entry to a link, or to null when no page exists.
 * Null is the common case and the correct one — see the module note.
 */
export function cityLinkFor(index: Map<string, CityLink>, cityName: string): CityLink | null {
  return index.get(normalise(cityName)) ?? null;
}

/**
 * Cities mentioned in a free-text string — a day title, typically.
 *
 * Matched on WORD BOUNDARIES against the normalised text rather than with a
 * bare `includes`, because a substring match would find "Agra" inside "Agra
 * Fort" (fine) and also inside words that merely contain it (not fine), and
 * would happily link the same city twice from one title. De-duplicated by
 * slug, and capped at two: a day title naming three cities is a transfer day,
 * and three chips under it would read as navigation rather than as a note.
 */
export function citiesMentionedIn(index: Map<string, CityLink>, text: string): CityLink[] {
  const haystack = ` ${normalise(text)} `;
  const found = new Map<string, CityLink>();

  for (const [alias, link] of index) {
    if (haystack.includes(` ${alias} `) && !found.has(link.slug)) {
      found.set(link.slug, link);
    }
  }

  return [...found.values()].slice(0, 2);
}

/**
 * Journeys that visit a city: every journey whose route names it, then the
 * entry's own `relatedJourneys` as an ordering override and an escape hatch
 * for a trip that belongs here but does not name the city in its route.
 *
 * Manual picks come FIRST and in the author's order; automatic matches follow.
 * Drafts never appear.
 */
export async function journeysForCity(city: City): Promise<Journey[]> {
  const journeys = await getCollection('journeys', ({ data }) => !data.draft);
  const names = new Set([city.data.name, ...city.data.routeAliases].map(normalise));

  const manual: Journey[] = [];
  for (const ref of city.data.relatedJourneys) {
    const match = journeys.find((journey) => journey.id === ref.id);
    if (match) manual.push(match);
  }

  const manualIds = new Set(manual.map((journey) => journey.id));
  const automatic = journeys.filter(
    (journey) =>
      !manualIds.has(journey.id) &&
      journey.data.routeCities.some((routeCity) => names.has(normalise(routeCity))),
  );

  /* Trains last, longest first — the same editorial order as the archive. */
  automatic.sort((a, b) => {
    const byVariant = Number(a.data.variant === 'B') - Number(b.data.variant === 'B');
    if (byVariant !== 0) return byVariant;
    return b.data.nights - a.data.nights;
  });

  return [...manual, ...automatic];
}

/** How many journeys visit a city — for counts on index and listing pages. */
export async function journeyCountForCity(city: City): Promise<number> {
  return (await journeysForCity(city)).length;
}
