/**
 * TEMPORARY hero footage + its poster.
 * ---------------------------------------------------------------------------
 * This is NOT the client's video. The homepage hero gained a background video
 * slot in design revision round 2, and a video treatment cannot be judged from
 * a still — so one stock clip stands in until the client's own footage
 * arrives. Both outputs are named `TEMP-VIDEO-*` so `grep -rn "TEMP-VIDEO"`
 * finds every reference and `npm run audit:hardcoded` counts them.
 *
 * Source: Pexels. The Pexels Licence permits commercial use with no
 * attribution required; attribution is recorded anyway in the provenance file,
 * because knowing where an asset came from is the difference between replacing
 * it confidently and guessing later.
 *
 * WHY IT IS DOWNSCALED TO 960x540, WHICH LOOKS LIKE THE WRONG CALL:
 *
 * The source is a beautifully encoded 2560x1440 at 3.4MB, and the first
 * version of this script shipped it untouched — every re-encode reachable here
 * came out LARGER (Apple's 720p preset turned 3.4MB into 9.0MB, and
 * --multiPass made it 13.4MB; the presets target a quality bar, not a size).
 * On bytes alone, leaving it alone was correct.
 *
 * Bytes were the wrong thing to measure. A 1440p60 clip costs 1,803ms of
 * main-thread work to decode where there is no hardware decoder, which took
 * the homepage's Lighthouse Performance score from 99 to **74** on a TBT of
 * 1,500ms — while LCP, the metric the whole pattern was built to protect,
 * never moved. The LCP-safe pattern kept the video out of the critical path
 * and the video went and blocked the main thread anyway.
 *
 * At 960x540 that cost is gone entirely: Performance 100, TBT 0ms. And
 * trimming to 7 seconds brings the file to 3.3MB — SMALLER than the 1440p
 * source, for a hundredth of the CPU. A background clip sitting behind a plum
 * veil has no use for 3.7 megapixels.
 *
 * If `avconvert` is unavailable this ships the source and says so. The
 * practical consequence for the client is recorded in CLIENT_REVIEW_SHEET §15:
 * we cannot re-encode an uploaded clip beyond this, so it has to arrive
 * web-ready — and 1080p is now the ceiling we ask for, not 1440p.
 *
 * The poster is frame 0, pulled with macOS QuickLook (`qlmanage`) since that
 * is the only frame extractor available. It matters that the poster is a real
 * frame of this clip and not a lookalike still: the video fades in over it, and
 * a mismatched poster turns a crossfade into a cut. If QuickLook is missing —
 * anything that is not macOS — the script falls back to the publisher's own
 * preview frame, which is also taken from the clip.
 *
 * The poster is deliberately NOT put through the photographs' warm grade. The
 * video cannot be graded without ffmpeg, and a graded poster crossfading into
 * ungraded footage would be a visible colour jump. They stay a matched pair.
 *
 * Usage: npm run temp:video
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import sharp from 'sharp';

const VIDEO_DIR = 'public/uploads';
const POSTER_DIR = 'src/assets/temp-video';
const PROVENANCE = 'docs/brand/processed/TEMP-VIDEO-PROVENANCE.md';

/** Poster master. 16:9 to match the footage exactly — a poster cropped to a
 *  different aspect than the video would jump at the crossfade.
 *
 *  Note this stays LARGE while the video shrinks, and the asymmetry is the
 *  point: the poster is the LCP element, it is a still, and `astro:assets`
 *  serves a responsive AVIF set from it. Decode cost is a video problem. */
const POSTER_WIDTH = 2400;

/**
 * Downscale target. 540p is ample behind a plum veil, and it is the difference
 * between 1,803ms of main-thread decode and none — see the header.
 */
const TARGET_PRESET = 'Preset960x540';

/** Seconds. A slow sunrise loops fine at 7s, and it is what puts the file
 *  under the 1440p source's own size. */
const TARGET_DURATION = 7;

const CLIP = {
  name: 'home-hero',
  title: 'Taj Mahal silhouette at sunrise',
  credit: 'Sahil Singh Raahee',
  pexelsId: '38264084',
  page: 'https://www.pexels.com/video/taj-mahal-silhouette-at-sunrise-38264084/',
  file: 'https://videos.pexels.com/video-files/38264084/16247023_2560_1440_60fps.mp4',
  /** Publisher's own preview frame — the non-macOS fallback for the poster. */
  previewFrame:
    'https://images.pexels.com/videos/38264084/a-mosque-agra-agra-fort-ancient-india-38264084.jpeg',
  /**
   * Why this clip and not the others auditioned (a Taj time-lapse and a Kerala
   * backwater aerial): it is warm and iconic, it moves slowly enough not to
   * fight a headline sitting on top of it, and — the deciding factor — its
   * bottom third is dark, which is exactly where the H1 and both CTAs sit. A
   * hero clip that is bright where the copy goes is a contrast problem you
   * cannot fix with a gradient without flattening the picture.
   */
  usedFor: 'homepage hero background (T1 §1)',
};

mkdirSync(VIDEO_DIR, { recursive: true });
mkdirSync(POSTER_DIR, { recursive: true });
mkdirSync('docs/brand/processed', { recursive: true });

const videoPath = join(VIDEO_DIR, `TEMP-VIDEO-${CLIP.name}.mp4`);
const posterPath = join(POSTER_DIR, `TEMP-VIDEO-${CLIP.name}-poster.jpg`);

/* ---------------------------------------------------------------- video -- */
const response = await fetch(CLIP.file, { headers: { 'User-Agent': 'Mozilla/5.0' } });
if (!response.ok) {
  console.error(`  FAILED ${CLIP.name} — HTTP ${response.status}`);
  process.exit(1);
}
const source = Buffer.from(await response.arrayBuffer());

/* ------------------------------------------------------------- downscale -- */
let transcoded = false;
const rawPath = join(tmpdir(), `iv-source-${process.pid}.mp4`);
writeFileSync(rawPath, source);

try {
  execFileSync(
    'avconvert',
    ['--source', rawPath, '--preset', TARGET_PRESET, '--duration', String(TARGET_DURATION),
     '--output', videoPath, '--replace'],
    { stdio: 'ignore' },
  );
  transcoded = true;
} catch {
  console.log('  avconvert unavailable — shipping the source encode unchanged.');
  console.log('  NOTE: a 1440p clip costs ~1.8s of main-thread decode where there is no');
  console.log('        hardware decoder. Re-run this on macOS before shipping.');
  writeFileSync(videoPath, source);
}

const video = readFileSync(videoPath);
const megabytes = video.length / 1048576;
console.log(
  `  ${megabytes.toFixed(1)} MB  ${videoPath}` +
    (transcoded ? `  (${TARGET_PRESET}, ${TARGET_DURATION}s, from ${(source.length / 1048576).toFixed(1)} MB at 2560x1440)` : ''),
);

/* The ~15MB guidance cap is the client's, and it applies to us too. */
if (megabytes > 15) {
  console.error(`  REFUSING — ${megabytes.toFixed(1)}MB exceeds the 15MB hero-video cap.`);
  rmSync(videoPath);
  process.exit(1);
}

/* --------------------------------------------------------------- poster -- */
let posterSource;
let posterOrigin;

try {
  const scratch = join(tmpdir(), `iv-poster-${process.pid}`);
  mkdirSync(scratch, { recursive: true });
  /* Frame 0 of the FULL-RESOLUTION source, not of the downscaled output. Same
     frame either way, but the poster is the LCP element and is served
     full-bleed: cutting it from a 960px file would hand a 1440px screen an
     upscale, and hand `astro:assets` nothing to build its responsive set from.
     The decode cost that forced the downscale is a video problem; a still has
     none of it. */
  execFileSync('qlmanage', ['-t', '-s', '2560', '-o', scratch, rawPath], { stdio: 'ignore' });
  const generated = join(scratch, `${basename(rawPath)}.png`);
  if (!existsSync(generated)) throw new Error('qlmanage produced no thumbnail');
  posterSource = readFileSync(generated);
  posterOrigin = 'frame 0 of the clip, extracted with macOS QuickLook';
  rmSync(scratch, { recursive: true, force: true });
} catch {
  console.log('  qlmanage unavailable — falling back to the publisher preview frame');
  const preview = await fetch(CLIP.previewFrame, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!preview.ok) {
    console.error(`  FAILED poster — HTTP ${preview.status}`);
    process.exit(1);
  }
  posterSource = Buffer.from(await preview.arrayBuffer());
  posterOrigin = "the publisher's own preview frame (not necessarily frame 0)";
}

const poster = await sharp(posterSource)
  .resize({ width: POSTER_WIDTH, withoutEnlargement: true })
  .jpeg({ quality: 82, mozjpeg: true })
  .toBuffer();

writeFileSync(posterPath, poster);
const meta = await sharp(poster).metadata();
console.log(
  `  ${String(Math.round(poster.length / 1024)).padStart(4)} KB  ` +
    `${meta.width}x${meta.height}  ${posterPath}`,
);

/* ----------------------------------------------------------- provenance -- */
writeFileSync(
  PROVENANCE,
  `# TEMP-VIDEO provenance

**This is not the client's footage.** It is a temporary clip sourced so the
homepage's video hero could be designed and reviewed, and it is **replaced by
the client's own video through the CMS — a content change with zero code
edits**. The shoot brief is in \`docs/CLIENT_REVIEW_SHEET.md\` §15.

Regenerate with \`npm run temp:video\`. Find every reference with
\`grep -rn "TEMP-VIDEO" src/ public/\`.

## Licence

From [Pexels](https://www.pexels.com/license/), whose licence permits
commercial use and does not require attribution. Attribution is recorded here
regardless. The clip may not be redistributed as stock footage; using it as a
background on a website is exactly what the licence is for.

## The clip

| | |
|---|---|
| File | \`${videoPath}\` |
| Poster | \`${posterPath}\` |
| Title | ${CLIP.title} |
| Videographer | ${CLIP.credit} |
| Source page | ${CLIP.page} |
| Downloaded from | ${CLIP.file} |
| Size | ${megabytes.toFixed(1)} MB${transcoded ? `, 960×540, ${TARGET_DURATION}s (downscaled from 3.4 MB at 2560×1440, 10s)` : ', 2560×1440, ~10s — NOT downscaled'} |
| Used for | ${CLIP.usedFor} |
| Poster origin | ${posterOrigin} |
| Poster master | ${meta.width}×${meta.height}, mozjpeg q82 |

## Why it is downscaled to 960×540

The first version of this script shipped the source untouched, because every
re-encode available here came out **larger**: Apple's 720p preset turned 3.4MB
into 9.0MB, and \`--multiPass\` made it 13.4MB. On bytes alone that was the
right call.

Bytes were the wrong thing to measure. Decoding 2560×1440 at 60fps where there
is no hardware decoder costs **1,803ms of main-thread work**, which took the
homepage's Lighthouse Performance score from 99 to **74** on a TBT of 1,500ms —
while LCP, the metric the entire LCP-safe pattern exists to protect, never
moved. The video stayed out of the critical path and blocked the main thread
anyway.

At 960×540 that cost disappears: **Performance 100, TBT 0ms.** Trimming to
${TARGET_DURATION} seconds brings the file to ${megabytes.toFixed(1)}MB — smaller than the 1440p source, for a
hundredth of the CPU. A clip sitting behind a plum veil has no use for 3.7
megapixels.

**What this means for the client's own video:** we can downscale and trim on
macOS, and nothing more — no bitrate control, no format conversion, no WebM.
\`CLIENT_REVIEW_SHEET\` §15 therefore asks for a web-ready file, and asks for
**1080p as the ceiling rather than 1440p**.

## Why the poster is not graded

Every photograph on this site goes through one shared warm curve so the set
reads as a collection. The poster does **not**, and must not: the video cannot
be graded without ffmpeg, and a graded poster crossfading into ungraded footage
would be a visible colour jump at the exact moment the visitor is looking at
it. Poster and clip stay a matched pair.
`,
);

rmSync(rawPath, { force: true });

console.log(`\n  provenance -> ${PROVENANCE}`);
