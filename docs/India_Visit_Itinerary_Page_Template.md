# India Visit — Itinerary Page Template Specification
### Single content model for all itinerary pages (PRD §7.3 — expanded)

**Version:** 1.0 · September 2026
**Covers:** all 20 itineraries supplied to date, and any future ones

---

## 1. Why one template, two variants

Auditing all 20 documents, every itinerary falls into one of two product types:

| Variant | Products | Key difference |
|---|---|---|
| **A — Custom Journey** (default, 17 pages) | Golden Triangle ×4, Rajasthan ×2, Kerala ×3, North East ×2, Leh Ladakh, Tadoba, Western & Southern India, Bhutan, Bali, Vietnam | Fully customizable; enquiry-led; no fixed pricing, dates, or policy blocks |
| **B — Fixed Departure / Luxury Train** (3 pages) | Palace on Wheels, Golden Chariot, Deccan Odyssey — **all three content-complete** | Operated by a third party (e.g., RTDC); India Visit is the booking agent (GSA). Has cabin categories, fixed inclusions/exclusions, departure schedule, booking process, and cancellation policy. **Operator tariffs are never published** (permanent rule) — cabin cards render "Enquire for pricing" |

**Both variants share the same visual skeleton.** Variant B adds five modules and swaps the CTA language ("Check Availability" instead of "Customise This Journey"). One design system, one CMS content type with conditional sections — that's what keeps the site consistent.

The **Kerala Houseboat** and **Western & Southern India** docs represent the client's most evolved format and are the **canonical content benchmark**. Older docs (Leh Ladakh, the original Kerala files) must be upgraded to this structure during migration — the template defines the target; content is edited to fit the template, never the other way around.

---

## 2. Page anatomy — section by section

Sections marked ● are required on every itinerary. ○ = optional/conditional. Ⓑ = Variant B only.

### ● S1. Hero
| Field | Spec | Source in client docs |
|---|---|---|
| Hero image | Full-width, 16:9 desktop / 4:5 mobile crop, warm-graded destination photo | Photo archive |
| Trip title | H1, Agrandir Grand. e.g., "Kerala with Houseboat" | Doc title |
| Duration badge | "11 Nights · 12 Days" pill | Doc subtitle |
| Signature feature badge | ○ One short line, e.g., "1 Night Aboard a Traditional Houseboat", "Fully Escorted", "UNESCO Trail" | Doc subtitle line |
| Trip type tag | "Custom Journey" (A) / "Luxury Train — Fixed Departures" (B) | Assigned |
| Route strip | City chain with dot separators: KOCHI · MUNNAR · PERIYAR · ALAPPUZHA… Scrollable on mobile | Doc route header |
| Primary CTA | A: **Customise This Journey** · B: **Check Availability** | — |
| Secondary CTAs | WhatsApp (context-prefilled) · Download PDF (gated) | — |

Design note: hero overlay uses Deep Plum `#452B5E` gradient from bottom; badges in Yellow `#E5C745` on plum only (contrast rule).

### ● S2. Quick Facts bar
A single horizontal strip directly under the hero (stacks 2×2 on mobile):
**Duration · Route (start → end) · Pace (Relaxed / Moderate / Active) · Best season · Ideal for (Couples / Family / Seniors / First-timers)**
Pace and Ideal-for are new editorial fields the client assigns per trip — they don't exist in the docs but are cheap to add and heavily aid Persona 2 and 3 in self-selecting.

### ● S3. Editorial introduction
2–3 paragraphs, the "why this journey" narrative. The Kerala doc's opening ("Some places you visit. Kerala, you sink into.") is exactly the register — evocative, unhurried, no hard sell. Max ~120 words visible; "read more" expander beyond that.
**Migration note:** newer docs have this ready-made; older docs (Leh Ladakh) need it written fresh.

### ● S4. Journey Highlights
5–8 items, each: **verb-led bold lead** + one line ("**Cruise** Periyar Lake by boat in search of wild elephants…"). Rendered as a 2-column grid with the lotus glyph (brand kit) replacing the client's ✦ character — this is where the brand mark earns its keep as a functional bullet.
**Source:** newer docs have these verbatim; distill from day text for older docs.

### ● S5. Itinerary at a Glance (table)
The 3-column table from the newest docs — **Day / Destination / Signature Experience** — rendered as a styled scannable table (desktop) or compact list (mobile). This is the section skimmers and seniors actually read; it also doubles as the structure for the gated PDF's summary page.
**Interaction:** each row anchors/scrolls to its day in S6.

### ● S6. Day-by-Day Itinerary
Accordion timeline. Per day:
| Field | Spec |
|---|---|
| Day label | "Day 04" numeral style (Agrandir) |
| Day title | Short evocative title — "Ellora Caves — Three Faiths, One Hillside" |
| Transport chip | ○ icon + text when a transfer happens: ✈ Flight · 🚂 Overnight train · 🚗 Drive 172 km · 🚤 Boat. The Western & Southern India doc mixes flights and overnight trains mid-trip — the template must express this per-day, not per-trip |
| Narrative | 80–150 words, benchmark voice |
| Overnight line | "Overnight in Munnar" / "Overnight aboard the houseboat" — always last line, styled subtly |
| Day image | ○ optional thumbnail every 2–3 days; not forced per-day |

First 3 days expanded by default; "Expand all" control; days ≥8 collapsed to keep page length humane on 13-day trips.

### ● S7. Route map
Static branded map graphic of the city chain (Phase 1). Interactive map is Phase 2. Sits beside or after S6 depending on breakpoint.

### ○ S8. Inclusions & Exclusions
Two-column checklist. **Variant B: required and verbatim from operator** (Palace on Wheels doc has the full list — meals, monument entrances, camel ride, etc.). **Variant A: optional at launch** — show a standardised "What's typically included" block (transfers, hotels, guide, breakfasts) with a "finalised in your custom quote" caveat, OR omit until the client supplies per-trip lists (Open Question — see §5).

### Ⓑ S9. Cabin Categories (Variant B only)
Comparison table/cards from the operator doc: **Deluxe · Super Deluxe · Suite · Presidential Suite**, each listing incremental facilities (private car, dedicated guide, liquor, spa session). Card layout with the top tier visually flagged. No prices unless client confirms (train tariffs change; operator "reserves right to amend").

### Ⓑ S10. Departure Schedule (Variant B only)
Season/departure-day info + "2026–27 season" label. Data must be easily editable — it changes yearly.

### Ⓑ S11. Booking Process (Variant B only)
The 6-step confirmation process from the Palace on Wheels doc, redesigned as a numbered horizontal stepper: *Select tour → Booking form & passports → 40% advance → Confirmation letter → Balance 95 days prior → Arrival assistance.* This is a genuine trust asset — it shows exactly what happens after you enquire. Consider a slimmed 4-step version of this on Variant A pages too ("How booking works").

### Ⓑ S12. Policies accordion (Variant B only)
Cancellation slabs, refund rules, amendment rules, visa note — collapsed accordion, present for transparency and legal cover, never competing visually with the sell. Header carries the agent disclosure: *"India Visit is an authorised booking agent (GSA); the train is operated by RTDC / [operator]. Operator terms apply."* **Do not bury this** — the client's doc states liability is limited to booking agent; the site must say so.

### ● S13. Practical Notes
Icon-led grid: Visa · Getting there · Best time · Currency · Pace. The Bali/Vietnam/Bhutan docs have this fully written; domestic trips need a lighter version (best season, nearest airport, climate). High SEO value (matches "best time to visit X" queries).

### ● S14. Customise / Convert band
Full-width plum band. Variant A copy pattern (verbatim structure exists in newest docs): *"This itinerary can be tailored to your dates, pace and interests — add an Ayurvedic retreat, extend your houseboat stay… Our team handles every transfer, guide and reservation."* + trip-prefilled enquiry form (name, phone/WhatsApp, travel month, party size, message) + WhatsApp and call alternatives.
Variant B copy: *"Departures fill early — check availability for your dates."*

### ● S15. Related journeys
3 cards, editorially assigned (e.g., Kerala Houseboat → Kerala 12N, Western & Southern India, Golden Chariot — note the upsell path from custom journey to luxury train).

### ● S16. Sticky mobile action bar
Persistent bottom bar on mobile: **[WhatsApp] [Call] [Enquire]**. On desktop: sticky sidebar card with duration, route, CTAs following scroll.

---

## 3. Section order (final)

**Variant A:** Hero → Quick Facts → Intro → Highlights → At a Glance → Day-by-Day (+Map) → [Inclusions] → Practical Notes → Customise band → Related → (sticky bar throughout)

**Variant B:** Hero → Quick Facts → Intro → Highlights → Cabin Categories → At a Glance → Day-by-Day (+Map) → Inclusions/Exclusions → Departure Schedule → Booking Process → Availability band → Policies accordion → Related

---

## 4. CMS content model (build-ready field list)

```
ItineraryPage
├─ title, slug, variant (A|B), trip_type_tag
├─ hero_image, gallery[]
├─ nights, days, route_cities[], start_city, end_city
├─ signature_feature (short text, optional)
├─ pace (enum), ideal_for[] (multi), best_season (text)
├─ intro_rich (rich text)
├─ highlights[] { lead_verb_bold, text }
├─ glance_rows[] { day_no, destination, signature_experience }
├─ days[] { day_no, title, transport (enum+detail, optional),
│          narrative, overnight_location, image (optional) }
├─ map_graphic
├─ inclusions[], exclusions[]                  (req. for B)
├─ cabin_categories[] { name, facilities[] }   (B only)
├─ departure_info (rich text)                  (B only)
├─ booking_steps[]                             (B only — no Variant A stepper at launch)
├─ policies_rich (rich text)                   (B only)
├─ operator_disclosure (text)                  (B only)
├─ practical_notes[] { icon, label, text }
├─ customise_copy (rich text, has default)
├─ related[] (refs ×3)
├─ pdf_file (gated download)
└─ seo { meta_title, meta_desc, og_image, TouristTrip schema auto-generated }
```

**Naming:** this listing is the field *inventory*; the implemented names are **camelCase** (`hero_image` → `heroImage`, `glance_rows` → `glanceRows`, `operator_disclosure` → `operatorDisclosure`). The schema also carries an optional `priceFrom` (INR), gated globally by `siteSettings.showPrices`.

One content type, conditional fields on `variant`. Editors never touch layout — consistency is enforced structurally, which is the whole point of the client's request.

---

## 5. Content migration map & gaps

| Itinerary | Doc format generation | Migration effort |
|---|---|---|
| Kerala Houseboat 11N, Western & Southern India 13D | **Newest — canonical** | Direct port |
| Bali, Vietnam, Bhutan | New (day plan + practical notes) | Add Highlights + Glance table (distill from days) |
| Golden Triangle ×4, Rajasthan ×2, Kerala ×2, North East ×2, Tadoba | Mid | Add intro, highlights, glance table; tighten voice |
| Leh Ladakh | Oldest — verbose, dated phrasing | Full rewrite to benchmark voice |
| Palace on Wheels | Variant B — complete | Port + design; verify current-year schedule with operator |
| Golden Chariot, Deccan Odyssey | **Content supplied and complete** (GC 5N/6D Jewels of South; DO 7N/8D Heritage Odyssey) | Port + design as full Variant B pages. **Suppress every published USD tariff** in both docs — cabin cards read "Enquire for pricing" |
| Kerala (general) | Thin — the shortest of the three Kerala docs | Migrate as a distinct shorter journey (e.g. positioned as "Kerala Highlights"), **clearly differentiated** from the 11N Houseboat and 12N Trivandrum circuits: distinct title, duration, slug, intro and meta description. If it proves a true subset of an existing page with no distinct identity, **stop and flag it** rather than publishing a near-duplicate |

**New open questions for the client (append to PRD §15):**
13. Inclusions/exclusions for custom journeys — supply per-trip, or approve the standardised "typically included" block?
14. Pace + "Ideal for" tags — client to assign per itinerary (15-minute exercise, we'll send a sheet).
15. Palace on Wheels: confirm the GSA disclosure wording. **Tariff half permanently closed** — operator tariffs are never published on any train page; only the current-season *departure schedule* question remains open (schedules render generically until it resolves).
16. ~~Golden Chariot & Deccan Odyssey source content~~ **Resolved** — both docs supplied and content-complete; both build as full Variant B pages.

---

## 6. Consistency rules (design QA checklist per page)

- [ ] Lotus glyph used for highlight bullets — never ✦, never generic checkmarks
- [ ] Yellow only on plum/burgundy backgrounds; CTAs always crimson; body always Inter on **white** (off-white is the secondary surface only — card fills, alternate sections, form fields)
- [ ] Day titles follow "Place — Evocative Phrase" pattern; overnight line present on every day
- [ ] Route strip, duration badge, and Quick Facts present and identically positioned on all 20 pages
- [ ] Every page ends at the Customise/Availability band before Related — no page ends on policy text
- [ ] Variant B pages carry operator disclosure above the fold-adjacent area (within Cabin or Inclusions section header)
- [ ] Transport chips used wherever a doc mentions a flight/train/boat transfer mid-trip
- [ ] Gated PDF matches the web page section-for-section (single source of truth: the CMS entry)
