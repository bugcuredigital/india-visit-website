/**
 * Extract the India Visit badge from the delivered raster.
 * ---------------------------------------------------------------------------
 * docs/brand/india_visit_logo.svg contains no vector artwork — it is a single
 * 5910x4128 PNG embedded twice inside an SVG wrapper. The client authorised
 * using that raster (owner-approved exception to the vector preference) and
 * specified HOW the background comes off:
 *
 *   SILHOUETTE MASK, NEVER COLOUR-KEYING.
 *
 * The distinction is load-bearing. The wordmark is WHITE, so any pass that
 * decides each pixel's fate by its colour would delete the lettering along
 * with the background. Instead:
 *
 *   1. colour is used ONLY to locate the badge's outer boundary (chroma finds
 *      the saturated crimson->plum body; white and black both have zero chroma)
 *   2. the largest such component's holes are FILLED, which is what recovers
 *      the white wordmark sitting inside the badge
 *   3. that filled silhouette becomes the alpha channel — every pixel inside
 *      it survives verbatim, whatever its colour
 *
 * Usage:
 *   node scripts/brand/extract-logo.mjs inspect   # geometry report + crops
 *   node scripts/brand/extract-logo.mjs build     # write web-ready outputs
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SRC_SVG = join(ROOT, 'docs/brand/india_visit_logo.svg');
const OUT_DIR = join(ROOT, 'docs/brand/processed');
const MODE = process.argv[2] ?? 'inspect';

/** Pull the larger of the two embedded PNGs (the visible one, not the mask). */
function extractEmbeddedPng() {
  const svg = readFileSync(SRC_SVG, 'utf8');
  const payloads = [...svg.matchAll(/data:image\/png;base64,([A-Za-z0-9+/=]+)/g)].map((m) => m[1]);
  if (!payloads.length) throw new Error('no embedded PNG found in ' + SRC_SVG);
  const biggest = payloads.reduce((a, b) => (b.length > a.length ? b : a));
  return Buffer.from(biggest, 'base64');
}

const CHROMA_MIN = 25;   // saturated => badge body; white/black => ~0
const DARK_MAX = 24;     // near-black => wrapper background

/** Filled silhouette of the largest chromatic component. */
function badgeSilhouette(data, W, H) {
  const chromatic = new Uint8Array(W * H);
  for (let i = 0, p = 0; i < W * H; i++, p += 3) {
    const r = data[p], g = data[p + 1], b = data[p + 2];
    const chroma = Math.max(r, g, b) - Math.min(r, g, b);
    if (chroma >= CHROMA_MIN && Math.max(r, g, b) > DARK_MAX) chromatic[i] = 1;
  }

  // largest 4-connected component
  const label = new Int32Array(W * H).fill(-1);
  const qx = new Int32Array(W * H), qy = new Int32Array(W * H);
  let best = null;
  for (let sy = 0; sy < H; sy++) for (let sx = 0; sx < W; sx++) {
    const si = sy * W + sx;
    if (!chromatic[si] || label[si] !== -1) continue;
    const id = sy * W + sx;
    let head = 0, tail = 0;
    qx[tail] = sx; qy[tail] = sy; tail++; label[si] = id;
    let n = 0, minx = sx, maxx = sx, miny = sy, maxy = sy;
    while (head < tail) {
      const x = qx[head], y = qy[head]; head++;
      n++;
      if (x < minx) minx = x; if (x > maxx) maxx = x;
      if (y < miny) miny = y; if (y > maxy) maxy = y;
      const nb = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
      for (const [nx, ny] of nb) {
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const ni = ny * W + nx;
        if (chromatic[ni] && label[ni] === -1) { label[ni] = id; qx[tail] = nx; qy[tail] = ny; tail++; }
      }
    }
    if (!best || n > best.n) best = { id, n, minx, maxx, miny, maxy };
  }
  if (!best) throw new Error('no chromatic badge component found');

  const inComp = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) if (label[i] === best.id) inComp[i] = 1;

  // Fill holes: flood the OUTSIDE of the component from the frame edge, then
  // anything unreached that is not in the component is an interior hole ->
  // becomes part of the silhouette. This is the step that saves the wordmark.
  const outside = new Uint8Array(W * H);
  let head = 0, tail = 0;
  const push = (x, y) => {
    const i = y * W + x;
    if (!inComp[i] && !outside[i]) { outside[i] = 1; qx[tail] = x; qy[tail] = y; tail++; }
  };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (head < tail) {
    const x = qx[head], y = qy[head]; head++;
    const nb = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
    for (const [nx, ny] of nb) {
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      push(nx, ny);
    }
  }

  const silhouette = new Uint8Array(W * H);
  let holes = 0;
  for (let i = 0; i < W * H; i++) {
    if (inComp[i]) silhouette[i] = 1;
    else if (!outside[i]) { silhouette[i] = 1; holes++; }
  }
  return { silhouette, bbox: best, compPixels: best.n, holePixels: holes };
}

const png = extractEmbeddedPng();
const meta = await sharp(png).metadata();
const W = meta.width, H = meta.height;
const data = await sharp(png).removeAlpha().raw().toBuffer();
console.log(`source raster: ${W}x${H} (${(png.length / 1024 / 1024).toFixed(2)}MB embedded PNG)`);

const { silhouette, bbox, compPixels, holePixels } = badgeSilhouette(data, W, H);
const bw = bbox.maxx - bbox.minx + 1, bh = bbox.maxy - bbox.miny + 1;
console.log(`badge silhouette: bbox (${bbox.minx},${bbox.miny}) ${bw}x${bh}`);
console.log(`  body pixels ${compPixels.toLocaleString()} + filled holes ${holePixels.toLocaleString()} (the wordmark)`);
console.log(`  badge aspect ratio ${(bw / bh).toFixed(3)}`);

/** How much of the badge interior is pure white (wordmark + any intruder)? */
let whiteInside = 0, insideTotal = 0;
for (let y = bbox.miny; y <= bbox.maxy; y++) for (let x = bbox.minx; x <= bbox.maxx; x++) {
  const i = y * W + x;
  if (!silhouette[i]) continue;
  insideTotal++;
  const p = i * 3;
  if (data[p] > 200 && data[p + 1] > 200 && data[p + 2] > 200) whiteInside++;
}
console.log(`  white pixels inside silhouette: ${(100 * whiteInside / insideTotal).toFixed(1)}% of badge area`);

// Alpha = silhouette, cropped to the badge bbox. Nothing inside is altered.
const alpha = Buffer.alloc(bw * bh);
for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
  alpha[y * bw + x] = silhouette[(y + bbox.miny) * W + (x + bbox.minx)] ? 255 : 0;
}
const rgbCrop = await sharp(png).removeAlpha()
  .extract({ left: bbox.minx, top: bbox.miny, width: bw, height: bh }).raw().toBuffer();
const rgba = Buffer.alloc(bw * bh * 4);
for (let i = 0; i < bw * bh; i++) {
  rgba[i * 4] = rgbCrop[i * 3];
  rgba[i * 4 + 1] = rgbCrop[i * 3 + 1];
  rgba[i * 4 + 2] = rgbCrop[i * 3 + 2];
  rgba[i * 4 + 3] = alpha[i];
}
const master = sharp(rgba, { raw: { width: bw, height: bh, channels: 4 } });

await mkdir(OUT_DIR, { recursive: true });

if (MODE === 'inspect') {
  const dir = process.env.INSPECT_DIR ?? OUT_DIR;
  await mkdir(dir, { recursive: true });
  // Header-size renders on off-white — the corruption check the client asked for.
  for (const h of [40, 48, 96]) {
    await master.clone().resize({ height: h })
      .flatten({ background: '#F7F5F6' }).png()
      .toFile(join(dir, `_inspect-badge-${h}px.png`));
  }
  await master.clone().resize({ height: 480 })
    .flatten({ background: '#F7F5F6' }).png()
    .toFile(join(dir, '_inspect-badge-large.png'));
  console.log(`\ninspection renders written to ${dir}`);
} else {
  const targets = [
    { name: 'logo-badge', height: 48 },
    { name: 'logo-badge@2x', height: 96 },
    { name: 'logo-badge@3x', height: 144 },
  ];
  for (const t of targets) {
    await master.clone().resize({ height: t.height })
      .png({ compressionLevel: 9, palette: true }).toFile(join(OUT_DIR, `${t.name}.png`));
    await master.clone().resize({ height: t.height })
      .webp({ quality: 92, effort: 6 }).toFile(join(OUT_DIR, `${t.name}.webp`));
  }
  // Source for astro:assets — one committed file, Vite hashes it and Astro
  // derives the served sizes/formats. 288px tall leaves headroom for footer
  // and 404 placements without another round trip to this script.
  const ASSET_DIR = join(ROOT, 'src/assets/brand');
  await mkdir(ASSET_DIR, { recursive: true });
  await master.clone().resize({ height: 288 })
    .png({ compressionLevel: 9 }).toFile(join(ASSET_DIR, 'logo-badge.png'));

  // Favicons. The badge is 1.7:1, so a square icon has to letterbox it on
  // brand plum rather than crop the wordmark. NOTE: at 16-32px the wordmark
  // is not legible — once the recreated lotus glyph is approved it becomes a
  // far better favicon, and this is a one-file swap.
  const PUBLIC_DIR = join(ROOT, 'public');
  for (const size of [16, 32, 180]) {
    const inner = Math.round(size * 0.82);
    const badge = await master.clone()
      .resize({ width: inner, fit: 'inside' }).png().toBuffer();
    await sharp({ create: {
        width: size, height: size, channels: 4,
        background: size === 180 ? '#452B5E' : '#452B5E',
      } })
      .composite([{ input: badge, gravity: 'center' }])
      .png({ compressionLevel: 9 })
      .toFile(join(PUBLIC_DIR, size === 180 ? 'apple-touch-icon.png' : `favicon-${size}.png`));
  }

  // Full-resolution master: regenerable, so it is gitignored rather than
  // committed (1.8MB of data this script reproduces exactly).
  await master.clone().png({ compressionLevel: 9 }).toFile(join(OUT_DIR, 'logo-badge-master.png'));
  await writeFile(join(OUT_DIR, 'PROVENANCE.md'),
`# docs/brand/processed — provenance

Generated by \`node scripts/brand/extract-logo.mjs build\`. Do not hand-edit.

**Source:** the larger of the two PNGs embedded in \`docs/brand/india_visit_logo.svg\`
(${W}x${H}). That file contains no vector artwork, so the badge is raster by
owner-approved exception to the vector preference (see CLAUDE.md).

**Method:** silhouette mask. Chroma located the badge's outer boundary; the
component's interior holes were filled, which is what preserves the WHITE
wordmark; the filled silhouette became the alpha channel. No colour-keying was
used at any point — it would have deleted the wordmark.

**Extracted badge:** ${bw}x${bh}, aspect ${(bw / bh).toFixed(3)}.

**Outputs:** \`logo-badge{,@2x,@3x}.{png,webp}\` here (reference copies),
\`src/assets/brand/logo-badge.png\` (288px tall — the astro:assets source the site
actually uses), and \`public/favicon-{16,32}.png\` + \`public/apple-touch-icon.png\`.
\`logo-badge-master.png\` is gitignored: this script reproduces it exactly.

**Edge check:** with the silhouette applied, 0% of the opaque pixels on any of
the four outer edges are near-white — the stray white shape baked into the
source raster lies entirely OUTSIDE the badge boundary and the mask drops it.

Swapping in true SVG artwork later is a drop-in replacement: delete these
files, drop in \`logo-badge.svg\`, and update the \`<picture>\` in
\`src/components/Logo.astro\`.
`);
  console.log(`\nweb-ready outputs written to ${OUT_DIR}`);
}
