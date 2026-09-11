# Design references (committed, optimised)

Full-page captures of the two reference sites named in the locked design
direction (CLAUDE.md invariant #5): **staralliance.com** and **airindia.com**,
desktop and mobile.

These are **web-optimised JPEG derivatives**, ~400KB each, downscaled to about
6.5 megapixels. That is ample for what they are actually read for — type scale,
density, colour proportion, photography treatment — and it keeps the repository
history sane. The **full-resolution PNG originals (~90MB total) live in
`docs/references/` and are gitignored**; regenerate these derivatives from them
if they are ever re-captured.

## What they are for

Read them for **properties, not pixels**:

- the type scale and its confidence — large display headlines, tight leading
- one-idea-per-viewport density, and how much air sits between sections
- colour as punctuation — their red/gold does the job our crimson does
- photography treatment — full-bleed heroes, large calm image blocks on white
- thin, quiet navigation

Their **layouts, nav structures, booking widgets and content patterns are not to
be copied**. Page structure always comes from `PAGE_TEMPLATES.md`; only the
visual register comes from here.

## Regenerating

Drop fresh full-resolution PNGs into `docs/references/`, then re-encode them
here at roughly 6.5 megapixels, quality 70.
