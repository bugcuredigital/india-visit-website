# TEMP-VIDEO provenance

**This is not the client's footage.** It is a temporary clip sourced so the
homepage's video hero could be designed and reviewed, and it is **replaced by
the client's own video through the CMS — a content change with zero code
edits**. The shoot brief is in `docs/CLIENT_REVIEW_SHEET.md` §15.

Regenerate with `npm run temp:video`. Find every reference with
`grep -rn "TEMP-VIDEO" src/ public/`.

## Licence

From [Pexels](https://www.pexels.com/license/), whose licence permits
commercial use and does not require attribution. Attribution is recorded here
regardless. The clip may not be redistributed as stock footage; using it as a
background on a website is exactly what the licence is for.

## The clip

| | |
|---|---|
| File | `public/uploads/TEMP-VIDEO-home-hero.mp4` |
| Poster | `src/assets/temp-video/TEMP-VIDEO-home-hero-poster.jpg` |
| Title | Taj Mahal silhouette at sunrise |
| Videographer | Sahil Singh Raahee |
| Source page | https://www.pexels.com/video/taj-mahal-silhouette-at-sunrise-38264084/ |
| Downloaded from | https://videos.pexels.com/video-files/38264084/16247023_2560_1440_60fps.mp4 |
| Size | 3.3 MB, 960×540, 7s (downscaled from 3.4 MB at 2560×1440, 10s) |
| Used for | homepage hero background (T1 §1) |
| Poster origin | frame 0 of the clip, extracted with macOS QuickLook |
| Poster master | 2400×1350, mozjpeg q82 |

## Why it is downscaled to 960×540

The first version of this script shipped the source untouched, because every
re-encode available here came out **larger**: Apple's 720p preset turned 3.4MB
into 9.0MB, and `--multiPass` made it 13.4MB. On bytes alone that was the
right call.

Bytes were the wrong thing to measure. Decoding 2560×1440 at 60fps where there
is no hardware decoder costs **1,803ms of main-thread work**, which took the
homepage's Lighthouse Performance score from 99 to **74** on a TBT of 1,500ms —
while LCP, the metric the entire LCP-safe pattern exists to protect, never
moved. The video stayed out of the critical path and blocked the main thread
anyway.

At 960×540 that cost disappears: **Performance 100, TBT 0ms.** Trimming to
7 seconds brings the file to 3.3MB — smaller than the 1440p source, for a
hundredth of the CPU. A clip sitting behind a plum veil has no use for 3.7
megapixels.

**What this means for the client's own video:** we can downscale and trim on
macOS, and nothing more — no bitrate control, no format conversion, no WebM.
`CLIENT_REVIEW_SHEET` §15 therefore asks for a web-ready file, and asks for
**1080p as the ceiling rather than 1440p**.

## Why the poster is not graded

Every photograph on this site goes through one shared warm curve so the set
reads as a collection. The poster does **not**, and must not: the video cannot
be graded without ffmpeg, and a graded poster crossfading into ungraded footage
would be a visible colour jump at the exact moment the visitor is looking at
it. Poster and clip stay a matched pair.
