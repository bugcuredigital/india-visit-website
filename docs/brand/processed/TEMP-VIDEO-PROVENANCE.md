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
| Size | 3.4 MB, 2560×1440, ~10s |
| Used for | homepage hero background (T1 §1) |
| Poster origin | frame 0 of the clip, extracted with macOS QuickLook |
| Poster master | 2400×1350, mozjpeg q82 |

## Why it ships exactly as downloaded

There is no ffmpeg on the build machine. macOS `avconvert` can transcode, but
re-encoding this clip to 720p through Apple's preset produced **9.0MB from a
3.4MB source** — the preset targets a quality bar, not a size. Pexels' own
encode is better than anything reachable here and is well inside the ~15MB cap,
so it ships untouched.

The consequence is worth stating plainly, because it applies to the client's
real video too: **we cannot trim, re-encode or resize an uploaded clip.**
Whatever is uploaded is what visitors download. That is why
`CLIENT_REVIEW_SHEET` §15 asks for a web-ready file rather than a master.

## Why the poster is not graded

Every photograph on this site goes through one shared warm curve so the set
reads as a collection. The poster does **not**, and must not: the video cannot
be graded without ffmpeg, and a graded poster crossfading into ungraded footage
would be a visible colour jump at the exact moment the visitor is looking at
it. Poster and clip stay a matched pair.
