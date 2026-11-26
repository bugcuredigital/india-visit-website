/**
 * check:structured-data — every JSON-LD block on every built page, against
 * Google's documented requirements for its type (runbook M8 step 1).
 * ---------------------------------------------------------------------------
 * Google's Rich Results Test has no API, so this is the gate that runs on
 * every build; LAUNCH_DAY.md runs the real test once per page type on the
 * live domain. Checked:
 *   · every block parses, and carries @context schema.org and an @type
 *   · every URL inside it is absolute and on the page's own origin (the
 *     canonical's): a SITE_URL left on pages.dev after the domain switch fails here
 *   · TravelAgency on every page: name, url, logo, address (PostalAddress)
 *   · BreadcrumbList on every inner page: positions 1..n, a name each, an item
 *     URL each, the last one the page's canonical
 *   · TouristTrip on every journey: name, description, url = canonical, image, an
 *     itinerary ItemList, and no `duration` (schema.org Trip has none)
 *   · Article on every post: headline (≤ 110 characters), image, datePublished,
 *     dateModified not before it, author.name
 *   · FAQPage: at least one question, each with an answer, and each question
 *     visible in the page (Google requires the marked-up FAQ to be on the page)
 *   · no Review or AggregateRating at all while every testimonial is a
 *     placeholder (invariant #9: a fabricated review is never structured data)
 *
 * Usage: node scripts/check-structured-data.mjs [dist]
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = process.argv[2] ?? 'dist';
const failures = [];
const counts = {};

const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path)));
    else if (entry.name === 'index.html') out.push(path);
  }
  return out;
};

const decode = (text) =>
  text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const visibleText = (html) =>
  decode(html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ');

const urlsIn = (value, out = []) => {
  if (typeof value === 'string' && /^https?:\/\//.test(value)) out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => urlsIn(v, out));
  else if (value && typeof value === 'object')
    Object.entries(value).forEach(([k, v]) => k !== 'sameAs' && k !== '@context' && urlsIn(v, out));
  return out;
};

for (const file of (await walk(DIST)).sort()) {
  const route = '/' + relative(DIST, file).replace(/index\.html$/, '');
  if (route.startsWith('/dev/') || route.startsWith('/admin/')) continue;
  const html = await readFile(file, 'utf8');
  const fail = (message) => failures.push({ route, message });
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  if (!canonical) {
    fail('no canonical');
    continue;
  }
  const origin = new URL(canonical).origin;
  const blocks = [];
  for (const match of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      blocks.push(JSON.parse(match[1]));
    } catch (error) {
      fail(`JSON-LD does not parse: ${error.message}`);
    }
  }
  const byType = {};
  for (const block of blocks) {
    if (block['@context'] !== 'https://schema.org') fail(`@context is ${block['@context']}`);
    const type = block['@type'];
    if (!type) fail('a block has no @type');
    (byType[type] ??= []).push(block);
    counts[type] = (counts[type] ?? 0) + 1;
    for (const url of urlsIn(block)) if (new URL(url).origin !== origin) fail(`${type} links off-origin: ${url}`);
  }
  const one = (type) => byType[type]?.[0];
  const is404 = route === '/404.html/' || /<title>[^<]*not found/i.test(html) || route === '/404/';

  const org = one('TravelAgency');
  if (!org) fail('no TravelAgency');
  else {
    for (const key of ['name', 'url', 'logo', 'telephone']) if (!org[key]) fail(`TravelAgency has no ${key}`);
    const a = org.address;
    if (!a || a['@type'] !== 'PostalAddress' || !a.streetAddress || !a.addressLocality || !a.addressCountry)
      fail('TravelAgency address is not a complete PostalAddress');
  }

  const inner = route !== '/' && !is404;
  const crumbs = one('BreadcrumbList');
  if (inner && !crumbs) fail('no BreadcrumbList');
  if (crumbs) {
    const items = crumbs.itemListElement ?? [];
    if (items.length < 2) fail('BreadcrumbList has fewer than two items');
    items.forEach((item, i) => {
      if (item.position !== i + 1) fail(`breadcrumb ${i + 1} has position ${item.position}`);
      if (!item.name) fail(`breadcrumb ${i + 1} has no name`);
      if (!item.item) fail(`breadcrumb ${i + 1} has no item URL`);
    });
    const last = items.at(-1)?.item;
    if (last && last !== canonical) fail(`last breadcrumb ${last} is not the canonical ${canonical}`);
  }

  if (/^\/journeys\/[^/]+\/$/.test(route)) {
    const trip = one('TouristTrip');
    if (!trip) fail('journey without TouristTrip');
    else {
      for (const key of ['name', 'description', 'image']) if (!trip[key]) fail(`TouristTrip has no ${key}`);
      if (trip.url !== canonical) fail(`TouristTrip url ${trip.url} is not the canonical`);
      if (trip.duration !== undefined) fail('TouristTrip carries duration, which schema.org Trip does not define');
      const stops = trip.itinerary?.itemListElement ?? [];
      if (trip.itinerary?.['@type'] !== 'ItemList' || !stops.length) fail('TouristTrip has no itinerary ItemList');
      stops.forEach((stop, i) => {
        if (stop.position !== i + 1 || !stop.item?.name) fail(`TouristTrip itinerary stop ${i + 1} is incomplete`);
      });
    }
  }

  if (/^\/travel-guide\/[^/]+\/$/.test(route)) {
    const article = one('Article');
    if (!article) fail('post without Article');
    else {
      if (!article.headline || article.headline.length > 110) fail(`Article headline missing or over 110 characters`);
      if (!article.image) fail('Article has no image');
      if (!article.author?.name) fail('Article author has no name');
      const published = Date.parse(article.datePublished);
      const modified = Date.parse(article.dateModified);
      if (Number.isNaN(published)) fail('Article datePublished is not a date');
      if (Number.isNaN(modified) || modified < published) fail('Article dateModified is missing or before datePublished');
    }
  }

  const faq = one('FAQPage');
  if (faq) {
    const text = visibleText(html);
    const questions = faq.mainEntity ?? [];
    if (!questions.length) fail('FAQPage with no questions');
    for (const q of questions) {
      if (q['@type'] !== 'Question' || !q.name || !q.acceptedAnswer?.text) fail(`FAQ entry incomplete: ${q.name}`);
      else if (!text.includes(q.name.replace(/\s+/g, ' ').trim())) fail(`FAQ question not visible on the page: "${q.name}"`);
    }
  }

  if (byType.Review || byType.AggregateRating || org?.aggregateRating) fail('Review or AggregateRating present');
}

console.log(`\nStructured data — ${Object.entries(counts).map(([t, n]) => `${t} ${n}`).join(' · ')}`);
if (failures.length) {
  // One line per kind of problem: a broken builder fails every page the same way.
  const grouped = new Map();
  for (const { route, message } of failures) grouped.set(message, [...(grouped.get(message) ?? []), route]);
  console.log(`\nFAIL: ${failures.length} problem(s), ${grouped.size} kind(s):`);
  for (const [message, routes] of grouped)
    console.log(`  · ${message} — ${routes.length} page(s): ${routes.slice(0, 3).join(', ')}${routes.length > 3 ? ', …' : ''}`);
  process.exit(1);
}
console.log('PASS: every block parses and meets Google\'s requirements for its type.');
