/**
 * Quiet placeholder images.
 * ---------------------------------------------------------------------------
 * Client ruling, after the first M4 homepage review: **never brand gradients
 * for placeholder imagery again.** The previous placeholders were
 * crimson-to-plum gradients with a diagonal stripe pattern, and they dominated
 * every page so completely that the actual design register could not be
 * assessed at all. A placeholder's job is to say "a photograph goes here" and
 * then get out of the way.
 *
 * So: a neutral warm grey #ECE9E6 field, a hairline border, and a small
 * centred label in muted ink. Nothing else — no brand colour, no pattern, no
 * shouting.
 *
 * Usage: node scripts/brand/make-placeholders.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const OUT_DIR = 'src/assets/placeholders';

const GREY = '#ECE9E6';
const BORDER = '#D8D2CC';
const LABEL = '#8A8078';

const PLACEHOLDERS = [
  { name: 'journey-hero', width: 2400, height: 1350, label: 'Journey photograph' },
  { name: 'destination-hero', width: 1600, height: 2000, label: 'Destination photograph' },
  { name: 'article-hero', width: 1600, height: 1200, label: 'Article photograph' },
  { name: 'portrait', width: 800, height: 800, label: 'Portrait' },
];

mkdirSync(OUT_DIR, { recursive: true });

for (const { name, width, height, label } of PLACEHOLDERS) {
  /* The label is sized against the shorter edge so it stays small and quiet at
     any aspect ratio, and clamped so a large canvas does not get a big sign. */
  const fontSize = Math.max(13, Math.min(22, Math.round(Math.min(width, height) * 0.022)));
  const inset = Math.round(Math.min(width, height) * 0.025);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" fill="${GREY}"/>
  <rect x="${inset}" y="${inset}" width="${width - inset * 2}" height="${height - inset * 2}"
        fill="none" stroke="${BORDER}" stroke-width="1.5"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}"
        letter-spacing="${(fontSize * 0.08).toFixed(2)}" fill="${LABEL}">${label}</text>
</svg>`;

  const buffer = await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
  writeFileSync(`${OUT_DIR}/${name}.jpg`, buffer);
  console.log(
    `  ${String(Math.round(buffer.length / 1024)).padStart(4)} KB  ` +
    `${width}x${height}  ${OUT_DIR}/${name}.jpg  "${label}"`,
  );
}

console.log('\n  Neutral warm grey, hairline border, small centred label. No brand colour.');
