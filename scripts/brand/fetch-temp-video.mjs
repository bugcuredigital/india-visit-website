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
 * WHY THE FILE IS SHIPPED EXACTLY AS DOWNLOADED, unlike the photographs:
 *
 * There is no ffmpeg on the build machine. macOS ships `avconvert`, which can
 * transcode — but re-encoding this clip to 720p through Apple's preset
 * produced a 9.0MB file from a 3.4MB source, because the preset targets a
 * quality bar rather than a size. Pexels' own encode is simply better than
 * anything reachable here, and it is comfortably inside the ~15MB guidance
 * cap, so it ships untouched. The practical consequence is recorded in
 * CLIENT_REVIEW_SHEET §15: whatever the client uploads is what ships, so it
 * has to arrive web-ready.
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
import { join } from 'node:path';
import sharp from 'sharp';

const VIDEO_DIR = 'public/uploads';
const POSTER_DIR = 'src/assets/temp-video';
const PROVENANCE = 'docs/brand/processed/TEMP-VIDEO-PROVENANCE.md';

/** Poster master. 16:9 to match the footage exactly — a poster cropped to a
 *  different aspect than the video would jump at the crossfade. */
const POSTER_WIDTH = 2400;

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
const video = Buffer.from(await response.arrayBuffer());
writeFileSync(videoPath, video);

const megabytes = video.length / 1048576;
console.log(`  ${megabytes.toFixed(1)} MB  ${videoPath}`);

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
  execFileSync('qlmanage', ['-t', '-s', '2560', '-o', scratch, videoPath], { stdio: 'ignore' });
  const generated = join(scratch, `TEMP-VIDEO-${CLIP.name}.mp4.png`);
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
| Size | ${megabytes.toFixed(1)} MB, 2560×1440, ~10s |
| Used for | ${CLIP.usedFor} |
| Poster origin | ${posterOrigin} |
| Poster master | ${meta.width}×${meta.height}, mozjpeg q82 |

## Why it ships exactly as downloaded

There is no ffmpeg on the build machine. macOS \`avconvert\` can transcode, but
re-encoding this clip to 720p through Apple's preset produced **9.0MB from a
3.4MB source** — the preset targets a quality bar, not a size. Pexels' own
encode is better than anything reachable here and is well inside the ~15MB cap,
so it ships untouched.

The consequence is worth stating plainly, because it applies to the client's
real video too: **we cannot trim, re-encode or resize an uploaded clip.**
Whatever is uploaded is what visitors download. That is why
\`CLIENT_REVIEW_SHEET\` §15 asks for a web-ready file rather than a master.

## Why the poster is not graded

Every photograph on this site goes through one shared warm curve so the set
reads as a collection. The poster does **not**, and must not: the video cannot
be graded without ffmpeg, and a graded poster crossfading into ungraded footage
would be a visible colour jump at the exact moment the visitor is looking at
it. Poster and clip stay a matched pair.
`,
);

console.log(`\n  provenance -> ${PROVENANCE}`);
