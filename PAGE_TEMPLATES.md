# PAGE_TEMPLATES.md — India Visit Website

Section-by-section template definitions for every page type. Companion to the *Itinerary Page Template Specification* (which governs `/journeys/{slug}/` — not repeated here). Component names match the M3 library in EXECUTION_RUNBOOK.md. This file is the **structural** source of truth for implementation; the **visual** register comes from the locked design direction in CLAUDE.md invariant #5 and the reference captures in `docs/references/`. There is no mockup track.

**Global rules for all templates:** Header (sticky, settings-driven) and Footer wrap everything · **one persistent-contact pattern, two form factors: on mobile a sticky bottom bar, on desktop a floating bottom-right WhatsApp button** — present on every page *except* policy pages and `/plan-my-trip/`. Default mobile bar order is [WhatsApp][Call][Enquire] · every template ends with a conversion opportunity before the footer · one H1 per page · **pure white `#FFFFFF` is the primary background sitewide; off-white `#F7F5F6` is a secondary surface for card fills, alternate sections and form fields; deep-plum bands are rare and intentional** (footer, How-It-Works, one homepage moment, ConvertBand) — see the locked design direction in CLAUDE.md · section rhythm 96–128px desktop / 56–72px mobile · crimson is punctuation, never a section flood: aim for exactly one crimson action per viewport · yellow accents only on plum/burgundy · lotus glyph for all highlight bullets.

---

## T1 v2 — Homepage `/`

**Supersedes the original T1 order (M4 revision 2).** The two moves that matter:
destinations come **before** journeys, because travellers shop by place first;
and a **Meet your travel consultant** section is added, because the page had no
human in it and that is the trust centrepiece for a twenty-year consultancy.

| # | Section | Component(s) | Image slots | Content & behaviour |
|---|---|---|---|---|
| 1 | Hero | Hero | **1 hero (3:2 master)** | Full-bleed photo, plum gradient at the text zone only. H1 value prop + a "20+ years" trust line drawn from `siteSettings.yearsExperience` — **never a hardcoded year**; `foundingYear` stays unrendered until verified (Open Q#2). CTAs: **Plan My Trip** (crimson) + Explore Journeys (ghost). Ken Burns on the image; the LCP image is never dimmed or delayed |
| 2 | Trust bar | CounterStat ×4 | — | Exactly four: **20+ Years · N Curated Journeys · 9 Regions · 24/7 On-Trip Support**. The two middle stats are **counted from our own catalogue, never claimed** — a computed number cannot be an unverified claim and cannot go stale. Client-verified figures (`travellerCount`, `destinationCount`) take the middle slots once they exist. Full-width display numerals divided by hairlines. Beneath: an **association-logos row slot**, rendered only when the client supplies logos |
| 3 | **Where do you want to go** | Image tile grid | **9 tiles** | Destinations **moved above journeys** — travellers shop by place first. All **nine** locked destinations (slugs in CLAUDE.md) plus a "View all destinations" link to `/destinations/`. 4/3/2-col responsive |
| 4 | Signature journeys | JourneyCard ×6 | **6 cards** | Editorially picked for spread: domestic + international + one train. Card→page View Transition morph |
| 5 | How it works | 3-step band | — | Plum band. Tell us your dream → We craft your itinerary → Travel fully supported. Lotus mark on step 3. Dotted rail with circular nodes at ≥48rem |
| 6 | **Meet your travel consultant** | Portrait + prose | **1 portrait (4:5)** | **The trust centrepiece the page was missing.** Warm environment shot of the founder, 2–3 lines in her own voice, one **ghost** CTA "Start a conversation" → `/plan-my-trip/`. White background, generous space. Copy is **provisional until the client approves it** — logged in `docs/CLIENT_REVIEW_SHEET.md`, and the portrait is a placeholder until the client supplies one |
| 7 | Why India Visit | 4 lotus cards | — | Experience · Personal Curation · Affordable Luxury · With You Every Step. Now **follows** the human section it substantiates |
| 8 | Luxury trains banner | Wide banner card | **1 wide** | "India's legendary luxury trains — booked through authorised agents" → `/luxury-trains/` |
| 9 | Testimonials | TestimonialCarousel | photos where consented | 5–7 reviews, name + city/country + trip taken. Auto-advance OFF. Placeholder-flagged until Open Q#3 resolves |
| 10 | **Slim dual strip** | Two-up light band | **1 guide card** | Corporate teaser **and** travel-guide teaser condensed into **one lighter band**. Both are secondary audiences — do not spend two full sections on them |
| 11 | Lead capture | ConvertBand (short form) | — | Plum band → footer. Name, phone/WhatsApp, destination, travel month |

## T2 v2 — Destination page `/destinations/{slug}/`

**Supersedes the original T2 order (M4 revision 2).** The product moves up: the
journey cards are the conversion core of the page and must be visible within one
scroll, not buried under editorial.

| # | Section | Component(s) | Image slots | Notes |
|---|---|---|---|---|
| 1 | Hero | Hero (short) | **1 hero** | Destination name H1, one emotive line, breadcrumb |
| 2 | Short intro | Prose block | — | **2–3 sentences only**, expandable if longer. Product must be visible within one scroll |
| 3 | **Journeys in {Destination}** | JourneyCard grid | per card | **Moved up, directly after the intro.** Every journey tagged to this destination (auto by tag + manual ordering override). This is the conversion core |
| 4 | **What defines {Destination}** | Experience tiles | **4–6 tiles** | Image-led — e.g. Kerala: backwaters, tea country, spice trails, coast. Content from the CMS, never hardcoded |
| 5 | Practical strip | PracticalNotesGrid | — | Best time · Getting there · Ideal duration · Pace |
| 6 | Testimonial | Single quote slot | optional photo | One destination-specific testimonial. Placeholder until Open Q#3 |
| 7 | Destination FAQ | Accordion + FAQPage schema | — | 4–6 questions. SEO workhorse |
| 8 | Related articles | 2–3 article cards | per card | Tagged posts |
| 9 | Convert | ConvertBand | — | Destination prefilled in the form |

## T2a — Destinations index `/destinations/`

Added to the locked URL list in M4 revision 2. The homepage strip shows seven of
the nine; this page carries all of them.

| # | Section | Notes |
|---|---|---|
| 1 | Compact hero | Short band, H1 "Where we go", one line |
| 2 | **India** group | Grouped heading, then cards |
| 3 | **Beyond India** group | Bhutan · Bali · Vietnam |
| 4 | Destination cards ×9 | Image, name, one-line hook, **live journey count** counted from the catalogue |
| 5 | Convert | ConvertBand |

**No filters and no map.** Nine items do not need either, and both are Phase 2
complexity for a page whose job is to be a clear index.

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
| T2a | `/destinations/` | `destinations` collection (all nine, grouped) |
| T2 v2 | `/destinations/[slug]` | `destinations` collection |
| T3 | `/journeys/` | `journeys` collection (all) |
| Itinerary A/B | `/journeys/[slug]` | `journeys` — **see Template Spec** |
| T4 | `/luxury-trains/` | `journeys` where variant=B + page frontmatter |
| T5–T7, T10–T13 | static routes | page frontmatter + settings + `testimonials` |
| T8/T9 | `/travel-guide/…` | `posts` collection |

## Image-slot convention (all templates)

Every image slot in every template obeys three rules:

1. It renders either the **neutral warm-grey placeholder** (`#ECE9E6`, hairline
   border, small centred label) or a **TEMP-PHOTO** Unsplash stand-in. **Never a
   brand gradient, never a decorative pattern.**
2. It is **CMS-fed**, so replacing placeholder imagery with the client's archive
   in M5 is a content change with **zero code edits**.
3. Its aspect ratio is fixed by the template, not by whatever is uploaded — so a
   photograph swap can never reflow the page.

**Claude Design order of attack:** T1 → Itinerary A → Itinerary B → T2 → T9 → rest (the first three set the design language; everything else derives).
