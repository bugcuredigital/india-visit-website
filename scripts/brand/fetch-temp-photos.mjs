/**
 * TEMPORARY design-review photography.
 * ---------------------------------------------------------------------------
 * These are NOT the client's photographs. They exist because a
 * photography-led design cannot be judged through placeholder blocks, and the
 * client's archive is still outstanding. Every output file is named
 * `TEMP-PHOTO-*.jpg` so that `grep -rn "TEMP-PHOTO"` finds every reference
 * across content and code, and `npm run audit:hardcoded` counts them. They are
 * all replaced by the client's own archive in M5.
 *
 * Source: Unsplash. The Unsplash Licence permits commercial use with no
 * attribution required — but attribution is recorded anyway in
 * `docs/brand/processed/TEMP-PHOTO-PROVENANCE.md`, because knowing where an
 * asset came from is the difference between replacing it confidently and
 * guessing later.
 *
 * Only `images.unsplash.com/photo-*` URLs are used. `plus.unsplash.com/
 * premium_photo-*` is Unsplash+ (paid) and is deliberately excluded — a
 * licence we do not hold is worse than no photograph.
 *
 * The grade is one shared curve for the whole set: a warm shift with colour
 * pulled slightly DOWN. Consistency is the point — a set of individually
 * lovely photographs with mismatched colour temperature looks like a stock
 * grid, not a brand, and lifting saturation makes that worse rather than
 * better.
 *
 * Usage: node scripts/brand/fetch-temp-photos.mjs
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const OUT_DIR = 'src/assets/temp-photos';
const PROVENANCE = 'docs/brand/processed/TEMP-PHOTO-PROVENANCE.md';

/**
 * One curve for the whole set. Note the saturation is BELOW 1: the first pass
 * lifted it to 1.06, which amplified how differently these photographs were
 * lit — the turquoise ones read tropical and the sandstone ones read desert,
 * and the strip looked like a stock grid. Pulling colour down while pushing
 * the warm bias up is what makes an unrelated set feel like one collection.
 */
const WARM_GRADE = { multipliers: [1.06, 1.0, 0.93], saturation: 0.93 };

/**
 * Heroes are cropped to a predictable 3:2 master rather than shipped at the
 * source aspect. Two reasons: composition stops being luck (a portrait
 * photograph cover-cropped into a wide hero loses its subject), and a portrait
 * master wastes real bytes on the LCP image — we were sending 1280px of height
 * to fill a 470px band.
 */
const HERO_ASPECT = 1.5;

/**
 * `width` is the source width to request and the max output width. Heroes need
 * the full 2400 because they are full-bleed; tiles and cards are rendered at a
 * few hundred CSS pixels, so a 1200px master is already generous at 2x.
 */
const PHOTOS = [
  // ---- heroes ------------------------------------------------------------
  {
    name: 'home-hero-udaipur',
    id: 'photo-1695956353120-54ce5e91632b',
    width: 2400,
    hero: true,
    credit: 'Maitree Patel',
    subject: 'Udaipur City Palace on Lake Pichola at golden hour',
    usedFor: 'homepage hero',
  },
  {
    name: 'journey-kerala-houseboat',
    id: 'photo-1602216056096-3b40cc0c9944',
    width: 2400,
    hero: true,
    credit: 'Unsplash contributor',
    subject: 'A boat on open backwater beside a green treeline',
    usedFor: 'journey hero — Kerala with Houseboat (Variant A seed)',
  },
  {
    name: 'journey-luxury-train',
    id: 'photo-1633084071043-7fb96fe530b1',
    width: 2400,
    hero: true,
    credit: 'Florian Marette',
    subject: 'Wood-panelled vintage train carriage interior',
    usedFor: 'journey hero — Palace on Wheels (Variant B seed) + homepage luxury-rail banner',
  },

  {
    name: 'journey-golden-triangle',
    id: 'photo-1587135941948-670b381f08ce',
    width: 2400,
    hero: true,
    credit: 'Rowan Heuvel',
    subject: 'The Taj Mahal at Agra under a golden-hour sky',
    usedFor: 'journey hero — Golden Triangle 5N/6D',
  },
  {
    name: 'journey-bali',
    id: 'photo-1558005530-a7958896ec60',
    width: 2400,
    hero: true,
    credit: 'Unsplash contributor',
    subject: 'A figure walking through bright green rice terraces below a misty ridge at dawn',
    usedFor: 'journey hero — Bali 5N/6D',
  },
  {
    name: 'journey-north-east',
    id: 'photo-1689089526066-c7e6e95ee265',
    width: 2400,
    hero: true,
    credit: 'Unsplash contributor',
    subject: 'A lush green valley in the Khasi Hills with a distant waterfall',
    usedFor: 'journey hero — North East India 6N/7D',
  },
  {
    name: 'journey-western-southern',
    id: 'photo-1559318246-114068fc532e',
    width: 2400,
    hero: true,
    credit: 'Unsplash contributor',
    subject: 'A stone temple on a hilltop above a wide valley',
    usedFor: 'journey hero — Western & Southern India 12N/13D',
  },

  // ---- the nine locked destinations --------------------------------------
  {
    name: 'dest-rajasthan',
    id: 'photo-1710347454810-e3d493dcc538',
    width: 1400,
    credit: 'Unsplash contributor',
    subject: 'Jaisalmer rooftops and fort from a high vantage',
    usedFor: 'destination tile — rajasthan-golden-triangle',
  },
  {
    name: 'dest-kerala',
    id: 'photo-1593693411515-c20261bcad6e',
    width: 1400,
    credit: 'Unsplash contributor',
    subject: 'Traditional houseboat on palm-lined Alappuzha backwaters',
    usedFor: 'destination tile — kerala',
  },
  {
    name: 'dest-south-west',
    id: 'photo-1722934804353-0d9f6a55ab5e',
    width: 1400,
    credit: 'Unsplash contributor',
    subject: 'Hampi temple ruins across open ground',
    usedFor: 'destination tile — south-west-india',
  },
  {
    name: 'dest-ladakh',
    id: 'photo-1600356033695-a003690a6351',
    width: 1400,
    credit: 'Unsplash contributor',
    subject: 'Turquoise high-altitude lake below bare Himalayan peaks',
    usedFor: 'destination tile — ladakh',
  },
  {
    name: 'dest-north-east',
    id: 'photo-1625826415128-3fbae9b3022c',
    width: 1400,
    credit: 'Unsplash contributor',
    subject: 'Green Meghalaya hills under cloud',
    usedFor: 'destination tile — north-east-india',
  },
  {
    name: 'dest-wildlife',
    id: 'photo-1615474286632-e31ac3633d58',
    width: 1400,
    credit: 'Unsplash contributor',
    subject: 'Tiger in warm light on dry grass',
    usedFor: 'destination tile — wildlife',
  },
  {
    name: 'dest-bhutan',
    id: 'photo-1665731235408-130bf915c424',
    width: 1400,
    credit: 'Truly Bhutan',
    subject: "Taktsang (Tiger's Nest) monastery on the cliff face",
    usedFor: 'destination tile — bhutan',
  },
  {
    name: 'dest-bali',
    id: 'photo-1555400038-63f5ba517a47',
    width: 1400,
    credit: 'Unsplash contributor',
    subject: 'Tegallalang rice terraces with palms',
    usedFor: 'destination tile — bali',
  },
  {
    name: 'dest-vietnam',
    id: 'photo-1643029891412-92f9a81a8c16',
    width: 1400,
    credit: 'Marina Lobato',
    subject: 'Boats among the limestone karsts of Ha Long Bay',
    usedFor: 'destination tile — vietnam',
  },

  // ---- travel-guide cards -------------------------------------------------
  {
    name: 'article-kerala-houseboat',
    id: 'photo-1609828913552-f9138ed9e42d',
    width: 1400,
    credit: 'Unsplash contributor',
    subject: 'Wooden boat moored beside backwater palms',
    usedFor: 'article hero — Kerala houseboat guide',
  },
  {
    name: 'article-tea-gardens',
    id: 'photo-1719831738921-972e0ec76337',
    width: 1400,
    credit: 'Unsplash contributor',
    subject: 'Rolling Munnar tea gardens against a hill',
    usedFor: 'spare article hero (M5)',
  },
  {
    name: 'article-fort',
    id: 'photo-1544616751-eea58efccec4',
    width: 1400,
    credit: 'Unsplash contributor',
    subject: 'Sandstone fort walls from below',
    usedFor: 'spare article hero (M5)',
  },
];

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync('docs/brand/processed', { recursive: true });

const results = [];

for (const photo of PHOTOS) {
  const url = `https://images.unsplash.com/${photo.id}?w=${photo.width}&q=85&fm=jpg&fit=max`;
  const outPath = join(OUT_DIR, `TEMP-PHOTO-${photo.name}.jpg`);

  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!response.ok) {
    console.error(`  FAILED ${photo.name} — HTTP ${response.status}`);
    results.push({ ...photo, ok: false });
    continue;
  }
  const source = Buffer.from(await response.arrayBuffer());

  const resize = photo.hero
    ? {
        width: photo.width,
        height: Math.round(photo.width / HERO_ASPECT),
        fit: 'cover',
        position: 'centre',
        withoutEnlargement: true,
      }
    : { width: photo.width, withoutEnlargement: true };

  const graded = await sharp(source)
    .resize(resize)
    .modulate({ saturation: WARM_GRADE.saturation })
    .linear(WARM_GRADE.multipliers, [0, 0, 0])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  writeFileSync(outPath, graded);
  const meta = await sharp(graded).metadata();
  console.log(
    `  ${String(Math.round(graded.length / 1024)).padStart(5)} KB  ` +
    `${String(meta.width).padStart(4)}x${String(meta.height).padEnd(4)}  ${outPath}`,
  );
  results.push({ ...photo, ok: true, url, bytes: graded.length, w: meta.width, h: meta.height });
}

const ok = results.filter((r) => r.ok);
const rows = ok
  .map((r) => `| \`TEMP-PHOTO-${r.name}.jpg\` | ${r.subject} | ${r.credit} | [source](https://unsplash.com/photos/${r.id.replace(/^photo-/, '')}) | ${r.w}×${r.h} | ${r.usedFor} |`)
  .join('\n');

writeFileSync(
  PROVENANCE,
  `# TEMP-PHOTO provenance

**These are not the client's photographs.** They are temporary images sourced
for design review only, because a photography-led design cannot be judged
through placeholder blocks. **Every one is replaced by the client's own archive
in M5.**

Regenerate with \`npm run temp:photos\`. Find every reference with
\`grep -rn "TEMP-PHOTO" src/\`.

## Licence

All files come from Unsplash under the [Unsplash
Licence](https://unsplash.com/license), which permits commercial use and does
not require attribution. Attribution is recorded here regardless, so that
replacing a file later is a lookup rather than a guess.

Unsplash+ (\`plus.unsplash.com/premium_photo-*\`) images are **deliberately
excluded** — that is a paid licence this project does not hold.

## The grade

One shared curve across the whole set, so it reads as a coherent collection
rather than a stock grid: channel multipliers \`${JSON.stringify(WARM_GRADE.multipliers)}\`
(red up, blue down — a warm shift) and saturation \`${WARM_GRADE.saturation}\`
(deliberately below 1, so an unrelated set reads as one collection instead of
a stock grid). Heroes are cropped to a ${HERO_ASPECT}:1 master.
Encoded as mozjpeg quality 82.

## The set

| File | Subject | Photographer | Source | Master size | Used for |
|---|---|---|---|---|---|
${rows}

${ok.length} of ${results.length} fetched successfully.
`,
);

console.log(`\n  ${ok.length}/${results.length} photos written to ${OUT_DIR}`);
console.log(`  provenance → ${PROVENANCE}`);
if (ok.length !== results.length) process.exit(1);
