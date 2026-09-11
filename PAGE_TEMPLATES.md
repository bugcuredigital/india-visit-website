# PAGE_TEMPLATES.md — India Visit Website

Section-by-section template definitions for every page type. Companion to the *Itinerary Page Template Specification* (which governs `/journeys/{slug}/` — not repeated here). Component names match the M3 library in EXECUTION_RUNBOOK.md. This file is the **structural** source of truth for implementation; the **visual** register comes from the locked design direction in CLAUDE.md invariant #5 and the reference captures in `docs/references/`. There is no mockup track.

**Global rules for all templates:** Header (sticky, settings-driven) and Footer wrap everything · **one persistent-contact pattern, two form factors: on mobile a sticky bottom bar, on desktop a floating bottom-right WhatsApp button** — present on every page *except* policy pages and `/plan-my-trip/`. Default mobile bar order is [WhatsApp][Call][Enquire] · every template ends with a conversion opportunity before the footer · one H1 per page · **pure white `#FFFFFF` is the primary background sitewide; off-white `#F7F5F6` is a secondary surface for card fills, alternate sections and form fields; dark bands are rare and intentional and are BURGUNDY `#741238` (round 3) — the footer is ink `#1A1523`, and plum `#452B5E` is kept for at most one deliberate moment per page** — see the locked design direction in CLAUDE.md · **every dark band carries a cropped low-opacity lotus watermark** (round 3) · section rhythm 96–128px desktop / 56–72px mobile · crimson is punctuation, never a section flood: aim for exactly one crimson action per viewport · yellow accents only on burgundy/plum/ink · lotus glyph for all highlight bullets · **every image is a CMS field** (round 3, CLAUDE.md invariant #10) · **no invented copy goes live-looking** (round 3, invariant #9 — register drafts in `docs/COPY_REGISTER.md`).

---

## T1 v2 — Homepage `/`

**Supersedes the original T1 order (M4 revision 2).** The two moves that matter:
destinations come **before** journeys, because travellers shop by place first;
and a **Meet your travel consultant** section is added, because the page had no
human in it and that is the trust centrepiece for a twenty-year consultancy.

**Amended by design revision round 2 (PRD v1.5)** — section *order* is unchanged;
sections 1 and 2 are re-specified below: the hero goes full-screen with a video
slot, and the trust bar gains an icon per stat.

**Amended again by design revision round 3 (PRD v1.6).** The condensed dual
strip is gone: it put a whole line of business and the entire Travel Guide into
half a band each, which is less than either earns. Section 10 becomes a
corporate band of its own and section 11 a full Travel Guide section, pushing
lead capture to 12. Sections 1, 7 and 9 are re-specified in place.

| # | Section | Component(s) | Image slots | Content & behaviour |
|---|---|---|---|---|
| 1 | Hero | Hero | **1 poster (16:9) + 1 video** | **Full-screen, 100svh (v1.5).** Background **video** slot behind the copy — muted, looped, `playsinline`, faded in over the poster **after `window.load`**; `prefers-reduced-motion` and `Save-Data` get the poster alone and the video is never fetched. **The poster is the LCP element** and behaves exactly as a photographic hero does (preloaded, `fetchpriority="high"`, eager, never animated) — PRD §12 carries the mandatory pattern. Gradient is **one continuous ink wash over the whole hero** (v1.6) — no text-zone band, no separate video veil, no perceptible boundary, and lighter than what it replaced so the photograph reads as a photograph. Verified per hero and per breakpoint with `npm run check:hero-contrast`. Both slots CMS-fed. H1 value prop + a "20+ years" trust line drawn from `siteSettings.yearsExperience` — **never a hardcoded year**; `foundingYear` stays unrendered until verified (Open Q#2). CTAs: **Plan My Trip** (crimson) + Explore Journeys (ghost). Ken Burns applies to the poster only, and stops once the video takes over |
| 2 | Trust bar | CounterStat ×4 | — | Exactly four: **20+ Years · N Curated Journeys · 9 Regions · 24/7 On-Trip Support**. The two middle stats are **counted from our own catalogue, never claimed** — a computed number cannot be an unverified claim and cannot go stale. Client-verified figures (`travellerCount`, `destinationCount`) take the middle slots once they exist. Full-width display numerals divided by hairlines, with **one thin-line icon above each numeral** (v1.5): Phosphor `thin` weight, **burgundy** stroke, ~28px, decorative (`aria-hidden`) because the label already says what the number is. Icons support the numbers — no illustration, no colour flood, and the icon is chosen per **stat**, not per position, so it stays correct when a verified figure replaces a counted one. Beneath: an **association-logos row slot**, rendered only when the client supplies logos |
| 3 | **Where do you want to go** | Image tile grid | **9 tiles** | Destinations **moved above journeys** — travellers shop by place first. All **nine** locked destinations (slugs in CLAUDE.md) plus a "View all destinations" link to `/destinations/`. 4/3/2-col responsive |
| 4 | Signature journeys | JourneyCard ×6 | **6 cards** | Editorially picked for spread: domestic + international + one train. Card→page View Transition morph |
| 5 | How it works | 3-step band | — | **The one plum band on the site** (v1.6) — everything else dark is burgundy or ink. Tell us your dream → We craft your itinerary → Travel fully supported. Lotus mark on step 3. Dotted rail with circular nodes at ≥48rem |
| 6 | **Meet your travel consultant** | Portrait + prose | **1 portrait (4:5)** | **The trust centrepiece the page was missing.** Warm environment shot of the founder, 2–3 lines in her own voice, one **ghost** CTA "Start a conversation" → `/plan-my-trip/`. White background, generous space. Copy is **provisional until the client approves it** — logged in `docs/CLIENT_REVIEW_SHEET.md`, and the portrait is a placeholder until the client supplies one |
| 7 | Why India Visit | 4 lotus cards | — | Experience · Personal Curation · Affordable Luxury · With You Every Step. Now **follows** the human section it substantiates. **Enriched v1.6** — it read too plain: numbered `01–04` in the display face, lotus up to **28px**, headings up one type-step and bolder, **hairline separators between columns** (between only, never around the outside), supporting text up one step. One calm off-white ground: richer, not busier |
| 8 | Luxury trains banner | Wide banner card | **1 wide** | "India's legendary luxury trains — booked through authorised agents" → `/luxury-trains/` |
| 9 | Testimonials | TestimonialCarousel | photos where consented | 5–7 reviews, name + city/country + trip taken. Auto-advance OFF. **Redesigned v1.6** — oversized lotus **watermark cropped at the card corner**, **initial-avatar circle** (never a stock face: a stranger's photograph presented as a guest is a fabrication), trip label as a **pill**, off-white card with a firmer burgundy hairline, arrows and dots styled to brand. Dots are JS-only and hidden without it; both controls disappear at ≥64rem where the track is a static 3-column grid. **An un-filled slot renders one italic muted line — "Guest review coming soon" — plus the lotus, and carries no name, origin or quote at all** (word control) |
| 10 | **Corporate band** | Burgundy band | — | Its own band (v1.6), not half a strip. One sentence, one **on-dark** CTA → `/corporate/`. Carries a lotus watermark |
| 11 | **Travel guide** | ArticleCard ×3 | **3 cards** | A full section again (v1.6): three article cards with category tags, and "All articles →" to `/travel-guide/`. Grid is sized for three and **holds its shape at one** — the catalogue is still being seeded |
| 12 | Lead capture | ConvertBand (short form) | — | **Burgundy** band → ink footer (v1.6 — two burgundy bands stacked read as one slab). Name, phone/WhatsApp, destination, travel month |

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
3. **Card grid** — all 20 JourneyCards in the one sitewide treatment (below). Trains are distinguished by the **"Fixed Departures" badge** only. No coming-soon state: all three trains are content-complete
4. **ConvertBand** — "Can't find your perfect trip? We build from scratch."

### The journey card — ONE treatment sitewide (v1.6)

Round 2 gave this index a `compact` card and left the homepage a larger
`featured` one. Round 3 removes the distinction entirely: **a journey card is a
journey card**, and the homepage row and the archive grid render the identical
component.

| Every card has | No card has |
|---|---|
| Image, 4:3 | Route line (`Delhi · Agra · Jaipur`) |
| Duration **pill** — `11N · 12D` | Signature-feature blurb |
| Title, max **2 lines** with ellipsis | A permanent dark ground for trains |
| **"View journey →"** | |
| "Fixed Departures" badge, Variant B only | |

Everything dropped is carried by the journey page itself, one click away, and
the two-line clamp is what stops one long title making a card taller than its
neighbours in a forty-card grid.

**Colour is a hover state.** Cards are white at rest. On `:hover` **and on
`:focus-within`** the card footer transitions to the burgundy treatment — the
title goes light, the CTA goes yellow, the pill inverts. The Variant B card's
permanent plum ground is gone: a permanent burgundy ground would have been the
same mistake in a warmer colour. The badge is what carries the meaning, and
unlike a background colour it survives being read by someone who cannot see it.

Price renders only while `siteSettings.showPrices` is on. It renders nothing
today; the path stays wired so the pricing decision is reversible without a
component edit.

## T4 — Luxury Trains landing `/luxury-trains/`

1. **Hero** — cinematic train image, H1 "India's Legendary Luxury Trains", **GSA credential line directly under H1** ("Authorised booking agents — Palace on Wheels & more")
2. **Why by train** — 3 short cards (heritage hotels on wheels, unpack once, all-inclusive)
3. **Train cards ×3** — large stacked cards: image, name, route one-liner, duration, "View journey →". All three link to full Variant B pages (GC and DO are content-complete — no coming-soon state). **No tariffs on any card** — pricing is always "Enquire"
4. **Shared FAQ** — booking process summary (4-step), who trains suit, accordion
5. **Disclosure note** — one restrained line + link to /booking-terms/
6. **ConvertBand** — "Check availability for your dates"

## T5 — Corporate `/corporate/`

**Register (v1.6).** The client's note was that this page should "feel like a
different room of the same house". Same tokens, same type, same lotus — colder
light. Four differences, all of them restraint rather than decoration:

- the **hero sits on ink**, not white, so a buyer arriving from a vendor
  shortlist knows within one screen that this is the business side;
- **eyebrows are burgundy**, so crimson is reserved on this page for the two
  things that are genuinely actions — the phone number and the submit button;
- the **capability grid is ruled, not airy**: hairline-separated flat rows
  rather than cards. Leisure pages breathe; a procurement page should let you
  compare four things quickly;
- **no photography above the fold**, no Ken Burns, no warm lede about unhurried
  days. The destination tiles stay — a group buyer does need to see where this
  can happen — but they are square, smaller and captioned flatly.

1. **Hero** — **ink band**, no photograph. H1 "Corporate Travel & Offsites", subline naming GST invoicing + single-vendor reliability. The phone number is the loud element and is **yellow** on this ground (crimson is not legible on ink)
2. **Capabilities** — 4 **ruled rows** (v1.6, not cards): Offsites · Incentive Trips (MICE) · Conferences · Group Logistics, each a title and one paragraph, hairline-separated
3. **How we work for companies** — 3-step (Brief us → Proposal → We run the whole trip), on a **burgundy band** with a lotus watermark. T5's "Proposal in 48h" is written **without the number** until the client confirms it (`responseSla` is null, PRD Open Q#12): a response-time promise on a corporate page is a commitment somebody has to keep at 4pm on a Friday, and it is not ours to make on their behalf
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

**Card treatment (v1.6)** — identical to the homepage carousel card: cropped
lotus watermark in the corner, off-white fill, firmer burgundy hairline, trip
label as a pill. **A slot with no review yet shows one italic muted line —
"Guest review coming soon" — and carries no name, no origin and no quote**
(word control; the schema refuses those fields on a placeholder). Placeholders
are **never** emitted as `Review` structured data: a fabricated review in
JSON-LD is republished by aggregators and cannot be withdrawn.

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

Single quiet template: slim header band (**burgundy** since v1.6, with a small lotus watermark), H1, prose with anchored H2s, updated date. Booking-terms carries the train cancellation slabs as tables + operator disclosure box. No conversion furniture, no sticky bar.

## T13 — 404

Full-bleed image (empty road/desert), "Looks like you've wandered off the route." Buttons: Home · All Journeys · WhatsApp. Lotus watermark. Keep it charming — it's a brand moment.

## T14 — Header and Footer (every page)

**One `Header` component and one `Footer` component sitewide, no per-page
variants** (v1.6). The four policy pages receive theirs through the `Policy`
layout rather than declaring their own. The Header's `overlay` / `isHome` props
are configuration for a page whose hero is full-bleed — they are not a second
header.

**Footer (v1.6).** Four columns at ≥68rem, two at ≥40rem, one below that:

1. **Brand + contact** — logo, tagline, the years/support line, then the
   **phone number with its country code** (`+91 …`) in the display face as the
   loudest thing in the footer. Half this audience dials from outside India and
   a number without `+91` is a number they cannot use. WhatsApp, email, address
   and socials follow; an unsupplied social handle leaves no empty icon behind.
2. **Explore** — Destinations plus the locked nav order.
3. **Policies** — the four policy pages.
4. **Send a quick enquiry** — a **compact enquiry form**: name, phone, message,
   consent, submit. It is a `layout` mode of `EnquiryForm`, **not a second
   form**, so it shares the honeypot, the hidden context fields (`leadType`,
   `pageUrl`, UTM) and the required consent checkbox with every other form on
   the site. A second form is a second place for the consent checkbox to go
   missing.

Ground is **ink**, not burgundy: every page ends with a burgundy ConvertBand,
and a burgundy footer directly beneath it merges the two into one
undifferentiated slab half a screen tall. Carries a cropped lotus watermark.

Every contact string comes from `siteSettings` (invariant #1) and is still
DUMMY DATA until M5.

**A footer reference layout is expected from the owner** (`docs/design/references/`).
The form above is the sensible-default build made in its absence; re-check it
against the reference when it lands.

## T15 — City page `/cities/{slug}/`

**New page type (PRD v1.5).** Numbered T15 by the owner's amendment; there is no
T14. City pages sit *beneath* destinations rather than beside them: a destination
sells a region, a city answers "what is there to see in Jaipur" and routes the
reader to the journeys that go there. Driven by a new `cities` collection.

| # | Section | Image slots | Notes |
|---|---|---|---|
| a | Hero | **1 hero** | Photo, city name H1, **state + one-line hook**, breadcrumb |
| b | Quick facts strip | — | State/region · best months · nearest airport/rail · known for |
| c | Intro | — | 2–3 short paragraphs, editorial voice |
| d | **What to see & do** | **4–8 tiles** | Image-led experience tiles, name + one line |
| e | **Journeys that visit {City}** | per card | **The conversion core.** Auto-matched from each journey's `routeCities`, with a manual override list for ordering and for journeys whose route names the city differently |
| f | Photo strip | **3–6** | Gallery band |
| g | Practical notes | — | Getting there / getting around / best time |
| h | FAQ accordion | — | `FAQPage` schema |
| i | Convert | — | ConvertBand with the city prefilled |

**Cross-linking.** Itinerary route-strip chips link to `/cities/{slug}/` when that
city page exists and stay **plain text** when it does not, so the city set can grow
without editing a single journey. The same applies to the city named in a day
entry — rendered as a quiet chip **inside the day body**, deliberately *not* inside
the `<summary>`: an anchor nested in a disclosure control both navigates and toggles
the panel, which is a keyboard and assistive-technology trap.

**Scope control.** The template plus **two seeds — Jaipur and Kochi** — at M4, their
content drawn from public knowledge and flagged provisional. The full set (~10–15)
is M5/Phase-2 content work; candidates are listed in `docs/CLIENT_REVIEW_SHEET.md`
for prioritisation.

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
| T15 | `/cities/[slug]` | `cities` collection (new, v1.5) |

## Image-slot convention (all templates)

Every image slot in every template obeys three rules:

1. It renders either the **neutral warm-grey placeholder** (`#ECE9E6`, hairline
   border, small centred label) or a **TEMP-PHOTO** Unsplash stand-in. **Never a
   brand gradient, never a decorative pattern.**
2. It is **CMS-fed**, so replacing placeholder imagery with the client's archive
   in M5 is a content change with **zero code edits**.
3. Its aspect ratio is fixed by the template, not by whatever is uploaded — so a
   photograph swap can never reflow the page.

**Day-by-day images (v1.5).** Itinerary days carry `dayImages[]`, 0–4 each. One
renders full width of the day body; two render side by side; three or four become a
two-column grid. Rounded frames, `loading="lazy"`, and a reserved aspect ratio, so
they can never enter the LCP path or shift layout. A day with no images renders no
image area at all — an empty day is not an unphotographed slot.

**The one moving image (v1.5).** The homepage hero video is the only video on the
site. Its poster obeys every rule above; the video file itself lives in
`/public/uploads/` as repo media, is CMS-fed, and is governed by the LCP-safe
pattern in PRD §12.

**Claude Design order of attack:** T1 → Itinerary A → Itinerary B → T2 → T9 → rest (the first three set the design language; everything else derives).
