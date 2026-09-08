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
