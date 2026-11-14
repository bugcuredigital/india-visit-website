# DEMO_PATH.md — the client walkthrough

**The 13 November demo has taken place.** It went ahead that morning on the
frozen build (your message, 13 Nov evening), before this route was refreshed
for the round-5 fixes. The route below describes production as it now stands
and is kept for the next walkthrough.

**Site:** https://india-visit-website.pages.dev (production `3c593ad`: the
round-5 fixes, live since 16:08 IST, and `/booking-terms/` published, live
since 19:21 IST). **Freeze:** lifted until further notice (your message,
13 Nov evening).
Open it on a laptop first, then repeat the homepage on a phone: the phone is
where most of the client's visitors will be.

Created for the 12 November demo, postponed to 13 November, and refreshed after
the round-5 fixes. Update it whenever the route or an open item changes.

## What changed since yesterday's route

- **One crimson action per screen.** The header's Plan My Trip pill is the only
  red button in a first screen. On the homepage and journey heroes the main
  button is a white outline beside the header pill at laptop size, and crimson
  on a phone (where the pill is hidden). The second hero action is now a text
  link.
- **The phone's sticky bar and Expand all work after a tapped link** (PR #20,
  live since 10:59 IST). Yesterday's workaround is gone.
- **Corporate has its own brief form**: company, group size, dates, budget band,
  requirements. It is live, and the email arrives titled "New corporate brief".
- **Plan My Trip**: on a phone the form is on the first screen, and Next is the
  red button.
- Words: the article author line, the Beyond India line and the Golden Triangle
  hero line were rewritten as you ruled (copy register §S).

## The route (about 20 minutes)

| # | Page | Show | Say |
|---|---|---|---|
| 1 | **Homepage** `/` | Video hero → trust bar → nine destinations (3×3) → signature journeys → how it works → why India Visit → Luxury Rail banner → corporate band → Travel Guide → "Tell us where you'd like to go" → footer | The phone number, WhatsApp and email are real: tap **Call** and **WhatsApp** on the phone to prove it (+91 98102 41121, info@india-visit.com). The sticky bar now appears on every page, however you got there. The enquiry form at the end of the page is live. |
| 2 | **Golden Triangle** `/journeys/golden-triangle-5n-6d/` | Hero ("The Taj Mahal at First Light"), quick facts, highlights, glance table, **Expand all** on the day-by-day, practical notes, related trips, the enquiry form | One template renders all 20 journeys. The enquiry form is live. To show the branded PDF, open `/downloads/golden-triangle-5n-6d.pdf` directly: the PDF download form on the page still reads "Launching shortly". |
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
- **Avoid `/reviews/`**: two "Guest review coming soon" slots, by design until
  consented reviews exist.
- Avoid the policy pages (`/privacy/`, `/terms/`, `/cancellation/`): structure
  only, waiting for the client's adviser.

## If they ask

| Question | Answer |
|---|---|
| "Are these our photos?" | Not yet. They are licensed stand-ins (Unsplash). Your Drive folder was inventoried: 455 images, 204 at web resolution or better. Five carry somebody else's mark or source (watermarks from three photographers, one image from Wikimedia), so nothing goes live until you tell us which images you own or have licensed. That is section 27 of the review sheet: four swaps are already picked and only wait for your answer. Swapping is a content change, no code. |
| "Does the form really work?" | Yes. Every enquiry form, Plan My Trip and the corporate brief included, sends to info@india-visit.com with the visitor's address as reply-to. Production test leads landed on 12 Nov. Next: a bot check (Turnstile) and a Google Sheet copy of every lead. |
| "Why do two forms still say Launching shortly?" | The itinerary-PDF download and the newsletter. The PDF form switches on with the PDF release (the 20 PDFs themselves are printed); the newsletter needs a mailing list to send from. Both are in the next round. |
| "Why is there only one red button?" | Your own rule: crimson marks exactly one action per screen. Everything else is white, ink or a text link. |
| "Who writes the articles?" | The line under each article says "From the India Visit travel desk". A stronger authorship claim goes in when you confirm it (copy register S1). |
| "Can we edit it ourselves?" | Yes, at `/admin`, signed in with GitHub: text, images, numbers, new articles. A save that breaks a rule is refused by the build, and the live site stays as it was. Fully open since 14 Nov, when a live text-and-image save came through clean. |
| "Where are the prices?" | Deliberately off (`showPrices`), and train fares are never published. |
| "Who wrote the founder's words?" | We did, as a draft (copy register B11). The founder's own words replace it. |

## Live state at hand-off

- **Production:** `3c593ad` (PR #23, `/booking-terms/` without the notice
  and indexed), deployed 19:21 IST. Before it: `74a9ddf` (PR #21, the 26 high
  items of the round-5 audit), deployed 16:08 IST, and `03a1607` (PR #20, the
  sticky bar and Expand all after a tapped link, live 10:59 IST).
- **Checks on this build:** hero contrast in each run's own colour (33 pages,
  317 runs, 0 failures), keyboard, responsive 360–1440, no-JS, hero video,
  links, CMS images, template spec, transport labels. Lighthouse on the preview:
  Performance 99–100 and Accessibility 100 on the five pages measured, LCP
  0.9–2.0s, CLS 0.
- **Captures** of every route page, desktop and phone, taken from production:
  `reports/demo-2026-11-13/`.
- Line-by-line status: `SITE_STATUS.md`. What changed: the session log entries
  of 12 and 13 November. The audit and its status: `docs/UNSLOP_AUDIT.md`.
