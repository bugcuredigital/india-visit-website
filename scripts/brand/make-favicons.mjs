/**
 * Favicon set from the lotus glyph.
 * The badge is 1.7:1, so a square icon had to letterbox it and the wordmark
 * was illegible below 32px. The lotus is the brand's actual mark and reads at
 * 16px, so it is the favicon source. Yellow on plum — legal per invariant #5
 * (yellow only ever on plum/burgundy) and high-contrast at small sizes.
 *
 * Usage: node scripts/brand/make-favicons.mjs
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PLUM = '#452B5E';
const YELLOW = '#E5C745';

const lotus = readFileSync(join(ROOT, 'src/assets/brand/lotus.svg'), 'utf8');
const viewBox = lotus.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 376 270';
const path = lotus.match(/<path[^>]*d="([^"]+)"/)?.[1];
if (!path) throw new Error('could not read the lotus path');

/** Square icon: plum ground, lotus centred at 66% width. */
const icon = (size) => {
  const [, , vw, vh] = viewBox.split(/\s+/).map(Number);
  const w = size * 0.66;
  const h = (w * vh) / vw;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.1875}" fill="${PLUM}"/>
  <g transform="translate(${(size - w) / 2} ${(size - h) / 2}) scale(${w / vw})">
    <path fill-rule="evenodd" fill="${YELLOW}" d="${path}"/>
  </g>
</svg>`;
};

// Scalable favicon — no rasterisation, so it stays crisp at any size.
writeFileSync(join(ROOT, 'public/favicon.svg'), icon(64) + '\n');

for (const size of [16, 32, 180]) {
  const out = size === 180 ? 'apple-touch-icon.png' : `favicon-${size}.png`;
  await sharp(Buffer.from(icon(size))).png({ compressionLevel: 9 }).toFile(join(ROOT, 'public', out));
  console.log(`public/${out}`);
}
console.log('public/favicon.svg');
