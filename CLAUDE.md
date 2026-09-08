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
5. **Brand tokens only.** Colors: crimson `#C3163A` (CTAs), burgundy `#741238`, deep plum `#452B5E` (dark sections/footer), yellow `#E5C745` (accents — ONLY on plum/burgundy backgrounds, never on off-white), off-white `#F7F5F6` (base). No other colors. Logo: approved artwork only, never redrawn/stretched. Lotus glyph = highlight bullets sitewide (never ✦ or generic checks).
   **Logo usage rule.** The wordmark inside the logo is **white**. `logo-white.svg` must never sit directly on off-white or white — in light contexts (the default header) it goes inside its brand badge or a plum/crimson container per the brand kit. When processing logo artwork, remove background nodes **structurally** (the full-canvas rect/path); never colour-key, which would delete the white wordmark. Never retrace or simplify paths.
6. **Variant B disclosure.** Every luxury-train page renders the operator/GSA disclosure and links to `/booking-terms/`.
   **Operator tariffs are never published — permanent rule, not a pending decision.** All three train source docs (Palace on Wheels, Golden Chariot, Deccan Odyssey) carry published USD tariffs; every figure is suppressed and cabin cards render "Enquire for pricing". A USD/price-pattern grep across the three train pages is a permanent regression check from the M5 gate onward. Departure schedules render generically ("Seasonal departures — enquire for current dates") until the schedule half of PRD Open Question #15 resolves.
7. **Copy voice.** Warm, editorial, unhurried. No exclamation-mark selling, no "BOOK NOW", no countdown/discount UI. Benchmark: the Kerala Houseboat and Western & Southern India itinerary intros.
8. **Schema safety.** All content collections Zod-validated. A malformed CMS entry must fail the build loudly — never render a broken page silently.

## Content collections (`src/content/`)

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
