/**
 * Internal link integrity across the built site.
 * ---------------------------------------------------------------------------
 * M4's gate is a full click-through on the preview URL. That is a human task,
 * and humans do not click every link on twenty-one pages — which is how a
 * homepage shipped with nine destination tiles pointing at pages that did not
 * exist yet, on a site where `trailingSlash: 'always'` means a missing slash
 * is also a 404.
 *
 * So: walk `dist`, collect every page that exists, collect every internal link
 * that is written, and report the difference. It runs on the BUILT output
 * rather than on source, because that is the only place where routing,
 * trailing slashes and redirects are all settled.
 *
 * Two things it deliberately does NOT treat as errors:
 *   · links to files that exist in `dist` but are not pages (PDFs, uploads)
 *   · anchors and query strings, which are stripped before comparison
 *
 * Known-pending routes can be listed in PENDING below, so that a half-built
 * milestone reports "8 pending, 0 broken" instead of failing on work that has
 * not started. Anything NOT on that list is a real break.
 *
 * Usage: node scripts/check-links.mjs [dist-dir]
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = process.argv[2] ?? 'dist';

/**
 * Routes that are specified and not yet built. Every entry here is a promise
 * to build it — delete the line when the page lands, and the check starts
 * enforcing it. An empty list is the goal.
 */
const PENDING = new Set([
  '/luxury-trains/',
  '/corporate/',
  '/about/',
  '/reviews/',
  '/travel-guide/',
  '/plan-my-trip/',
  '/privacy/',
  '/terms/',
  '/cancellation/',
  '/booking-terms/',
]);

/**
 * Whole sections still to be built, where the child routes are not knowable in
 * advance — an article slug exists in content long before its template does.
 * A trailing-slash prefix, matched only against DEEPER paths, so listing
 * `/travel-guide/` here never excuses a typo in `/about/`.
 */
const PENDING_PREFIXES = ['/travel-guide/'];

const isPending = (target) =>
  PENDING.has(target) ||
  PENDING_PREFIXES.some((prefix) => target.startsWith(prefix) && target.length > prefix.length);

if (!existsSync(DIST)) {
  console.error(`No ${DIST}/ — run \`npm run build\` first.`);
  process.exit(1);
}

const walk = (dir) => {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
};

const files = walk(DIST);

/** Every URL path the built site actually serves. */
const served = new Set();
for (const file of files) {
  const rel = '/' + relative(DIST, file).split(sep).join('/');
  served.add(rel);
  if (rel.endsWith('/index.html')) served.add(rel.slice(0, -'index.html'.length));
}

const pages = files.filter((file) => file.endsWith('.html'));
const broken = new Map();
const pending = new Map();
let checked = 0;

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const from = '/' + relative(DIST, page).split(sep).join('/');

  for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const raw = match[1];
    /* Astro's own hashed assets and anything with a protocol are not our
       problem; anchors and queries are stripped, not resolved. */
    const target = raw.split('#')[0].split('?')[0];
    if (!target || target.startsWith('//')) continue;
    checked += 1;
    if (served.has(target)) continue;

    const bucket = isPending(target) ? pending : broken;
    if (!bucket.has(target)) bucket.set(target, new Set());
    bucket.get(target).add(from);
  }
}

const report = (label, map) => {
  for (const [target, sources] of [...map].sort()) {
    const list = [...sources].slice(0, 3).join(', ');
    const more = sources.size > 3 ? ` (+${sources.size - 3} more)` : '';
    console.log(`  ${label} ${target}\n      linked from ${list}${more}`);
  }
};

console.log(`\nInternal links — ${pages.length} pages, ${checked} references\n`);

if (pending.size) {
  console.log('  Pending (specified, not yet built):');
  report('·', pending);
  console.log('');
}

if (broken.size) {
  console.log('  BROKEN:');
  report('✗', broken);
  console.error(`\nFAIL: ${broken.size} link target(s) do not exist and are not on the pending list.`);
  process.exit(1);
}

console.log(`PASS: no broken internal links. ${pending.size} route(s) still pending.`);
