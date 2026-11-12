# DEMO_PATH.md — the client walkthrough, 12 November 2026, 7 pm IST

**Site:** https://india-visit-website.pages.dev (production, `main` at `7a07fd4`,
live since 18:04 IST). **Frozen:** nothing merges until after the demo.
Open it on a laptop first, then repeat the homepage on a phone: the phone is
where most of the client's visitors will be.

Created for the demo on 2026-11-12 and refreshed at the freeze. Update it
whenever the route or an open item changes.

## The route (about 20 minutes)

| # | Page | Show | Say |
|---|---|---|---|
| 1 | **Homepage** `/` | Video hero → trust bar → nine destinations (3×3) → signature journeys → how it works → why India Visit → Luxury Rail banner → corporate band → Travel Guide → "Tell us where you'd like to go" → footer | The phone number, WhatsApp and email are real: tap **Call** and **WhatsApp** on the phone to prove it (+91 98102 41121, info@india-visit.com). The enquiry form at the end of the page is live. |
| 2 | **Golden Triangle** `/journeys/golden-triangle-5n-6d/` | Hero, quick facts, highlights, glance table, **Expand all** on the day-by-day, practical notes, related trips, the enquiry form | One template renders all 20 journeys. The enquiry form is live. To show the branded PDF, open `/downloads/golden-triangle-5n-6d.pdf` directly: the PDF download form on the page still reads "Launching shortly". |
| 3 | **Kerala with Houseboat** `/journeys/kerala-with-houseboat-11n-12d/` | The longest custom journey | The client's own itinerary, ported section for section. |
| 4 | **Palace on Wheels** `/journeys/palace-on-wheels-7n-8d/` | Cabins ("Enquire for pricing"), "Operated by RTDC… Operator terms apply", booking steps, policies | Train tariffs are never published (permanent rule). No agent claims anywhere (today's ruling). |
| 5 | **Luxury trains** `/luxury-trains/` | The three trains, the FAQ | |
| 6 | **An article** `/travel-guide/best-time-to-visit-ladakh/` | Contents, FAQ, the embedded journey | Eight launch articles are live. |
| 7 | **Corporate** `/corporate/` | The professional register | |
| 8 | **Plan My Trip** `/plan-my-trip/` | The four steps, through to **Send it over** | Live. An enquiry reaches info@india-visit.com within about a minute, sent from enquiries@india-visit.com with the visitor's email as reply-to, so the client's reply goes straight to the customer. |

**Optional live proof at step 8.** Submit one enquiry with your own phone and
email and the name "Demo enquiry", show the thank-you message ("Thank you — we'll
reply personally within a day."), then show the email arriving in the Gmail
inbox. It is a real lead email, so only if you want one there. Reload the page
to get the form back.

## Do not

- **Do not open `/admin`** (your ruling today). The live check of image saves
  through the editor is parked until tomorrow, 13 November. Your Tadoba test
  save never reached GitHub, so nothing on the site changed.
- **Avoid the Deccan Odyssey page**: its eight days are provisional until the
  operator's programme arrives (review sheet §22).
- **Avoid `/reviews/`**: two "Guest review coming soon" slots, by design until
  consented reviews exist.
- Avoid the policy pages (`/privacy/`, `/terms/`, `/cancellation/`): structure
  only, waiting for the client's adviser.

## If they ask

| Question | Answer |
|---|---|
| "Are these our photos?" | Not yet. They are licensed stand-ins (Unsplash). Your Drive folder was inventoried today: 455 images, 204 at web resolution or better. Five carry somebody else's mark or source (watermarks from three photographers, one image from Wikimedia), so nothing goes live until you tell us which images you own or have licensed. That is section 27 of the review sheet: four swaps are already picked and only wait for your answer. Swapping is a content change, no code. |
| "Does the form really work?" | Yes. Every enquiry form, Plan My Trip included, sends to info@india-visit.com with the visitor's address as reply-to. The production test lead at 14:33 today landed in the inbox. Next, after the demo: a bot check (Turnstile) and a Google Sheet copy of every lead. |
| "Why do two forms still say Launching shortly?" | The itinerary-PDF download and the newsletter. The PDF form switches on with the PDF release (the 20 PDFs themselves are printed); the newsletter needs a mailing list to send from. Both are in the next round. |
| "Can we edit it ourselves?" | Yes, at `/admin`, signed in with GitHub: text, images, numbers, new articles. A save that breaks a rule is refused by the build, and the live site stays as it was. We finish the last check on image saves tomorrow; after that, it is fully open. |
| "Where are the prices?" | Deliberately off (`showPrices`), and train fares are never published. |
| "Who wrote the founder's words?" | We did, as a draft (copy register B11). The founder's own words replace it. |

## Live state at hand-off

- **Production:** `7a07fd4`, deployed 18:04 IST, frozen until after the demo.
- **Forms:** 102 lead forms live, on every one of the 54 pages; 21 read "Launching shortly" (the 20 PDF download forms and the newsletter). Checked on production at 18:05: a real click on the homepage form and on Plan My Trip shows the thank-you message, with `/api/lead` answering 200 (run with the honeypot filled, so no email was sent).
- **Captures** of every route page, desktop and phone, taken from production at
  the freeze: `reports/demo-2026-11-12/`.
- Line-by-line status: `SITE_STATUS.md`. What changed today: the three session
  log entries of 2026-11-12.
