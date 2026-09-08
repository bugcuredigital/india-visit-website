# PAGE_TEMPLATES.md — India Visit Website

Section-by-section template definitions for every page type. Companion to the *Itinerary Page Template Specification* (which governs `/journeys/{slug}/` — not repeated here). Component names match the M3 library in EXECUTION_RUNBOOK.md. Feed this file to Claude Design for mockups and to Claude Code for implementation.

**Global rules for all templates:** Header (sticky, settings-driven) and Footer wrap everything · **one persistent-contact pattern, two form factors: on mobile a sticky bottom bar, on desktop a floating bottom-right WhatsApp button** — present on every page *except* policy pages and `/plan-my-trip/`. Default mobile bar order is [WhatsApp][Call][Enquire] · every template ends with a conversion opportunity before the footer · one H1 per page · backgrounds alternate off-white / white / deep-plum bands for rhythm · yellow accents only on plum/burgundy · lotus glyph for all highlight bullets.

---

## T1 — Homepage `/`

| # | Section | Component(s) | Content & behaviour |
|---|---|---|---|
| 1 | Hero | Hero | Full-viewport (min 85svh) image/video, plum gradient from bottom. H1 value prop + "Curating journeys since {foundingYear}" line — **rendered only when `siteSettings.foundingYear` is set; the year is never hardcoded** (PRD Open Q#2). CTAs: **Plan My Trip** (crimson) + Explore Journeys (ghost). Ken Burns on image; headline fade-up; LCP image never dimmed/delayed |
| 2 | Trust bar | CounterStat ×2–4 | Renders only the stats that have verified values in `siteSettings` (nullable fields; null = omitted). **Launch set = "20+ Years" and "24/7 On-Trip Support"**; [N] Travellers and 25+ Destinations appear only once the client verifies them (PRD Open Q#2). Count-up on scroll-into-view. Association logos row beneath (greyscale, small) — omit entirely if none supplied |
| 3 | Featured journeys | JourneyCard ×6 | Editorially picked: mix domestic + international + 1 train. Card: image, title, duration pill, route one-liner. Card→page View Transition morph |
| 4 | How it works | 3-step band | Plum background. Tell us your dream → We craft your itinerary → Travel fully supported. Namaste icon on step 3 |
| 5 | Destinations strip | Image tile grid | 7 curated tiles with short labels: Rajasthan, Kerala, Ladakh, North East, Bhutan, Bali, Vietnam → destination pages, plus a **"View all destinations"** link. The strip is intentionally *not* the full list — there are 9 destination pages (slugs locked in CLAUDE.md). 4/3/2-col responsive |
| 6 | Why India Visit | 4 cards | Experience · Personal Curation · Affordable Luxury · With You Every Step. Lotus-marked, 1–2 lines each |
| 7 | Luxury trains teaser | Wide banner card | Palace on Wheels image, "India's Legendary Luxury Trains — book with authorised agents" → /luxury-trains/ |
| 8 | Testimonials | TestimonialCarousel | 5–7 reviews, name + city/country + trip taken; photo where consented. Auto-advance OFF; swipe/arrows only |
| 9 | Corporate teaser | Slim band | "Planning a company offsite?" + button → /corporate/ |
| 10 | Travel Guide teaser | 3 article cards | Latest/featured posts → /travel-guide/ |
| 11 | Lead capture | ConvertBand (short form) | Name, phone/WhatsApp, destination select, travel month. Plum band, Namaste success state |

## T2 — Destination page `/destinations/{slug}/`

| # | Section | Component(s) | Notes |
|---|---|---|---|
| 1 | Hero | Hero (short, 55svh) | Destination name H1 + one evocative line |
| 2 | Editorial intro | Prose block | 2–3 paras, "why go / what it feels like". Drop-cap optional |
| 3 | Practical strip | PracticalNotesGrid | Best time · Getting there · Ideal duration · Pace. From CMS fields |
| 4 | Journeys here | JourneyCard grid | All journeys tagged to this destination (auto) + manual ordering override |
| 5 | Destination FAQ | Accordion + FAQPage schema | 4–6 questions (SEO workhorse) |
| 6 | Related articles | 2–3 article cards | Tagged posts |
| 7 | Convert | ConvertBand | Prefilled destination in form |

## T3 — Journeys index `/journeys/`

1. **Compact hero** — H1 "All Journeys", one line, no image or slim band only (this page is a tool, not a story)
2. **Type toggle** — All · Custom Journeys · Luxury Trains (client-side, tiny island). Full filter/search = Phase 2
3. **Card grid** — all 20 JourneyCards, trains visually distinguished (plum card treatment + "Fixed Departures" tag). No coming-soon state: all three trains are content-complete
4. **ConvertBand** — "Can't find your perfect trip? We build from scratch."

## T4 — Luxury Trains landing `/luxury-trains/`

1. **Hero** — cinematic train image, H1 "India's Legendary Luxury Trains", **GSA credential line directly under H1** ("Authorised booking agents — Palace on Wheels & more")
2. **Why by train** — 3 short cards (heritage hotels on wheels, unpack once, all-inclusive)
3. **Train cards ×3** — large stacked cards: image, name, route one-liner, duration, "View journey →". All three link to full Variant B pages (GC and DO are content-complete — no coming-soon state). **No tariffs on any card** — pricing is always "Enquire"
4. **Shared FAQ** — booking process summary (4-step), who trains suit, accordion
5. **Disclosure note** — one restrained line + link to /booking-terms/
6. **ConvertBand** — "Check availability for your dates"

## T5 — Corporate `/corporate/`

1. **Hero** — professional-toned image (not beach-party), H1 "Corporate Travel & Offsites", subline naming GST invoicing + single-vendor reliability
2. **Capabilities** — 4 cards: Offsites · Incentive Trips (MICE) · Conferences · Group Logistics
3. **How we work for companies** — 3-step (Brief us → Proposal in 48h → We run the whole trip). The 48h promise = key differentiator (confirm with client)
4. **Destinations for teams** — 4–6 tiles suited to groups
5. **Proof** — client logos row or anonymised case snippets (pending Open Q#5); omit section entirely if nothing supplied — never fake it
6. **Corporate form** — Company, Contact, Email, Phone, Group size, Dates, Budget band (optional), Requirements. Tagged `corporate` in lead payload
7. WhatsApp stays present here as everywhere, but Corporate **leads with Call**: mobile bar reorders to [Call][Form][WhatsApp]. The desktop floating WhatsApp button is unchanged

## T6 — About `/about/`

1. **Hero** — portrait-led: the consultant, warm environment shot (not a stock handshake). H1 = brand promise line
2. **The story** — prose, first person where natural; founding year, why she does this
3. **Timeline** — 2006 → today, 4–6 milestones, horizontal scroll on mobile
4. **Philosophy** — Affordable Luxury explained honestly (luxury where it matters, value where it counts)
5. **Certifications & memberships** — logo row (pending Open Q#4)
6. **CounterStat band** — reuse trust numbers
7. **Testimonial spotlight** — one long-form quote
8. **ConvertBand** — "Start a conversation"

## T7 — Reviews `/reviews/`

1. **Compact hero** — H1 + aggregate line ("Rated ★ 4.9 across N reviews" — only if verifiable)
2. **Filter chips** — All · India · International · Trains · Corporate (island)
3. **Review wall** — masonry/2-col cards: quote, name, origin, trip link, photo if consented. `Review` schema
4. **Guest gallery** — photo grid of real travellers (consent-flagged only)
5. **ConvertBand** — "Become our next story"

## T8 — Travel Guide index `/travel-guide/`

1. **Compact hero** — H1 "Travel Guide", one line on planning smarter
2. **Featured article** — full-width card (latest or pinned)
3. **Category chips** — Planning & Visas · Best Time to Visit · Destination Guides
4. **Article grid** — cards: image, category tag, title, reading time. Pagination after 12
5. **Newsletter band** — "Travel inspiration, twice a month" (email only)

## T9 — Article `/travel-guide/{slug}/`

| # | Section | Notes |
|---|---|---|
| 1 | Hero | Slim: category tag, H1, author chip (photo + "20 years curating India"), published/updated dates, reading time |
| 2 | TOC | Auto from H2s, sticky sidebar desktop / collapsible mobile; only if ≥4 headings |
| 3 | Body | Rich text; supports image, callout, and FAQ blocks; **InlineJourneyCard embedded 1–2× mid-body (required ≥1)** |
| 4 | Author block | Fuller bio card at end — E-E-A-T |
| 5 | ConvertBand | Article-contextual line ("Planning Bhutan? Talk to us.") |
| 6 | Related | 3 article cards |
| Schema | `Article` + `FAQPage` (when FAQ block present) + Breadcrumb | |

## T10 — Plan My Trip `/plan-my-trip/`

1. **Split layout** — left: reassurance column (photo, "what happens next" 3 steps, response-time promise, phone + WhatsApp large); right: **multi-step form** (4 steps per PRD §8.1, progress dots, back/next, chips not dropdowns where possible)
2. **Success state** — replaces form: Namaste motif, "We've received it — expect our call within [SLA]", WhatsApp shortcut
3. **Below** — mini-FAQ (Is this free? Am I committing? How do payments work?) — objection handling
4. This page has NO other exits pushed — minimal distractions, footer only

## T11 — Contact block (embedded + `/plan-my-trip/` serves as contact)

**Ruling: there is no separate `/contact/` page.** `/contact/` 301s to `/plan-my-trip/` (redirect added in M8). The contact channels — call, WhatsApp, email, address — live in the Footer and in T10's reassurance column, both driven by `siteSettings`.

## T12 — Policy pages `/privacy/ /terms/ /cancellation/ /booking-terms/`

Single quiet template: slim header band (plum), H1, prose with anchored H2s, updated date. Booking-terms carries the train cancellation slabs as tables + operator disclosure box. No conversion furniture, no sticky bar.

## T13 — 404

Full-bleed image (empty road/desert), "Looks like you've wandered off the route." Buttons: Home · All Journeys · WhatsApp. Lotus watermark. Keep it charming — it's a brand moment.

---

## Template → collection mapping (for Claude Code)

| Template | Route | Driven by |
|---|---|---|
| T1 | `/` | siteSettings + editorial picks (frontmatter refs) |
| T2 | `/destinations/[slug]` | `destinations` collection |
| T3 | `/journeys/` | `journeys` collection (all) |
| Itinerary A/B | `/journeys/[slug]` | `journeys` — **see Template Spec** |
| T4 | `/luxury-trains/` | `journeys` where variant=B + page frontmatter |
| T5–T7, T10–T13 | static routes | page frontmatter + settings + `testimonials` |
| T8/T9 | `/travel-guide/…` | `posts` collection |

**Claude Design order of attack:** T1 → Itinerary A → Itinerary B → T2 → T9 → rest (the first three set the design language; everything else derives).
