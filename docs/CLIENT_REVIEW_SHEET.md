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

## 12. Kerala journeys — differentiation check (M5) — DONE, please confirm

Three Kerala itineraries were in scope and had to read as distinct products.
They now do, and the differences are structural rather than cosmetic:

| Page | Nights | Runs | What makes it itself |
|---|---|---|---|
| **Kerala in a Week** (`/journeys/kerala-in-a-week-7n-8d/`) | 7 | Kochi → Munnar → Thekkady → Alappuzha → Varkala; **Kochi in, Trivandrum out** | The first-visit week: one direction, no doubling back, beach finish. Ported from your shortest Kerala document. |
| **Kerala with Houseboat** (`/journeys/kerala-with-houseboat-11n-12d/`) | 11 | Kochi → Munnar/Kodaikanal → Periyar → Alappuzha → **three nights at Mararikulam** → Kochi | The slow version: a Kodaikanal day and three beach nights. |
| **Kerala and the Southern Coast** (`/journeys/kerala-southern-coast-12n-13d/`) | 12 | **Trivandrum → Kanyakumari** → Kovalam → Alappuzha → Kumarakom → Periyar → Munnar → Kochi | The southern circuit: the tip of India, two Kovalam days, Kumarakom. |

Distinct title, duration, slug, intro and meta description on each, and each
page names the other two. The short document was **not** a true subset — it
runs one way and ends on the coast, which neither of the others does — so no
stop-and-flag was needed. If you would rather the week were called "Kerala
Highlights" (the Template Spec's suggestion), say so; the slug can change
before launch with no 301 needed, because nothing has been indexed.

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

---

## 15. Homepage hero video (added M4 revision round 2)

The hero is now full-screen with a background video. **The clip currently on the
preview is not yours** — it is a temporary Pexels stand-in, flagged `TEMP-VIDEO`,
and it exists only so the treatment can be judged.

| Item | Status | What we need |
|---|---|---|
| Hero video | **TEMP-VIDEO** — Taj Mahal at sunrise, Pexels, 7s loop at 960×540 | Your own footage. Upload through the CMS when it exists; no code change. |
| Hero poster | **TEMP-VIDEO** — first frame of the same clip | Comes with the video. The poster is what loads first and what a phone on a slow connection sees, so it needs to be a good still in its own right. |

**What makes a good hero clip, so the shoot brief is right first time:**

- **10–20 seconds, and it must loop without a jump** — the last frame should be
  able to sit next to the first. Slow drifts and locked-off shots loop; anything
  with a beginning and an end does not.
- **Slow.** A drifting aerial, a locked-off shot with movement inside the frame.
  Fast cuts and time-lapses fight the headline sitting on top of them.
- **Dark or calm across the bottom third**, where the headline and buttons sit.
- **No recognisable faces**, unless you hold a signed model release.
- **Web-ready, ≤ 15MB, 1080p maximum, H.264 mp4.** 1080p is a ceiling, not a
  target — and this is the one place where a bigger file is genuinely worse, for
  a reason worth knowing. Our first temporary clip was a gorgeous 1440p at only
  3.4MB, so it looked like a free win. It was not: **decoding it cost 1.8
  seconds of phone processor time**, which dropped the homepage's performance
  score from 99 to 74 — while the loading metric we had carefully protected
  never moved at all. Downscaled to 960×540 and trimmed to seven seconds, the
  same clip is 3.3MB, looks identical behind the gradient, and costs nothing.
  A hero video sits behind a colour wash at a fraction of its resolution; the
  pixels you pay for are pixels nobody sees.
- **If you only have a large master, send it to us.** We can downscale and trim
  on our side, and nothing beyond that — no bitrate control, no format
  conversion. Anything more and it needs a proper edit before it reaches us.
- **No audio track needed** — a background hero video is always muted, and
  browsers refuse to autoplay anything that is not.

**What it will never be:** a YouTube embed. Your style reference is recorded for
us in `docs/design/references/README.md`, but embedding YouTube as a hero
background drags in player chrome, third-party branding and a third-party script
in front of the page's own content. The upload slot is the mechanism.

---

## 16. City pages — new page type, two seeded (added M4 revision round 2)

City pages (`/cities/{slug}/`) are new. **Two are built — Jaipur and Kochi —
and their copy is written by us from public knowledge.** It is accurate to the
best of our reading, but none of it is yours yet.

**Every seeded city page needs one read-through for:**

| What to check | Why it matters |
|---|---|
| The "known for" line and the one-line hook | These are positioning, and you say it better than a guidebook does. |
| Best months to visit | We have used general climate knowledge. You know when *your* travellers should actually go. |
| "What to see & do" — the four experiences chosen | Are these the four you would send someone to? |
| Practical notes — getting there, getting around | Airport and rail names are checkable facts; the advice around them is judgement. |
| The FAQ answers | These are the SEO workhorse and they will be read as India Visit's own advice. |

**Candidate cities for the full set — please rank or strike.** Building all of
these is M5/Phase-2 content work, and the order should follow where your enquiries
actually come from, not where the biggest monuments are:

| City | Why it is a candidate | Journeys that would link to it |
|---|---|---|
| **Jaipur** | Seeded | Golden Triangle, Rajasthan journeys |
| **Kochi** | Seeded | Kerala journeys |
| Delhi | Arrival city for most inbound travellers | Golden Triangle, most India journeys |
| Agra | Highest-intent search term in the whole catalogue | Golden Triangle |
| Udaipur | The "romantic Rajasthan" enquiry | Rajasthan journeys |
| Jodhpur | Rajasthan depth | Rajasthan journeys |
| Jaisalmer | Desert / Palace on Wheels | Rajasthan, Palace on Wheels |
| Varanasi | Strong inbound-foreigner draw | North India journeys |
| Alleppey (Alappuzha) | The houseboat itself | Kerala with Houseboat |
| Munnar | Tea country | Kerala journeys |
| Mumbai | Corporate arrivals + Western India | Western & Southern India |
| Leh | Ladakh's only real base | Himalayan journeys |
| Shillong / Cherrapunji | North East | North East India |
| Thimphu / Paro | Bhutan | Bhutan journeys |

**Two decisions we need from you, not just corrections:**

1. **How many, and in what order?** Ten to fifteen is a sensible full set. More
   than that and they start competing with the destination pages for the same
   searches.
2. **Photography.** Each city page wants a hero, four experience tiles and a
   three-to-six image strip — roughly eight photographs per city. That is the
   single biggest ask in the whole M5 content migration, so it is worth deciding
   the city list *before* the archive gets sorted.

---

## 17. The eight destination pages (added M4, remaining templates)

Writing the nine destination pages is scheduled as M5 content work. Only
**Kerala** existed, and the homepage has been linking all nine since T1 v2 —
so eight of the nine links were dead. Rather than ship a click-through gate
with eight 404s in it, we drafted the other eight now.

**All eight are agency-drafted from public knowledge and none of it is yours
yet.** No new photography was needed — every hero already existed.

| Page | What specifically needs your eye |
|---|---|
| Rajasthan & the Golden Triangle | The claim that six days "covers the three cities without rushing them" — your call, not ours. |
| South & West India Heritage | We describe it as your most demanding route and say so plainly on the page. Confirm you are happy to be that blunt. |
| Himalayas — Leh & Ladakh | **We state that you will not sell a Ladakh trip without two acclimatisation days.** That is a policy, and it is now published. Confirm or strike. |
| North East India | The permit list (Inner Line / Protected Area) — confirm which you arrange. |
| Wildlife Journeys | **We say you never promise a tiger sighting, and that three nights per reserve is your minimum recommendation.** Both are commitments. |
| Bhutan | The Sustainable Development Fee is described as payable and non-negotiable. Confirm the current position. |
| Bali | We recommend two bases rather than touring, and say the south is busy. |
| Vietnam | We say there is no single best month for the whole country. |

Three of those pages now carry **policies rather than descriptions** — no
elephant rides at Amer, no promised tiger sightings, no Ladakh trip without
acclimatisation days. We believe all three are right and all three are good
for trust, but they are yours to confirm before launch.

---

## 18. Pages where a section is deliberately missing

These are not unfinished. In each case the honest options were to omit the
section or to invent something, and we omitted it. Each one turns on when you
supply a fact.

| Page | What is missing | What turns it on |
|---|---|---|
| About | **The timeline.** T6 specifies "2006 → today", and a timeline is nothing but dates. `foundingYear` is null. | Your founding year (Open Question #2). |
| About | Certifications and memberships logo row. | Which bodies apply (Open Question #4). |
| Corporate | **The "proposal in 48 hours" promise.** The template names it as your key differentiator; we have written the step *without* the number, because a response-time promise is something somebody has to keep on a Friday afternoon. | Your actual commitment (Open Question #12). |
| Corporate | Client logos / case snippets. | Whatever you are permitted to show (Open Question #5). |
| Reviews | The aggregate rating line, and the `AggregateRating` structured data. | A verifiable average (Open Question #3). A machine-readable rating is worse than an on-screen one, because aggregators republish it. |
| Reviews | The guest photo gallery. | Photo consent, which is a separate permission from quote consent. |
| Plan My Trip | A numeric response-time promise. | Open Question #12, as above. |

---

## 19. The four policy pages ⚑ LEGAL

**These need your lawyer, not us.** `/privacy/`, `/terms/` and
`/cancellation/` currently publish the *structure* each policy must
cover — every section named, so your adviser is filling in a brief rather than
starting from a blank page. They carry a visible notice saying so and are
**excluded from search engines** until the real text lands.

We have not drafted the binding text, and we will not: a privacy policy
carries obligations under India's DPDP Act 2023 and, for your inbound
travellers, under the GDPR. Agency drafting is not legal advice.

**`/booking-terms/` is the exception and is already real.** It is built from
the operator disclosures and cancellation policies already in the Palace on
Wheels content, pulled live from the journey entry rather than retyped — so an
operator whose terms change is edited in one place and both pages follow.
Every luxury-train page links here, as invariant #6 requires.

**What we need from you:** the approved text for the three, plus the
cancellation slab table for journeys you arrange yourself (the train slabs are
the operator's and are already handled).

---

## 20. The copy register ⚑ (added M4 design round 3)

**This is the big one, and it is new.** Your instruction was that no invented
copy should go live-looking. That is now a standing rule, and the mechanism is
**`docs/COPY_REGISTER.md`** — every headline, tagline, section heading, eyebrow
and promise currently on the site, listed by page and marked:

- **APPROVED** — traceable to your documents, the PRD, the templates, or a
  ruling you gave in a previous round;
- **DRAFT** — written by us, plausible, in voice, **and not yet yours**;
- **PLACEHOLDER** — deliberately neutral and visibly provisional.

It is built to be approved or struck **in bulk**: read the DRAFT rows and reply
one line per row you want changed.

**Rows worth your attention first**, because they are claims, promises or
numbers rather than atmosphere:

| Row | What it says | Why it is flagged |
|---|---|---|
| B1 | "Journeys across India, planned by a person" | The single most important line on the site |
| B15 | "…at the price of a package tour" | A **comparative pricing claim** |
| B9 / B22 | "Not a call centre" (twice) | A **promise about how you answer the phone** |
| A9 | "We reply personally — no call centre, no spam." | Same, on every form |
| D1 | "Nine regions we have been arranging journeys through for twenty years" | Applies twenty years to **Bali and Vietnam** as well |
| E3 | "Almost everything is included" (trains) | An **inclusions claim** that must match the operator's |
| F1 | "GST invoicing" | A **factual claim about your business** |
| F3 | "Twenty to two hundred people" | A **capacity claim** |
| G1 / G2 | "…not one itinerary written by somebody who had not been there" and the three-paragraph company history | **Your history, inferred and written by us.** Read closely or strike |
| I3 | "One note a fortnight… unsubscribe in one click" | A **frequency promise** the mailing list has to keep |
| J2 | "We read it properly / come back with a draft / change it until it fits" | Three **process promises** |

**Already fixed under this rule, no action needed:** the testimonial cards were
rendering a full paragraph of internal explanation at quote size, under two
invented guest names — "Anita R." and "James & Clare W.", neither of whom
exists. Both entries are gone. An empty slot now shows one italic muted line,
*"Guest review coming soon"*, with the lotus, and the schema physically refuses
to store a name, an origin or a quote on a placeholder. They are also excluded
from the page's structured data, so no aggregator can pick up a review that
never happened.

---

## 21. Footer — reference layout still to come (added M4 design round 3)

You mentioned a screenshot of the approved footer design going into
`docs/design/references/`. It is not there yet, so the footer has been built to
a sensible default per your description:

- the **phone number with its country code** in the display face, as the
  loudest thing in the footer, alongside WhatsApp, email and address;
- a **compact enquiry form** — name, phone, message, consent, submit — sitting
  in the fourth column;
- ink ground rather than burgundy, so it does not merge with the burgundy
  enquiry band immediately above it.

**When the reference lands we will rebuild to it.** Nothing here is expensive
to change: the form is a layout mode of the existing enquiry component, so the
fields, the spam protection and the consent checkbox all move with it.

One thing worth confirming while you are looking: the footer form and the page
forms both require the **consent checkbox** linking to the privacy policy. That
wording is itself awaiting your adviser (§19), so the footer form inherits the
same open question.


---

## 22. The two new luxury-train pages ⚑ (M5 — one STOP-AND-FLAG)

Both train documents you supplied are **another agency's documents**. They
name that agency six and five times, carry its bank-charge and service-fee
clauses, and one of them names IRCTC as the operator while the other never
names the operator at all. This is exactly what the Palace on Wheels document
was too, and it was handled the same way in M4: **the operator's rules are
ported, the other agency's commercial terms are not, and its name appears
nowhere on the site** (the `audit:hardcoded` third-party check enforces this).

**What that leaves for you to confirm, per train:**

| | Golden Chariot | Deccan Odyssey |
|---|---|---|
| Operator named on the page | IRCTC (the document says so) | **Maharashtra Tourism Development Corporation** — the document only says "the train tour operator"; MTDC is public knowledge but is **our inference** |
| Advance in the booking steps | 30% (the document's figure — *that agency's* term) | 30% (same) |
| Cancellation slabs | 35% ≥80 days · 60% 65–79 · 100% ≤64 | 10% >95 days · 30% 60–94 · 50% 45–59 · 100% <45 |
| Omitted on purpose | the USD 235 bank charge, the US$100 service/postponement charge, the USD 400 festive supplement (a tariff figure), the RBI refund-timing clause | the same, plus the per-cabin USD tariffs (never published, invariant #6) |
| Cabin classes | **One** — Deluxe only, as the document states. The schema was relaxed from "at least two" to allow it | Deluxe Cabin and Presidential Suite |

**⚑ STOP-AND-FLAG — Deccan Odyssey has no day-by-day.** The Template Spec
recorded this document as "content-complete". It is not: it carries the route,
a highlights paragraph, cabins, inclusions, exclusions, the confirmation
process and the policies — and **no daily programme**. A Variant B page cannot
be built without one, and we will not invent an operator's fixed-departure
schedule. What is on the page instead: eight days built strictly from the route
in the operator's own order (eight stops, matching 7N/8D exactly) and the
document's own highlight sentences, every one marked *provisional* on the page.
**The page must not launch until you supply the operator's daily programme.**
Until then it renders, so the design can be reviewed, with the provisional
notice showing.

**Also to confirm:** the disclosure wording on both pages mirrors the Palace
on Wheels wording you have already seen (PRD Open Question #15); and whether
India Visit's own advance percentage on trains is 30%, 40% (the Palace on
Wheels figure) or something else — it is currently printed per document.

---

## 23. Things in your itinerary documents that are NOT on the site (M5)

Read this one. These are choices we made while porting, and each is
reversible on your word.

1. **Hotel names.** The 13-day Rajasthan document names its hotels (The
   Suryaa, Fateh Garh, Indana, Pushkara, Grand Mercure). They are not published
   — they are commercially variable and belong in the quotation. Tell us if
   you want named properties on any page.
2. **Elephant rides at Amer.** Two documents offer "elephant or jeep" for the
   climb to Amer Fort. Every page says **jeep**, consistent with the policy the
   Rajasthan destination page already publishes. If you want the elephant
   option offered, say so and we will change the page *and* the policy — they
   cannot say different things.
3. **The elephant sanctuary morning** (13-day Rajasthan, day 10). The document
   lists feeding, bathing, a walk alongside, and *body-painting the elephant*.
   The page keeps feeding, bathing and the walk and omits the painting. Confirm
   or strike the whole activity.
4. **"Elephant ride at the Elephant Arrival Spot"** (12-night Kerala, Munnar
   day). Omitted from the page for the same reason as item 2.
5. **Leh Ladakh — acclimatisation.** Your document has one rest day. The page
   keeps your route and day order exactly, but describes day 3 as *gentle, at
   the town's own altitude* (which it is — Leh Palace, the bazaar, Spituk and
   Phyang), and the Ladakh destination page's wording is aligned to "one fully
   free day, one gentle day" rather than "two full rest days". Both now say the
   same thing. If you would rather add a second full rest day, it becomes an
   11-night journey.
6. **Overstatements corrected in the port.** "Varanasi, the oldest city in the
   world (5000 AD)" → "among the oldest continuously inhabited cities";
   "12 km long Lakshman Jhula" → "the Lakshman Jhula suspension bridge";
   "Siachen Glacier" as a Leh sightseeing option → dropped; the Jaipur "painted
   pink in the 18th century for the Prince of Wales" → 1876. Nothing else was
   changed in substance.
7. **Tadoba and *The Jungle Book*.** Your document says Tadoba was the
   inspiration; the page says "often said to have inspired". Pench and Seoni
   make the same claim.

---

## 24. The seven new Travel Guide articles — DRAFT (M5)

All seven launch articles from PRD §7.8 now exist alongside the Kerala
houseboat guide. **Every word is agency-drafted** (word control) and listed in
`docs/COPY_REGISTER.md` §L. The facts are drawn from your itinerary documents
and the destination pages; the four **visa and entry** articles carry a
"rules change — we confirm before you travel" line and we would like you to
read those four first:

| Article | Category | The regulatory claim to check |
|---|---|---|
| Bhutan for Indian Travellers | Planning & Visas | entry permit not visa; SDF per night at the Indian rate; INR accepted |
| Bali Visa on Arrival for Indians | Planning & Visas | VoA for Indian passports, 30 days, extendable once; six months' validity |
| Vietnam E-Visa Guide | Planning & Visas | e-visa only (no VoA); port of entry must match; Tet delays |
| First Trip to India | Planning & Visas | e-visa for most nationalities; not valid at every land border |
| Best Time to Visit Ladakh | Best Time | pass opening months; Hemis in July; Chadar in Jan–Feb |
| Palace on Wheels — Complete Guide | Guides | restates the journey entry only — nothing new |
| Golden Triangle — 5 Days or 10 | Guides | compares four journeys on the site — nothing new |

No article states a fee amount, a price or a processing time as a promise.

---

## 25. The twenty branded PDFs ⚑ (M5) — and what gating means before M6

Every journey page now has a "Download this itinerary" gate — name, email and
phone, as PRD §8.1 specifies — and a branded PDF exists for all twenty. The
PDF is **printed from the web page itself** (headless Chrome, print
stylesheet), so it matches the page section for section by construction: the
brand header with your phone and email, the hero, the intro, highlights, the
glance table, every day expanded, inclusions, practical notes, and on the
trains the cabins, booking steps and policies.

**Two honest limits until M6:**

1. The gate form is a shell like every other form on the site — the function
   that validates the submission and releases the file is M6 work. Submitting
   it today does nothing.
2. The files currently sit at `/downloads/<slug>.pdf` so that you can review
   them; that path is guessable. **M6 moves them behind the function** so that
   only a completed gate releases one. This is recorded as an M6 step in the
   runbook, and the site must not launch with the files where they are now.

**To review:** open any journey page on the preview, add `/downloads/` +
the slug + `.pdf` to the site root — e.g.
`/downloads/golden-triangle-5n-6d.pdf` — or ask and we will send the set.
The photography in them is the TEMP-PHOTO set and is replaced with the pages
when your archive lands; regenerating all twenty is one command.
