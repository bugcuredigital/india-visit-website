# Design references

Full-page captures of the two reference sites named in the locked design
direction (CLAUDE.md invariant #5): **staralliance.com** and **airindia.com**,
desktop and mobile.

## What they are for

They are read for **properties, not pixels**:

- the type scale and its confidence — huge display headlines, tight leading
- one-idea-per-viewport density, and how much air sits between sections
- colour as punctuation — their red/gold does the job our crimson does
- photography treatment — full-bleed heroes, large calm image blocks on white
- thin, quiet navigation

Their **layouts, nav structures, booking widgets and content patterns are not
to be copied**. Page structure always comes from `PAGE_TEMPLATES.md`; only the
visual register comes from here.

## Why the images are not committed

The seven captures total roughly **90 MB** of PNG. Committing them would put
that in the repository's history permanently, on every clone, for files that
are reference material rather than a build input — so `.gitignore` excludes
`docs/references/*.png` and they live in the working copy only.

**Open question for the client:** if these should be versioned, the sensible
form is web-optimised JPEG derivatives (roughly 300 KB each, still perfectly
adequate for reading register and proportion) committed alongside this README.
Say the word and that is a five-minute change.

## Refreshing them

Re-capture at 2800px wide (desktop) and a phone width, full page, and drop the
PNGs in this directory using any filename — nothing reads them by name.
