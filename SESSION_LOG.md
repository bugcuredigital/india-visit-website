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
