#!/usr/bin/env node
/**
 * Transport labels never say their mode twice — checked on the built pages.
 * ---------------------------------------------------------------------------
 * The per-day transport chip reads "<mode> · <detail>". When the detail names
 * its own mode, the chip has to drop the label or it reads "Drive · Drive 172
 * km". That bug was fixed page by page twice and survived both times: on 12
 * Nov on sixteen journeys, and again in the round-5 audit, where Kerala still
 * showed "Drive · Drive 172 km" on four days and Bhutan "Flight · Fly to
 * Paro". The client's ruling (13 Nov): fix it sitewide and make it fail loudly.
 *
 * So this reads what visitors actually see: every `.chip__text` in `dist/`,
 * whatever the content looked like and however the chip built it. A label
 * fails when the first word after the middle dot belongs to the same word
 * family as a word before it ("Drive · Drive", "Flight · Fly", "Overnight
 * train · Overnight"). It runs inside `npm run build`, after Astro, so a
 * doubled label stops the deploy and the last good one stays live.
 *
 * Usage: node scripts/check-transport-labels.mjs   (needs a built dist/)
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

/** Words that name the same way of travelling. */
const FAMILIES = [
  ['flight', 'flights', 'fly', 'flies', 'flying', 'flew'],
  ['drive', 'drives', 'driving', 'drove', 'road'],
  ['train', 'trains', 'rail', 'railway'],
  ['overnight'],
  ['boat', 'boats', 'boating'],
  ['cruise', 'cruises', 'cruising'],
  ['ferry', 'ferries'],
  ['walk', 'walks', 'walking', 'foot'],
  ['hike', 'hikes', 'hiking'],
  ['trek', 'treks', 'trekking'],
];

const familyOf = (word) => FAMILIES.findIndex((family) => family.includes(word));
const words = (text) => text.toLowerCase().match(/[a-z]+/g) ?? [];

/** "Drive · Drive 172 km" → true; "Train · Overnight to Kochi" → false. */
export const isDoubled = (text) => {
  const [label, rest] = text.split(' · ');
  if (rest === undefined) return false;
  const first = words(rest)[0];
  if (!first) return false;
  return words(label).some((word) => word === first || (familyOf(word) !== -1 && familyOf(word) === familyOf(first)));
};

const decode = (html) =>
  html
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&middot;|&#183;|&#xb7;/gi, '·')
    .replace(/\s+/g, ' ')
    .trim();

const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path)));
    else if (entry.name.endsWith('.html')) out.push(path);
  }
  return out;
};

let files;
try {
  files = await walk(DIST);
} catch {
  console.error('check:transport-labels: no dist/ — run the Astro build first.');
  process.exit(1);
}

const failures = [];
let checked = 0;
for (const file of files) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/class="chip__text"[^>]*>([^<]*)</g)) {
    const text = decode(match[1]);
    checked += 1;
    if (isDoubled(text)) failures.push(`/${relative(DIST, file).replace(/index\.html$/, '')}  "${text}"`);
  }
}

if (!checked) {
  console.error('check:transport-labels: found no transport chips in dist/ — the chip markup changed, so this check must change with it.');
  process.exit(1);
}
if (failures.length) {
  console.error(`\ncheck:transport-labels: ${failures.length} transport label(s) name their mode twice:`);
  for (const failure of failures) console.error(`  · ${failure}`);
  console.error('\nStore the detail with a separator ("Drive — 172 km"), or drop the mode word from it.\n');
  process.exit(1);
}
console.log(`check:transport-labels: ${checked} transport labels on the built pages, none says its mode twice.`);
