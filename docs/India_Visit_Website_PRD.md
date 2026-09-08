# Product Requirements Document (PRD)
## India Visit — Portfolio & Lead Generation Website

**Version:** 1.4 (Travel Guide blog moved into Phase 1 with 8 launch articles — §7.8. v1.3 motion spec; v1.2 final stack; v1.1 added 3 itineraries + Template Spec.)
**Prepared for:** India Visit (Client)
**Prepared by:** [Your Agency]
**Date:** September 2026

---

## 1. Executive Summary

India Visit is a travel consultancy with ~20 years of experience curating customized tours across India and neighbouring countries (Bhutan, Bali/Indonesia, Vietnam, and similar). The business runs on personal consultation — every trip is tailored, not sold off a shelf.

This website is a **portfolio-cum-lead-generation site**, not a booking engine. Its job is to:

1. **Establish trust instantly** — 20 years of experience, real itineraries, real testimonials.
2. **Position the brand as "affordable luxury to luxury"** — premium feel without intimidating price signals.
3. **Convert visitors into consultation leads** — every page should funnel toward "Plan My Trip."

**What this site is NOT:** an OTA (no live pricing, no cart, no instant booking, no flight/hotel search). All conversions end in a human conversation with the consultant.

---

## 2. Business Context

| Item | Detail |
|---|---|
| Business type | Independent travel consultancy / curated tour operator |
| Experience | ~20 years in the industry |
| Core offering | Customized itineraries: India domestic + neighbouring international (Bhutan, Bali, Vietnam, etc.) |
| Secondary offering | Corporate travel / MICE (offsites, incentive trips, group travel) |
| Positioning | Affordable luxury → luxury |
| Differentiator | Experience, reliability, personal service, end-to-end handling |
| Primary market | Indian travellers (23–60), Foreigners visiting India (30–60) |

### Product inventory available at launch (from client's itineraries)

**India — North & cultural circuits:** Golden Triangle (5N/6D), Golden Triangle + Varanasi (9N/10D), Golden Triangle + Jhalana Leopard Reserve, Golden Triangle ex-Amritsar (11N/12D), Rajasthan Grand Tour (12N/13D), Rajasthan + Jawai Leopard Reserve (10N/11D)

**India — South & West:** Kerala (12N/13D ex-Trivandrum + general Kerala itinerary), Kerala with Houseboat (11N/12D), Western & Southern India Grand Journey (12N/13D — Mumbai · Ajanta-Ellora · Hyderabad · Chennai · Mysore · Bengaluru)

**India — Himalayas, North East & wildlife:** Leh Ladakh (10N/11D), North East (6N/7D — standard + experiential), Tadoba Tiger Trails (2N/3D)

**India — Luxury trains (India Visit acts as booking agent/GSA):** Palace on Wheels (7N/8D — full content supplied incl. cabin categories, inclusions, booking process, cancellation policy), Golden Chariot (5N/6D — Jewels of South), Deccan Odyssey (7N/8D — Heritage Odyssey) — source docs supplied and content-complete; operator tariffs present in both docs are permanently suppressed (never published)

**International:** Bhutan (7N), Bali (5N), Vietnam (8D)

**Total at launch: 20 itinerary pages.** The inventory splits into two product types — **Custom Journeys** (17) and **Fixed-Departure Luxury Trains** (3) — which drive the two-variant page template (see Itinerary Page Template Specification) and the category structure in §6. The two newest documents (Kerala with Houseboat, Western & Southern India) define the canonical content format all older itineraries are edited up to.

---

## 3. Goals & Success Metrics

### Primary goals
1. Generate qualified consultation leads (form + WhatsApp + phone)
2. Communicate 20 years of trust and expertise within the first screenful
3. Showcase itineraries as proof of curation skill (portfolio function)
4. Capture corporate/MICE enquiries as a separate stream

### KPIs (first 6 months)

| Metric | Target |
|---|---|
| Lead form conversion rate | ≥ 2.5% of sessions |
| WhatsApp click-through | ≥ 4% of sessions |
| Avg. session duration | ≥ 2 min |
| Bounce rate (organic) | ≤ 55% |
| Enquiry-to-consultation rate | ≥ 40% (quality signal) |
| Mobile page load (LCP) | ≤ 2.5s on 4G |

---

## 4. Target Users & Personas

### Persona 1 — "The Milestone Traveller" (Indian, 28–45)
Urban professional or couple planning an anniversary, honeymoon, or family trip. Compares 3–4 operators, reads reviews, is wary of being overcharged. Wants premium hotels and smooth logistics at a fair price. **Converts via:** WhatsApp, phone; wants fast response.
**Site must show:** sample itineraries with real detail, what's included, testimonials, "no hidden costs" messaging.

### Persona 2 — "The Senior Explorer" (Indian, 50–60)
Retired or semi-retired, travels with spouse or friends group. Values reliability and comfort over adventure; less digitally fluent. **Converts via:** phone number, callback request.
**Site must show:** large legible text, prominent phone number, human face of the consultant, gentle-pace itineraries (trains, Kerala, Bhutan).

### Persona 3 — "The Inbound Foreigner" (International, 30–60)
Planning a first or second India trip; primary fear is chaos, scams, and safety. Researches heavily; wants a trustworthy local expert. **Converts via:** enquiry form, email, later WhatsApp.
**Site must show:** English-first polished copy, visa/practical notes (already present in client's itineraries), safety and 24/7 support messaging, foreign-guest testimonials, association memberships/certifications.

### Persona 4 — "The Corporate Planner" (HR/Admin, 25–45)
Organising an offsite, incentive trip, or dealer meet. Needs a reliable single vendor, GST invoicing, group logistics. **Converts via:** dedicated corporate enquiry form.
**Site must show:** separate Corporate Travel page, group capabilities, past corporate work (logos if permitted), fast turnaround promise.

---

## 5. Positioning & Messaging Framework

**Brand promise:** *"20 years of crafting India, one traveller at a time."* (working line — refine with client)

| Pillar | Message | Where it lives |
|---|---|---|
| Experience | "Curating journeys since 2006" — badge in header/hero | Sitewide |
| Personal curation | "Every itinerary is built for you, not pulled off a shelf" | Home, How It Works |
| Affordable luxury | "Luxury where it matters, value where it counts" | Home, About |
| Reliability | 24/7 on-trip support, transparent inclusions, no hidden costs | Home, FAQ, itinerary pages |
| Hospitality | Namaste motif from brand kit — "Welcome to India" warmth | Visual identity |

**Tone of voice:** Warm, assured, unhurried. Editorial rather than salesy. No "BOOK NOW!!" urgency tactics, no discount banners — these break the luxury positioning. (Reference: Enchanting Travels' calm confidence, not OTA noise.)

---

## 6. Information Architecture & Sitemap

```
Home
├── Destinations
│   ├── India
│   │   ├── Rajasthan & the Golden Triangle      (6 journeys)
│   │   ├── Kerala & the Backwaters              (3 journeys, incl. Houseboat)
│   │   ├── South & West India Heritage          (1 journey: Mumbai–Ajanta/Ellora–
│   │   │                                         Hyderabad–Chennai–Mysore–Bengaluru)
│   │   ├── Himalayas (Ladakh; future: Himachal/Uttarakhand)
│   │   ├── North East India                     (2 journeys)
│   │   └── Wildlife (Tadoba, Jhalana, Jawai)
│   └── Beyond India
│       ├── Bhutan
│       ├── Bali
│       └── Vietnam
├── Journeys (all 20 itineraries, filterable by destination/duration/type)
│   └── Itinerary detail pages (×20 at launch — Template Variant A: 17, Variant B: 3)
├── Luxury Trains (landing page + GSA credentials)
│   ├── Palace on Wheels        (Variant B — full content ready)
│   ├── Golden Chariot          (Variant B — content supplied)
│   └── Deccan Odyssey          (Variant B — content supplied)
├── Corporate Travel
├── About Us (story, 20 years, the consultant, how we work)
├── Reviews / Guest Stories
├── Travel Guide (blog — now Phase 1)
│   ├── Category: Planning & Visas
│   ├── Category: Best Time to Visit
│   ├── Category: Destination Guides
│   └── Article pages (8 at launch, ~2/month after)
├── Contact / Plan My Trip
└── Utility: Privacy Policy, Terms, Cancellation Policy, Booking Terms (trains)
```

**Sitemap notes from the new inventory:**
- **Luxury Trains gets a landing page**, not just child pages: it must carry the "Authorised Booking Agent (GSA)" credential prominently — this is a differentiator most competitors bury, and it's also a required disclosure (operator terms apply; agent liability is limited).
- **South & West India Heritage** is a new category created by the Western & Southern India itinerary — it also future-proofs for Gujarat/Goa/Hampi additions.
- **Wildlife** remains a cross-cutting theme: Tadoba lives here natively; Jhalana/Jawai journeys are cross-listed from Rajasthan (tag-based, not duplicated pages).
- **Destination slugs are locked** (SEO): `/destinations/rajasthan-golden-triangle/` "Rajasthan & the Golden Triangle" · `/destinations/kerala/` "Kerala & the Backwaters" · `/destinations/south-west-india/` "South & West India Heritage" · `/destinations/ladakh/` "Himalayas — Leh & Ladakh" · `/destinations/north-east-india/` "North East India" · `/destinations/wildlife/` "Wildlife Journeys" · `/destinations/bhutan/` · `/destinations/bali/` · `/destinations/vietnam/`. Nine pages. The homepage strip shows 7 curated tiles with short labels plus a "View all destinations" link — the strip is intentionally not the full list.
- **Booking Terms (trains)** added to utility pages — the Palace on Wheels cancellation slabs, refund and amendment rules need a canonical URL that Variant B pages link to.

**Navigation (header):** Destinations ▾ · Journeys · Luxury Trains · Corporate · Travel Guide · About · Reviews · **[Plan My Trip →]** (button, crimson). At 1024–1200px only, About + Reviews collapse into a "More ▾" group. There is no `/contact/` route — it 301s to `/plan-my-trip/`.
Sticky header on scroll with phone number and WhatsApp icon always visible on mobile.

---

## 7. Page-by-Page Requirements

### 7.1 Home

| Section | Requirement |
|---|---|
| Hero | Full-bleed cinematic photo/video (Indian palace, backwaters, or Ladakh — warm golden light). Headline: value proposition + "20 years" trust line. Primary CTA: "Plan My Trip". Secondary: "Explore Journeys". Matches brand-kit mockup direction ("Discover Incredible India"). |
| Trust bar | Immediately below hero: 4 stat/badges — *20+ Years · 10,000+ Travellers (verify number) · 25+ Destinations · 24/7 On-Trip Support*. Add association logos (IATO/TAAI/Govt. recognition — confirm which apply). |
| Featured journeys | 4–6 itinerary cards (image, name, duration, "from ₹__ per person" optional — see Open Questions). Mix domestic + international + one train. |
| How it works | 3 steps: *Tell us your dream → We craft your itinerary → Travel with full support.* Mirrors consultative sales model; sets expectation that CTA = conversation, not checkout. |
| Why India Visit | 3–4 cards: Experience, Personal Curation, Affordable Luxury, With You Every Step. |
| Destinations strip | Visual grid: Rajasthan, Kerala, Ladakh, North East, Bhutan, Bali, Vietnam. |
| Testimonials | Carousel of 5–7 real reviews with name, origin (city/country), trip taken, and photo where possible. Foreign + Indian mix. |
| Corporate teaser | One band: "Planning a company offsite?" → Corporate page. |
| Lead capture | Short inline form (Name, Phone/WhatsApp, Destination, Travel month) + newsletter opt-in. |
| Footer | Full nav, contact details, social links, payment/association logos, policies. |

### 7.2 Destination pages (e.g., Rajasthan, Kerala, Bhutan)

- Hero image + 2–3 paragraph editorial intro (why go, what it feels like)
- Best time to visit / getting there / practical notes (reuse the "Practical Notes" already written in client's itineraries — this content exists)
- All itineraries for that destination as cards
- Destination-specific FAQ (SEO value)
- Sticky "Plan My Trip" CTA + WhatsApp

### 7.3 Itinerary detail page (the workhorse — 20 pages at launch)

> **Governing document:** *Itinerary Page Template Specification v1.0* — one visual skeleton, two variants: **A — Custom Journey** (17 pages) and **B — Fixed-Departure Luxury Train** (3 pages, adds cabin categories, inclusions/exclusions, departure schedule, booking-process stepper, and policies accordion). One CMS content type with conditional fields enforces consistency. The summary below is retained for context; where they differ, the template spec wins.

**Above the fold:** Title, duration (e.g., 10 Nights / 11 Days), route summary (Delhi → Leh → Srinagar), hero image, "Customisable" badge, CTAs: *Get This Itinerary Customised* + *WhatsApp Us* + *Download PDF* (email-gated — lead magnet).

**Body (per template spec):**
- Quick Facts bar (duration, route, pace, best season, "ideal for" tags)
- Editorial introduction (benchmark voice: Kerala Houseboat / Western & Southern India docs)
- Journey Highlights — verb-led bullets rendered with the lotus glyph
- "Itinerary at a Glance" table (Day / Destination / Signature Experience) with anchor links
- Day-by-day accordion timeline, with per-day transport chips (flight / overnight train / drive-km / boat)
- Route map (static branded graphic at launch)
- Inclusions / Exclusions (required + verbatim on Variant B; standardised block on Variant A pending client decision)
- Practical notes (visa, best season, currency — already written for international itineraries)
- Customise/Availability conversion band with trip-prefilled enquiry form
- "Trips like this" cross-sell (3 cards, incl. custom-journey → luxury-train upsell paths)
- Sticky mobile action bar: WhatsApp / Call / Enquire

**Explicitly no fixed pricing displayed** unless client opts for "starting from" bands (Open Question #1). Every itinerary is presented as a starting point for customisation — this is the portfolio framing.

### 7.4 Luxury Trains (Palace on Wheels, Golden Chariot, Deccan Odyssey)

Landing page + three Variant-B itinerary pages. These anchor the top of the "luxury" positioning ladder.

- **Landing page:** GSA/authorised-agent credential up top ("Book with confidence — authorised booking agents for India's luxury trains"), the three trains as premium cards, shared FAQs.
- **Palace on Wheels** is content-complete from the client's doc: 7N/8D Rajasthan route, 4 cabin categories with facility comparison (Deluxe → Presidential Suite), full inclusions/exclusions, 6-step booking process (40% advance, balance 95 days prior), cancellation slabs. The booking-process stepper is a trust asset; the cancellation/refund rules live in a collapsed policies accordion + canonical Booking Terms page.
- **Golden Chariot & Deccan Odyssey:** structure identical; **source content supplied and content-complete** (Open Question #16 resolved) — both build as full Variant B pages, not "coming soon" cards. Golden Chariot = 5N/6D Jewels of South; Deccan Odyssey = 7N/8D Heritage Odyssey.
- **Required disclosure on all three:** India Visit is the booking agent; the operator (e.g., RTDC for Palace on Wheels) runs the train and its terms/tariff changes apply.
- **Operator tariffs are never published — permanent rule, not a pending decision.** The Palace on Wheels, Golden Chariot and Deccan Odyssey source docs all carry published USD tariffs; every one is suppressed. Cabin cards render "Enquire for pricing". A USD/price-pattern grep across all three train pages is a permanent regression check in the M5 gate. Departure schedules stay generic ("Seasonal departures — enquire for current dates") until the schedule half of Open Question #15 resolves.

### 7.5 Corporate Travel

- Capabilities: offsites, incentive trips, conferences/MICE, group logistics, GST invoicing
- Group size handling, destinations suited for corporates
- Client logos / case snippets (if permitted)
- Dedicated form: Company, Contact, Group size, Dates, Budget band, Requirements
- This page gets its own nav item and its own lead-routing (tag as "Corporate" in CRM/email)

### 7.6 About Us

The single most important trust page for this brand.
- The founder's story — 20 years, how she works, photo of her (people buy people; Persona 2 & 3 especially)
- Timeline or milestone graphic (2006 → today)
- Philosophy: affordable luxury, personal curation
- Certifications, memberships, recognitions
- Team (if any)

### 7.7 Reviews / Guest Stories

- All testimonials, filterable by destination
- Google Reviews embed/aggregate rating if available
- Video testimonials (Phase 2)
- Photo gallery of real guests on trips (with consent)

### 7.8 Travel Guide (blog — moved into Phase 1, v1.4)

**Purpose:** SEO engine + trust builder. Articles answer the planning questions personas Google before they ever search for a tour operator, then funnel readers to the matching itinerary.

**Index page:** card grid with category filter (Planning & Visas · Best Time to Visit · Destination Guides), featured article slot, newsletter capture band.

**Article template (one design, CMS-driven like itineraries):**
- Hero image, title, category tag, reading time, published/updated dates (updated date matters for SEO freshness)
- Table of contents (auto-generated from headings) for long guides
- Body: rich text with image, callout, and FAQ blocks
- **Inline journey card** — every article embeds 1–2 relevant itinerary cards mid-body ("Planning this trip? See our 7-night Bhutan journey") — this is the article's conversion job
- Author block: the consultant, with photo + "20 years" line (E-E-A-T signal for Google)
- End-of-article CTA band (Plan My Trip + WhatsApp) and related articles
- `Article` + `FAQPage` schema markup

**Launch set (8 articles — low-effort because the practical notes are already written in the itinerary docs):**
1. Best Time to Visit Ladakh — month-by-month
2. Bhutan for Indian Travellers — entry permit, SDF, air vs road (ex-East India)
3. Bali Visa on Arrival for Indians + best season
4. Vietnam E-Visa Guide for Indian Passport Holders
5. Kerala Houseboat Guide — how it works, what to expect, best stretch
6. Palace on Wheels — Complete Guide (cabins, route, booking process; from the GSA doc)
7. Golden Triangle: 5 Days vs 10 Days — which itinerary suits you
8. First Trip to India — a practical guide for foreign visitors (Persona 3 magnet)

**Editorial rules:** same voice benchmark as itineraries; no thin listicles; every article maps to ≥1 itinerary; client publishes future articles herself through Tina (new BlogPost = fill a form, ~2/month cadence).

### 7.9 Contact / Plan My Trip

- Full trip-planning form (see §8)
- Direct channels: phone (click-to-call), WhatsApp deep link with pre-filled message, email
- Office address + map, business hours, "we respond within X hours" promise

---

## 8. Lead Generation System (Core Feature Set)

### 8.1 Conversion channels (in priority order for this audience)

1. **WhatsApp** — floating button on all pages (bottom-right, plum/crimson brand style, not default green if possible while keeping recognisability). Deep link with context: *"Hi, I'm interested in [page name]…"* Non-negotiable for the Indian market.
2. **Plan My Trip form** — multi-step for higher completion:
   - Step 1: Where do you want to go? (chips: destinations + "Not sure yet")
   - Step 2: When & how long? (month + duration)
   - Step 3: Who's travelling? (couple / family / friends / solo / corporate) + rough budget band (optional)
   - Step 4: Name, phone, email, preferred contact method
3. **Click-to-call** — persistent in header (mobile), prominent for Persona 2.
4. **Itinerary PDF download** — gated by email + phone. The client already has beautifully written itineraries; branded PDFs become lead magnets.
5. **Callback request** — "Get a call back" micro-form (name + phone only).
6. **Newsletter** — soft capture in footer ("Travel inspiration, twice a month").

### 8.2 Lead handling

- All submissions → email notification to client + stored in a sheet/CRM (recommend a lightweight CRM — Zoho/HubSpot free tier — Open Question #6)
- Auto-response email confirming receipt with response-time promise
- WhatsApp Business account with catalog + quick replies configured
- Lead source/itinerary tagging on every form (hidden field: page URL, UTM)
- Corporate leads routed/tagged separately

### 8.3 Anti-spam & compliance

- Honeypot + rate limiting (avoid visible CAPTCHA — friction kills luxury feel; use invisible reCAPTCHA/Turnstile)
- Consent checkbox referencing Privacy Policy (required for foreign visitors — GDPR-adjacent hygiene)
- DPDP Act (India) compliant privacy policy

---

## 9. Design Requirements

### 9.1 Brand system (from the India Visit Brand Kit — mandatory)

| Element | Spec |
|---|---|
| Logo | Approved artwork only (crimson + plum variants); maintain clear-space; never stretch/redraw |
| Colours | Crimson `#C3163A` (primary CTA/accents) · Burgundy `#741238` · Deep Plum `#452B5E` (headers/footer/dark sections) · Yellow `#E5C745` (sparing highlights) · Off White `#F7F5F6` (backgrounds) |
| Typography | **Agrandir Grand** — headlines/display · **Inter** — body/UI (the kit's "how to use" note names Inter for digital body; Montserrat appears as secondary — confirm hierarchy, Open Question #8). Never mix competing typefaces. |
| Iconography | Lotus (brand mark, section dividers, watermarks) · Namaste (welcome moments — hero, contact, thank-you states) |
| Don'ts | No unapproved colours, no crowded layouts, no logo modification |

### 9.2 "Affordable luxury" visual language

What separates this from a budget-operator site (and from the current template look of sites like luxuriousheritagetravel.com):

- **Whitespace is the luxury signal.** Generous padding, max content width ~1200–1280px, airy sections. Off-white base, deep plum for contrast sections.
- **Photography carries the site.** Large, warm, golden-hour imagery; real places from actual itineraries. No cheesy stock, no watermarked images, consistent colour grading (warm, slightly desaturated). Budget line item for licensed/original photography.
- **Editorial typography.** Big confident Agrandir headlines, restrained body sizes, no more than 2 weights per block.
- **Micro-restraint.** Subtle hover lifts and fades only. No autoplay carousels spinning fast, no popups in first 30 seconds, no discount stickers, no countdown timers.
- **Reference direction:** Enchanting Travels' structure and calm (destination-led browsing, expert-led trust, review-heavy) + Revealed Journeys' boutique intimacy ("we work with a limited number of clients") — executed in India Visit's crimson/plum identity.

### 9.3 Responsive & accessibility

- Mobile-first (expect 65–75% mobile traffic for Indian audience)
- Base font ≥ 16px; comfortable line-height (Persona 2)
- WCAG 2.1 AA contrast (test yellow `#E5C745` — never yellow text on off-white; use it on plum only)
- Tap targets ≥ 44px; sticky WhatsApp/call bar on mobile

### 9.4 Motion & animation spec (added v1.3)

**Principle: motion is seasoning, not the dish.** Luxury reads as calm and deliberate; over-animation reads as template. Every animation must pass: *does this add orientation, hierarchy, or delight — or just movement?*

**Approved animation vocabulary:**
| Where | Motion | Implementation |
|---|---|---|
| Page-to-page | View transitions — hero image/title morphs from journey card into itinerary page | Astro `<ClientRouter/>` (built-in, ~zero JS) |
| Section entrances | Single soft fade-up (12–20px, 400–600ms), staggered children max 80ms apart, triggers once | CSS + IntersectionObserver; GSAP ScrollTrigger for the homepage only |
| Hero | Slow Ken-Burns-style scale on the image (8s+, subtle); headline fade-up. **The LCP image itself paints immediately at full opacity — entrance animation never delays or dims first paint** | CSS |
| Trust stats | Count-up on scroll into view ("20+", "10,000+") | ~15-line vanilla island |
| Cards/buttons | Hover lift 2–4px + shadow ease, 200ms | CSS transitions |
| Accordions (day-by-day) | Height ease 250ms, chevron rotate | CSS |
| Lotus brand mark | SVG stroke draw-on for section dividers / form success states | CSS stroke-dashoffset |
| Sticky mobile bar | Slide-in after first scroll | CSS |

**Hard rules (enforced in code review):**
- Animate `transform` and `opacity` only — never width/height/top/margin (layout thrash kills INP)
- One easing family sitewide (e.g., `cubic-bezier(0.22, 1, 0.36, 1)`); durations 200–600ms except hero Ken Burns
- All motion wrapped in `@media (prefers-reduced-motion: no-preference)`
- GSAP (~30KB, now fully free incl. premium plugins) lazy-loads below the fold; never in the critical path
- No autoplay carousels, no parallax that fights scrolling, no animation on the LCP element's visibility, no entrance animation replaying on every scroll
- Budget: total animation JS ≤ 40KB gzipped, homepage only; inner pages CSS-only + view transitions

---

## 10. Content Requirements

| Content | Source | Owner |
|---|---|---|
| 20 itinerary pages | Client's Word docs (uploaded) — edited up to the canonical format of the two newest docs (Kerala with Houseboat, Western & Southern India: editorial intro, verb-led highlights, at-a-glance table, transport-aware day narratives). Oldest doc (Leh Ladakh) needs full rewrite; migration effort per doc is mapped in the Template Spec §5 | Agency edit, client approve |
| Golden Chariot & Deccan Odyssey source content | **Supplied** — routes, cabins, day plans present in both docs; tariffs suppressed | Agency edit, client approve |
| Destination intros (×9) | New copy | Agency |
| About/founder story | Client interview | Agency |
| Testimonials (10–15) | Client to collect with names, cities/countries, photos, consent | Client |
| Trust numbers (travellers served, destinations, repeat rate) | Client to verify — **never publish unverifiable claims** | Client |
| Certifications/memberships | Client to provide | Client |
| Photography | Client's trip archive + licensed stock to fill gaps | Both |
| 8 launch blog articles (§7.8) | Drafted from existing practical notes + Palace on Wheels doc; client review | Agency draft, client approve |
| FAQ (10–12 sitewide + per-destination) | New copy | Agency |
| Policies (Privacy, T&C, Cancellation + train Booking Terms from Palace on Wheels doc) | Template + client review; train terms port from operator doc | Agency |
| Branded itinerary PDFs (20) | Redesign client docs in brand template; single source of truth = CMS entry | Agency |

**Copy style guide:** British/Indian English, warm second person ("your journey"), short paragraphs, no exclamation-mark selling. The Bali/Vietnam/Bhutan docs already model the right voice — use them as the benchmark.

---

## 11. SEO Requirements

- **Keyword targets (initial):** "customized India tour packages", "Golden Triangle tour package", "Rajasthan luxury tour", "Kerala tour package", "Kerala houseboat package", "Bhutan tour from India", "Leh Ladakh package", "luxury train tours India", "Palace on Wheels booking" (high-intent — the GSA credential makes this rankable and directly monetisable), "Ajanta Ellora tour package", "South India temple tour", "corporate offsite planner India" + long-tail per itinerary
- Clean URL structure: `/destinations/rajasthan/`, `/journeys/golden-triangle-5n-6d/`
- Schema markup: `TravelAgency` (org), `TouristTrip` (itineraries), `Review`/`AggregateRating`, `FAQPage`, `BreadcrumbList`
- Unique meta titles/descriptions per page; OG images per itinerary
- Google Business Profile setup/optimisation + review generation workflow
- XML sitemap, robots, canonical tags; image alt text throughout
- Travel Guide blog **launches in Phase 1** with 8 articles for topical authority — best-time-to-visit and visa-guide articles map directly to the practical notes already written; `Article` schema + author E-E-A-T block on every post
- Core Web Vitals budget: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms. **2.5s is the CWV pass mark; our own working target is LCP ≤ 1.5s (§12, CLAUDE.md).**

---

## 12. Technical Requirements — FINAL STACK (v1.2, battle-tested)

**Hard constraints from client-side:** ₹0 hosting with custom domain · lowest possible LCP · all text, images, button links, phone numbers, and Google/Meta tags editable without touching code · edits must never be able to break the live site.

| Area | Final decision |
|---|---|
| Build workflow | **Claude Design** (visual design from brand kit + Template Spec) → **Claude Code** (implementation, content migration, ongoing changes) |
| Framework | **Astro, static output** + Tailwind (brand tokens for colours/type). Content collections schema = Template Spec §4 field list, Zod-validated. **Next.js SSG evaluated and declined (v1.3):** viable, but ships ~85–90KB React runtime + hydration on every page (worse LCP/INP on low-end Indian mobile) for no animation benefit — all required motion is framework-agnostic; Vercel Hobby tier also prohibits commercial use. React available per-component via Astro islands if ever needed |
| Animation | Per §9.4 spec: Astro View Transitions (built-in) · CSS transforms/opacity · **GSAP + ScrollTrigger** (free, lazy-loaded, homepage only) · vanilla islands for counters. Budget ≤ 40KB gzipped animation JS, homepage only |
| Hosting | **Cloudflare Pages** (free): unlimited bandwidth, free custom domain + SSL, Indian edge PoPs, 500 builds/month, atomic deploys, one-click rollback, preview URLs per change |
| CMS | **TinaCMS — Tina Cloud free tier (2 editors)**: visual click-to-edit on the live page; content stored as markdown/JSON in the repo. **Vendor hedge:** if Tina's terms change, swap UI to Sveltia/Decap (drop-in, content files unchanged). **Rejected — Strapi:** Cloud free plan removed July 2026; self-hosting needs a paid VPS + Postgres + patching; DB-backed API server is architecturally wrong for a static portfolio |
| Media storage | **Tina repo-based media** (images committed to the GitHub repo, NOT Tina Cloud's hosted storage) — deliberately avoids the free plan's ~100MB hosted-asset cap. Same media-manager UI for the client; only GitHub limits apply (100MB/file, ~1–5GB repo — years of headroom). Bonus: images + content deploy and roll back atomically. Caveats: repo media is immutable (replace = re-upload under new name), no rename in UI. **Escape hatch if repo grows heavy:** Tina's first-party Cloudinary integration (free tier ≈ 25GB-equivalent credits). **Upload rule for client:** photos ≤2000px wide; agency pre-processes her archive once during migration |
| Site Settings singleton | Phone, WhatsApp number + default message, email, address, social URLs, CTA link targets, GTM container ID, Meta Pixel ID — every component reads from these CMS fields; nothing hardcoded, nothing duplicated |
| Tags | **GTM installed once, loaded via Partytown** (web worker, off main thread). GA4, Meta Pixel, conversion events, and all future tags managed entirely in the GTM UI — zero code edits, and no LCP penalty from the tag stack |
| Forms | Cloudflare Pages Function → Resend free tier (email notify) + Google Sheet webhook; Turnstile (invisible, free) + honeypot. Alt: Web3Forms free |
| LCP plan (target < 1.5s 4G) | Static HTML from CDN edge · inlined critical CSS · self-hosted subset fonts, `font-display: swap` · hero preloaded, `fetchpriority="high"`, AVIF/WebP responsive srcset via `astro:assets` (build-time, free) · near-zero default JS · third-party scripts off-thread |
| Serving & caching model | **GitHub and Tina exist only in the publish path, never the visitor path.** Visitors hit Cloudflare edge → pre-built static files; zero runtime calls to GitHub/Tina/any origin (site stays up even if GitHub is down). Caching is structural: assets get content-hashed filenames (immutable, cache-forever, staleness impossible), HTML revalidates, and every deploy is an atomic edge-wide cutover — no manual purges, no stale-cache states, no cache plugins. **Trade-off accepted:** edits go live ~1–3 min after save (build time), not instantly — fine for a portfolio's edit cadence |
| Cannot-break-the-site guarantee | (1) Client edits schema-validated form fields, never markup; (2) failed builds never deploy — live site keeps serving last good version; (3) every deploy is rollback-able in one click; (4) preview deploy per change before publish |
| Unavoidable costs | Domain (~₹800–1,000/yr, Cloudflare Registrar at-cost) · Agrandir Grand web font licence (Open Question #9). Everything else: ₹0/month |
| Capacity sanity check | 500 builds/mo ≈ 16 published edit-batches/day (ample); Resend 100 emails/day ≫ lead volume; bandwidth unlimited (traffic spikes cost nothing) |
| Integrations (Phase 2) | Google Reviews feed, Instagram feed, CRM, email marketing (Brevo free tier) — all API-side, no lock-in |

**Why WordPress was dropped (v1.1) and Strapi rejected (v1.2):** both require paid always-on infrastructure (hosting/VPS + database), carry patching burden, edit the live site directly (a bad edit can take it down instantly), and can't match static-CDN LCP. The Astro + git-based-CMS architecture makes the client's "I shouldn't be able to break it" requirement a structural property, not a training issue.

---

## 13. Scope & Phasing

### Phase 1 — Launch (MVP)
Home · 9 destination pages · 20 itinerary pages (17 Variant A + 3 Variant B; all three trains content-complete — no "coming soon" cards needed) · Luxury Trains landing · Corporate · About · Reviews · **Travel Guide blog (index + article template + 8 launch articles)** · Plan My Trip · Full lead-gen system (forms, WhatsApp, call, gated PDFs) · SEO foundation · Analytics · Policies incl. train Booking Terms

### Phase 2 — Growth (post-launch 1–3 months)
Ongoing Travel Guide articles (~2/month, client-published via Tina) · Journey filter/search on the Journeys index · Video testimonials · Instagram feed · Email nurture sequences · CRM integration · Additional itineraries (Himachal, Andamans, Sri Lanka, Nepal — natural inventory extensions)

### Phase 3 — Optimisation (ongoing)
A/B testing on hero + forms · Review-generation automation · Seasonal landing pages (summer Ladakh, winter Rajasthan, festival specials) · Multilingual consideration (German/French/Spanish inbound — only if data supports)

### Out of scope (all phases unless re-negotiated)
Online payments/booking engine · Live inventory or pricing APIs · User accounts · Mobile app

---

## 14. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Trust claims can't be verified (traveller counts, awards) | Publish only client-verified numbers; use "20+ years" as the anchor claim |
| Photography quality undermines luxury positioning | Budget for licensed imagery; audit client archive early; reject low-res assets |
| Client expects bookings, gets enquiries | This PRD explicitly defines the site as consultative lead-gen; align in kickoff |
| Slow lead response kills conversions | Response-time SLA agreed with client (≤ 2 business hours target); auto-acknowledgement emails |
| Agrandir Grand licensing for web | Verify licence before build; fallback pairing pre-approved (Open Question #9) |
| Old itinerary copy (e.g., Leh doc) reads dated | Copy-edit pass on all 20 before publish, benchmarked to the two newest docs |
| Train pages publish stale operator info (tariffs/schedules change yearly; operator "reserves right to amend") | No tariffs without confirmation; season-labelled schedule fields; annual review task; GSA disclosure + "operator terms apply" on every Variant B page |
| ~~Golden Chariot / Deccan Odyssey content never arrives~~ **Retired** | Content was supplied; both build as full Variant B pages. No coming-soon state needed |

---

## 15. Open Questions for Client (blocking items marked ⚑)

1. ⚑ **Pricing display:** Show "starting from ₹__" bands on itinerary cards, or no pricing at all (pure enquiry model)? Recommendation: "from" bands on domestic, enquiry-only on luxury trains/international — filters out mismatched leads without hard-committing prices. **Build decision (pre-M1):** the schema carries an optional `priceFrom` (INR) plus a global `siteSettings.showPrices` boolean defaulting to `false` — the field exists so the decision stays reversible, and nothing renders until it flips. Train pages are exempt regardless (tariffs never published).
2. ⚑ **Trust numbers:** Exact founding year, travellers served, destinations covered, repeat-client rate — what can we verifiably claim? **Build decision (pre-M1):** `foundingYear`, `travellerCount`, `destinationCount` and `aggregateRating` are nullable `siteSettings` fields; null means the stat is not rendered. Launch set is the verifiable pair — "20+ Years" and "24/7 On-Trip Support". CounterStat renders 2–4 stats gracefully; "Curating journeys since {foundingYear}" appears only when set; no aggregate-rating line on /reviews/ until data exists.
3. ⚑ **Testimonials:** Can the client supply 10–15 with names, cities/countries, and photos + consent? Any Google Reviews presence today?
4. **Certifications:** IATO / TAAI / Ministry of Tourism recognition / any awards?
5. **Corporate proof:** Client logos or anonymised case snippets permitted?
6. **CRM preference:** Google Sheet + email is fine at launch, or set up Zoho/HubSpot from day one?
6a. ~~Content editing post-launch~~ **Resolved (v1.2):** TinaCMS visual editing, free tier, 2 editor seats (client + agency). Client edits via click-on-page; agency retains Claude Code for structural changes.
7. **Domain & channels:** Confirm final domain (indiavisit.com per brand kit mockups?), existing social handles, Google Business Profile status.
8. **Typography hierarchy:** Brand kit shows Agrandir Grand (titles) + Inter (body note) but also Montserrat — confirm the intended pairing for web. **Resolved for build:** Agrandir Grand display + Inter body; Montserrat is not used on web.
9. ⚑ **Font licensing:** Does the client hold a web licence for Agrandir Grand (Pangram Pangram — paid)? If not, budget it or approve a fallback. **Resolved for build (pre-M1):** not licensed yet; the display face sits behind a `--font-display` design token with **Archivo Expanded** (free, Google Fonts, self-hosted, subset) as the temporary display font and Inter for body. The eventual swap to Agrandir must remain a one-token-plus-font-file change.
10. **Photography:** Volume and quality of the client's own trip photo archive?
11. **Languages:** English-only at launch confirmed? Hindi consideration for domestic audience?
12. **Response SLA:** Who answers leads, and within what committed timeframe?
13. **Inclusions on custom journeys:** Supply per-trip inclusion/exclusion lists, or approve a standardised "what's typically included" block with a "finalised in your custom quote" caveat? *(Inclusions stay optional on Variant A in the schema until this resolves.)*
14. **Pace & "Ideal for" tags:** Client to assign per itinerary from a short sheet we'll provide (feeds the Quick Facts bar and Journeys filter). **Build decision:** `pace` and `idealFor` are required in the schema; the agency drafts provisional values for all 20 journeys during M5 and lists every one in `docs/CLIENT_REVIEW_SHEET.md` for one-shot sign-off.
15. **Palace on Wheels publishing rights:** **Tariff half permanently closed (pre-M1):** operator tariffs are never published on any train page — no confirmation will change this; cabin cards render "Enquire for pricing" and a USD/price grep guards it. ⚑ **Still open:** GSA disclosure wording, and whether the current-season *departure schedule* may be published — until then schedules render generically ("Seasonal departures — enquire for current dates").
16. ~~**Golden Chariot & Deccan Odyssey content**~~ **Resolved (pre-M1):** both source docs supplied and content-complete (GC 5N/6D Jewels of South, DO 7N/8D Heritage Odyssey). Both build as full Variant B pages; their published USD tariffs are suppressed.

---

## 16. Acceptance Criteria (launch checklist)

- [ ] Travel Guide live with 8 articles, each embedding ≥1 journey card, Article schema validating, and BlogPost publishable by the client through Tina without agency help
- [ ] All Phase-1 pages live, populated with approved content
- [ ] Brand kit applied exactly (colours, fonts, logo rules, lotus/namaste motifs)
- [ ] Every page has ≥ 2 working conversion paths (form/WA/call)
- [ ] Lead notifications reach client within 1 minute of submission; test leads verified end-to-end
- [ ] All 20 itinerary pages conform to the Template Spec (Variant A/B) and pass its §6 consistency checklist
- [ ] All launched itinerary PDFs branded and gated, matching their web pages section-for-section
- [ ] Variant B pages carry the GSA/operator disclosure and link to Booking Terms
- [ ] Lighthouse mobile: Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95 — **85 is the launch floor**; per-task definition-of-done is ≥ 90 (CLAUDE.md) and the M1 empty-page gate is ≥ 95
- [ ] Schema validates (Rich Results test) on org, trips, FAQs, reviews
- [ ] GA4 events firing for all conversion actions
- [ ] Responsive QA on iOS/Android Chrome & Safari, 360px–1440px
- [ ] Policies published; consent checkbox live on all forms
