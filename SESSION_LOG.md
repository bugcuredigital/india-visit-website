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
