/**
 * Template Spec §6 — per-page design QA checklist, automated.
 * ---------------------------------------------------------------------------
 * §6 is the list that keeps 20 itinerary pages looking like siblings, and the
 * M5 gate requires all 20 to pass it. Checking that by eye 20 times is how
 * consistency quietly rots, so this reads the BUILT HTML and asserts the
 * structural half of the checklist. Run `npm run build` first.
 *
 * Automated here (structure — the part a script can actually know):
 *   1. lotus glyph is the highlight bullet, and no ✦ / ✓ / • survives there
 *   2. day titles follow "Place — Evocative Phrase"; every day has an
 *      overnight line
 *   3. route strip, duration badge and Quick Facts all present, in that order
 *   4. the page ends at the convert band → (policies) → related; no page ends
 *      on policy text
 *   5. Variant B carries the operator disclosure inside the cabin section
 *      header, not buried at the bottom
 *   6. transport chips are present on any journey whose days mention a
 *      flight/train/boat transfer
 *   7. no operator tariff anywhere (invariant #6 — belt and braces alongside
 *      audit-hardcoded.sh)
 *
 * NOT automated, and deliberately listed as REVIEW rather than silently
 * dropped: "yellow only on plum/burgundy" (needs computed colours against
 * their painted background — audited visually and by the Lighthouse contrast
 * check), and "gated PDF matches the page section-for-section" (the PDFs are
 * generated in M5 from the same CMS entry, so it is verified there).
 *
 * Usage: node scripts/check-template-spec.mjs [distDir]
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = process.argv[2] ?? 'dist/journeys';

if (!existsSync(DIST)) {
  console.error(`no built journeys at ${DIST} — run \`npm run build\` first`);
  process.exit(1);
}

/**
 * Only ever look at the BODY, with <style> blocks removed.
 * `build.inlineStylesheets: 'always'` puts every component's CSS in the head,
 * so a bare `indexOf('routestrip')` finds the *stylesheet* rule long before
 * the markup — which made the section-order check compare CSS authoring order
 * instead of DOM order, and fail on pages that were perfectly correct.
 */
const bodyOf = (html) =>
  html
    .slice(Math.max(html.indexOf('<body'), 0))
    .replace(/<style[\s\S]*?<\/style>/g, '');

const pages = readdirSync(DIST, { withFileTypes: true })
  .filter((e) => e.isDirectory() && existsSync(join(DIST, e.name, 'index.html')))
  .map((e) => ({
    slug: e.name,
    html: bodyOf(readFileSync(join(DIST, e.name, 'index.html'), 'utf8')),
  }));

if (pages.length === 0) {
  console.error(`no journey pages found in ${DIST}`);
  process.exit(1);
}

/** Text content of every match of a class, tags stripped. */
const textOf = (html, className) =>
  [...html.matchAll(new RegExp(`class="[^"]*\\b${className}\\b[^"]*"[^>]*>([\\s\\S]*?)<`, 'g'))]
    .map((m) => m[1].replace(/&#8212;|&mdash;/g, '—').replace(/&amp;/g, '&').trim())
    .filter(Boolean);

const count = (html, needle) => html.split(needle).length - 1;

let failures = 0;
const report = [];

for (const { slug, html } of pages) {
  const isVariantB = html.includes('id="cabins"');
  const checks = [];
  const check = (label, ok, detail = '') => {
    checks.push({ label, ok, detail });
    if (!ok) failures++;
  };

  /* 1. lotus bullets ---------------------------------------------------- */
  const highlightsBlock = html.match(/<section[^>]*class="band"[^>]*>[\s\S]*?highlights[\s\S]*?<\/section>/)?.[0] ?? '';
  const lotusMarks = count(highlightsBlock, 'lotus');
  const bannedGlyph = /[✦✓✔•●]/.exec(highlightsBlock);
  check(
    'lotus glyph is the highlight bullet',
    lotusMarks > 0 && !bannedGlyph,
    bannedGlyph ? `found "${bannedGlyph[0]}" in the highlights block` : `${lotusMarks} lotus marks`,
  );

  /* 2. day titles + overnight lines ------------------------------------- */
  const dayTitles = textOf(html, 'day__title');
  const overnights = textOf(html, 'day__overnight');
  const untitled = dayTitles.filter((t) => !t.includes('—'));
  check(
    'day titles follow "Place — Evocative Phrase"',
    dayTitles.length > 0 && untitled.length === 0,
    untitled.length ? `${untitled.length} without an em dash: ${untitled.slice(0, 2).join(' / ')}` : `${dayTitles.length} days`,
  );
  check(
    'every day carries an overnight line',
    overnights.length === dayTitles.length,
    `${overnights.length} overnight lines for ${dayTitles.length} days`,
  );

  /* 3. route strip, duration badge, quick facts — present and in order -- */
  const order = ['badge--duration', 'routestrip', 'quickfacts'].map((c) => html.indexOf(c));
  check(
    'duration badge → route strip → Quick Facts, all present and in order',
    order.every((i) => i !== -1) && order[0] < order[1] && order[1] < order[2],
    order.some((i) => i === -1) ? 'one of them is missing' : 'ok',
  );

  /* 4. the tail of the page --------------------------------------------- */
  const iEnquire = html.indexOf('id="enquire"');
  const iPolicies = html.indexOf('id="policies"');
  const iRelated = html.lastIndexOf('related__head');
  check(
    'ends at the convert band, then related — never on policy text',
    iEnquire !== -1 && iRelated > iEnquire && (iPolicies === -1 || (iPolicies > iEnquire && iPolicies < iRelated)),
    iRelated === -1 ? 'no related section' : 'ok',
  );

  /* 5. Variant B disclosure placement ---------------------------------- */
  if (isVariantB) {
    const cabinSection = html.match(/<section[^>]*id="cabins"[\s\S]*?<\/section>/)?.[0] ?? '';
    check(
      'operator disclosure sits in the cabin section header (Variant B)',
      /authorised booking agent|GSA|operated by/i.test(cabinSection),
      cabinSection ? 'found in the cabin section' : 'no cabin section',
    );
    check(
      'links to /booking-terms/ (Variant B)',
      html.includes('/booking-terms/'),
    );
  }

  /* 6. transport chips -------------------------------------------------- */
  const mentionsTransfer = /\b(flight|fly|overnight train|train|boat|ferry|drive)\b/i.test(
    textOf(html, 'day__narrative').join(' '),
  );
  const chips = count(html, 'chip__text');
  check(
    'transport chips present where days describe a transfer',
    !mentionsTransfer || chips > 0,
    `${chips} chips`,
  );

  /* 7. no operator tariff anywhere (invariant #6) ----------------------- */
  const tariff = /(?:US\$|USD|\$)\s?[\d,]{3,}|₹\s?[\d,]{4,}/.exec(html);
  check(
    'no operator tariff figure on the page (invariant #6)',
    !tariff,
    tariff ? `found "${tariff[0]}"` : 'clean',
  );

  report.push({ slug, isVariantB, checks });
}

console.log(`\nTemplate Spec §6 checklist — ${pages.length} journey page(s)\n`);
for (const { slug, isVariantB, checks } of report) {
  const bad = checks.filter((c) => !c.ok).length;
  console.log(`  ${bad ? '✗' : '✓'} ${slug}  [Variant ${isVariantB ? 'B' : 'A'}]`);
  for (const c of checks) {
    console.log(`      ${c.ok ? 'ok  ' : 'FAIL'} ${c.label}${c.detail ? ` — ${c.detail}` : ''}`);
  }
}

console.log('\n  REVIEW (not automatable, checked by eye + Lighthouse contrast):');
console.log('      · yellow only on plum/burgundy surfaces');
console.log('      · gated PDF matches the page section-for-section (M5)');

console.log(
  failures === 0
    ? `\nPASS: all ${pages.length} page(s) satisfy the automated half of §6.\n`
    : `\nFAIL: ${failures} check(s) failed.\n`,
);
process.exit(failures === 0 ? 0 : 1);
