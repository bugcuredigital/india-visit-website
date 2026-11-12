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

### TinaCMS — how it is wired (M7)

- **`tina/config.ts` mirrors `src/content.config.ts` field-for-field, and Zod stays the validator.** Tina is the editor; a save that breaks a rule fails the *build* loudly and the last good deploy stays live. Constraints Tina cannot express (Variant B modules required on B, glance rows = days) are stated in field descriptions.
- **Forms-based editing for every collection, no visual editing.** Tina's contextual editing on Astro now requires `output: 'server'`; the stack is static-only with no exceptions, so the admin at `/admin` is the editor. The M7 gate (edit text, swap an image, change a number, publish a draft article — without touching code) is met through it.
- **Media stays in `/public/uploads/`** (repo-based, as locked) **and images stay on `astro:assets`** (invariant #3). Verified by experiment: a content entry referencing `../../../public/uploads/<file>` builds the full AVIF/WebP set. Every image field carries the same `ui.parse`/`ui.format` pair — the editor sees `/uploads/<file>`, the file holds `../../../public/uploads/<file>`; `src/assets` paths (the TEMP-PHOTO set) pass through untouched. These mappers are **string-guarded and array-aware**: Tina hands them the raw value, which for a list field is the array, and an unguarded `.startsWith` took the whole journey form down in the first smoke test.
- **Reference arrays are plain slug lists** (`related`, `relatedJourneys`, `embeddedJourneys`): Tina cannot list a reference field, and wrapping one in an object list saved `[{}]`, which Zod refused. The single `tripRef` on testimonials is a real reference with a path↔id mapping.
- **Bodies are plain textareas, not rich-text.** Rich-text round-trips through an MDX AST and can re-serialise the prose; a textarea gives it back byte for byte.
- **A CMS save rewrites a file's frontmatter** — YAML comments are dropped and strings requoted. That is expected: every flag that matters is a *field* (`provisional`, `placeholder`, `draft`, `_dummyDataFlags`), and TEMP-PHOTO tracking is by filename. Do not put anything load-bearing in a frontmatter comment.
- **`npm run build` is `scripts/build.mjs`:** it runs `tinacms build` only when `TINA_PUBLIC_CLIENT_ID` and `TINA_TOKEN` are set, then `astro build`. Adding those two variables in Cloudflare Pages is what switches the admin on in production. `npm run dev` is `tinacms dev -c "astro dev"`; `dev:astro` is the plain server.
- **Committed:** `tina/config.ts`, `tina/tina-lock.json`. **Ignored:** `tina/__generated__/`, `public/admin/`.

## Skill precedence

The globally installed **`ui-ux-pro-max`** skill does not get to design this site.

- **Overridden here:** its design-system generation — palette, typography, styles, patterns. The locked brand system and design direction in this file win outright. A general-purpose generator will propose a coherent palette and type scale of its own, and adopting any part of it would quietly break a brand system the client authored and has signed off in stages.
- **Usable here:** its **UX guidelines, accessibility rules and anti-pattern checklists**, as a *supplementary review lens* — a second opinion on flows, states, affordances and WCAG issues, applied on top of the locked design rather than in place of it.

**Taken from it so far, under that lens:** the **icon vocabulary** for the trust bar — the skill's curated **Phosphor** set (MIT). The client authorised this explicitly in design revision round 2. Glyph choice is a UX affordance question, not a brand-system question, and the icons are rendered in **our** colours at **our** weight. Extract them with `npm run brand:icons`; provenance in `docs/brand/processed/PHOSPHOR-PROVENANCE.md`. There is no `@phosphor-icons/*` dependency and there is not going to be one: the paths are copied into the repo, so the stack stays locked.

General shape of the rule: where a global skill and this project's locked specifications disagree, the specifications win. Treat the skill as a reviewer, never as an art director.

## Non-negotiable invariants

1. **Nothing user-editable is hardcoded.** Phone, WhatsApp number + prefill text, email, address, social URLs, CTA link targets, GTM container ID, Meta Pixel ID → all read from the `siteSettings` singleton. If you find yourself typing a phone number in a component, stop and wire it to settings.
   Settings also carry the **nullable trust fields** — `foundingYear`, `travellerCount`, `destinationCount`, `aggregateRating`: `null` means the stat is not rendered at all (never publish an unverified number, never a placeholder).
   **The trust bar is always exactly four stats**, so it never changes shape as open questions close. First and last are fixed — years of experience, and the support promise. The two middle slots prefer the client's verified figures (`travellerCount`, `destinationCount`) and otherwise fall back to counts **derived from our own catalogue**: the number of published journeys, and the length of the locked destination list. That fallback is what makes four stats legitimate while PRD Open Question #2 is open — a number we compute cannot be an unverified claim and cannot go stale. It reads "2 Curated Journeys" until M5 seeds the catalogue, then 20, with nobody editing anything. `showPrices` (boolean, default `false`) globally gates the optional per-journey `priceFrom` — the field exists so the pricing decision stays reversible, and nothing renders until it flips.
2. **Visitor path is static-only.** No runtime fetches to Tina/GitHub/any CMS API from public pages. Tina admin lives at `/admin` only.
3. **LCP protection.** Hero image: `fetchpriority="high"`, preloaded, AVIF/WebP via `astro:assets`, and **never entrance-animated** — it paints at full opacity immediately. No render-blocking JS. Third-party scripts only through Partytown. **Working target LCP ≤ 2.0s (Lighthouse mobile, simulated); hard ceiling 2.5s (Core Web Vitals pass mark).** Revised from 1.5s in M4: that figure was set while every hero was a flat placeholder graphic, and real photography costs roughly 0.7s of simulated LCP on its own. 2.0s is the correct trade for a photography-led premium site once the code-side levers are in place. **The M8 WebPageTest 4G Moto-class run is the field verdict** — Lighthouse's simulation is the working proxy, not the truth.
   **Homepage exception: ≤ 2.2s**, granted for the full-screen video hero (PRD v1.5). 2.5s stays the hard ceiling everywhere, this page included.
   **Video is never in the critical path — no exceptions.** The homepage hero's **poster is the LCP element** and behaves exactly as a photographic hero does. The `<video>` ships with **no sources and `preload="none"`**; sources are attached only **after `window.load`**, on an idle callback, and it fades in over the poster on opacity alone. **`prefers-reduced-motion: reduce` and `Save-Data: on` get the poster and nothing else** — for them the video is never fetched at all. If the video ever moves homepage LCP past 2.2s, the video comes out: the exception buys the full-screen hero, not the video.
4. **Animation rules (PRD §9.4).** `transform`/`opacity` only. One easing: `cubic-bezier(0.22, 1, 0.36, 1)`. Durations 200–600ms (Ken Burns hero exempt). Everything inside `@media (prefers-reduced-motion: no-preference)`. Total animation JS ≤ 40KB gzipped, homepage only; inner pages CSS + View Transitions only.
   **Default for all section entrances sitewide — homepage included — is CSS + IntersectionObserver.** GSAP + ScrollTrigger is reserved for at most 1–2 homepage set pieces, lazy-loaded below the fold; the library alone is ~35–38KB gzipped, so it consumes nearly the whole budget. If a design review wants more motion, the budget is raised deliberately at that review — never silently exceeded.
5. **Brand tokens only.** Colors: crimson `#C3163A` (CTAs), burgundy `#741238`, deep plum `#452B5E` (rare dark bands/footer), yellow `#E5C745` (accents — ONLY on plum/burgundy backgrounds, never on a light surface), off-white `#F7F5F6` (secondary surface), plus ink `#1A1523` (plum-black) for text on light. No other colors. Logo: approved artwork only, never redrawn/stretched. Lotus glyph = highlight bullets sitewide (never ✦ or generic checks).

   ### Design direction — white-canvas premium (locked)

   The school to translate — **not clone** — is `staralliance.com` (grid discipline, type scale, restraint) plus `airindia.com` (warm premium, photography-led, deep red as accent). Our voice stays warm; theirs does not come with it.

   **Surfaces.** Pure **white `#FFFFFF` is the primary background sitewide.** Off-white `#F7F5F6` is *demoted to secondary*: card fills, alternate sections, form fields — a whisper of contrast, never the base. Dark bands are **rare and intentional**. Everything else lives on white.

   **Which dark — rebalanced in design round 3.** The owner's note was that deep plum "reads blue and kills the warmth", and it was correct: plum was carrying the footer, every ConvertBand, the train cards and How-It-Works, so the cool end of a warm brand was doing most of the visible work. The hierarchy is now:

   | Role | Colour | Where |
   |---|---|---|
   | Primary dark ground | **burgundy `#741238`** | ConvertBand, the homepage corporate band, the travel-guide newsletter band, the corporate "how we work" band, policy page headers |
   | The page's end | **ink `#1A1523`** | the footer, and the corporate hero. A burgundy footer directly under a burgundy ConvertBand merges into one slab half a screen tall |
   | Punctuation | **crimson `#C3163A`** | unchanged: CTAs, active states, small accents |
   | One deliberate moment | **plum `#452B5E`** | at most one band per page — How It Works on the homepage — plus fine details. Demoted, not deleted |
   | Micro-doses | **yellow `#E5C745`** | unchanged, and still only on burgundy / plum / ink |

   The neutrals were rebased with it: `--color-ink-muted`, `--color-hairline` and `--color-on-dark-muted` were plum-derived and are now burgundy-derived, because the muted text and the hairlines were the quiet half of the same problem. Every pair clears AA with room (`ink-muted` is 7.25:1 on white, `on-dark-muted` 7.2:1 on burgundy). **Any change of ground is re-verified**, not assumed.

   **Typography — type IS the design.** Display goes big and confident: hero H1 `clamp(2.5rem, 6vw, 4.5rem)`, section H2 `clamp(1.75rem, 3.5vw, 2.75rem)`, tight leading (1.05–1.15), ink `#1A1523` on white — never pure black. Inter body 16–18px, line-height 1.6–1.7, measure capped ~68ch. Section rhythm 96–128px vertical padding desktop, 56–72px mobile. **When in doubt add space, not decoration.**

   **Colour application — red as punctuation.** Crimson is for CTAs, active states and small accents (tags, links, glyph highlights) and **never floods a section**. Burgundy is the dark ground *and* handles hover/pressed states, fine rules and quiet details. Yellow stays in micro-doses on dark only. Net effect: mostly white-and-ink pages where crimson draws the eye to **exactly one action per viewport**.

   **Colour on a card is a HOVER state, not a rest state** (round 3). Every listing card is white at rest; the card footer transitions to the burgundy treatment on hover *and* on `:focus-within`, so a keyboard user gets the same affordance. Variant B (train) cards used to carry a permanent plum ground; a permanent burgundy ground would have been the same mistake in a warmer colour. What distinguishes a train is the **"Fixed Departures" badge**, which survives being looked at by someone who cannot see colour.

   **Two rules approved at the round-3 review, recorded as design rules:**
   - **Gradients over photographs are ink; solid bands are burgundy.** A coloured wash over a picture tints it (the trains banner recoloured with everything else became a red panel); a near-black wash only darkens. So every overlay on a photograph or video — hero, banner, card image — is ink, and every solid dark ground is burgundy.
   - **The footer is ink, never burgundy.** Every page ends on a burgundy ConvertBand; a burgundy footer under it merges the two into one slab half a screen tall. Ink reads as the end of the page.

   **Lotus watermarks on dark bands** (round 3). Every dark band carries the extracted lotus vector: oversized, ~6% opacity, deliberately cropped by the band edge, brand-kit cover style. On hover over the section it drifts — transform-only, 600ms, inside `prefers-reduced-motion: no-preference`. Decorative and `aria-hidden`. Use `<BandWatermark>` on a section carrying `band-watermarked`; the element is marked `data-allow-clip` because being clipped is the design.

   **Components.** Cards: white fill, 12–16px radius, hairline border (burgundy at ~12% opacity), soft shadow on hover only. **One journey-card treatment sitewide** (round 3) — image, duration pill, title, "View journey →" — with no route line and no signature-feature line anywhere; the homepage and the archive render the identical card. Buttons: solid crimson primary with white text, ghost/outline ink secondary, subtle 2px hover lift per the motion spec. **Button radius is LOCKED to pill** (`--btn-radius: 9999px`, settled design round 3); it stays a token so the shape of every CTA is one edit, but the A/B is over and the losing option is gone from the demo page. Nav: white with a hairline bottom border, ink links, crimson Plan-My-Trip button; may sit transparent over a hero photo and solidify to white on scroll. Photography: full-bleed heroes under one continuous ink wash (see **Hero gradients** below); elsewhere images sit in clean rounded frames on white, gallery-style.

   **Reference captures live in `docs/references/`** (staralliance.com and airindia.com, desktop + mobile full-page). Study them before building each page and take **properties, not pixels**: the type scale and its confidence, one-idea-per-viewport density, colour-as-punctuation, photography treatment (full-bleed heroes, large calm image blocks on white), thin quiet nav, generous section breathing room. Page *structure* always comes from PAGE_TEMPLATES.

   **Imagery — placeholders are quiet, never loud.** An unphotographed slot renders as a neutral warm grey `#ECE9E6` block with a hairline border and a small centred label. **Never a brand gradient, and never a decorative pattern** — the first M4 homepage filled every image slot with crimson-to-plum gradients under a diagonal stripe pattern, and they dominated the page so completely that the design register could not be assessed at all. A placeholder says "a photograph goes here" and then gets out of the way. Regenerate with `npm run brand:placeholders`. The diagonal stripe pattern is removed from all heroes and banners sitewide and is not part of this brand's language.

   **TEMP-PHOTO — temporary design-review photography.** While the client archive is outstanding, real photography is sourced from Unsplash (its licence permits commercial use with no attribution required; Unsplash+ `premium_photo-*` files are excluded, being a paid licence we do not hold), graded on one shared warm curve so the set reads as a collection rather than a stock grid. Every file is named `TEMP-PHOTO-*` so `grep -rn "TEMP-PHOTO" src/` finds every reference and `npm run audit:hardcoded` counts them. Regenerate with `npm run temp:photos`; provenance in `docs/brand/processed/TEMP-PHOTO-PROVENANCE.md`. **All of it is replaced by the client's own archive in M5.**

   **TEMP-VIDEO — temporary design-review footage.** The homepage hero video slot is filled, until the client supplies their own clip, by one stock loop from **Pexels** (its licence permits commercial use with no attribution required). The file and its poster are both named `TEMP-VIDEO-*` so `grep -rn "TEMP-VIDEO" src/ public/` finds every reference and `npm run audit:hardcoded` counts them. Regenerate with `npm run temp:video`; provenance in `docs/brand/processed/TEMP-VIDEO-PROVENANCE.md`. **Replaced by the client's own footage through the CMS — a content change with zero code edits.** The owner's style reference for this video is recorded in `docs/design/references/README.md` and is **human-viewing only**: never fetch, download or embed it, and a YouTube embed is never acceptable as a hero background (player chrome, third-party branding, a third-party script in the critical path).

**Hero gradients — ONE continuous wash, and it is INK** (design round 3, superseding the text-zone rule and the separate video veil). Every hero — photograph or video, 100svh or 34svh — carries the same gradient: anchored to the bottom, firm for `--scrim-firm`, then feathered to nothing over `--scrim-feather`. Three properties are non-negotiable:
   - **No perceptible boundary.** The previous scrim was an element that *began* five rem above the copy, which put a visible horizontal seam across the Golden Triangle hero — yellow sky, a hard line, dark below. Eleven stops feathered over the whole distance mean there is no position at which the rate of change jumps.
   - **Ink, not plum.** Plum at 90% over a sunrise is a purple panel with a building in it. A near-black wash darkens without tinting, so the photograph stays the colour it was photographed. The overlay header's own scrim is ink for the same reason: two washes in two hues over one photograph is how you get a seam even when neither gradient has an edge.
   - **Lengths, not percentages.** A percentage curve cannot know where the copy is: the same stops that gave the homepage 11:1 gave a breadcrumb on a 55svh destination hero 3.0:1. `--scrim-firm`/`--scrim-feather` are per hero height, because the height of a copy column is a length.

   The gradient is deliberately **lighter** than what it replaced — the photo must read as a photo, not a tinted panel — which means legibility is verified rather than assumed. `npm run check:hero-contrast` measures the lightest ground pixel behind every run of text on **every** hero page, at mobile and desktop, and it is the arbiter. Any text that cannot be covered by a gradient the client would accept gets **its own opaque ground** instead: that is why the trip-type tag, the duration badges and the route strip are pills. An opaque ground makes contrast a property of the design rather than of whichever photograph an editor uploads.

   **Image-slot convention (every template).** Each image slot renders the neutral grey placeholder or a TEMP-PHOTO stand-in — never a brand gradient — is **CMS-fed** so the M5 photo swap is content-only with zero code edits, and has an aspect ratio fixed by the template so a photograph swap can never reflow the page.

   **Do not import from the references:** their layouts, nav structures, booking-widget UI, mega-nav complexity, carousel-heavy homepages, content patterns, or Star Alliance's cool corporate tone. The motion spec, lotus bullets, AA contrast and LCP protections all apply unchanged on top of this.

   **There is no mockup track.** The client cancelled the separate design-mockup pass: the M4 preview URL is the design review. Treat any doc language about "approved mockups" as stale.
   **Logo — raster, by owner-approved exception.** The delivered `docs/brand/india_visit_logo.svg` contains no vector artwork (it is one 5910x4128 PNG embedded twice inside an SVG wrapper). The client, who authored the brand kit, approved using that raster rather than waiting for vector files. Source of truth: the badge extracted from it by **silhouette mask** — chroma locates the badge's outer boundary, its interior holes are filled (this is what preserves the WHITE wordmark), and the filled silhouette becomes the alpha. **Colour-keying is forbidden** — it would delete the wordmark. Regenerate with `npm run brand:logo`; provenance in `docs/brand/processed/PROVENANCE.md`. **Swapping to true SVG later is a drop-in replacement:** replace `src/assets/brand/logo-badge.png` and adjust the `<Picture>` in `Logo.astro`.
   The extracted badge carries its own crimson→plum ground, so it may sit directly on off-white. A bare **white** wordmark never may — in light contexts it needs its plum/crimson container. Never retrace, redraw or restyle the badge.
   **Lotus glyph — extracted vector, APPROVED.** No standalone vector file was supplied, and the brand's author (BugCure) authorised a faithful recreation. In the event none was needed: page 7 of the brand kit PDF draws the lotus as Bézier paths filled `.4549 .0706 .2196` (= `#741238`), so `npm run brand:lotus` interprets that content stream and copies the control points **verbatim** — the glyph is geometrically identical to the original, not an approximation. Single path, `fill="currentColor"`, so one file inherits crimson/plum/white by context. It is the sitewide highlight-bullet mark and the favicon source. If a future mark ever does need recreating, the same conditions apply: trace faithfully, single colour, and get client approval against a side-by-side before wiring it in.
6. **Variant B disclosure.** Every luxury-train page renders the operator/GSA disclosure and links to `/booking-terms/`.
   **Operator tariffs are never published — permanent rule, not a pending decision.** All three train source docs (Palace on Wheels, Golden Chariot, Deccan Odyssey) carry published USD tariffs; every figure is suppressed and cabin cards render "Enquire for pricing". A USD/price-pattern grep across the three train pages is a permanent regression check from the M5 gate onward. Departure schedules render generically ("Seasonal departures — enquire for current dates") until the schedule half of PRD Open Question #15 resolves.
7. **Copy voice.** Warm, editorial, unhurried. No exclamation-mark selling, no "BOOK NOW", no countdown/discount UI. Benchmark: the Kerala Houseboat and Western & Southern India itinerary intros.
8. **Schema safety.** All content collections Zod-validated. A malformed CMS entry must fail the build loudly — never render a broken page silently.
9. **Word control — no invented copy goes live-looking.** (Design round 3, standing rule.) Every user-facing string is one of three things:
   - **sourced** — from the client's documents, the PRD, PAGE_TEMPLATES, the Template Spec, or an explicit client instruction;
   - **registered** — listed in `docs/COPY_REGISTER.md` with its page and section, marked `DRAFT`, awaiting the client's approval; or
   - **obviously a placeholder** — neutral, visibly provisional, and **SHORT**. One quiet italic line, never a paragraph, and never styled as though it were the content it stands in for.

   The rule exists because the testimonial cards rendered a full paragraph of internal explanation about why no reviews existed yet, at quote size, under an invented guest name. The client reads that as the agency putting words in their mouth, and they are right. Placeholder testimonials now carry **no name, no origin and no quote at all** — the schema refuses those fields when `placeholder` is true — and render `Guest review coming soon` with the lotus. A placeholder is never emitted as structured data: a fabricated `Review` in JSON-LD is republished by aggregators and cannot be taken back.

   `docs/COPY_REGISTER.md` is kept current whenever new copy is written. It is the file the client approves or strikes in bulk.
10. **Image control — every image is a CMS field.** (Design round 3, standing rule.) Every image and video a visitor sees must arrive through a content-collection field, so the M5 photo swap and every later change is content, not code. Collection pages read their own entry; a fixed page with no collection of its own reads `siteSettings.pageHeroes`. **Exempt:** inline decorative SVG (the lotus, the Phosphor icons, the 404 road), the logo, and the neutral grey placeholders that render when a nullable CMS field is empty. Enforced by `npm run check:cms-images`, which fails on any asset import outside that list — it is part of the gate, not a convenience.

## Content collections (`src/content/`)

**Placeholder flags in JSON.** JSON cannot carry comments, so any data collection holding placeholder values carries a **`_dummyDataFlags`** array listing them, one human-readable entry per field (`"phone — DUMMY DATA, real number due in M5"`). `grep -rn "DUMMY DATA" src/content/` finds them and `npm run audit:hardcoded` reports the count; the array is emptied only when every listed field holds a real value. Markdown collections use ordinary `#` frontmatter comments instead.

**Field naming: camelCase everywhere** — in the Zod schemas, the content files and `tina/config.ts`. The Template Spec §4 listing is the field *inventory*, not the field *names*; its snake_case is illustrative only (`hero_image` → `heroImage`, `glance_rows` → `glanceRows`, `operator_disclosure` → `operatorDisclosure`).

| Collection | Notes |
|---|---|
| `journeys` | **20 entries at launch: 17 Variant A + 3 Variant B.** Full field list = Template Spec §4. `variant: 'A' \| 'B'` gates conditional sections (cabins, departures, bookingSteps, policies, operatorDisclosure required when B — `bookingSteps` is Variant B only, there is no A stepper at launch). Optional `priceFrom` gated by `siteSettings.showPrices`; `pace` and `idealFor` required. Each itinerary day carries `dayImages[]` (0–4, PRD v1.5) — lazy, never in the LCP path |
| `destinations` | name, heroImage, intro, practicalNotes[], faq[], relatedJourneys (auto by tag + manual override) |
| `cities` | **New in PRD v1.5.** name, state, hook, heroImage, quickFacts, intro[], experiences[] (4–8, image-led), photoStrip[] (3–6), practicalNotes[], faq[], relatedJourneys (manual override on top of the automatic `routeCities` match), `provisional` flag. Two seeded at M4 (Jaipur, Kochi) from public knowledge; the rest is M5/Phase-2 content |
| `posts` | title, category ('planning-visas' \| 'best-time' \| 'guides'), heroImage, publishDate, updatedDate, body (rich), embeddedJourneys[] (≥1 required), faq[] |
| `testimonials` | name, origin, tripRef, quote, photo?, consentConfirmed (must be true to render), category, featured, **`placeholder`** (round 3 — an empty slot; the schema then REFUSES name, origin, quote and photo, and the card renders one quiet line. Never emitted as `Review` structured data) |
| `siteSettings` (singleton) | see invariant #1; also **`pageHeroes`** (round 3) — the hero image + alt for the fixed pages that have no collection of their own, currently `/luxury-trains/` only |

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

`/` · `/destinations/` (index) · `/destinations/{slug}/` · `/cities/{slug}/` · `/journeys/` · `/journeys/{slug}/` · `/luxury-trains/` (landing) · `/corporate/` · `/about/` · `/reviews/` · `/travel-guide/` · `/travel-guide/{slug}/` · `/plan-my-trip/` · `/privacy/` `/terms/` `/cancellation/` `/booking-terms/`

**City pages `/cities/{slug}/` are a locked URL *pattern*** (added PRD v1.5, PAGE_TEMPLATES T15), not a fixed list — the set grows as content is written. **Two exist at M4: `jaipur` and `kochi`.** There is deliberately no `/cities/` index: nine destinations need an index, a handful of cities do not, and the entry points are the destination pages and the itinerary route strips. Add one when the set justifies it, with a 301 plan if that changes any existing URL.

**Destinations index `/destinations/` is a real page** (added M4 revision 2, PAGE_TEMPLATES T2a): compact hero → an "India" group and a "Beyond India" group → all nine cards with a live journey count → ConvertBand. No filters, no map.

**Homepage destination strip: three columns at desktop** (client ruling, round-3 review) — nine tiles in a 3×3, never 4+4+1.

**Destination slugs (locked):** `/destinations/` + `rajasthan-golden-triangle` ("Rajasthan & the Golden Triangle") · `kerala` ("Kerala & the Backwaters") · `south-west-india` ("South & West India Heritage") · `ladakh` ("Himalayas — Leh & Ladakh") · `north-east-india` ("North East India") · `wildlife` ("Wildlife Journeys") · `bhutan` · `bali` · `vietnam` — nine pages. **The homepage strip shows all nine** (T1 v2, M4 revision 2 — it was seven until then) plus a "View all destinations" link to the index. Short labels: Rajasthan, Kerala, South & West, Ladakh, North East, Wildlife, Bhutan, Bali, Vietnam.

**There is no `/contact/` route** — it 301s to `/plan-my-trip/` (added to `_redirects` in M8).

**Header nav (locked order):** Destinations ▾ · Journeys · Luxury Trains · Corporate · Travel Guide · About · Reviews · **[Plan My Trip]** (crimson button). At 1024–1200px only, About + Reviews collapse into a "More ▾" group.

Trailing slashes on. Never change a published URL without a 301 in `_redirects`.

## SEO requirements per page type

- Unique title/meta description from frontmatter; OG image (per-journey hero)
- JSON-LD: `TravelAgency` (global), `TouristTrip` (journeys), `Article` + author (posts), `FAQPage` (where faq[] present), `BreadcrumbList` (all inner pages)
- Auto sitemap + robots; canonical on every page

## Definition of done (any task)

- `astro build` passes; no TS/Zod errors
- Lighthouse (mobile, throttled): Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95; LCP ≤ 2.0s on the changed pages (homepage ≤ 2.2s by the video-hero exception; 2.5s hard ceiling everywhere)
  *(Three distinct Performance bars, deliberately: **≥ 95** on the M1 empty-page gate · **≥ 90** per-task definition of done · **≥ 85** launch floor in PRD §16.)*
- Template Spec §6 consistency checklist passes for any itinerary page touched
- New editable strings wired to CMS, not hardcoded (invariant #1 audit)
- `npm run check:cms-images` passes — no image outside the CMS (invariant #10)
- `npm run check:hero-contrast` passes if any hero, gradient or hero copy changed. Its coverage contract is **every page with text over imagery**, discovered from `dist/` — a new template that uses `<Hero>` joins the audit automatically
- New user-facing copy is registered in `docs/COPY_REGISTER.md` (invariant #9)
- Works 360px–1440px; keyboard navigable; visible focus states
- Commit messages: `feat|fix|content|chore: short description`

## Commands

```bash
npm run dev        # tinacms dev -c "astro dev" — the editor at /admin/index.html plus the site (M7)
npm run dev:astro  # the plain Astro dev server, no CMS
npm run build      # scripts/build.mjs — tinacms build when cloud credentials exist, then astro build
npm run preview    # verify built output locally
npm run pdf:build  # print the 20 branded itinerary PDFs from the built journey pages (needs preview running)
```

Deploy = push to `main` (Cloudflare Pages auto-builds). Feature work on branches → PR → preview URL → merge.
