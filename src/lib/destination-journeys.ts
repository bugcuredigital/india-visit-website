/**
 * The journeys a destination page lists — CLAUDE.md's "auto by tag + manual
 * override", in one place so the page and the /destinations/ index count can
 * never disagree.
 * ---------------------------------------------------------------------------
 * 1. The destination's own `relatedJourneys`, in the order an editor put them
 *    (the manual override, unchanged since M5).
 * 2. Then every journey whose `destinations` names this page and is not
 *    already in that list, longest first (the automatic half, round 5).
 *
 * The tag is a list of the nine locked slugs, validated by Zod, so a trip is
 * filed only where an editor said it belongs. Nothing here guesses from a
 * title or a route, which is the fuzzy match the destination template
 * refused to build in M4.
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

type Journey = CollectionEntry<'journeys'>;
type Destination = CollectionEntry<'destinations'>;

export async function journeysForDestination(destination: Destination): Promise<Journey[]> {
  const manual = (
    await Promise.all(destination.data.relatedJourneys.map((ref) => getEntry('journeys', ref.id)))
  ).filter((journey): journey is Journey => journey !== undefined && !journey.data.draft);

  const listed = new Set(manual.map((journey) => journey.id));
  const tagged = (
    await getCollection(
      'journeys',
      ({ id, data }) => !data.draft && !listed.has(id) && data.destinations.includes(destination.id),
    )
  ).sort((a, b) => b.data.nights - a.data.nights || a.data.title.localeCompare(b.data.title));

  return [...manual, ...tagged];
}
