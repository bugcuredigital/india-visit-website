# CLIENT_REVIEW_SHEET.md — items awaiting client sign-off

Everything the agency has filled in **provisionally** so the build could
proceed. Each item is live on the site now but must be confirmed or corrected
before launch. One pass through this sheet clears the lot.

Created during M2 (originally scheduled for M5) because the Palace on Wheels
port produced provisional content that needed recording immediately.

**How to use:** for each row, either write "OK" or give the correction. Items
tied to a PRD Open Question are also blocked on that question.

---

## 1. Palace on Wheels — GSA disclosure wording ⚑ (PRD Open Question #15)

The source document names a *different agency* as the booking agent, so its
disclosure language could not be reused. The wording below is the agency's
draft and needs your exact approved text.

> India Visit is an authorised booking agent (GSA) for the Palace on Wheels.
> The train is owned and operated by RTDC, the Rajasthan Tourism Development
> Corporation, Government of Rajasthan, and the operator's terms apply to your
> journey. Our liability is that of booking agent.

**Also still open on #15:** may we publish the current-season departure
schedule? Until you confirm, all three train pages render
"Seasonal departures — enquire for current dates".

**Settled, no action needed:** operator tariffs are never published. Every USD
figure in all three train source docs is suppressed, and a grep guards it on
every build.

## 2. Palace on Wheels — day-by-day narratives (8 entries)

The source document supplies route, cabins, inclusions, booking process and
cancellation rules but **no day-by-day section at all**. These eight day
entries were drafted from the published route so the page is structurally
complete. Each is flagged `provisional: true` in the content file.

| Day | Draft title | Needs |
|---|---|---|
| 1 | Delhi — All Aboard | Confirm boarding time, welcome ceremony details |
| 2 | Jaipur — The Pink City | Confirm which forts/palaces are actually included |
| 3 | Sawai Madhopur & Chittorgarh — Tigers and Ramparts | Confirm safari timing and whether Chittorgarh is same-day |
| 4 | Udaipur — Venice of the East | Confirm City Palace inclusion alongside the boat ride |
| 5 | Jaisalmer — The Golden City | Confirm fort/haveli stops and camel-ride timing |
| 6 | Jodhpur — Beneath Mehrangarh | Confirm which sites beyond the fort |
| 7 | Bharatpur & Agra — Birdlife and the Taj | Confirm rickshaw ride and Taj visit timing |
| 8 | Delhi — Journey's End | Confirm disembarkation time and assistance arrangements |

## 3. Palace on Wheels — cabin descriptions

The operator table lists only what each tier adds *compared to the Deluxe
cabin*, so the Deluxe row was inferred (coach excursions with a shared guide).
Please confirm the Deluxe cabin's actual facilities.

Higher tiers are verbatim from the operator document and need no review.

## 4. Journey highlights — Palace on Wheels (7 items)

The source document has no highlight list, so these were distilled from its
route description. Verb-led, one line each. Please confirm or reword.

## 5. Pace, "Ideal for" and Best season ⚑ (PRD Open Question #14)

Editorial fields that do not exist in any source document. Required by the
Quick Facts bar. Agency assignments so far:

| Journey | Pace | Ideal for | Best season |
|---|---|---|---|
| Kerala with Houseboat (11N/12D) | Relaxed | Couples, Families, Seniors | October to March |
| Palace on Wheels (7N/8D) | Moderate | Couples, Seniors, First-timers | September to April |

The remaining 18 journeys get the same treatment during M5 and will be added
here.

## 6. Practical notes — Kerala with Houseboat

The source document has no practical-notes section; a lighter domestic set was
written from the itinerary (best time, nearest airport, ideal duration, pace).
Please confirm the airport and season claims.

## 7. Trust numbers ⚑ (PRD Open Question #2)

Currently **only two stats render**: "20+ Years" and "24/7 On-Trip Support".
The rest are `null` in settings and therefore not displayed at all — we never
publish an unverified number.

| Field | Status |
|---|---|
| `foundingYear` | null — needed for "Curating journeys since ____" |
| `travellerCount` | null — needed for the travellers stat |
| `destinationCount` | null — needed for the destinations stat |
| `aggregateRating` | null — no rating line on /reviews/ until supplied |

## 8. Pricing ⚑ (PRD Open Question #1)

`showPrices` is **false**, so no price appears anywhere. The optional
`priceFrom` field exists on journeys so the decision stays reversible without
a schema change. Train pages are exempt permanently.

## 9. Contact details — all placeholder

Every value in `siteSettings` is a placeholder, inventoried in that file's
`_dummyDataFlags` array. Needed before launch: phone, WhatsApp number, the
WhatsApp prefill wording, email, postal address, and social handles
(PRD Open Question #7).

## 10. Testimonials ⚑ (PRD Open Question #3)

Two entries exist with `PLACEHOLDER TESTIMONIAL` text purely so the component
could be built. **Real reviews with recorded consent are required** — the
schema refuses any entry whose `consentConfirmed` is not `true`.

## 11. Photography

All heroes currently use flagged `PLACEHOLDER-IMAGE` graphics. Awaiting the
photo archive (pre-processed to ≤2000px wide).

## 12. Kerala journeys — differentiation check (M5)

Three Kerala itineraries are in scope and must read as distinct products, not
near-duplicates: the 11N Houseboat journey, the 12N Trivandrum circuit, and
the shorter general Kerala itinerary. If the third turns out to be a true
subset of another with no distinct identity, the agency will flag it rather
than publish a duplicate.

## 13. Response-time SLA (PRD Open Question #12)

`responseSla` is null, so form success states omit the promise. What
timeframe may we commit to publicly?

---

## 14. Homepage — "Meet your travel consultant" (added M4 revision 2)

PAGE_TEMPLATES T1 v2 adds a founder section to the homepage — the trust
centrepiece of the page. Three things there need you, and **none of them have
been invented in the meantime**:

| Field | Status | What we need |
|---|---|---|
| `founder.name` | **BLANK** — deliberately | Your name as you want it published. The section renders without a name line rather than with a guess, because putting a made-up name on a real consultancy's founder is a fabrication, not a placeholder. |
| `founder.role` | Provisional: *"Founder & Travel Consultant"* | Confirm or replace. |
| `founder.quote` | **PROVISIONAL agency draft** — see below | Approve, edit, or replace entirely. It is written in the first person and should sound like you, not like us. |
| `founder.portrait` | **BLANK** — renders the neutral grey slot | A warm environment portrait, 4:5, ideally at your desk or somewhere that reads as "where the planning happens". Not a studio headshot. |

**The provisional quote, as currently published on the preview:**

> Twenty years ago I started planning trips for friends of friends, and I have
> never really stopped. I still write every itinerary myself, and I still pick
> up the phone when you are standing in an airport at two in the morning
> wondering where your driver is.

Two claims in it are yours to confirm or strike: that you **still write every
itinerary personally**, and that you **answer the phone during a trip
yourself**. Both are strong trust signals and both are checkable by a customer,
so we would rather cut them than overstate them.

All four values live in `siteSettings` and are editable without touching code.
