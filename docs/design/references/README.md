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

## The owner's hero-video reference — human viewing only

The homepage hero now carries a background video (PRD v1.5). The owner's style
reference for it is:

**https://youtu.be/35npVaFGHMY**

**Do not fetch, download, scrape or embed this.** Three separate reasons, and all
three hold independently:

1. YouTube is not fetchable from the build environment, so any attempt is wasted
   effort that ends in a failure message.
2. A YouTube embed is **never** acceptable as a hero background — it drags in
   player chrome and third-party branding, and puts a third-party script in front
   of the page's own content, which invariant #3 forbids outright.
3. It is a *reference*, not an asset. Nothing in it is licensed to this project.

It is recorded here so a human can open it and so nobody has to ask twice what the
owner meant. The real video arrives through the CMS upload slot in `siteSettings`;
a flagged `TEMP-VIDEO` stock clip stands in until then.

## Regenerating

Drop fresh full-resolution PNGs into `docs/references/`, then re-encode them
here at roughly 6.5 megapixels, quality 70.
