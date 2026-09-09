# EXECUTION_RUNBOOK.md — India Visit Website

Build order for Claude Code. Each milestone ends with a **gate** — do not proceed until it passes. Rules in CLAUDE.md apply to every step. Client-facing review happens on Cloudflare preview URLs at the marked ⚑ points.

## M0 — Pre-flight (human tasks, before any code)

- [ ] Answers to blocking Open Questions: #1 pricing display, #2 trust numbers, #9 Agrandir web licence (buy or approve fallback), #15/#16 train content
- [ ] Accounts created (client-owned, agency added as member): GitHub org/repo, Cloudflare, Tina Cloud, Resend, GTM container + GA4 property, Meta Pixel, Google Search Console
- [ ] Domain registered (Cloudflare Registrar) — can run parallel to build
- [ ] Claude Design pass: homepage, itinerary Variant A + B, destination page, article page mockups approved by client
- [ ] Assets collected into `/docs/`: brand kit, logo SVGs, font files (licensed), 20 itinerary docs, photo archive (pre-processed ≤2000px)

**Gate:** design mockups approved; font question resolved (Archivo Expanded behind `--font-display` — Agrandir deferred). Train content is no longer a gap: all three trains are content-complete, so the "coming soon" fallback is retired. **Outstanding at M1 start:** approved Claude Design mockups and the photo archive (client-side); the supplied logo file is unusable as vector artwork — see M1 step 6.

## M1 — Scaffold & tokens (Day 1)

1. `npm create astro@latest` (strict TS) + Tailwind integration; static output config
2. `src/styles/tokens.css`: brand colors as custom props; Tailwind theme extension mapping them
3. Self-host fonts: subset **Archivo Expanded** (display, behind `--font-display`) + **Inter** (body), latin, preload, `font-display: swap`. Agrandir Grand is unlicensed — the swap must stay a one-token-plus-font-file change
4. `Base.astro` layout: meta/SEO slots, favicon set, fonts, skip-link, GTM-via-Partytown stub (container ID from settings, may be empty for now)
5. Repo → GitHub → connect Cloudflare Pages → verify auto-deploy on push + preview URL on PR
6. Process the supplied logo per the brand rules (structural background removal only, never colour-keying — the wordmark is white) → `docs/brand/processed/`, then wire logo + favicon in. If the artwork cannot be processed safely, ship a `TEMP-ASSET`-flagged text wordmark and plum "IV" favicon so M1 is not blocked, and escalate

**Gate:** empty styled page deploys to `*.pages.dev`; Lighthouse mobile ≥ 95 perf on it; fonts render; logo renders visibly on off-white (or TEMP-ASSET fallback is in place and greppable).

## M2 — Content schema (Day 1–2)

1. Define Zod schemas for all five collections exactly per CLAUDE.md table + Template Spec §4 (`journeys` with `variant` discriminated union — Variant B fields required when `variant: 'B'`)
2. Create `siteSettings` singleton with placeholder values
3. Seed 2 real journeys as content files — one Variant A (Kerala with Houseboat), one Variant B (Palace on Wheels) — hand-ported carefully from the Word docs; these are the reference implementations
4. Seed 1 blog post, 1 destination, 2 testimonials

**Gate:** `astro build` fails loudly when a required field is removed from a seed file (schema safety proven), passes when restored.

## M3 — Component library (Day 2–4)

Build in this order (each reused by later ones): Button/CTA set → Header (sticky, settings-driven phone/WA) → Footer → SEO/JSON-LD component → Hero → QuickFactsBar → HighlightsGrid (lotus glyph) → GlanceTable → DayAccordion (+transport chips) → InclusionsBlock → CabinCards → BookingStepper → PoliciesAccordion → PracticalNotesGrid → ConvertBand (+enquiry form shell) → JourneyCard → RelatedJourneys → TestimonialCarousel → StickyMobileBar → ArticleBody blocks → CounterStat.

Rules: every component reads editable values from props/settings (invariant #1); CSS-only motion here (GSAP comes in M6); accessibility built in (focus, aria, 44px targets).

**Gate:** Storybook-style demo page renders all components; keyboard pass; no hardcoded contact strings (`grep` audit for phone-like patterns).

## M4 — Page templates (Day 4–7)

1. `journeys/[slug].astro` — renders BOTH variants from one template with conditional sections; verify against the two seed journeys; run Template Spec §6 checklist
2. Homepage per approved mockup (hero, trust bar, featured journeys, how-it-works, why-us, destinations strip, testimonials, corporate teaser, lead capture)
3. Destination template · Journeys index (card grid; filter is Phase 2) · Luxury Trains landing (GSA credential + 3 cards incl. coming-soon state) · Travel Guide index + article template (with inline JourneyCard embeds) · Corporate · About · Reviews · Plan-My-Trip (multi-step form UI) · policy pages · custom 404
4. View Transitions: journey card → itinerary hero morph; global fade fallback

**Gate ⚑:** full click-through on preview URL with seed content; client reviews look & feel. LCP ≤ 1.5s on homepage + both journey seeds (WebPageTest, 4G, Moto-class device profile).

## M5 — Content migration (Day 7–10, parallelizable with M6)

1. Port remaining 17 itineraries per Template Spec §5 migration map (upgrade older docs to canonical format; full rewrite for Leh Ladakh; benchmark voice throughout)
2. Write 9 destination pages; port/draft 8 launch articles with embedded journey cards; enter client-supplied testimonials (consent flag on)
3. Generate 20 branded PDFs (from the same content) → wire as gated downloads
4. Populate real siteSettings (phone, WA number + prefill, email, socials)
5. Cross-link pass: related journeys, article↔journey embeds, destination↔journey listings

**Gate:** all 20 journey pages pass Template Spec §6 checklist; content spot-check by client ⚑; every page has unique title/meta; sitemap contains all routes; **`docs/CLIENT_REVIEW_SHEET.md` complete** (created early, in M2) listing every provisional value (pace, idealFor, trust numbers, empty priceFrom) for one-shot client sign-off; **USD/price-pattern grep across all three train pages returns nothing** — this is a permanent regression check, not a one-off.

## M6 — Interactivity & motion (Day 8–11)

1. Multi-step Plan-My-Trip form logic + per-journey prefilled enquiry forms
2. `functions/api/lead.ts`: validate → Turnstile verify → Resend email → Sheet webhook → JSON response; honeypot; rate limit; hidden fields (page URL, UTM, journey slug, lead type incl. corporate tag)
3. Form success states (Namaste motif) + auto-response email copy
4. WhatsApp deep links with per-page context; click-to-call; sticky mobile bar behavior
5. Section entrances are CSS + IntersectionObserver sitewide (the default); GSAP + ScrollTrigger only for 1–2 homepage set pieces, lazy-loaded, + CounterStat islands; verify ≤ 40KB budget & reduced-motion
6. Wire GTM via Partytown reading container ID from settings; define events: `lead_form_submit`, `wa_click`, `call_click`, `pdf_download`, `corporate_submit`

**Gate:** test lead arrives in inbox + Sheet in < 1 min with correct tags; forms unusable by a simple bot (Turnstile verified server-side); Lighthouse unchanged (≥ 90 perf) WITH GTM firing — proves Partytown is doing its job.

## M7 — Tina wiring (Day 10–12)

1. `tina/config.ts` mirroring the Zod schemas field-for-field; repo-based media to `/public/uploads/`
2. Visual editing on: journeys, posts, destinations, siteSettings; forms-only fallback acceptable for testimonials
3. **Fallback trigger:** if visual editing costs > 1.5 days of fighting, switch to Sveltia on the same content files — do not burn the schedule. **Requires the client's explicit sign-off before activating** (standing rule: documented hedges — Sveltia, Cloudinary, Web3Forms — are surfaced and approved, not switched on unilaterally)
4. Editor smoke tests: change phone number in settings → live in one build; create a BlogPost end-to-end; upload image ≤2000px; attempt an invalid entry → build fails, site stays up, rollback works
5. Client walkthrough ⚑ + one-page cheat sheet (edit, publish, undo)

**Gate:** the client herself successfully edits text, swaps an image, changes a phone number, and publishes a draft article on a screen-share — without touching code.

## M8 — SEO, analytics, hardening (Day 12–13)

1. JSON-LD all page types → Rich Results test passes; OG images per journey
2. `_redirects` file ready; robots + sitemap submitted to Search Console; GA4 events verified in DebugView; Meta Pixel via GTM verified
3. Security headers (`_headers`): CSP (Partytown-compatible), HSTS, X-Content-Type-Options, Referrer-Policy
4. Full QA matrix: iOS Safari, Android Chrome, desktop Chrome/Safari/Firefox, 360→1440px; keyboard + screen-reader pass on home, one journey, form
5. Content proof pass: no lorem, no placeholder numbers, GSA disclosure present on all train pages, consent-flagged testimonials only

**Gate:** PRD §16 acceptance checklist — every box.

## M9 — Launch (Day 14)

1. Custom domain on Cloudflare Pages + www redirect; SSL verified
2. Production siteSettings final check (real GTM ID, real numbers)
3. Deploy → immediate smoke test: lead form, WA link, call link, PDF gate, 404, rollback drill (deploy, roll back, redeploy — practiced once for real)
4. Search Console: request indexing on key pages; monitor Core Web Vitals field data from day 1

## M10 — Handover & steady state

- Client owns: Tina (content), GTM (tags), GA4 (numbers), inbox+Sheet (leads), Cloudflare rollback button (undo)
- Agency/Claude Code owns: anything structural (new page types, redesigns, Phase 2 features)
- Documented cadences: ~2 articles/month (client via Tina); annual: domain renewal, PoW season/schedule refresh (risk register item), font licence check; quarterly: Lighthouse + Search Console review
- Phase 2 backlog seeded from PRD §13 (journeys filter, video testimonials, Instagram feed, nurture emails, CRM, new itineraries)

---

### Standing rules during execution

- One milestone per PR where practical; preview URL in every PR description
- Never merge a failing build; never edit `main` directly after M4
- Any scope change → update PRD version + this runbook before building it
- If a free-tier limit is hit unexpectedly, stop and consult (documented hedges: Sveltia, Cloudinary, Web3Forms)
