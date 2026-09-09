# CLAUDE.md — India Visit Website

Operational rules for building and maintaining this project. Read CONTEXT.md for business background and EXECUTION_RUNBOOK.md for build order. Where documents conflict: CLAUDE.md wins on code rules, the PRD wins on scope, the Itinerary Page Template Specification wins on itinerary page structure.

## Project

Portfolio + lead-generation website for **India Visit**, a travel consultancy (20 yrs). Static site. No booking engine, no payments, no user accounts. Every conversion path ends in an enquiry: form, WhatsApp, or call.

## Locked tech stack — do not substitute

- **Astro** (static output only — never enable SSR/hybrid) + **Tailwind CSS v4** (CSS-first: brand tokens defined once in `src/styles/tokens.css` and exposed through `@theme` — there is no `tailwind.config.mjs`)
- **TinaCMS** (Tina Cloud free tier) with **repo-based media** (`/public/uploads/`) — never Tina Cloud hosted assets
- **Cloudflare Pages** hosting; **Cloudflare Pages Functions** for the form endpoint only
- **Resend** (email notify) + Google Sheet webhook for leads; **Turnstile** + honeypot anti-spam
- **GTM loaded via Partytown** — no direct GA4/Meta script tags anywhere in code, ever
- **GSAP + ScrollTrigger** (lazy-loaded, homepage only) + Astro View Transitions + CSS for all other motion
- Fonts self-hosted, subset, `font-display: swap`: display face behind the `--font-display` token, **Inter** (body). **Agrandir Grand is not licensed yet** — `--font-display` currently resolves to **Archivo Expanded** (free, Google Fonts, self-hosted). The swap to Agrandir must stay a one-token-plus-font-file change: never name a display family directly in a component, utility or `@theme` entry — always go through `--font-display`.

Rejected (do not reintroduce, reasons in CONTEXT.md): WordPress, Strapi, Next.js, Vercel, Tina hosted media, client-side CMS fetching.

## Non-negotiable invariants

1. **Nothing user-editable is hardcoded.** Phone, WhatsApp number + prefill text, email, address, social URLs, CTA link targets, GTM container ID, Meta Pixel ID → all read from the `siteSettings` singleton. If you find yourself typing a phone number in a component, stop and wire it to settings.
   Settings also carry the **nullable trust fields** — `foundingYear`, `travellerCount`, `destinationCount`, `aggregateRating`: `null` means the stat is not rendered at all (never publish an unverified number, never a placeholder). CounterStat must render 2–4 stats gracefully; the launch set is "20+ Years" and "24/7 On-Trip Support". `showPrices` (boolean, default `false`) globally gates the optional per-journey `priceFrom` — the field exists so the pricing decision stays reversible, and nothing renders until it flips.
2. **Visitor path is static-only.** No runtime fetches to Tina/GitHub/any CMS API from public pages. Tina admin lives at `/admin` only.
3. **LCP protection.** Hero image: `fetchpriority="high"`, preloaded, AVIF/WebP via `astro:assets`, and **never entrance-animated** — it paints at full opacity immediately. No render-blocking JS. Third-party scripts only through Partytown. Working target **LCP ≤ 1.5s**; 2.5s is merely the Core Web Vitals pass mark, not the goal.
4. **Animation rules (PRD §9.4).** `transform`/`opacity` only. One easing: `cubic-bezier(0.22, 1, 0.36, 1)`. Durations 200–600ms (Ken Burns hero exempt). Everything inside `@media (prefers-reduced-motion: no-preference)`. Total animation JS ≤ 40KB gzipped, homepage only; inner pages CSS + View Transitions only.
   **Default for all section entrances sitewide — homepage included — is CSS + IntersectionObserver.** GSAP + ScrollTrigger is reserved for at most 1–2 homepage set pieces, lazy-loaded below the fold; the library alone is ~35–38KB gzipped, so it consumes nearly the whole budget. If a design review wants more motion, the budget is raised deliberately at that review — never silently exceeded.
5. **Brand tokens only.** Colors: crimson `#C3163A` (CTAs), burgundy `#741238`, deep plum `#452B5E` (rare dark bands/footer), yellow `#E5C745` (accents — ONLY on plum/burgundy backgrounds, never on a light surface), off-white `#F7F5F6` (secondary surface), plus ink `#1A1523` (plum-black) for text on light. No other colors. Logo: approved artwork only, never redrawn/stretched. Lotus glyph = highlight bullets sitewide (never ✦ or generic checks).

   ### Design direction — white-canvas premium (locked)

   The school to translate — **not clone** — is `staralliance.com` (grid discipline, type scale, restraint) plus `airindia.com` (warm premium, photography-led, deep red as accent). Our voice stays warm; theirs does not come with it.

   **Surfaces.** Pure **white `#FFFFFF` is the primary background sitewide.** Off-white `#F7F5F6` is *demoted to secondary*: card fills, alternate sections, form fields — a whisper of contrast, never the base. Deep-plum dark bands are **rare and intentional**: the footer, How-It-Works, one homepage moment, and ConvertBand. Everything else lives on white.

   **Typography — type IS the design.** Display goes big and confident: hero H1 `clamp(2.5rem, 6vw, 4.5rem)`, section H2 `clamp(1.75rem, 3.5vw, 2.75rem)`, tight leading (1.05–1.15), ink `#1A1523` on white — never pure black. Inter body 16–18px, line-height 1.6–1.7, measure capped ~68ch. Section rhythm 96–128px vertical padding desktop, 56–72px mobile. **When in doubt add space, not decoration.**

   **Colour application — red as punctuation.** Crimson is for CTAs, active states and small accents (tags, links, glyph highlights) and **never floods a section**. Burgundy handles hover/pressed states, fine rules and quiet details. Plum is the rare dark bands and footer, with white text. Yellow stays in micro-doses on plum/burgundy only. Net effect: mostly white-and-ink pages where crimson draws the eye to **exactly one action per viewport**.

   **Components.** Cards: white or off-white fill, 12–16px radius, hairline border (plum at ~8% opacity), soft shadow on hover only. Buttons: solid crimson primary with white text, ghost/outline ink secondary, subtle 2px hover lift per the motion spec. Nav: white with a hairline bottom border, ink links, crimson Plan-My-Trip button; may sit transparent over a hero photo and solidify to white on scroll. Photography: full-bleed heroes with a soft plum gradient **only at the text zone**; elsewhere images sit in clean rounded frames on white, gallery-style.

   **Reference captures live in `docs/references/`** (staralliance.com and airindia.com, desktop + mobile full-page). Study them before building each page and take **properties, not pixels**: the type scale and its confidence, one-idea-per-viewport density, colour-as-punctuation, photography treatment (full-bleed heroes, large calm image blocks on white), thin quiet nav, generous section breathing room. Page *structure* always comes from PAGE_TEMPLATES.

   **Do not import from the references:** their layouts, nav structures, booking-widget UI, mega-nav complexity, carousel-heavy homepages, content patterns, or Star Alliance's cool corporate tone. The motion spec, lotus bullets, AA contrast and LCP protections all apply unchanged on top of this.

   **There is no mockup track.** The client cancelled the separate design-mockup pass: the M4 preview URL is the design review. Treat any doc language about "approved mockups" as stale.
   **Logo — raster, by owner-approved exception.** The delivered `docs/brand/india_visit_logo.svg` contains no vector artwork (it is one 5910x4128 PNG embedded twice inside an SVG wrapper). The client, who authored the brand kit, approved using that raster rather than waiting for vector files. Source of truth: the badge extracted from it by **silhouette mask** — chroma locates the badge's outer boundary, its interior holes are filled (this is what preserves the WHITE wordmark), and the filled silhouette becomes the alpha. **Colour-keying is forbidden** — it would delete the wordmark. Regenerate with `npm run brand:logo`; provenance in `docs/brand/processed/PROVENANCE.md`. **Swapping to true SVG later is a drop-in replacement:** replace `src/assets/brand/logo-badge.png` and adjust the `<Picture>` in `Logo.astro`.
   The extracted badge carries its own crimson→plum ground, so it may sit directly on off-white. A bare **white** wordmark never may — in light contexts it needs its plum/crimson container. Never retrace, redraw or restyle the badge.
   **Lotus glyph — extracted vector, APPROVED.** No standalone vector file was supplied, and the brand's author (BugCure) authorised a faithful recreation. In the event none was needed: page 7 of the brand kit PDF draws the lotus as Bézier paths filled `.4549 .0706 .2196` (= `#741238`), so `npm run brand:lotus` interprets that content stream and copies the control points **verbatim** — the glyph is geometrically identical to the original, not an approximation. Single path, `fill="currentColor"`, so one file inherits crimson/plum/white by context. It is the sitewide highlight-bullet mark and the favicon source. If a future mark ever does need recreating, the same conditions apply: trace faithfully, single colour, and get client approval against a side-by-side before wiring it in.
6. **Variant B disclosure.** Every luxury-train page renders the operator/GSA disclosure and links to `/booking-terms/`.
   **Operator tariffs are never published — permanent rule, not a pending decision.** All three train source docs (Palace on Wheels, Golden Chariot, Deccan Odyssey) carry published USD tariffs; every figure is suppressed and cabin cards render "Enquire for pricing". A USD/price-pattern grep across the three train pages is a permanent regression check from the M5 gate onward. Departure schedules render generically ("Seasonal departures — enquire for current dates") until the schedule half of PRD Open Question #15 resolves.
7. **Copy voice.** Warm, editorial, unhurried. No exclamation-mark selling, no "BOOK NOW", no countdown/discount UI. Benchmark: the Kerala Houseboat and Western & Southern India itinerary intros.
8. **Schema safety.** All content collections Zod-validated. A malformed CMS entry must fail the build loudly — never render a broken page silently.

## Content collections (`src/content/`)

**Placeholder flags in JSON.** JSON cannot carry comments, so any data collection holding placeholder values carries a **`_dummyDataFlags`** array listing them, one human-readable entry per field (`"phone — DUMMY DATA, real number due in M5"`). `grep -rn "DUMMY DATA" src/content/` finds them and `npm run audit:hardcoded` reports the count; the array is emptied only when every listed field holds a real value. Markdown collections use ordinary `#` frontmatter comments instead.

**Field naming: camelCase everywhere** — in the Zod schemas, the content files and `tina/config.ts`. The Template Spec §4 listing is the field *inventory*, not the field *names*; its snake_case is illustrative only (`hero_image` → `heroImage`, `glance_rows` → `glanceRows`, `operator_disclosure` → `operatorDisclosure`).

| Collection | Notes |
|---|---|
| `journeys` | **20 entries at launch: 17 Variant A + 3 Variant B.** Full field list = Template Spec §4. `variant: 'A' \| 'B'` gates conditional sections (cabins, departures, bookingSteps, policies, operatorDisclosure required when B — `bookingSteps` is Variant B only, there is no A stepper at launch). Optional `priceFrom` gated by `siteSettings.showPrices`; `pace` and `idealFor` required |
| `destinations` | name, heroImage, intro, practicalNotes[], faq[], relatedJourneys (auto by tag + manual override) |
| `posts` | title, category ('planning-visas' \| 'best-time' \| 'guides'), heroImage, publishDate, updatedDate, body (rich), embeddedJourneys[] (≥1 required), faq[] |
| `testimonials` | name, origin, tripRef, quote, photo?, consentConfirmed (boolean, must be true to render) |
| `siteSettings` (singleton) | see invariant #1 |

## Directory conventions

```
src/
  components/      # PascalCase .astro; islands only where interactive (Counter.astro + tiny script)
  layouts/         # Base.astro (SEO/meta/GTM-Partytown/fonts), Page.astro
  pages/           # file-based routes; journeys/[slug].astro renders BOTH variants from one template
  content/         # collections above (markdown/JSON)
  styles/          # tokens.css (brand custom props), global.css
public/uploads/    # Tina repo-based media (client uploads land here)
functions/         # Cloudflare Pages Functions: api/lead.ts
tina/              # config.ts — schema must mirror src/content zod schemas exactly
```

## URL structure (locked for SEO)

`/` · `/destinations/{slug}/` · `/journeys/` · `/journeys/{slug}/` · `/luxury-trains/` (landing) · `/corporate/` · `/about/` · `/reviews/` · `/travel-guide/` · `/travel-guide/{slug}/` · `/plan-my-trip/` · `/privacy/` `/terms/` `/cancellation/` `/booking-terms/`

**Destination slugs (locked):** `/destinations/` + `rajasthan-golden-triangle` ("Rajasthan & the Golden Triangle") · `kerala` ("Kerala & the Backwaters") · `south-west-india` ("South & West India Heritage") · `ladakh` ("Himalayas — Leh & Ladakh") · `north-east-india` ("North East India") · `wildlife` ("Wildlife Journeys") · `bhutan` · `bali` · `vietnam` — nine pages. The homepage strip shows 7 curated tiles (short labels: Rajasthan, Kerala, Ladakh, North East, Bhutan, Bali, Vietnam) plus "View all destinations"; the strip is intentionally not the full list.

**There is no `/contact/` route** — it 301s to `/plan-my-trip/` (added to `_redirects` in M8).

**Header nav (locked order):** Destinations ▾ · Journeys · Luxury Trains · Corporate · Travel Guide · About · Reviews · **[Plan My Trip]** (crimson button). At 1024–1200px only, About + Reviews collapse into a "More ▾" group.

Trailing slashes on. Never change a published URL without a 301 in `_redirects`.

## SEO requirements per page type

- Unique title/meta description from frontmatter; OG image (per-journey hero)
- JSON-LD: `TravelAgency` (global), `TouristTrip` (journeys), `Article` + author (posts), `FAQPage` (where faq[] present), `BreadcrumbList` (all inner pages)
- Auto sitemap + robots; canonical on every page

## Definition of done (any task)

- `astro build` passes; no TS/Zod errors
- Lighthouse (mobile, throttled): Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95; LCP ≤ 1.5s on the changed pages
  *(Three distinct Performance bars, deliberately: **≥ 95** on the M1 empty-page gate · **≥ 90** per-task definition of done · **≥ 85** launch floor in PRD §16.)*
- Template Spec §6 consistency checklist passes for any itinerary page touched
- New editable strings wired to CMS, not hardcoded (invariant #1 audit)
- Works 360px–1440px; keyboard navigable; visible focus states
- Commit messages: `feat|fix|content|chore: short description`

## Commands

```bash
npm run dev        # plain `astro dev` until M7; becomes tinacms dev -c "astro dev" when Tina lands
npm run build      # production build (must pass before any push to main)
npm run preview    # verify built output locally
```

Deploy = push to `main` (Cloudflare Pages auto-builds). Feature work on branches → PR → preview URL → merge.
