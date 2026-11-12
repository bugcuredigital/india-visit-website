# COPY_REGISTER.md — every drafted string on the site, by page

**Purpose.** Design round 3 introduced a standing rule (CLAUDE.md, *Word
control*): **no invented user-facing copy goes live-looking.** Every string
that is not sourced from the client's own documents or from an explicit client
instruction is either obviously a placeholder, or listed here for approval.

This file is the list. It is written to be **approved or struck in bulk**: read
down a section, and mark anything you want rewritten. Nothing here is a
question about *design* — those live in `CLIENT_REVIEW_SHEET.md`. This is only
about **words**.

## How to read the status column

| Status | Meaning |
|---|---|
| **APPROVED** | Traceable to a source you own: the PRD, `PAGE_TEMPLATES.md`, the Itinerary Page Template Specification, your itinerary documents, or a ruling you gave in a review round. Not up for discussion unless you changed your mind. |
| **DRAFT** | Written by the agency. Plausible, in voice, and **not yet approved by you**. This is the column to read. |
| **PLACEHOLDER** | Deliberately neutral, visibly provisional, and replaced before launch. Listed for completeness, not for approval. |

Where a whole section of copy is already being reviewed elsewhere — the Palace
on Wheels day narratives, the founder quote — this file points at the
`CLIENT_REVIEW_SHEET.md` section rather than repeating it.

**Scale note.** 33 pages are live. Itinerary day titles, day narratives,
highlights, practical notes and FAQ answers are **content**, not chrome, and
they are already covered by `CLIENT_REVIEW_SHEET.md` §2, §4, §6 and the M5
content pass. This register covers the **chrome**: headlines, section headings,
eyebrows, ledes, promises and button labels — the strings that are written once
and then appear on every page.

---

## A. Sitewide — appears on every page

| # | Where | String | Status | Note |
|---|---|---|---|---|
| A1 | Footer, brand | "Curated journeys across India and beyond" | **DRAFT** | `siteSettings.tagline`. The one line that sits under the logo on every page. |
| A2 | Footer, trust line | "20+ years · 24/7 On-Trip Support" | **APPROVED** | PRD §7.1 trust bar; `yearsExperience` + `supportPromise`. |
| A3 | Footer form heading | "Send a quick enquiry" | **DRAFT** | New in round 3 (item 8). |
| A4 | Footer legal | "© {year} India Visit. All rights reserved." | **APPROVED** | Standard. |
| A5 | ConvertBand eyebrow | "Speak to a person, not a portal" | **DRAFT** | Appears at the foot of nearly every page. High-leverage line — worth reading twice. |
| A6 | ConvertBand default heading | "Shall we start planning?" | **DRAFT** | Fallback when a page does not set its own. |
| A7 | ConvertBand buttons | "WhatsApp us" · the phone number | **APPROVED** | PRD §8 conversion paths. |
| A8 | Enquiry form submit | "Start planning" (page forms) · "Send enquiry" (footer) | **DRAFT** | |
| A9 | Enquiry form note | "We reply personally — no call centre, no spam." | **DRAFT** | ⚑ This is a **promise**. It commits you to a human reply. |
| A10 | Enquiry form consent | "I agree to India Visit contacting me about this enquiry, per the Privacy Policy." | **DRAFT** | ⚑ Consent wording is a **legal** string — see §19 of the review sheet. |
| A11 | Form labels | "Your name" · "Phone or WhatsApp" · "Email" · "Travel month" · "Anything you'd like us to know?" · "Where would you like to go?" | **DRAFT** | |
| A12 | Skip link | "Skip to content" | **APPROVED** | Accessibility standard. |
| A13 | Nav labels | Destinations · Journeys · Luxury Trains · Corporate · Travel Guide · About · Reviews · **Plan My Trip** | **APPROVED** | Locked in CLAUDE.md, URL structure. |

---

## B. Homepage (`/`)

| # | Where | String | Status | Note |
|---|---|---|---|---|
| B1 | Hero H1 | "Journeys across India, planned by a person" | **DRAFT** | ⚑ The single most important line on the site. |
| B2 | Hero lede | "20 years of arranging unhurried, private travel — Rajasthan to the backwaters, the Himalayas to Bhutan, Bali and Vietnam." | **DRAFT** | The regions named are locked; the sentence around them is drafted. |
| B3 | Hero CTAs | "Plan My Trip" · "Explore Journeys" | **APPROVED** | PAGE_TEMPLATES T1 §1. |
| B4 | Trust bar | "20+ Years" · "{n} Curated Journeys" · "9 Regions" · "24/7 On-Trip Support" | **APPROVED** | PRD §7.1; the middle two are counted from the catalogue, not claimed. |
| B5 | Destinations eyebrow + H2 | "Nine regions" / "Where do you want to go?" | **DRAFT** | |
| B6 | Journeys eyebrow + H2 | "Signature journeys" / "Trips we would take ourselves" | **DRAFT** | ⚑ First person. Reads as the founder speaking — confirm you are comfortable with that voice. |
| B7 | How-it-works H2 | "Three steps, one person looking after them" | **DRAFT** | |
| B8 | How-it-works steps | "Tell us your dream" · "We craft your itinerary" · "Travel fully supported" | **APPROVED** | PAGE_TEMPLATES T1 §4 names these three steps. |
| B9 | How-it-works step bodies | Three short paragraphs, incl. *"Not a call centre."* | **DRAFT** | ⚑ "Not a call centre" is a **promise** about how you answer the phone. |
| B10 | Consultant eyebrow + H2 | "Meet your travel consultant" / "Someone plans your trip. Not something." | **DRAFT** | Section itself is CLIENT_REVIEW_SHEET §14. |
| B11 | Consultant quote | The founder's paragraph | **DRAFT** | Already in CLIENT_REVIEW_SHEET §14 — agency draft, awaiting your words. |
| B12 | Why-us eyebrow + H2 | "Why India Visit" / "The difference is who plans it" | **DRAFT** | |
| B13 | Why-us item 1 | "Twenty years of it" — *"…long enough to know which hill station is worth the drive in July."* | **DRAFT** | |
| B14 | Why-us item 2 | "Curated, not catalogued" — *"Every itinerary is written for the people travelling it. Nothing is picked off a shelf."* | **DRAFT** | |
| B15 | Why-us item 3 | "Affordable luxury" — *"Heritage properties, private guides and unhurried days — arranged at the price of a package tour."* | **DRAFT** | ⚑ **Price claim.** "At the price of a package tour" is a comparative pricing statement. |
| B16 | Why-us item 4 | "With you the whole way" — `supportPromise` | **APPROVED** | |
| B17 | Trains eyebrow + H2 | "Luxury rail" / "India's legendary luxury trains" | **DRAFT** | |
| B18 | Trains body | "…booked through authorised agents, with the operator's terms set out plainly before you commit." | **APPROVED** | Required disclosure framing, CLAUDE.md invariant #6. |
| B19 | Testimonials eyebrow + H2 | "In their words" / "What travellers say" | **DRAFT** | |
| B20 | Corporate band | "Corporate travel" / "Offsites, incentives and conferences" / one sentence + CTA | **DRAFT** | New in round 3 (item 7). |
| B21 | Travel-guide band | "Travel guide" / "Reading before you go" / "All articles" | **DRAFT** | |
| B22 | Closing ConvertBand | "Tell us where you'd like to go" + body ending *"No obligation, and no call centre."* | **DRAFT** | ⚑ Another "no call centre" promise. |

---

## C. Journeys

| # | Where | String | Status | Note |
|---|---|---|---|---|
| C1 | `/journeys/` H1 + lede | "All Journeys" / "Every route we run, written up day by day. Each one is a starting point — tell us what to change and we will rebuild it around you." | **DRAFT** | ⚑ "Every route we run" is literally true only once M5 seeds all twenty. |
| C2 | `/journeys/` closing | "Can't find your perfect trip?" | **DRAFT** | |
| C3 | Journey page section headings | "Journey Highlights" · "Itinerary at a Glance" · "Day by Day" · "What's included" · "Not included" · "Practical notes" · "Cabin Categories" · "How booking works" · "Departures" · "Policies & cancellation" · "Trips like this" | **APPROVED** | Itinerary Page Template Specification §4/§6. Not ours to rename. |
| C4 | Journey ConvertBand | "Shall we tailor this to your dates?" (A) · "Departures fill early — check availability for your dates" (B) | **DRAFT** | |
| C5 | Journey titles, day titles, day narratives, highlights, inclusions | — | **see CLIENT_REVIEW_SHEET §2, §4, §6** | Content, already under review. |
| C6 | Trip-type tag | "Custom Journey" · "Luxury Train — Fixed Departures" | **APPROVED** | Template Spec S1. |

---

## D. Destinations and cities

| # | Where | String | Status | Note |
|---|---|---|---|---|
| D1 | `/destinations/` H1 + lede | "Where we go" / "Nine regions we have been arranging journeys through for twenty years — six across India, three beyond it. Every one of them is planned by someone who has been there." | **DRAFT** | ⚑ "Twenty years" applied to *all nine* regions — including Bali and Vietnam. Confirm that is accurate, or the sentence needs splitting. |
| D2 | Destination names | The nine locked names | **APPROVED** | CLAUDE.md, URL structure. |
| D3 | Destination intros, practical notes, FAQ answers (8 pages) | — | **DRAFT** | Drawn from public knowledge, flagged provisional. **CLIENT_REVIEW_SHEET §17.** |
| D4 | Destination section headings | "About {name}" · "Journeys in {short}" · "What defines {short}" · "Practical notes — {short}" · "{short} — common questions" | **DRAFT** | Pattern, not per-page. Approve the pattern once. |
| D5 | Destination ConvertBand | "Shall we plan {short}?" | **DRAFT** | |
| D6 | City pages (Jaipur, Kochi) — all prose | — | **DRAFT** | **CLIENT_REVIEW_SHEET §16.** Flagged provisional in the CMS. |
| D7 | City section headings | "About {city}" · "What to see and do in {city}" · "Trips that visit {city}" · "{city} in photographs" · "Practical notes — {city}" · "{city} — common questions" · "Planning {city}?" | **DRAFT** | Pattern. |

---

## E. Luxury trains (`/luxury-trains/`)

| # | Where | String | Status | Note |
|---|---|---|---|---|
| E1 | H1 + lede | "India's legendary luxury trains" / "Authorised booking agents — Palace on Wheels, the Golden Chariot and the Deccan Odyssey" | **APPROVED** | The disclosure half is required (invariant #6). |
| E2 | "Why by train" H2 | "Seven cities, one unpacking" | **DRAFT** | |
| E3 | Three reasons | "A heritage hotel on wheels" · "Unpack once" · "Almost everything is included" + bodies | **DRAFT** | ⚑ "Almost everything is included" is an **inclusions claim**; it must match the operator's actual inclusions. |
| E4 | "Booking a luxury train" | Section copy | **APPROVED** | Derived from the operator documents. |
| E5 | Closing | "Check availability for your dates" | **DRAFT** | |

---

## F. Corporate (`/corporate/`)

| # | Where | String | Status | Note |
|---|---|---|---|---|
| F1 | H1 + lede | "Corporate travel & offsites" / "One vendor, GST invoicing, and a single person who answers the phone for the whole trip. 20 years of doing this for companies that cannot afford the trip to go wrong." | **DRAFT** | ⚑ **GST invoicing** is a factual claim about your business. |
| F2 | Capabilities H2 + four items | "Four kinds of trip"; Offsites · Incentive trips (MICE) · Conferences · Group logistics, each with a body | **APPROVED** *(names)* / **DRAFT** *(bodies)* | The four categories are PAGE_TEMPLATES T5 §2. |
| F3 | Capability body, Offsites | "Twenty to two hundred people…" | **DRAFT** | ⚑ **Capacity claim.** Confirm the range. |
| F4 | Three steps | "Brief us" · "We come back with a proposal" · "We run the whole trip" + bodies | **DRAFT** | Written **without** a response-time number on purpose — T5 §3's "Proposal in 48h" is not published until you confirm it (CLIENT_REVIEW_SHEET §13). |
| F5 | Team destinations H2 | "Destinations that suit a group" | **DRAFT** | |
| F6 | Brief form | "Tell us what the trip is for" + body | **DRAFT** | |

---

## G. About (`/about/`)

| # | Where | String | Status | Note |
|---|---|---|---|---|
| G1 | H1 + lede | "Every trip on this site was planned by a person" / "…not one itinerary written by somebody who had not been there." | **DRAFT** | ⚑ **Strong claim**, stated absolutely. |
| G2 | "The story" — three paragraphs | "India Visit began the way most good consultancies do…" | **DRAFT** | ⚑ This is **your history, written by us from inference**. It contains no dates (the founding year is still unverified) but it does assert how the business started. Read it closely or strike it. |
| G3 | Philosophy H2 + three items | "What that actually means"; "Luxury where it changes the day" · "Value where it does not" · "Nothing bought off a shelf" | **DRAFT** | |
| G4 | Philosophy body, Value | "…we will tell you when an upgrade is not worth what it costs." | **DRAFT** | ⚑ A **promise** about how you advise. |
| G5 | Closing | "Start a conversation" + "Not a booking form — a conversation." | **DRAFT** | |

---

## H. Reviews (`/reviews/`)

| # | Where | String | Status | Note |
|---|---|---|---|---|
| H1 | H1 + lede | "Guest stories" / "Published in the traveller's own words, and only with their written permission. We would rather show you a handful we can stand behind than a wall of them we cannot." | **DRAFT** | |
| H2 | Empty-slot line | *"Guest review coming soon"* | **PLACEHOLDER** | Round 3, item 1. Replaces the paragraph of internal meta-text that was rendering as if it were a review. |
| H3 | Closing | "Become our next story" + body | **DRAFT** | |
| H4 | Trailing note | "More guest stories are being collected with permission and join this page as they are confirmed." | **DRAFT** | |

---

## I. Travel guide (`/travel-guide/`)

| # | Where | String | Status | Note |
|---|---|---|---|---|
| I1 | H1 + lede | "Travel guide" / "The things we end up explaining on the phone anyway — when to go, what a visa actually involves, and what a region is like once you are in it." | **DRAFT** | |
| I2 | Category labels | "Planning & Visas" · "Best Time to Visit" · "Destination Guides" | **APPROVED** | PAGE_TEMPLATES T8. |
| I3 | Newsletter band | "Twice a month" / "Travel inspiration, not a mailing list" / "One note a fortnight… Unsubscribe in one click." | **DRAFT** | ⚑ **Frequency promise** *and* an unsubscribe promise. Both must be true once the list is wired in M6. |
| I4 | Article body — Kerala houseboat guide | — | **DRAFT** | Full article, agency-written. |
| I5 | Pending note | "Seven more articles are written and land with the rest of the catalogue in M5." | **DRAFT** | Internal-facing; strike before launch. |

---

## J. Plan my trip (`/plan-my-trip/`)

| # | Where | String | Status | Note |
|---|---|---|---|---|
| J1 | H1 | "Tell us the shape of it" | **DRAFT** | |
| J2 | "What happens next" | "We read it properly" · "We come back with a draft" · "We change it until it fits" | **DRAFT** | ⚑ Three **process promises**, and the one the enquiry form is judged against. |
| J3 | "Before you send it" | Section copy | **DRAFT** | |

---

## K. 404 and policies

| # | Where | String | Status | Note |
|---|---|---|---|---|
| K1 | 404 H1 + body | "Looks like you've wandered off the route" / "That page has moved or never existed. No harm done — the good stuff is all one click away." | **DRAFT** | T13 asks for "charming"; this is the agency's attempt at it. |
| K2 | `/privacy/`, `/terms/`, `/cancellation/` | All body copy | **PLACEHOLDER** | ⚑ **LEGAL — CLIENT_REVIEW_SHEET §19.** Structure only, `noindex` until real copy lands. The agency does not draft binding legal copy. |
| K3 | `/booking-terms/` | Body copy | **APPROVED** | Built from the operator documents and the journey entries; no agency invention. |

---

## What to do with this file

1. Read the **DRAFT** rows, especially the ones marked ⚑ — those are claims,
   promises or numbers rather than atmosphere.
2. Strike or rewrite anything you disagree with. A one-line reply per row is
   plenty ("B15 — drop the package-tour comparison").
3. Anything you approve moves to **APPROVED** here and stops being re-litigated
   in later rounds.

Everything not yet approved is still live on the preview, because a blank page
is not reviewable — but nothing on the list is treated as settled until it is
marked so here.
