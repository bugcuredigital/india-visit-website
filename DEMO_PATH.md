# DEMO_PATH.md — the client walkthrough, 12 November 2026, 7 pm

**Site:** https://india-visit-website.pages.dev (production, `main`). Every
change below is live there. Open it on a laptop first, then repeat the homepage
on a phone: the phone is where most of the client's visitors will be.

Created for the demo on 2026-11-12 (there was no earlier version). Update it
whenever the route or an open item changes.

## The route (about 20 minutes)

| # | Page | Show | Say |
|---|---|---|---|
| 1 | **Homepage** `/` | Video hero → trust bar → nine destinations (3×3) → signature journeys → how it works → why India Visit → Luxury Rail banner → corporate band → Travel Guide → "Tell us where you'd like to go" → footer | The phone number, WhatsApp and email are real: tap **Call** and **WhatsApp** on the phone to prove it (+91 98102 41121, info@india-visit.com). |
| 2 | **Golden Triangle** `/journeys/golden-triangle-5n-6d/` | Hero, quick facts, highlights, glance table, **Expand all** on the day-by-day, practical notes, related trips | One template renders all 20 journeys. To show the branded PDF, open `/downloads/golden-triangle-5n-6d.pdf` directly; the download form on the page is not live yet. |
| 3 | **Kerala with Houseboat** `/journeys/kerala-with-houseboat-11n-12d/` | The longest custom journey | The client's own itinerary, ported section for section. |
| 4 | **Palace on Wheels** `/journeys/palace-on-wheels-7n-8d/` | Cabins ("Enquire for pricing"), "Operated by RTDC… Operator terms apply", booking steps, policies | Train tariffs are never published (permanent rule). No agent claims anywhere (today's ruling). |
| 5 | **Luxury trains** `/luxury-trains/` | The three trains, the FAQ | |
| 6 | **An article** `/travel-guide/best-time-to-visit-ladakh/` | Contents, FAQ, the embedded journey | Eight launch articles are live. |
| 7 | **Corporate** `/corporate/` | The professional register | |
| 8 | **Plan My Trip** `/plan-my-trip/` | The four-step form | Forms go live once the first test email lands (see below). |
| 9 | **The editor** `/admin` | Browse a journey and the settings, **read only** | See "Do not" below. |

## Do not

- **Do not save anything in `/admin` during the demo** unless the image round
  trip has been confirmed in SITE_STATUS.md. The first production save broke
  the build (fixed and guarded since), and the live test of the fix needs one
  deliberate save on a non-demo journey first.
- **Avoid the Deccan Odyssey page**: its eight days are provisional until the
  operator's programme arrives (review sheet §22).
- **Avoid `/reviews/`**: two "Guest review coming soon" slots, by design until
  consented reviews exist.
- Avoid the policy pages (`/privacy/`, `/terms/`, `/cancellation/`): structure
  only, waiting for the client's adviser.

## If they ask

| Question | Answer |
|---|---|
| "Are these our photos?" | Not yet. They are licensed stand-ins (Unsplash). The Drive folder was inventoried today (455 images, 204 at web resolution or better), but it contains third-party copyrighted images (one carries a visible "© Nick Mayo" watermark), so nothing goes live until the client confirms which images they own or have licensed. Swapping is a content change, no code. |
| "Why does the form say Launching shortly?" | The lead function is built and deployed. It switches on after one real test email lands in info@india-visit.com, so no enquiry is ever lost. |
| "Can we edit it ourselves?" | Yes, at `/admin`, signed in with GitHub. Text, images, numbers, new articles. A save that breaks a rule is refused by the build and the live site stays as it was. |
| "Where are the prices?" | Deliberately off (`showPrices`), and train fares are never published. |
| "Who wrote the founder's words?" | We did, as a draft (copy register B11). The founder's own words replace it. |

## Live state at hand-off

See `SITE_STATUS.md` for the line-by-line status, and the session log entry of
2026-11-12 for what changed today.
