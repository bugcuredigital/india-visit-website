# CONTEXT.md — India Visit Website

Business background and decision history. Operational rules live in CLAUDE.md; build order in EXECUTION_RUNBOOK.md; full detail in the PRD (v1.4) and Itinerary Page Template Specification (v1.0) — both in `/docs/`.

## The client & the business

- **India Visit** — travel consultancy, ~20 years in business. Founder is a travel consultant; the entire sales model is personal: enquiry → conversation → custom itinerary → she handles everything during the trip.
- Products: **custom journeys** across India + Bhutan/Bali/Vietnam, and **fixed-departure luxury trains** (Palace on Wheels — she is an authorised booking agent/GSA; Golden Chariot & Deccan Odyssey pending content).
- Positioning: **affordable luxury → luxury.** The differentiator sold on every page is trust: 20 years, personal curation, 24/7 on-trip support, transparent dealings.
- Secondary line: **corporate/MICE** (offsites, incentive trips) — separate page, separate lead tag.

## Audiences (drive design choices)

1. **Milestone Traveller** (Indian, 28–45): compares operators, fears overpaying → wants detail, inclusions, WhatsApp-first contact.
2. **Senior Explorer** (Indian, 50–60): comfort + reliability → large type, prominent phone number, human face, gentle-pace trips.
3. **Inbound Foreigner** (30–60): fears chaos/scams → polish, practical/visa notes, safety messaging, foreign testimonials, enquiry form + email.
4. **Corporate Planner**: needs one reliable vendor + GST invoicing → capability proof, fast-turnaround promise, dedicated form.

~65–75% of traffic will be mobile, much of it low-end Android — this is why performance decisions were so aggressive.

## What the site is / is not

- IS: a portfolio of 19 real itineraries + a lead machine (multi-step Plan-My-Trip form, per-page prefilled WhatsApp, click-to-call, email-gated PDF downloads, callback micro-form, corporate form).
- IS NOT: an OTA. No live pricing, no cart, no instant booking. Custom journeys show no fixed prices (pending client decision on "from ₹" bands — Open Q#1).

## Brand system (source: INDIA VISIT Brand Kit PDF in `/docs/brand/`)

- Colors: Crimson `#C3163A` · Burgundy `#741238` · Deep Plum `#452B5E` · Yellow `#E5C745` · Off-White `#F7F5F6`
- Type: **Agrandir Grand** display / **Inter** body (kit also shows Montserrat — not used on web; Open Q#8 resolved). **Agrandir is not licensed yet** — the display face sits behind a `--font-display` token currently resolving to Archivo Expanded (Open Q#9)
- Iconography: **Lotus** (India/heritage — used as functional bullet glyph + watermarks) and **Namaste** (welcome moments: hero, contact, form-success states)
- Explicit don'ts: no logo modification, no unapproved colors, no crowded layouts, no competing typefaces
- Voice: warm, editorial, unhurried. Whitespace and photography carry the luxury signal; restraint IS the aesthetic. Reference sites the client liked: enchantingtravels.com (structure/calm benchmark), revealedjourneys.com (boutique intimacy).

## Content inventory & state

- **20 itineraries** as Word docs in `/docs/itineraries/`. Two product types → two template variants (A: Custom Journey ×17, B: Luxury Train ×3). Canonical format = the two newest docs (Kerala with Houseboat, Western & Southern India). Migration effort per doc mapped in Template Spec §5; Leh Ladakh needs a full rewrite. **Golden Chariot & Deccan Odyssey turned out to be content-complete** (GC 5N/6D Jewels of South, DO 7N/8D Heritage Odyssey) → both build as full Variant B pages, no "coming soon" cards; their published USD tariffs are suppressed. The three Kerala docs must be clearly differentiated from each other, not near-duplicates.
- **8 launch blog articles** (PRD §7.8) — mostly assembled from practical notes already inside the itinerary docs.
- Pending from client: testimonials (with consent), verified trust numbers, certifications, corporate logos permission, photo archive.

## Decision log (do not relitigate without new facts)

| Decision | Reason |
|---|---|
| WordPress ❌ | Paid hosting, live-DB edits can break the site instantly, plugin/patch burden, can't match static LCP |
| Strapi ❌ | Cloud free plan removed Jul 2026; self-host needs paid VPS+Postgres; DB API server wrong for static portfolio |
| Next.js SSG ❌ | ~85–90KB React runtime + hydration on every page for zero animation benefit; Vercel Hobby bars commercial use |
| Astro static ✅ | Zero-JS default, content collections mirror the Template Spec, best LCP floor |
| TinaCMS ✅ | Only free git-CMS with visual click-on-page editing (client's mental model). Hedge: Sveltia/Decap drop-in on same files if Tina's terms change |
| Repo-based media ✅ | Avoids Tina Cloud's ~100MB hosted-asset cap; images version with content; GitHub limits are the only bound |
| Cloudflare Pages ✅ | Free custom domain + unlimited bandwidth + Indian PoPs + atomic deploys + one-click rollback; commercial use allowed |
| GTM via Partytown ✅ | All tags managed in GTM UI forever (client's no-code requirement); Partytown keeps them off the main thread (LCP) |
| Blog in Phase 1 ✅ | v1.4 change — 8 articles nearly free to produce from existing practical notes; SEO compounding starts at launch |

## Client's hard constraints (verbatim intent)

1. ₹0/month infrastructure; only domain + font licence are paid.
2. Lowest possible LCP.
3. After launch, she never touches code: text, images, phone numbers, button links, Google/Meta tags all edited through UIs (Tina, GTM, Cloudflare dashboards).
4. Edits must not be able to break the live site (solved structurally: schema validation, atomic deploys, rollback).
5. Accepted trade-off: edits go live in ~1–3 min (build time), not instantly.

## Open questions status (PRD §15 — check before building affected parts)

Blocking: #1 pricing display · #2 trust numbers · #3 testimonials · #15 PoW *schedule* publishing rights (tariff half permanently closed — tariffs are never published). Non-blocking: #4–8, #10–14. Resolved: #6a (Tina, 2 seats) · #8 (Inter body, no Montserrat) · #9 (Agrandir unlicensed — Archivo Expanded behind `--font-display`) · #16 (GC/DO content supplied). #1 and #2 no longer block the build: nullable settings fields and a `showPrices` flag keep both reversible.
