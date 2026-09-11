/**
 * 1:1 crops of a tall capture, for review.
 * ---------------------------------------------------------------------------
 * Full-page captures of this site run to 13,000px on a phone. Viewed
 * fit-to-screen that is roughly 10% zoom, at which 15px body copy is
 * sub-pixel — which is exactly how a previous review round produced a "these
 * sections render blank" bug report against sections that rendered perfectly.
 * The fix is to send crops at true scale rather than one squashed image.
 *
 * It also keeps captures under the ~8000px limit that file transport imposes.
 *
 * Usage:
 *   node scripts/crop.mjs <in.png> <out.jpg> <top> <height>   # one slice
 *   node scripts/crop.mjs <in.png> <out-prefix> --parts <n>   # n equal slices
 */
import sharp from 'sharp';

const [input, output, ...rest] = process.argv.slice(2);
if (!input || !output) {
  console.error('usage: node scripts/crop.mjs <in.png> <out> <top> <height> | <in.png> <prefix> --parts <n>');
  process.exit(1);
}

const { width, height } = await sharp(input).metadata();

const write = async (out, top, sliceHeight) => {
  await sharp(input)
    .extract({ left: 0, top, width, height: Math.min(sliceHeight, height - top) })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(out);
  console.log(`  ${out}  ${width}x${Math.min(sliceHeight, height - top)}  (from y=${top})`);
};

if (rest[0] === '--parts') {
  const parts = Number(rest[1]);
  const slice = Math.ceil(height / parts);
  for (let i = 0; i < parts; i++) {
    await write(`${output}-${i + 1}.jpg`, i * slice, slice);
  }
} else {
  await write(output, Number(rest[0] ?? 0), Number(rest[1] ?? height));
}
