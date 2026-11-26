/**
 * The last word in every sort: the entry's id (its slug).
 * ---------------------------------------------------------------------------
 * A collection comes back from Astro's loader in the order the build
 * machine's file system lists it, and that differs between machines: on
 * 25 Nov 2026 the homepage's featured row showed Kerala before North East on
 * Cloudflare's builder and the reverse on a Mac, because the sort compared
 * only `featured` and "trains last" and left every tie to the loader. Ending
 * each comparator with `byId` makes the order a property of the content, the
 * same on every machine. Cloudflare's loader lists files alphabetically, so
 * this reproduces the order production already showed.
 *
 * Plain code-unit comparison, not localeCompare: slugs are ASCII, and the
 * result must not depend on the machine's locale either.
 */
export const byId = (a: { id: string }, b: { id: string }): number =>
  a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
