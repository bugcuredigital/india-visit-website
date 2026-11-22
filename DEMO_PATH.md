# DEMO_PATH.md — the client walkthrough

**The 13 November demo has taken place.** It went ahead that morning on the
frozen build (your message, 13 Nov evening), before this route was refreshed
for the round-5 fixes. The route below describes production as it now stands
and is kept for the next walkthrough.

**Site:** https://india-visit-website.pages.dev (production at PR #31, 22 Nov:
round 5, the client's remarks and her eight short programmes). **Freeze:** on
since 22 Nov for agency merges; the client's own `/admin` edits stay open.
Open it on a laptop first, then repeat the homepage on a phone: the phone is
where most of the client's visitors will be.

Created for the 12 November demo, postponed to 13 November, and refreshed after
the round-5 fixes. Update it whenever the route or an open item changes.

## What changed in round 5 (22 Nov)

- **Her eight short programmes are live**: `/journeys/` now opens with three
  groups, and **Short Breaks** (2–4 days) is one chip away. Show one, e.g.
  `/journeys/taj-and-agra-1n-2d/`: every narrative is her own text, and the
  "Ideal for" line is her own "Best for". They are also listed on
  `/corporate/` until she decides (review sheet §28.1).
- **Title Case on every card and button**, by her remark ("City Palaces" on the
  Rajasthan page).
- **Her details everywhere**: the address and both numbers in the footer, the
  Instagram and Facebook icons, the GSTIN on `/corporate/` and
  `/booking-terms/`.
- **`/reviews/` opens on "Read Our TripAdvisor Reviews"**, and the homepage
  testimonials carry the same link quietly.
- The **Instagram section** is built but not shown: it appears once she adds
  three to six reels in Site settings.

Earlier, still true: one crimson action per screen; the sticky bar and Expand
All work after a tapped link; the corporate brief form is live.

## The route (about 20 minutes)

| # | Page | Show | Say |
|---|---|---|---|
| 1 | **Homepage** `/` | Video hero → trust bar → nine destinations (3×3) → signature journeys → how it works → why India Visit → Luxury Rail banner → corporate band → Travel Guide → "Tell us where you'd like to go" → footer | The phone number, WhatsApp and email are real: tap **Call** and **WhatsApp** on the phone to prove it (+91 98102 41121, info@india-visit.com). The sticky bar now appears on every page, however you got there. The enquiry form at the end of the page is live. |
| 2 | **Golden Triangle** `/journeys/golden-triangle-5n-6d/` | Hero ("The Taj Mahal at First Light"), quick facts, highlights, glance table, **Expand all** on the day-by-day, practical notes, related trips, the enquiry form | One template renders all 28 journeys. The enquiry form is live. To show the branded PDF, open `/downloads/golden-triangle-5n-6d.pdf` directly: the PDF download form on the page still reads "Launching Shortly". |
| 3 | **Kerala with Houseboat** `/journeys/kerala-with-houseboat-11n-12d/` | The longest custom journey | The client's own itinerary, ported section for section. |
| 4 | **Palace on Wheels** `/journeys/palace-on-wheels-7n-8d/` | Cabins ("Enquire for pricing"), "Operated by RTDC… Operator terms apply" (now once), booking steps, policies | Train tariffs are never published (permanent rule). No agent claims anywhere. |
| 5 | **Luxury trains** `/luxury-trains/` | The three trains, the FAQ | |
| 6 | **An article** `/travel-guide/best-time-to-visit-ladakh/` | Contents, FAQ, the embedded journey, the author line | Eight launch articles are live. The author line is a neutral "From the India Visit travel desk" until you confirm an authorship claim. |
| 7 | **Corporate** `/corporate/` | The professional register, then **Send us a brief** | The brief form asks for what a company buyer has: company, group size, dates, budget band. |
| 8 | **Plan My Trip** `/plan-my-trip/` | The four steps, through to **Send it over** | Live. An enquiry reaches info@india-visit.com within about a minute, sent from enquiries@india-visit.com with the visitor's email as reply-to, so the client's reply goes straight to the customer. |

**Optional live proof at step 8.** Submit one enquiry with your own phone and
email and the name "Demo enquiry", show the thank-you message ("Thank you — we'll
reply personally within a day."), then show the email arriving in the Gmail
inbox. It is a real lead email, so only if you want one there. Reload the page
to get the form back.

## Do not

- **Avoid the Deccan Odyssey page**: its eight days are provisional until the
  operator's programme arrives (review sheet §22).
- **On `/reviews/`, show the TripAdvisor button and stop there**: the two slots
  below it still read "Guest review coming soon", by design until consented
  reviews exist.
- Avoid the policy pages (`/privacy/`, `/terms/`, `/cancellation/`): structure
  only, waiting for the client's adviser.

## If they ask

| Question | Answer |
|---|---|
| "Are these our photos?" | Not yet. They are licensed stand-ins (Unsplash). Your Drive folder was inventoried: 455 images, 204 at web resolution or better. Five carry somebody else's mark or source (watermarks from three photographers, one image from Wikimedia), so nothing goes live until you tell us which images you own or have licensed. That is section 27 of the review sheet: four swaps are already picked and only wait for your answer. Swapping is a content change, no code. |
| "Does the form really work?" | Yes. Every enquiry form, Plan My Trip and the corporate brief included, sends to info@india-visit.com with the visitor's address as reply-to. Production test leads landed on 12 Nov. Next: a bot check (Turnstile) and a Google Sheet copy of every lead. |
| "Why do two forms still say Launching Shortly?" | The itinerary-PDF download and the newsletter. The PDF form switches on with the PDF release (the 20 PDFs themselves are printed); the newsletter needs a mailing list to send from. Both are in the next round. |
| "Why is there only one red button?" | Your own rule: crimson marks exactly one action per screen. Everything else is white, ink or a text link. |
| "Who writes the articles?" | The line under each article says "From the India Visit travel desk". A stronger authorship claim goes in when you confirm it (copy register S1). |
| "Why does TripAdvisor open in a new tab?" | The reviews live there, under TripAdvisor's terms. The site links to them and copies nothing: no review text, no rating, no badge. |
| "How do the reels get on the homepage?" | Site settings → Instagram reels: a still from each reel, its address and one caption line. Three to six, and the section appears. Nothing from Instagram loads on the site. |
| "Can we edit it ourselves?" | Yes, at `/admin`, signed in with GitHub: text, images, numbers, new articles. A save that breaks a rule is refused by the build, and the live site stays as it was. Fully open since 14 Nov, when a live text-and-image save came through clean. |
| "Where are the prices?" | Deliberately off (`showPrices`), and train fares are never published. |
| "Who wrote the founder's words?" | Sheena did. Since 21 Nov the homepage lines and the whole About page come from her own About Us (copy register §T). Our earlier draft is struck. |

## Live state at hand-off

- **Production:** PR #31 (round 5), deployed 22 Nov. Before it: PR #29 (her
  About Us, 21 Nov); PR #27, #26 and #25 (14 Nov: the reduced-motion hero,
  Partytown 1.0.5, `/admin` open); PR #23, #21 and #20 (13 Nov).
- **Checks:** hero contrast in each run's own colour, on phones with reduced
  motion too; keyboard; responsive 360–1440; no-JS; hero video; links; CMS
  images; Template Spec on 28 journeys; transport labels; the hardcoded-details
  audit, which now names every contact field as resolved. Lighthouse on
  production after round 5: see the session log, 22 Nov.
- **Captures** of the round-5 pages, desktop and phone, from production:
  `reports/round5-2026-11-22/`. The full route as of 13 Nov:
  `reports/demo-2026-11-13/`.
- Line-by-line status: `SITE_STATUS.md`. What changed: the session log. The
  audit and its status: `docs/UNSLOP_AUDIT.md`.
