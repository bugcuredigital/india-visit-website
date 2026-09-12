# SESSION_LOG.md — India Visit Website

Append-only. One entry per session: date, what was completed, current milestone
and gate status, and the exact next action.

---

## 2026-09-08 — M1 scaffold

**Branch:** `m1-scaffold` · **Remote:** `origin` → github.com/bugcuredigital/india-visit-website

### Completed

**Pre-flight — doc reconciliation (commit 1)**
Applied rulings b1–b18 plus the b4 amendment to the six canonical root docs
(69 assertion-checked edits, no prose rewrites). Headline changes: itinerary
count is **20 pages = 17 Variant A + 3 Variant B**; Golden Chariot and Deccan
Odyssey build as full Variant B pages; operator tariffs permanently suppressed;
Tailwind 4 CSS-first; camelCase field naming authoritative; 9 destination slugs
and header nav locked; no `/contact/` route; trust numbers and `priceFrom` made
reversible so PRD Open Questions #1 and #2 no longer block the build.

**M1 scaffold (commit 2)**
- Astro 5 static output, `trailingSlash: 'always'`, `build.inlineStylesheets: 'always'`,
  strict TS. Tailwind 4 via the Vite plugin — no `tailwind.config.mjs`.
- `src/styles/tokens.css` — closed brand palette, plum-derived neutrals, fluid
  type scale (16px floor), one easing family, duration scale, layout widths.
  Every token exposed through Tailwind 4 `@theme`.
- Fonts self-hosted, latin subset, `font-display: swap`, content-hashed by Vite:
  Archivo Expanded 400/700 (display, behind `--font-display`) + Inter 400/600
  (body). 80KB total for four faces; the two above-the-fold faces are preloaded.
  Agrandir swap path documented in `fonts.css` — two lines plus the font files.
- `Base.astro` (meta/SEO, canonical, OG/Twitter, favicons, font preloads,
  `TravelAgency` JSON-LD, GTM-via-Partytown stub that emits nothing while the
  container ID is null) and `Page.astro`.
- `src/lib/site-settings.ts` — typed stub carrying the full invariant-#1 field
  list, promoted to a Zod-validated singleton in M2. 17 `DUMMY DATA` flags.
  Trust fields nullable; `showPrices` false.
- `src/pages/index.astro` — M1 verification page (noindex). Zero page JS.
  M4 replaces it with the real homepage.
- Tooling: `scripts/audit-hardcoded.sh` (invariant #1 + the permanent tariff
  regression check + placeholder-debt report) and `scripts/check-responsive.mjs`
  (CDP overflow measurement, 360–1440px). Housekeeping: `.gitignore`, `.nvmrc`
  (Node 22), branded OG fallback (1200×630) and 404 graphic from the palette.

### Gate status — M1 gate: PARTIALLY MET, awaiting client action

| Gate criterion | Status |
|---|---|
| `astro build` passes | PASS — 1 page, 363ms, no errors |
| `astro check` (TS) | PASS — 0 errors, 0 warnings, 0 hints |
| Lighthouse mobile Performance ≥ 95 | **PASS — 100** (A11y 100, Best Practices 100) |
| Fonts render | PASS — both self-hosted faces verified in rendered output |
| Logo visible on off-white | PASS via TEMP-ASSET fallback (see blocker below) |
| No horizontal overflow 360–1440px | PASS — measured, not eyeballed |
| Invariant audits | PASS — no hardcoded contact details, no tariff figures |
| Deploys to `*.pages.dev` | **BLOCKED — needs the client to connect Cloudflare Pages** |

Evidence: `reports/m1-gate-summary.json` (raw Lighthouse report is gitignored;
regenerate with `npm run gate:lighthouse` against `npm run preview`).
SEO scored 63 solely because the scaffold page sets `noindex` deliberately; a
control run with `noindex` removed scored SEO 100 with every other category
still at 100.

### Blockers raised this session

1. **The supplied logo is not usable artwork.** `docs/brand/india_visit_logo.svg`
   contains no vector paths — it is a single 5910×4128 PNG embedded twice (image
   + luminance mask) inside an SVG wrapper, 2.4MB, whose only `<path>` is a
   full-canvas clip rectangle. There is therefore no background *node* to remove
   structurally, and colour-keying the raster is forbidden because it would
   delete the white wordmark. As delivered the file also renders with the lotus
   clipped out of frame entirely, and a large stray white shape is baked into
   the raster. Shipped the pre-authorised `TEMP-ASSET` fallback (typographic
   wordmark in its brand badge, plum "IV" favicon) so M1 was not blocked.
   **Needs:** real vector artwork — `logo-full.svg` and `logo-white.svg`.
2. **The lotus glyph has no vector source either.** It is required sitewide as
   the highlight-bullet mark (CLAUDE.md invariant #5) and cannot be redrawn.
   **This becomes an M3 blocker** for HighlightsGrid and every highlight list.
3. Still outstanding from M0, client-side: approved Claude Design mockups and
   the photo archive.

### Exact next action

1. **Client:** connect Cloudflare Pages to the pushed branch using the build
   settings listed in the handover message, then send back the `*.pages.dev`
   preview URL so the last M1 gate row can close.
2. **Client:** supply real logo vector artwork (and the lotus glyph) — or
   confirm M2/M3 should proceed on the TEMP-ASSET fallback.
3. **Then, on approval:** open the PR for `m1-scaffold` → `main` and begin
   **M2 — content schema**: Zod schemas for all five collections in camelCase,
   `siteSettings` promoted from the typed stub to a validated singleton, and the
   two reference journeys seeded (Kerala with Houseboat as Variant A, Palace on
   Wheels as Variant B). M2's gate is proving the build fails loudly when a
   required field is removed and passes when restored.

---

## 2026-09-09 — main published, brand assets, M2 schema

**Branch:** `m2-schema` → PR into `main` · Cloudflare Pages live at
https://india-visit-website.pages.dev (M1 gate closed on both halves)

### Completed

**`main` published.** Pushed at the M1 commit (`3a1a353`) so the client can
flip the Cloudflare production branch and so `m2-schema` has a PR base.

**Brand assets — TEMP-ASSET placeholders removed.**
- Badge extracted from the delivered raster by **silhouette mask** per the
  client's ruling: chroma locates the badge boundary, interior holes are filled
  (which is what preserves the white wordmark), and the filled silhouette
  becomes the alpha. No colour-keying anywhere.
- The stray white shape in the source raster proved to sit entirely *outside*
  the badge silhouette, so the mask drops it and no trimming was needed —
  measured at 0% near-white among opaque pixels on all four edges.
- Outputs: 1x/2x/3x png+webp (served 48px webp is 1.6KB), favicon set, and one
  288px source for `astro:assets`. Regenerate with `npm run brand:logo`.
- **Lotus needed no tracing.** Page 7 of the brand kit PDF draws it as Bézier
  paths filled `.4549 .0706 .2196` = brand burgundy `#741238`, so
  `npm run brand:lotus` interprets that content stream and copies the control
  points verbatim — geometrically identical to the original rather than an
  approximation. Single path, `fill="currentColor"`, legible from 14px.
  **Not yet wired into any component** — awaiting client approval of the
  side-by-side, and its consumer (HighlightsGrid) is M3 anyway.

**M2 — content schema.** `src/content.config.ts` defines all five collections,
camelCase throughout, using the Astro 5 content-layer loaders.
- `journeys` is a **discriminated union on `variant`**, so Variant B's five
  extra modules (cabins, departures, bookingSteps, policies, operatorDisclosure
  + verbatim inclusions/exclusions) are structurally required. A train page
  physically cannot ship without its disclosure or its cancellation policy.
- There is deliberately **nowhere to put a tariff on a Variant B page**, and a
  union-level refinement rejects `priceFrom` there outright.
- `priceFrom` (optional, INR) + `siteSettings.showPrices` (default false) keep
  the pricing decision reversible; `pace` and `idealFor` are required.
- Trust figures are nullable in `siteSettings`; null means the stat is not
  rendered, so an unverified number cannot be published.
- Seeds: Kerala with Houseboat (Variant A, direct port of the canonical doc),
  Palace on Wheels (Variant B), Kerala destination, one article with a required
  embedded journey, two testimonials.
- `siteSettings` promoted from the M1 typed stub to the validated singleton;
  field names unchanged, so consumers needed only the async accessor.

### Gate status — M2 gate: PASSED

`npm run gate:m2` breaks the seeds four ways and shows the build refusing each,
then restores and shows it passing. 5/5 cases:

| Case | Result |
|---|---|
| Variant B with `operatorDisclosure` removed | build fails |
| Testimonial with `consentConfirmed: false` | build fails |
| Variant B carrying `priceFrom` | build fails |
| Variant A with `pace` removed | build fails |
| All seeds restored | build passes |

Worth noting: the guards were rewritten as Zod *refinements* mid-milestone.
Astro's error formatter overrides messages attached to type-level checks — a
rejected tariff printed "Expected type undefined, received number", which is
not a loud failure for whoever is editing content. Refinement messages print
verbatim, so the tariff rule now explains itself and cites invariant #6.

`npm run audit:hardcoded` passes all three enforced checks, and now also
guards against third-party agency branding (see below).

### Findings raised this session

1. **The Palace on Wheels source doc is another agency's material.** It carries
   "Luxury India" as the booking agent, their domain, and their own service
   charges (USD 235 / 200 / 100 for bank, postponement and refund handling).
   None of that is India Visit's to publish, so the seed keeps the **RTDC
   cancellation percentages** (15/30/55/100%) and drops every third-party
   figure and mention. A grep for third-party branding is now a permanent audit
   check. The GSA disclosure wording in the seed is flagged provisional pending
   Open Question #15.
2. **The Palace on Wheels doc has no day-by-day section.** It supplies route,
   cabins, inclusions, booking process and cancellation rules only. The eight
   day entries in the seed are drafted from the published route, each flagged
   `provisional: true` in the schema, and all need client copy in M5.
3. Placeholder imagery and testimonials are in place and flagged
   (`PLACEHOLDER-IMAGE`, `PLACEHOLDER TESTIMONIAL`) because the photo archive
   and real reviews have not arrived.

### Exact next action

1. **Client:** review and merge the `m2-schema` PR (preview URL in the PR), and
   approve or amend the lotus glyph from the side-by-side already sent.
2. **Then, on approval:** begin **M3 — component library** in the runbook's
   stated order, starting with the Button/CTA set and Header. The lotus is
   needed for HighlightsGrid, so lotus approval gates that component
   specifically, not the whole milestone.
3. Still outstanding from the client: real logo vector (optional now — the
   raster is wired and approved), the photo archive, verified trust numbers
   (#2), testimonials with consent (#3), pricing decision (#1), and the GSA
   disclosure wording plus schedule-publishing answer (#15).

---

## 2026-09-09 (later) — design direction locked, M3 component library

**Branch:** `m3-components` → PR into `main` · PR #1 merged, production branch
flipped to `main`, auto-deploys on.

### Completed

**Design direction patched into the docs first**, so the spec cannot drift from
the ruling: surfaces (white is the page; off-white demoted to card fills, alt
sections and form fields; plum bands rare and intentional — footer,
How-It-Works, one homepage moment, ConvertBand), the typography scale, colour
as punctuation, component conventions, the reference school
(staralliance.com + airindia.com, translated not cloned) and the
do-not-import list. CLAUDE.md brand section, PAGE_TEMPLATES global rules and
PRD §9.2 all updated. The `_dummyDataFlags` JSON convention is documented.

**`docs/CLIENT_REVIEW_SHEET.md` created early** (was scheduled for M5) because
the Palace on Wheels port produced provisional content that needed recording
immediately. 13 sections covering the GSA wording, the eight provisional day
narratives, cabin descriptions, pace/idealFor/bestSeason, trust numbers,
pricing, placeholder contact details, testimonials and photography.

**Tokens rebuilt** on the ruling: white base, ink `#1A1523` rather than black,
display sizes that go big with tight leading, 96–128px desktop section rhythm,
hover-only shadows, card borders at plum 8%.

**27 components** in the runbook's order, leaning on native semantics wherever
that buys accessibility for free — `details`/`summary` for the day accordion,
policies accordion and both nav menus, so keyboard operation and find-in-page
work with no script at all.

Notable decisions: the day accordion deliberately does **not** animate open,
because that means animating height, which the motion spec forbids outright;
the lotus is a single `currentColor` path serving crimson bullets, yellow
footer marks and the favicon; cabin cards have **no price prop at all** and
always render "Enquire for pricing"; the operator disclosure renders in the
section header, never inside a collapsed panel.

**Favicon swapped to the lotus** — the badge is 1.7:1, so a square icon had to
letterbox it and the wordmark was illegible below 32px. The lotus reads at
16px. Yellow on plum, which is legal per invariant #5.

### Two real bugs the gate caught

1. **Entrance animations hid content when JavaScript did not run.** The CSS
   started `.fade-up` elements at opacity 0 and relied on the observer to
   reveal them, so any scripting failure left whole sections permanently
   invisible — silent content loss on a static-first, SEO-driven site. Rules
   are now scoped to `html.js`, set in `<head>` before first paint. No JS means
   no animation, never no content. `npm run check:nojs` asserts it (0/24
   hidden with scripting disabled).
2. **TestimonialCarousel orphaned its list items.** `role="group"` on the
   `<ul>` overrides the implicit list role, so every `<li>` lost its list
   parent in the accessibility tree. The scroll region and the list are now
   separate elements; accessibility went 97 → 100.

### Gate status — M3 gate: PASSED

| Check | Result |
|---|---|
| Demo page renders all components | PASS — `/dev/components/`, real seed content, both variants |
| Lighthouse mobile Performance | **100** |
| Lighthouse Accessibility | **100** (after the carousel fix) |
| Lighthouse Best Practices | **100** |
| Keyboard pass | PASS — 80 tab stops, skip link first, focus ring on every stop, no trap |
| Content visible without JS | PASS — 0/24 animated elements hidden |
| No horizontal overflow 360–1440px | PASS |
| Invariant audits | PASS — contact details, tariffs, third-party branding |

Evidence in `reports/m3-gate-summary.json`. SEO 66 is the demo page's
deliberate `noindex`; DOM size 50 is one page rendering all 27 components.

Four checks are now scripted and re-runnable: `check:nojs`, `check:keyboard`,
`check:responsive`, and `shot` (full-page screenshots at a realistic viewport
— naive headless captures get this wrong because `svh` heroes size themselves
against the window).

### Exact next action

1. **Client:** review the `m3-components` PR against the preview URL — this is
   the first look at the design language in real components, ahead of M4's
   formal design review.
2. **Then, on approval:** begin **M4 — page templates**, starting with
   `journeys/[slug].astro` rendering both variants from one template and
   verified against the two seed journeys, then the homepage per T1.
3. Still outstanding from the client: photo archive (every hero is a flagged
   placeholder), verified trust numbers (#2), consented testimonials (#3),
   pricing decision (#1), GSA disclosure wording and schedule-publishing
   answer (#15), and the items in `docs/CLIENT_REVIEW_SHEET.md`.

---

## 2026-09-09 — M4 (part 1 of 2): itinerary template + homepage

**Branch:** `m4-templates` → PR into `main`. M3 gate approved and PR #2 merged.

### Completed

**Doc patches first, per the client's design-process decision.** The separate
mockup track is cancelled: removed as an M0 checklist item and gate condition
in `EXECUTION_RUNBOOK.md`, removed from `PAGE_TEMPLATES.md`'s preamble, and
replaced in `CLAUDE.md` invariant #5 with a note that the M4 preview URL *is*
the design review and that any "approved mockups" language is stale. The M4
gate now records the client's review loop — desktop + mobile captures in the PR
alongside the preview URL, styling feedback applied as token/CSS edits rather
than rebuilds, homepage sign-off before the register rolls onward. Also patched
Template Spec §6, whose checklist still said "body always Inter on off-white",
to match the white-primary ruling.

**Design references studied** (`docs/references/`, seven full-page captures).
Properties taken, not pixels: display type stays huge even at 390px — Star
Alliance's mobile H1 is around 44px and our `clamp(2.5rem, 6vw, 4.5rem)`
already lands in that register, so no token changed; crimson all-caps section
labels over one calm sub-line; a quiet outline "view all" pill on the heading's
baseline; image cards as rounded frames with the label inside a bottom-up
gradient; and a dotted rail with circular nodes for process steps, which is
what How It Works uses. Their layouts, nav structures and booking widgets were
not imported. The 90MB of PNGs are documented in `docs/references/README.md`
and deliberately left untracked — **a ruling is wanted** on whether to commit
web-optimised JPEG derivatives instead.

**`src/pages/journeys/[slug].astro`** — one template, both variants, in
Template Spec §3's order, with Variant B's five extra modules gated on the
discriminated union. Two spec tensions were resolved in comments rather than
silently: §3's Variant B chain omits the ●-required S13 Practical Notes (it
renders on B too, after the booking process), and §6's "ends at the convert
band before Related" reads against §3 putting B's policies after that band —
§3 wins, and §6's actual failure condition, a page *ending* on policy text,
still cannot happen. The S3 intro expander is CSS-only via `:has()`, gated
behind `@supports selector(:has(*))` so a browser without `:has()` shows the
whole intro rather than a clipped one with a dead control, and the clamp
applies below 64rem only.

**`src/pages/index.astro`** — all eleven T1 sections, replacing the M1 scaffold
page. Exactly two plum bands besides the footer (How It Works, lead capture),
which is the whole allowance the design direction gives. The founding-year line
is absent because `foundingYear` is null and the year is never guessed; the
supporting line uses `yearsExperience`, which is verified. The association logo
row is omitted entirely, as T1 instructs when none are supplied.

New: `ArticleCard.astro`, `lib/hero-image.ts`, `lib/destinations-strip.ts`.
View Transitions are global from `Base.astro`, and `RevealScript` now re-arms
on `astro:page-load` with each element stamped once.

### Three real defects, found by gating rather than by reading

1. **Hero grid blowout, hidden by `overflow: clip`.** `.hero` used the implicit
   `auto` grid track, whose automatic minimum is the item's min-content — the
   `white-space: nowrap` route strip grew the content box to 775px inside a
   390px hero, and the clip silently swallowed it. The H1, the badges and both
   CTAs were cut off on every phone, while `check:responsive` reported a clean
   pass because the *document* never scrolled sideways. Fixed with
   `grid-template-columns: minmax(0, 1fr)`.
2. **Yellow on a light surface** — DayAccordion's provisional notice carried a
   yellow left rule on off-white, which invariant #5 forbids outright. Now
   burgundy, the documented role for a fine rule on a light surface. This one
   shipped through the M3 gate.
3. **Contrast failure, 1.08:1, on the hero route strip.** Because the strip is
   its own scroll region, a checker resolves its background to the page white
   behind the hero rather than to the scrim — and it was right in substance:
   legibility of 12px uppercase text would otherwise depend on whichever
   photograph an editor uploads. The strip now carries its own plum ground,
   which also puts its yellow separators on plum, where yellow is legal.

**Invariant #3's hero preload existed only on paper.** There is now a head
preload whose candidate set matches the `<picture>` AVIF source byte-for-byte
(verified against the built HTML on all three pages), and heroes emit
AVIF + WebP — 15KB against 29KB at 960w.

### Two checks were reporting green over real bugs

- **`check-responsive.mjs`** now also detects content *clipped* inside an
  overflow box. Document `scrollWidth` cannot see that class of bug: there is
  no scrollbar, the content is simply gone. This is what caught the hero
  blowout. Deliberate scrollers opt out with `data-allow-clip`, and SVG
  internals are excluded because a `<path>` extending past its viewBox is
  intrinsic to SVG.
- **`screenshot.mjs`** was producing convincing but wrong images, twice over.
  `captureBeyondViewport` rasterised the hero content box at its pre-layout
  width, giving captures indistinguishable from a genuine responsive bug — a
  DOM probe at the same instant reported the correct 390px widths. It now
  stitches viewport-only captures, each cropped to the exact gap between
  *settled* scroll offsets, with smooth scrolling disabled for the capture:
  `global.css` sets `scroll-behavior: smooth`, so `scrollTo` animates and
  earlier attempts read the offset at one moment and captured pixels at
  another, duplicating a strip of the page — it made a trust stat and a form
  label appear twice, which reads as a component bug.
- **`check-template-spec.mjs`** is new and automates the structural half of
  Template Spec §6, which the M5 gate needs across all 20 journey pages. Its
  first two runs failed on correct pages — it was matching class names inside
  the inlined `<style>` block ahead of the markup — so it now reads the body
  with styles stripped.

### Gate status — M4 part 1: evidence delivered, awaiting review

| Check | / | Variant A | Variant B |
|---|---|---|---|
| Lighthouse performance | 100 | 100 | 100 |
| Accessibility | 100 | 100 | 100 |
| Best practices | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 |
| FCP / LCP | 1.1s / 1.7s | 1.1s / 1.7s | 1.1s / 1.7s |
| TBT / CLS | 0ms / 0 | 0ms / 0 | 0ms / 0 |
| Keyboard pass | 57 stops | 67 stops | 67 stops |
| Content visible without JS | 0/18 hidden | 0/12 | 0/22 |
| No overflow **or clipping** 360–1440px | PASS | PASS | PASS |
| Template Spec §6 (automated half) | — | PASS | PASS |

`astro check` clean across 40 files; `audit:hardcoded` and `gate:m2` still
pass. Evidence in `reports/m4-gate-summary.json`, captures in `reports/m4/`.

**Target not met, stated plainly: LCP is 1.7s against the 1.5s working
target.** Every code-side lever is in place and verified — matched preload,
AVIF, `fetchpriority="high"`, eager, no render-blocking JS, TBT 0ms — and the
*observed* LCP subparts total about 56ms. The 1.7s is Lighthouse's throttling
model, dominated by FCP at 1.1s for a 27KB gzipped document. The runbook
specifies WebPageTest 4G Moto-class for this gate, which needs the deployed
preview URL and real photography to mean anything.

**Every image in the evidence is a flagged placeholder**, both testimonials are
flagged placeholder text, and the seeded catalogue means the featured row shows
2 of 6 cards, the destination strip resolves 1 of 7 tiles from content, the
travel-guide teaser 1 of 3, and related journeys 1 card. The layout and
typography are real; the imagery is not.

### Open question needing a ruling

`/destinations/` — the index route the homepage strip's "View all destinations"
link points at **is not in CLAUDE.md's locked URL list** and has no template in
PAGE_TEMPLATES, yet T1 specifies the link. Either the index page joins the URL
structure (and M4 step 3) or the link comes off the homepage. Not improvised
either way.

### Exact next action

1. **Client:** review the `m4-templates` PR — the six desktop/mobile captures
   plus the preview URL. **The homepage needs explicit sign-off before the
   register rolls across the remaining templates**, per the M4 review loop.
2. Rule on `/destinations/`, and on whether the reference captures should be
   committed as optimised JPEGs.
3. **Then:** M4 part 2 — destination template, journeys index, luxury-trains
   landing, travel-guide index + article, corporate, about, reviews,
   plan-my-trip, policy pages, custom 404, and the journey-card → hero View
   Transition verified end to end once `/journeys/` exists.
4. Still outstanding from the client: photo archive, verified trust numbers
   (#2), consented testimonials (#3), pricing decision (#1), GSA disclosure
   wording and schedule publishing (#15), and `docs/CLIENT_REVIEW_SHEET.md`.

---

## 2026-09-09 — M4 part 1, revision 2: real photography and the placeholder overhaul

**Branch:** `m4-templates` (PR #3, not yet merged). Homepage register **not
approved** at first review; the client's diagnosis was that brand-gradient
placeholders were making a photography-led design impossible to judge. That
diagnosis was correct.

### The six items

1. **Temporary real photography.** 15 Unsplash images (licence permits
   commercial use, no attribution required; Unsplash+ `premium_photo-*` files
   deliberately excluded as a paid licence we do not hold), all named
   `TEMP-PHOTO-*` so `grep -rn "TEMP-PHOTO" src/` finds every reference and the
   audit counts them. Wired to the homepage hero, both seed journey heroes, the
   luxury-rail banner, all nine locked destination tiles and the travel-guide
   card. `npm run temp:photos` regenerates; provenance and per-file attribution
   in `docs/brand/processed/TEMP-PHOTO-PROVENANCE.md`.
   **The grade needed a second pass.** The first curve *lifted* saturation,
   which amplified how differently the photographs were lit — turquoise ones
   read tropical, sandstone ones read desert, and the strip looked like a stock
   grid. Pulling colour slightly **down** while pushing the warm bias **up** is
   what made an unrelated set read as one collection.
   Heroes are also now cropped to a predictable 3:2 master. Three of the
   sources were portrait, and a portrait photograph cover-cropped into a wide
   hero loses its subject — the Kerala one became palms and a sun flare with no
   boat in it, so that source was swapped for a landscape frame. It also halved
   the bytes: we had been sending 1280px of image height to fill a 470px band.
2. **Placeholder overhaul.** Neutral warm grey `#ECE9E6`, hairline border,
   small centred label, and nothing else. `npm run brand:placeholders`.
3. **Stripes removed sitewide.** They were baked into the placeholder graphics
   rather than set in CSS, so replacing those removed them everywhere at once.
   The hero gradient is confined to the text zone (bottom 58%).
4. **Trust bar: four stats** — 20+ Years · N Curated Journeys · 9 Regions ·
   24/7 On-Trip Support — restyled as full-width display numerals divided by
   hairlines. The two middle stats are **derived from our own catalogue**, not
   claimed, which is what makes them legitimate while PRD Open Question #2 is
   still open: a number we compute cannot be an unverified claim and cannot go
   stale. It reads "2 Curated Journeys" today and reaches 20 in M5 with nobody
   editing anything.
5. **Hero H1** desktop cap raised 4.5rem → 5.25rem (72px → 84px). The mobile
   floor is unchanged, because 40px at 390px already matched the reference.
6. **The reported blank sections were not a bug.** Both sections render fully —
   all seven highlights and all four practical notes are present and visible,
   verified by cropping the delivered JPEG at 1:1. The cause was **scale**: a
   1440×7616 full-page capture viewed fit-to-screen is about 10% zoom, at which
   15px body copy is sub-pixel and simply disappears. Practical notes were the
   worst case at 15px in muted grey. Fixed anyway, because both sections were
   genuinely too quiet: practical-notes body → `--text-base` in full ink,
   labels → `--text-lg`, highlight text → `--text-lg`. Review captures now also
   ship as 1:1 crops so copy is legible without zooming.

### Two contrast failures the real photography exposed

Both were invisible while every image was a flat gradient:

- **The overlay header's white nav links** sat directly on a pale sunrise sky
  and were unreadable. The transparent header now carries its own soft
  top-down scrim, which disappears the moment it solidifies.
- **The hero gradient was too timid.** Confined to the text zone as ruled, but
  the first attempt left the H1 and the lede on bright sandstone and genuinely
  hard to read. A label gradient has to actually work as a reading ground; it
  is now ramped firmly, because an editor may upload any photograph.

### LCP: real photography cost 0.7s, and 0.4s of it came back

| Stage | Homepage LCP |
|---|---|
| Flat placeholder graphic | 1.7s |
| Real photography, unoptimised | 2.4s |
| After the two fixes below | **2.0s** |

1. Hero AVIF quality 42 rather than Astro's default — the 960w candidate drops
   from 76KB to 56KB with no visible difference at 1:1 (checked).
2. A **768 rung** added to the hero srcset: a 412px phone at DPR 1.75 needs
   721px and was being served the 960px candidate, a third more pixels than it
   could display, on the LCP resource.

FCP is 1.1s on all three pages, so the hero has a 0.9s budget in this
instrument. **A decision is needed:** the 1.5s working target in invariant #3
was set when heroes were flat graphics, and the code-side levers are now
exhausted short of visibly degrading imagery on a photography-led premium site.
2.0s is comfortably inside the 2.5s Core Web Vitals pass mark. Either the
working target moves, or hero art direction changes.

### Gate — revision 2

| Check | / | Variant A | Variant B |
|---|---|---|---|
| Performance | 99 | 99 | 100 |
| Accessibility | 100 | 100 | 100 |
| Best practices | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 |
| FCP / LCP | 1.1s / 2.0s | 1.1s / 2.0s | 1.1s / 1.7s |
| TBT / CLS | 0ms / 0 | 0ms / 0 | 0ms / 0 |
| Keyboard | PASS | PASS | PASS |
| Visible without JS | 0/18 hidden | 0/12 | 0/22 |
| No overflow or clipping | PASS | PASS | PASS |
| Template Spec §6 | — | PASS | PASS |

`astro check` clean; `audit:hardcoded` and `gate:m2` pass. Evidence in
`reports/m4-gate-summary.json`.

### Exact next action

1. **Client:** re-review the homepage register on the PR #3 preview. **No
   rollout to the remaining templates until that sign-off.**
2. Rule on: the LCP working target vs real photography; the `/destinations/`
   index route; and whether `docs/references/` should be committed as
   optimised JPEGs.
3. Note that filling all six featured-journey slots needs four more itineraries
   ported from `docs/itineraries/` — genuine M5 content work, not done here
   because M5 has not been authorised.
4. Still outstanding from the client: the real photo archive (all 15 images are
   TEMP-PHOTO), verified trust numbers (#2), consented testimonials (#3),
   pricing decision (#1), GSA wording and schedule publishing (#15), and
   `docs/CLIENT_REVIEW_SHEET.md`.

---

## 2026-09-11 — M4 part 1, revision 3: T1 v2, style deltas, 4-journey pull-forward

**Branch:** `m4-templates` (PR #3). Homepage register improved but **not yet
approved**; this round applies the two style deltas, the T1 v2 restructure and
the authorised M5 pull-forward.

### Rulings recorded in the docs

- **LCP target revised to ≤2.0s** (Lighthouse mobile) with a 2.5s hard ceiling,
  patched into CLAUDE.md invariant #3, the definition of done, and PRD §12/§16.
  The M8 WebPageTest 4G run remains the field verdict.
- **References:** 90MB PNG originals stay gitignored in `docs/references/`;
  optimised JPEGs (~350KB each, 2.5MB total) committed to
  `docs/design/references/`, with a README in each explaining which is which.
- **`/destinations/` index** added to the locked URL list and specified as
  PAGE_TEMPLATES **T2a**.
- **Image-slot convention** documented in both CLAUDE.md and PAGE_TEMPLATES.

### Style deltas

Display type stepped down ~17% (hero cap 5.25rem → 3.5rem, H2 2.75 → 2.25rem,
inner H1 3.5 → 2.875rem, stat numerals 3.25 → 2.75rem). **Body sizes were not
touched** — last round's legibility bump stays. Button radius and padding moved
to tokens; padding down one step everywhere, large size 52px/19px → 48px/17px,
and every control still clears 44px. Both radius options render side by side at
`/dev/components/#buttons` for the pick; **pill is currently live and switching
is one token.**

### T1 v2 and the founder section

The homepage was rebuilt to the new eleven-section order: destinations moved
above journeys and now show **all nine** tiles, corporate and travel-guide
condensed into one slim dual strip, and an association-logos slot that renders
nothing until logos exist.

The new **Meet your travel consultant** section is entirely CMS-fed through a new
`siteSettings.founder` object, and **nothing in it is invented**. The name is
null and stays null until the client supplies it — the section renders without a
name line rather than with a guess. The portrait is null and renders the neutral
grey 4:5 slot; a stock photograph of a stranger is not used, because presenting
one as a real consultancy's founder would be a fabrication rather than a
placeholder. The quote is an agency draft, logged in
`docs/CLIENT_REVIEW_SHEET.md` §14 with its two checkable claims flagged for the
client to confirm or strike.

### M5 pull-forward — four journeys ported

`golden-triangle-5n-6d` (Rajasthan), `bali-5n-6d` (international),
`north-east-india-6n-7d` (new region) and `western-southern-india-12n-13d` (the
canonical direct-port doc, covering south-west India). All ported from the real
source documents in `docs/itineraries/`. Six journeys now exist — five Variant A
and one Variant B — and **all six pass the automated half of Template Spec §6**.

### The CLS regression, and two wrong diagnoses before the right one

CLS went from 0 to **0.132** on the Palace on Wheels page, reproducible to three
decimals. I assumed a font-metric mismatch on the display face and added
metric-matched `size-adjust` fallbacks; no change. I then switched the display
face to `font-display: optional`; the number did not move **by a single
digit** — which was the clue that the diagnosis was wrong, not insufficient.

Lighthouse had named the cause outright in the audit sub-items:
`inter-600-latin.woff2`. Semibold carries the hero eyebrow, the badges, the
route strip and the buttons; when it swapped in, the hero content reflowed, and
because that content is bottom-aligned the whole block moved.

Worth recording: **my own CDP harness reported zero shifts even under CPU and
network throttling**, because it reused a Chrome profile and the font was
cached. Cold-cache behaviour was the entire bug, and a local harness that warms
its cache cannot see it.

The fix is Inter 600 **preloaded and set to `font-display: optional`** — the same
pairing now used for the display face. Preloaded it wins the ~100ms window in
almost every real case; when it does not, the page stays still and the
metric-matched fallback stands in. Result: **CLS 0 on all four pages**, and FCP
on journey pages improved from 1.1s to 0.9s.

### Gate — revision 3

| Check | `/` | Kerala (A) | Golden Triangle (A) | Palace on Wheels (B) |
|---|---|---|---|---|
| Performance | 99 | 99 | 100 | 100 |
| Accessibility | 100 | 100 | 100 | 100 |
| Best practices | 100 | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 | 100 |
| FCP / LCP | 1.1s / 2.2s | 0.9s / 2.0s | 0.9s / 1.7s | 0.9s / 1.7s |
| TBT / CLS | 0ms / **0** | 0ms / **0** | 0ms / **0** | 0ms / **0** |

`astro check` clean. Template Spec §6 passes on all six journey pages. Keyboard,
no-JS, responsive-and-clipping, and the invariant audits all pass.

**One target missed by 0.2s:** the homepage is **2.2s** against the new ≤2.0s
working target, and 0.3s inside the 2.5s ceiling. T1 v2 put nine destination
tiles and six journey cards on the page — 14 images and 405KB of real
photography. Every code-side lever is applied, including moving the LCP preload
ahead of the font preloads in document order. The remaining lever is
above-the-fold image density, which is a design decision rather than a code one,
and nine tiles is what T1 v2 asks for.

### Exact next action

1. **Client:** re-review the homepage register on the PR #3 preview, and **pick
   a button radius** (A pill / B 14px) at `/dev/components/#buttons`.
2. Rule on whether 2.2s on the homepage is acceptable, or whether the tile count
   above the fold should come down.
3. Sign off §14 of `docs/CLIENT_REVIEW_SHEET.md` — founder name, role, quote and
   portrait.
4. **Then:** the rest of M4 in runbook order — `/destinations/` index (T2a),
   destination pages (T2 v2), journeys index, luxury-trains landing,
   travel-guide index and article, corporate, about, reviews, plan-my-trip,
   policy pages, 404, and the card→hero View Transition verified end to end.

---

## 2026-09-11 — M4, design revision round 2 (PRD v1.5)

Six owner amendments, recorded as a PRD v1.5 scope amendment (§17) before any
of them was built, then delivered in the sequence the owner set: 2+3 → 1 → 4 → 5.

**1 · Homepage hero → full-screen with background video.** 100svh, CMS-fed
poster and clip. The poster is still the LCP element; the `<video>` ships with
no sources and `preload="none"`, attaches them on an idle callback after
`window.load`, and fades in on opacity. `prefers-reduced-motion` and
`Save-Data` never fetch a byte. `npm run check:hero-video` asserts all fifteen
of those conditions against a real network log, because "we respect Save-Data"
is trivially satisfiable by downloading the clip and hiding it.

**2 · Trust bar icons.** One Phosphor `thin` glyph above each numeral, burgundy,
hairlines kept. Path data copied into `src/lib/phosphor-icons.ts` by
`npm run brand:icons` — no `@phosphor-icons/*` dependency, which is a React
component library this site has no use for.

**3 · Compact journey cards + `/journeys/`.** Duration pill and a two-line
title; image height unchanged. The index is built to T3 with a vanilla type
toggle that hides itself without JavaScript.

**4 · `dayImages[]`.** 0–4 per day, superseding the single per-day `image`.
One runs 3:2 across the prose measure, two or more become a 4:3 two-column grid.

**5 · City pages (T15).** New `cities` collection, `/cities/{slug}/`, Jaipur and
Kochi seeded from public knowledge and flagged provisional. The journeys section
and the whole cross-link layer are **computed** from each journey's
`routeCities` plus `routeAliases`, so the set can grow from two to fifteen
without editing one line of journey content.

**6 · Reference video.** URL recorded in `docs/design/references/README.md` as
human-viewing-only, with the reasons it is never fetched or embedded.

### Four bugs caught, one of them already live

1. **The journey hero scrim was sized as 58% of the HERO, not of the COPY.** On
   a phone the itinerary hero stacks an eyebrow, a two-line H1, three chips and
   two buttons — taller than 58% — so the Golden Triangle headline sat on bright
   sandstone at **1.32:1**. Shipped through the previous review round, because
   on desktop the same copy is short enough to stay inside the band. The scrim
   now shares a grid row with the copy: **8.79:1**. This is why
   `npm run check:hero-contrast` exists — it hides the type, photographs the
   ground behind it, and takes the lightest pixel in every text box. Its own
   first run then showed it was excluding overlay nav links, the element that
   failed in round 1, so it was blind to its own reason for existing.
2. **The video boot script shipped its own backticks** — written as
   `<script is:inline>` inside a JSX conditional, the braces and template
   literal reached the browser verbatim as a block containing a string. Valid
   JavaScript that does nothing. Now emitted through `set:html`.
3. **The first veil calibration flattened the photograph** into a plum panel —
   the exact failure the client killed in the previous round. Retuned against
   where the copy actually sits rather than against a hypothetical white frame.
4. **The 1440p clip cost 1,803ms of main-thread decode**, taking the homepage
   from Performance 99 to **74** on a TBT of 1,500ms — while LCP, the metric the
   whole pattern was built to protect, never moved. Bytes were the wrong thing
   to measure: every re-encode available came out *larger*, so the first version
   shipped the source. Downscaled to 960×540 and trimmed to 7s it is **3.3MB —
   smaller than the 1440p source — at Performance 100, TBT 0ms.**

### Gate evidence (Lighthouse mobile, simulated)

| Check | `/` | `/journeys/` | Golden Triangle | `/cities/jaipur/` | `/cities/kochi/` |
|---|---|---|---|---|---|
| Performance | 100 | 100 | 100 | 99 | 100 |
| Accessibility | 100 | 100 | 100 | 100 | 100 |
| Best practices | 100 | 100 | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 | 100 | 100 |
| FCP / LCP | 1.1s / **1.7s** | 0.9s / 1.7s | 0.9s / 1.7s | 0.9s / **2.1s** | 0.9s / 1.7s |
| TBT / CLS | 0ms / **0** | 0ms / 0 | 0ms / 0 | 0ms / 0 | 0ms / 0 |

Full figures in `reports/m4-rev2-gate-summary.json`. `astro check` clean.
Template Spec §6 passes on all six journey pages. Hero-video (15 checks),
hero-contrast (50 text runs across four pages), responsive-and-clipping,
keyboard, no-JS and the invariant audits all pass.

**The homepage LCP went 2.2s → 1.7s**, comfortably inside its own 2.2s
exception, because the hero poster is now a dark silhouette rather than a
detailed palace.

**One target missed by 0.1s:** `/cities/jaipur/` is **2.1s** against the ≤2.0s
working target, and 0.4s inside the 2.5s ceiling. The cause is understood: its
TEMP-PHOTO hero is a Hawa Mahal facade of 953 windows, which is the pathological
case for AVIF — 59KB against 25–35KB for every other hero on the site. Kochi,
same template and a heavier page overall, is 1.7s. The client's own photography
replaces it in M5.

### Exact next action

1. **Client:** review the round-2 shots on the PR #3 preview — homepage,
   `/journeys/`, the Golden Triangle page with day images, and `/cities/jaipur/`.
2. **Button radius is still unanswered** — the decision came through as the
   literal placeholder `[PILL / 14px]`. Pill stays live and both options stay on
   `/dev/components/#buttons` until a choice lands; locking the token and
   removing the loser is a one-line change.
3. Rule on `/cities/jaipur/` at 2.1s — accept, or swap the temporary hero
   photograph for something less finely detailed.
4. Sign off §14, §15 and §16 of `docs/CLIENT_REVIEW_SHEET.md` — the founder
   fields, the hero-video shoot brief, and the city-page copy plus the candidate
   city list to rank.
5. **Then:** the rest of M4 in runbook order — `/destinations/` index (T2a),
   destination pages (T2 v2), luxury-trains landing, travel-guide index and
   article, corporate, about, reviews, plan-my-trip, policy pages, 404, and the
   card→hero View Transition verified end to end.

---

## 2026-09-11 (later) — M4 remaining templates + two rulings

### Rulings applied

**Jaipur hero — swapped, not excepted.** The old stand-in was a Hawa Mahal
facade: 953 windows of fine repeating detail, the pathological case for AVIF,
at 59KB where every other hero lands at 25–35KB. Replaced with Amer Fort above
Maota Lake at golden hour — mostly sky, water and hillside, which compresses
almost for free. **19KB, and the page went 2.1s → 1.7s**, matching Kochi. Worth
keeping as a rule: a hero's encoded size is a property of its *content*, and
the fix for a heavy hero is usually a different photograph rather than a lower
quality number.

**Scroll cue — kept, and verified.** Its opacity transition and its keyframe
animation both already sat inside `@media (prefers-reduced-motion:
no-preference)`, and the animation is transform-only per the motion spec.
Desktop-only as built. No change was needed.

**Button radius — still unanswered.** The decision has now arrived twice as a
literal placeholder (`[PILL / 14px]`, then `[PICK ONE: PILL or 14px]`). Pill
stays live and both options stay on `/dev/components/#buttons`. Locking the
token and deleting the loser is a one-line change whenever a choice lands; it
has not been guessed at.

### Every remaining M4 template, built

`/destinations/` (T2a) · 9 × `/destinations/{slug}/` (T2 v2) · `/luxury-trains/`
(T4) · `/corporate/` (T5) · `/about/` (T6) · `/reviews/` (T7) ·
`/travel-guide/` (T8) · `/travel-guide/{slug}/` (T9) · `/plan-my-trip/` (T10) ·
four policy pages (T12) · `/404/` (T13).

**33 pages build. 1,927 internal references. Zero broken links.**

### The judgement calls, so they can be overruled

- **M5 pull-forward, flagged.** Eight destination pages were drafted now. Their
  prose is M5 work, but the homepage has linked all nine since T1 v2, so eight
  of the nine were 404s and the M4 gate is a click-through. No new photography
  was needed. Logged as **CLIENT_REVIEW_SHEET §17**, and three of those pages
  now carry *policies* rather than descriptions — no elephant rides at Amer, no
  promised tiger sightings, no Ladakh trip without acclimatisation days.
- **Seven sections deliberately do not render** (§18): the About timeline (a
  timeline is nothing but dates and `foundingYear` is null), certifications, the
  corporate "48-hour proposal" promise, client logos, the reviews aggregate line
  *and* its `AggregateRating` schema, the guest gallery, and any numeric
  response-time promise. Each turns on one client fact.
- **The policy pages publish structure, not law** (§19). `/privacy/`,
  `/terms/` and `/cancellation/` carry a visible notice and are `noindex` until
  real copy lands — agency drafting is not legal advice, and a placeholder
  privacy policy in a search index is the version people quote back at you.
  `/booking-terms/` is the exception and is already real: it is built from the
  operator disclosures and policies in the journey entries, pulled live rather
  than retyped.
- **Plan My Trip's stepper is progressive enhancement.** All four fieldsets are
  in the HTML and the form submits as one long form without JavaScript —
  verified in the built output. A multi-step form that needs script to be
  submittable is a lead-capture page that loses leads silently.
- **Destination journeys are manual only.** CLAUDE.md calls it "auto by tag +
  manual override"; journeys carry no destination reference, so the only
  automatic basis available would be fuzzy-matching a region name against a
  title. That files trips wrongly and does it silently. The tag arrives in M5.

### New check — `npm run check:links`

M4's gate is a click-through and nobody clicks every link on 33 pages; with
`trailingSlash: 'always'` a missing slash is a 404 too. It walks the built
output and separates genuinely broken links from routes that are specified but
unwritten. Its pending list was exactly the rest of M4, which made it a to-do
list that could not go stale. It is now empty.

### Gate evidence (Lighthouse mobile, simulated)

| | `/` | `/journeys/` | GT | `/cities/jaipur/` | `/luxury-trains/` | `/about/` | `/plan-my-trip/` | article |
|---|---|---|---|---|---|---|---|---|
| Performance | 100 | 100 | 100 | 100 | 100 | 100 | 100 | 99 |
| LCP | 1.7s | 1.7s | 1.7s | **1.7s** | 1.7s | 1.7s | 1.5s | **2.3s** |
| CLS / TBT | 0 / 0ms | 0 / 0ms | 0 / 0ms | 0 / 0ms | 0 / 0ms | 0 / 0ms | 0 / 0ms | 0 / 0ms |

Accessibility, best-practices and SEO are 100 on every page measured. Full
figures in `reports/m4-templates-gate-summary.json`.

**One target missed by 0.3s:** the article template at **2.3s**, inside the
2.5s ceiling. Same cause as the Jaipur hero — a detailed TEMP-PHOTO master.
Preloading it as AVIF took it from 2.6s to 2.3s; the rest is the photograph,
and M5 replaces it.

**A measurement note worth keeping.** An early `/journeys/` run reported 2.9s
and P95. Two clean repeat runs both returned 1.7s and P100 — the outlier was
contention from three Lighthouse runs queued against one preview server. The
figure that went in the gate summary is the repeated one, not the first one.

### Exact next action

1. **Client:** review the remaining templates on the PR #3 preview. Desktop and
   mobile captures attached for the design-significant ones.
2. **Button radius** — still needs an actual pick (A pill / B 14px).
3. **CLIENT_REVIEW_SHEET §14–§19** — founder fields, hero-video brief, the two
   city pages, the eight destination pages (three of which publish policies),
   the seven deliberately-missing sections, and ⚑ **the legal copy for three
   policy pages**.
4. **Then M5:** the remaining 17 itineraries, 7 more articles, real photography
   replacing all 40 TEMP-PHOTO files and the TEMP-VIDEO clip, and the
   destination reference on journeys that turns the auto-tagging on.

---

## 2026-09-11 — M4, design revision round 3 (ten items)

**Branch:** `m4-templates` (continues PR #3) · **PRD → v1.6**

Ten owner items, executed in the sequence given: governance and audit first
(1+2), then the colour rebalance (9) because it touches everything, then
gradients (3), cards (4), the trust/testimonial redesigns (5+6), the homepage
and corporate register (7), the footer (8), and the watermarks (10).

### Governance (items 1 and 2) — two new standing rules

**Word control** is now CLAUDE.md invariant #9. Every user-facing string is
sourced, registered in the new **`docs/COPY_REGISTER.md`** as `DRAFT`, or an
obviously-placeholder line that is short and quiet. The trigger was real: the
two testimonial cards were rendering a full paragraph of internal explanation
at quote size, under two invented guest names. Both entries are deleted. The
schema now carries a `placeholder` flag and **refuses** `name`, `origin`,
`quote` and `photo` when it is set, so the failure cannot recur by editing; the
card renders one italic muted line and the lotus. Placeholders are excluded
from the `Review` structured data, because a fabricated review republished by
an aggregator cannot be withdrawn.

`docs/COPY_REGISTER.md` inventories the chrome copy of all 33 pages by page,
each row `APPROVED` / `DRAFT` / `PLACEHOLDER`, with twelve rows flagged as
claims, promises or numbers rather than atmosphere.

**Image control** is invariant #10, enforced by the new
**`npm run check:cms-images`**. Three findings, all converted: the
`/luxury-trains/` hero was imported straight from `src/assets/` and now reads
from a new `siteSettings.pageHeroes`; the 404 graphic became inline SVG; and
nine dead TEMP-PHOTO fallbacks in the destination strip were deleted — all nine
destination entries exist, so the homepage now resolves every tile from content
and **throws** on a missing entry rather than silently showing a photograph
nobody chose.

### Two defects the round exposed, neither of them new

**The hero gradient regression I introduced, and how it was caught.** The first
version of the continuous gradient used percentage stops. On the homepage it
measured 11:1. `check:hero-contrast` defaulted to the homepage only, so that
would have been the whole story — so the default was widened to all eight hero
pages first, and it returned **33 AA failures**: a percentage curve cannot know
where the copy is, and a breadcrumb halfway up a 55svh destination hero landed
at 3.0:1. Re-anchoring the gradient in `rem` from the bottom, with
`--scrim-firm`/`--scrim-feather` per hero height, fixed 32 of them; the last
was the trip-type tag, which now carries its own burgundy pill like the badges
beneath it. Final: **90 text runs, all pass**. A baseline run against the
previous commit confirmed the old scrim passed all 94 — so this was a
regression I made, not one I inherited.

**The lotus glyph has been the wrong colour since M3.** Ten call sites did
`<Lotus class="why__mark" />` with `.why__mark { color: crimson }` in the
calling page. The `<span>` is authored inside `Lotus.astro`, so it carries
*that* component's `data-astro-cid`; the caller's rule compiled to
`.why__mark[data-astro-cid-<caller>]` and matched nothing. Every lotus that was
meant to be crimson or yellow rendered plain ink, through three design reviews,
because a missing colour reads as a design choice. The same trap was found once
before on the trust-bar icons in round 2 and fixed *locally* with a wrapper
span — which left the pattern intact everywhere else. It is now a **`tone`
prop** resolved inside `Lotus.astro`, with the reasoning written into the file.

### Gate evidence

33 pages · `astro check` 0/0/0 · **1,956 internal references, 0 broken, 0
pending** · Lighthouse mobile **Performance 100** on `/`, `/journeys/`, Golden
Triangle, `/corporate/`, `/reviews/`, `/about/`, `/luxury-trains/`,
`/cities/jaipur/`; **99** on the article. LCP 1.5–1.7s everywhere except the
article at 2.3s (unchanged, inside the ceiling). CLS 0 and TBT 0ms throughout.
Contrast, CMS-image, hero-video, responsive, keyboard, no-JS, template-spec,
link and hardcoded audits all pass. Figures:
`reports/m4-rev3-gate-summary.json`; captures in `reports/rev3/`.

The homepage's first Lighthouse run in a sequential loop returned P75 / TBT
1,400ms; two clean repeats both returned P100 / TBT 0ms. Same queued-run
contention as round 2 — the repeated figure is the one recorded, and the
summary says so.

**Button radius: LOCKED to pill.** The A/B is removed from `/dev/components/`.

### Flagged, deliberately not changed

The homepage destination strip puts nine tiles in a four-column grid, which
leaves Vietnam alone on its own row. `PAGE_TEMPLATES` T1 §3 specifies
"4/3/2-col responsive", so this was not changed unilaterally; a one-line move to
three columns at desktop makes it a clean 3×3.

### Exact next action

1. **Client:** judge round 4 from the captures on PR #3 — homepage,
   `/journeys/`, Golden Triangle and `/corporate/`, desktop and mobile.
2. **`docs/COPY_REGISTER.md`** — the bulk copy approval. Review-sheet §20 lists
   the twelve rows worth reading first.
3. **Footer reference layout** (§21) — when the screenshot lands, rebuild to it.
4. **Destination strip** — three columns at desktop, or leave at four?
5. ⚑ **CLIENT_REVIEW_SHEET §19** — legal copy for the three policy pages plus
   the agency's own cancellation slabs. Still the only launch blocker.
6. **Then M5:** the remaining 17 itineraries, 7 more articles, real photography
   replacing all 40 TEMP-PHOTO files and the TEMP-VIDEO clip, and the
   destination reference on journeys that turns the auto-tagging on.

---

## 2026-09-11 — Round 3 review rulings (M4 tail)

**Client verdicts:** testimonial deletion and the schema refusal — approved. The
two judgement calls — gradients over photographs are ink while solid bands are
burgundy, and the footer is ink to avoid the double-burgundy slab — approved and
recorded as design rules in CLAUDE.md. Destination strip: **three columns at
desktop** (3×3). `check:hero-contrast`: the all-hero-pages widening is the
permanent definition, now expressed as a coverage contract — every page with
text over imagery, **discovered from `dist/`** rather than listed, so a new
template type joins the audit without an edit.

### Standing review heuristic (client instruction — applies to every session)

**When a bug is found at one call site, grep the pattern at every call site
before closing it.** The lotus colour bug survived three design reviews because
the same trap had been found once before — on the trust-bar icons in round 2 —
and fixed *locally* with a wrapper span, which left the pattern intact at ten
other call sites. A missing colour reads as a design choice, so nobody looked
again. A bug at one call site is a bug in a pattern until proven otherwise:
sweep the codebase for the same shape, and where possible fix it at the
definition (the lotus fix moved colour to a `tone` prop resolved inside the
component) so the pattern cannot recur. Record the sweep.

**Still open on the client's side:** the DESIGN VERDICT line in the round-3
review arrived as a literal placeholder (`[APPROVED — M4 design-complete / OR
deltas: <your specifics>]`), so M4 design is not formally marked approved and
PR #3 remains unmerged. The instruction to proceed to M5 was explicit and is
being followed; M5 branches from `m4-templates` until PR #3 merges.

---

## 2026-09-11 — M5 content migration (branch `m5-content`)

**Sequence ruling applied:** the runbook now runs M5 → M7 → M6 → M8 → M9;
nothing in M6 assumed Tina existed first (verified — no `tina/` or
`functions/` yet, every M6 step sits on the built output and the settings
singleton).

### Done

- **All 20 journeys live** — 14 ported this milestone from `docs/itineraries/`
  (11 Variant A, 2 Variant B), all 20 passing Template Spec §6. Leh Ladakh was
  the full rewrite the spec called for; the mid-format documents gained intro,
  highlights and glance tables. Kerala's three pages are now three products
  (§12, resolved — the short document ran one way and ended on the coast, so
  it was never a subset).
- **8 launch articles** — the seven missing from PRD §7.8 written; the four
  visa/entry pieces carry a "rules change" line and are listed for the client's
  read first.
- **Destination prose for all 9**, replacing the pull-forward stubs; every
  destination and journey cross-linked (`related` ×3 on every journey,
  `relatedJourneys` on every destination).
- **20 branded PDFs** — printed *from the journey pages* through a print
  stylesheet, so section-for-section parity is a property of the build; a
  name/email/phone gate on every journey page in the shared `EnquiryForm`.
- **Sitemap** — `@astrojs/sitemap` added (the CLAUDE.md "auto sitemap"
  requirement and the M5 gate line), filtered to exclude the dev page and the
  three `noindex` policies: 49 URLs.
- **52 TEMP-PHOTO stand-ins** (12 new, every id checked against its Unsplash
  page — five candidates were Unsplash+ and were dropped).
- `SITE_STATUS.md` created — **the instruction named it as a standing rule but
  no such file or rule existed in the repo**, so its shape is inferred: a
  one-page status board updated in the same commits as the work.

### Two STOP-AND-FLAG items (CLIENT_REVIEW_SHEET §22)

1. **The Deccan Odyssey document has no day-by-day.** The Template Spec
   recorded it as content-complete; it is not. Eight provisional days are built
   from the route in the operator's order and the document's own highlight
   sentences — nothing invented — and every one carries the on-page
   provisional notice. **It must not launch until the operator's programme
   arrives.**
2. **Both train documents are another agency's.** Handled as the Palace on
   Wheels was in M4: operator rules ported, that agency's bank charge, service
   fee, festive supplement and name stripped (the third-party audit enforces
   the last). The Deccan Odyssey's operator is never named in its document;
   "Maharashtra Tourism Development Corporation" is our inference and is
   flagged as such.

### Things chosen in the port, listed for reversal (§23)

Hotel names not published; elephant rides at Amer written as jeep, consistent
with the published policy; the sanctuary painting omitted; the Ladakh
acclimatisation wording on the destination page aligned to the client's own
one-rest-day route rather than contradicting it; four factual overstatements
in the source documents quietly corrected.

### Defects the gate found

The Golden Chariot's long transport label pushed a phone page sideways (chip
now wraps); the print-only brand header rendered on screen because the
scoped rule outranked the global utility; a hero came down black-and-white;
and six three-line mobile H1s fell under 3:1 on the `full` hero — its firm zone
went from 24 to 28rem and the six re-measure at 3.1–3.8:1. Every one was found
by an audit, not by eye.

### Gate evidence

54 pages · `astro check` 0/0 · 20/20 Template Spec §6 · tariff grep clean ·
0 broken links · 0 images outside the CMS · sitemap 49 routes · responsive,
keyboard, no-JS, hero-video all pass · Lighthouse P100 on every sampled page
except the article template at P99 / 2.0s. Full figures:
`reports/m5-gate-summary.json`; captures in `reports/m5/`.

### Exact next action

1. **Client:** §22 (train operator names, advance %, the Deccan Odyssey
   programme), §23, §24, §25 in the review sheet; the DRAFT rows in
   `docs/COPY_REGISTER.md` §L–§N.
2. **M7 — Tina wiring** on `m7-tina`, per the resequence: `tina/config.ts`
   mirroring every Zod schema field-for-field, repo media to
   `/public/uploads/`, the editor smoke tests, and the 1.5-day Sveltia trigger
   still requiring the client's sign-off before it is pulled. The M7 gate is
   the owner's own dashboard session.
3. **M6 inherits** the PDF release step: files out of `public/downloads/`,
   released by the lead function after a verified gate submit — and a size
   budget for them (0.8–3.8 MB each today).

---

## 2026-09-12 — M7 Tina CMS wiring (branch `m7-tina`, stacked on M5)

**Done.** `tina/config.ts` mirrors every Zod collection field-for-field
(journeys with both variants, destinations, cities, posts, testimonials, the
settings singleton), pinned to tinacms 3.13.0 / @tinacms/cli 2.7.0. Media is
repo-based in `/public/uploads/` as locked; `npm run build` is a conditional
script so Cloudflare deploys keep working until the client's Tina Cloud
credentials exist. Cheat sheet at `docs/CMS_CHEATSHEET.md`.

**Two things the docs did not cover, decided and recorded.** (1) Astro's
`image()` versus Tina's `/uploads/` paths: settled by experiment — a content
entry referencing `../../../public/uploads/<file>` builds the full AVIF/WebP
set, so every image field carries a path mapping and invariant #3 holds with
the locked media folder. (2) Tina's visual editing on Astro now requires SSR,
which the stack forbids; **forms-based editing for every collection** ships
instead and satisfies the gate. Runbook M7 step 2 is superseded accordingly.

**The smoke tests found three bugs in my own config before the client could.**
The path mappers called `.startsWith` on raw values — for image *list* fields
that is an array, and `gallery: []` blanked the entire journey form. Reference
arrays modelled as object lists saved `related: [{}]`, which Zod refused. And
the API's `updateSiteSettings` with partial params *replaces* the settings
object — the form submits the whole document, so it is an API-only hazard,
recorded so nobody scripts partial updates. All three were caught by driving
the real form over CDP rather than by the API tests, which bypass the mappers.

**Smoke-test results (runbook M7 step 4):** phone changed through the real form
→ built → on the homepage and every footer; a journey field the same way →
Zod-clean build; an article created end to end → Astro-valid, built; an image
uploaded through the media API → in `/public/uploads/` → thirteen optimised
variants served; an invalid `phoneHref` → build refused naming the field,
`dist/` untouched. Every test edit reverted; the content tree is clean.

**Gate: OPEN, on the client's side.** The M7 gate is the owner's own dashboard
session. It needs a Tina Cloud project under their account and its two
values in the Cloudflare environment (review sheet §26); until then the editor
runs only locally, which is enough for a screen-share.

### Exact next action

1. **Client:** Tina Cloud project + the two environment variables (§26); then
   the screen-share session. Review of the M5 evidence (§22–§25) and the M4
   design verdict placeholder both still stand.
2. **M6** on `m6-forms`: the lead function, Turnstile, Resend, the Sheet
   webhook, GTM via Partytown — and step 2a, the PDF release with the files
   moved out of `public/`.
