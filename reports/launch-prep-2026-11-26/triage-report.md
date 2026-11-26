# Round-5 audit triage: the 54 medium and 14 low items

I ruled every item to the standing rule. Where an item complies with CLAUDE.md I implemented its intent. Where it conflicts, the locked rule wins. I escalated only changes to words, brand or claims.

**Totals:** 41 FIXED · 20 ESCALATED · 5 SETTLED (2 by round 6, 3 earlier) · 2 NEEDS-RESERVED-FILE · 0 declined outright. Three items have a part declined; the table names the rule for each.

Nothing was committed or staged. No git state was changed.

## 1. All 68 items

| # | Sev | Subject | Status | What was done / why |
|---|---|---|---|---|
| 10 | med | Tight section padding below the rhythm floor; neighbouring same-colour bands stack their padding | FIXED | `--space-section-tight` is now `clamp(3.5rem, 2rem + 5vw, 6rem)`: 56px at 390, 96px from 1280. In global.css, a band that follows a band of the same colour drops its top padding, so 188–218px gaps become one section's worth. New `band-ruled` utility (a hairline under the band) keeps both paddings and replaces 5 page-local intro borders. The Reviews intro now gets its colour from `band-offwhite` rather than scoped CSS. Probed on 16 pages: every collapsed pair is the same colour. |
| 11 | med | Uppercase crimson eyebrows everywhere; echo eyebrows | ESCALATED (style SETTLED-R6) | The single uppercase, tracked eyebrow with its lead-in rule was round 6's approved sitewide style, so the styling is settled. Removing the echo eyebrows removes words: escalation §2. The wrap of "Speak to a person, not a portal" is a copy question (#18). |
| 12 | med | `68ch` measure runs 85–108 characters a line | FIXED + reserved part | `--container-prose: 34em`. Measured at 1280: articles 64 average / 74 max characters per line (was 69/92), booking-terms 63/79 (was 80/97), day narratives 66/75 (was 82/93). FAQ panels keep their round-6 width (46rem) and the answers hold to the measure. The Policy notice box at the prose width is in Policy.astro (reserved): §3. |
| 13 | med | Crimson at rest: card CTAs, glance numerals, transport icons, stepper | FIXED (part SETTLED-R6) | Now burgundy at rest: JourneyCard "View journey", GlanceTable day links (crimson on hover), TransportChip icon, BookingStepper rules and numerals. Round 6 had already made the day-number pills and the practical-note icons burgundy. |
| 14 | med | `ghost` button is crimson text | FIXED | Ghost is now underlined ink text (burgundy on hover), the design direction's secondary. The on-dark ghost is unchanged. Affects "Start a Conversation", "Read More Reviews" and the 404. |
| 15 | med | ConvertBand has no primary; second form in the footer | NEEDS-RESERVED-FILE; footer half DECLINED | Added a Button variant `on-dark-solid` (light fill, burgundy text: today's outline hover state at rest). The ConvertBand submit needs one line in EnquiryForm.astro (§3; tested in a scratch build). **Declined:** the Footer prop that drops the form column. PAGE_TEMPLATES T14 says "one Footer component sitewide, no per-page variants", and T10 allows "footer only". CLAUDE.md: page structure comes from PAGE_TEMPLATES. The T14 footer reference is still with the client. |
| 16 | med | Header: no burger open state; transparent header under the open menu; 240px panel wraps; "Journeys" current on trains | FIXED | The burger turns to an X (transform only, inside reduced-motion). The overlay header goes solid while the menu is open (`is-open`, set by the existing toggle). The menu panel is `max-content` and its links don't wrap. Header has a new `current` prop, so train pages mark Luxury Trains current. |
| 17 | med | Breadcrumbs hand-built on 12 templates; the article trail omits the current page; journeys have none | FIXED + reserved part; journey half DECLINED | New `Breadcrumb.astro` (ol/li, drawn separator with empty alt text, tones light/image/dark), used on 9 page templates. The article trail now ends on the article. Policy.astro and plan-my-trip.astro are reserved: §3. **Declined:** a breadcrumb in the journey hero. The Itinerary Template Spec S1 has none, and CLAUDE.md says the Template Spec wins on itinerary page structure. BreadcrumbList JSON-LD is already present, and #32 says that hero is already crowded. |
| 18 | med | "X, not Y" tic; "call centre" repeated | ESCALATED | Copy. §2. |
| 19 | med | Practical-note icons; fifth note alone on a row | FIXED (icons SETTLED-R6) | Round 6 moved to Phosphor glyphs in a badge. Columns now follow the note count (3 or 4, whichever leaves the fuller last row; 5 notes → 3+2, 3 notes → 3). Content still maps "Fitness" and "Sightings" to the clock icon. That is an editor's icon pick in the CMS; I left it for M5 content. |
| 20 | low | Type scale documented differently from tokens | SETTLED-EARLIER | CLAUDE.md has recorded the M4 rev-2 scale since 13 Nov. |
| 22 | med | Trust numerals bigger than the H1 | FIXED | CounterStat uses `--text-stat` (2.75rem cap). |
| 23 | med | Stat 3 flush against its divider from 768px | FIXED | At 48rem every cell's inline padding is reset, odd and even cells included. |
| 24 | med | How It Works rail misaligned | SETTLED-R6 | Round 6 rebuilt the connector from each marker to the next. |
| 25 | med | Soft destination tiles; Vietnam alone at 390 | FIXED | `sizes` is 24rem and a 760w file was added. Below 40rem an odd last tile spans both columns at 8:5, the same height as its neighbours. **Text over a photograph: needs check:hero-contrast.** |
| 26 | med | Why India Visit #4 body is a three-word label | ESCALATED | Copy. §2. |
| 27 | med | "20 years" ×6; "curated" ×3 | ESCALATED | Copy. §2. |
| 28 | low | CTA casing; three arrow treatments | FIXED (casing SETTLED-EARLIER) | Casing was settled by PR #31. Arrows follow one rule now: onward text links get the drawn SVG arrow (new Button `arrow` prop, the JourneyCard CTA, the day city chips, the dev page), outline and filled buttons get none, and ↗ stays only for off-site links. The typed → is gone from "Start a Conversation" (ghost + arrow) and "Corporate Travel" (outline, no arrow). The audit's note that "Corporate Travel" repeats its eyebrow is copy: §2. |
| 32 | med | Crowded phone hero; place names broken at 1280 | FIXED + ESCALATED | On phones the two ghost CTAs share a row (16px text, 44px targets kept), saving one 60px row. Runs of capitalised words are held together from 48rem ("Ha Long Bay", "Root Bridges", "The Golden Triangle"); measured: no mid-name break at 1280 or 768. Capping `signatureFeature` at ~40 characters means rewriting 20 of 28 lines, which is copy: §2. **Hero layout changed: needs check:hero-contrast.** |
| 33 | med | Glance table stays three columns on phones | FIXED | Below 48rem each row stacks: day and destination on one line, the experience under them. Explicit ARIA table roles keep row semantics in Safari. Kerala's 12 days are far shorter. |
| 34 | low | "Explore Kochi" on transfer and departure days | FIXED | Chips follow the overnight city. On a night aboard (train, houseboat) they use the place before the title's colon. Departure days get none. Kerala days 3 and 12 lost the chip; train days keep theirs. |
| 35 | low | Day titles leave one-word last lines; the day label floats mid-title | FIXED | `text-wrap: balance` on day titles. The day pill is baseline-aligned to the first line. |
| 37 | med | Cabin facility lists stretch; cards lift with no link | FIXED | `align-content: start`. The hover lift is removed (round 6's rule for non-link cards). |
| 38 | med | One cabin flagged "Top tier" in a four-column row | FIXED + ESCALATED | "Top tier" renders only when there is more than one cabin. Columns follow the count, and a lone cabin is held to 24rem. The singular heading "Cabin Category" is a new string: §2. |
| 39 | med | Availability band body repeats its heading | ESCALATED | Copy (C4/M6 DRAFT). §2. |
| 40 | low | Six-column stepper; crimson disclosure rule | FIXED | 3×2 from 48rem, burgundy rules and numerals. The cabin disclosure rule is burgundy. |
| 41 | low | Inclusion headings small; half-empty grid with no exclusions | FIXED (headings SETTLED-R6) | With no exclusions there is one panel at the measure (Jhalana, Jawai, Tadoba). Round 6's approved two-panel design set the headings as panel titles. "One H2 over two H3s" would need a new heading string, so I left it. |
| 45 | med | `auto-fill` builds four columns; one card fills 23% | FIXED | Destination card rows are at most three across. With one or two cards (journeys or reading) the row uses the FAQ layout: heading and pill on the left, cards on the right. |
| 46 | med | Kerala and Ladakh pages contradict themselves | ESCALATED | Copy and facts. §2. |
| 47 | med | "What defines" repeats the city pages; no link to /cities/ | ESCALATED | Copy, plus a schema field for a tile link (schema changes still stop and ask). §2. |
| 48 | med | South & West reads like one journey's page | ESCALATED | Copy. §2. |
| 49 | med | Intensifiers, "rather than" ×31, a superlative used twice | ESCALATED | Copy. §2. |
| 50 | low | FAQ H2 stacks into one word per line; tagline widows | SETTLED-R6 | Round 6 set `h2 { text-wrap: balance }` and `p { text-wrap: pretty }` sitewide. What remains is word length at the locked H2 size in an 18rem column. |
| 52 | med | Nine hooks all "A, B and C" | ESCALATED | Copy. §2. |
| 53 | low | Counts in three formats (count eyebrows) | ESCALATED | Removing the "6 destinations" / "3 destinations" eyebrows removes words. §2. |
| 54 | med | "About Jaipur" H2 styled as an eyebrow; three label styles | FIXED | It is now a normal H2 (`--text-h2`). The quick-fact labels match the journey Quick Facts style (0.14em). |
| 55 | med | Three notes in four columns; six cards break 4+2 | FIXED | Notes via #19. City journey cards are three-up (Jaipur 3+3, Kochi 3+2). |
| 56 | med | City prose repeats itself and states unconfirmed claims | ESCALATED | Copy and claims. §2. |
| 59 | med | The "slim" article hero is all photograph | FIXED + ESCALATED | The hero photo is 21:9 from 48rem (16:9 on phones). The excerpt as a lede is copy in a new place, and T9 §1 lists no lede: §2. |
| 60 | med | Mobile table of contents is an open list | FIXED | Below 64rem the contents list is a closed `<details>`. The desktop sticky list is unchanged. The hidden copy is `display:none`, so nothing is announced twice. |
| 61 | med | Article lists have no bullets or numbers | FIXED | `disc` and `decimal` restored (round 6's crimson marker now shows). |
| 62 | med | Required journey card after the last paragraph | FIXED | The card sits mid-body (T9 §3): the rendered HTML is split before the H2 that opens the second half. Verified on all 8 articles (e.g. Ladakh: after "Month by month"). It is ruled at the text column's width; a single card stands beside its heading. If a body has fewer than 2 H2s, or contains Astro image placeholders, the card falls back to after the body. |
| 63 | med | Related posts = newest three (file order) | FIXED | Ranked: +2 for the same category, +1 per shared destination of the embedded journeys, then date, then id. |
| 64 | med | Eight drafts share one formula | ESCALATED | Copy. §2. |
| 65 | med | Vietnam guide contradicts itself on season | ESCALATED | Copy and claim. §2. |
| 66 | med | Kerala houseboat guide is a stub under a long excerpt | ESCALATED | Copy. §2. |
| 67 | med | Golden Triangle guide: "5 nights / 6 days" and a title matching no itinerary | ESCALATED | Copy (title and body). §2. |
| 69 | med | Travel guide grid runs 3+3+1 | FIXED | The grid takes 3 or 4 columns, whichever leaves the fuller last row: today 4+3. The audit proposed featuring two posts; I kept one, because T8 §2 says "full-width card". |
| 70 | med | Every card reads "September 2026"; featured post picked by file order | FIXED | ArticleCard shows "Category · N min read" (T8 §4), with the publish date dropped from cards; article pages keep it. A drawn dot never ends a line. The Ladakh guide is pinned with `featured: true`, a content flag reversible in /admin. It is the demo-path article, and the homepage guide row now leads with it (same three posts). |
| 71 | med | "actually" ×6 on the guide page | ESCALATED | Copy. §2. |
| 72 | low | Filter counts; featured ignores the filter; casing | FIXED; casing DECLINED | Chips count all 8 posts, and the lead article is filtered with the grid. **Declined:** "Travel guide" H1 vs "Travel Guide" crumb. Invariant #7 sets page headings in sentence case and nav labels in Title Case, so both are right. The audit gave no fix for the chips wrapping at 390, so they still wrap. |
| 73 | med | "Why by train" describes one train | ESCALATED | Copy and claim. §2. |
| 74 | med | Deccan Odyssey first on the trains page | FIXED | Sorted featured first, then nights, then id: Palace on Wheels, Deccan Odyssey, Golden Chariot. `featured` is the CMS toggle the homepage already uses. |
| 75 | med | The disclosure note has a section of its own (188px gaps) | FIXED + ESCALATED | The same words now sit as the FAQ section's last line, through a new FaqAccordion slot. The tighter wording is copy: §2. |
| 76 | low | Lotus and yellow semibold on a legal line | FIXED | Lotus dropped. The line is white, regular weight. **Hero text changed: needs check:hero-contrast** (white measures higher than yellow). |
| 79 | med | Corporate: one selling point made four times; mixed number styles | ESCALATED | Copy. §2. |
| 80 | med | Corporate sticky bar fills "Form", not Call | FIXED | The crimson fill goes on the layout's lead action: Call on /corporate/, Enquire elsewhere. |
| 81 | low | Stray lotus on step 03; step bodies misaligned | FIXED | Lotus removed. At ≥52rem the three steps share rows (subgrid), so bodies align. |
| 82 | med | About repeats itself and changes voice | SETTLED-EARLIER | The page was rebuilt on 21 Nov from the client's own About Us (COPY_REGISTER §T, APPROVED). |
| 83 | low | About philosophy: three lotus columns | SETTLED-EARLIER | The section no longer exists since the 21 Nov rebuild. |
| 84 | low | About hero copy centred on the portrait | FIXED | `align-items: start`. |
| 85 | med | Review chips count placeholder slots | FIXED (wall SETTLED-R6) | Chips count real reviews only, show only when real reviews span two categories, and the status text skips slots. Round 6's auto-fit wall already fills the row. |
| 86 | low | Trip pill "Palace on Wheels, 7N/8D" | FIXED | Punctuation only, per invariant #7: "Palace on Wheels · 7N · 8D" and "Kerala with Houseboat · 11N · 12D". The Tina field hint now shows that format. |
| 90 | med | Plan My Trip: 480px of white under the step-1 card | NEEDS-RESERVED-FILE | Patch tested: the mini-FAQ moves under the form in the right column. §3. |
| 91 | med | Policy pages show no "Last updated"; slabs set as run-in text | ESCALATED | A table restates approved legal text, and a date is a statement about the document. §2. |
| 92 | med | 404 has three crimson actions in a row | FIXED | On the new band: filled on-dark "Back to the Homepage", on-dark ghosts for the other two. No crimson on the band. |
| 93 | med | 404 lotus margin computes to 0; Lotus note wrong | FIXED | A wrapper the page owns carries the spacing. Lotus.astro's note is corrected: under Astro's `attribute` scoping, a caller's scoped rule reaches neither colour nor layout. Swept per the one-call-site rule: the two `.quote__mark` rules (About, destinations) now use the working `:global` pattern, and the dead `.author__mark` rule is removed. Plan My Trip's `.side__mark { flex:none }` is equally dead but harmless (reserved file). |
| 94 | med | 404 is the stock composition; off-palette SVG; filler lede | FIXED + ESCALATED | Full-width burgundy band with the BandWatermark (T13). The road SVG is palette-only (#3D0A1E and #2A1520 became ink). The lede rewrite is copy: §2. |

## 2. Escalations (proposed words; nothing on the site was changed)

The category for each is copy unless marked otherwise.

- **#11 echo eyebrows**: delete these eyebrows, with no replacement:
  - "Journeys" over "Journeys in {region}" (destination pages)
  - "What defines it" over "What defines {region}" (destination pages)
  - "Journeys" over "Trips that visit {city}" (city pages)
- **#18 "X, not Y"**. Current → proposed:
  - ConvertBand eyebrow (every page) "Speak to a person, not a portal" → "Speak to a person". This also ends the wrap at 390.
  - Homepage How It Works step 1 "A conversation, not a form-filling exercise. Where you want to go, how long you have, what kind of days you enjoy." → "Start with a conversation: where you want to go, how long you have, what kind of days you enjoy."
  - Homepage Why #2 title "Curated, Not Catalogued" → "Planned Around You".
  - About ConvertBand body "Not a booking form, a conversation. Tell us roughly…" → "Tell us roughly what you have in mind and we will tell you honestly whether we are the right people for it."
  - Corporate step 2 "A costed plan with properties named, not a brochure, and a named person to take your questions about it." → "A costed plan with the properties named, and one person to take your questions about it."
  - Plan My Trip next steps (reserved file):
    - "A person, not an autoresponder. If something in it needs a question, we ask before we plan." → "A person reads it. If something needs a question, we ask before we plan."
    - "…and a price. Not a brochure, and not a quote with three options." → "…and a price, written for this trip."
    - "That is the job, not an inconvenience." → "We expect them."
  - "Call centre": keep the client's own two (About, and the founder quote; both APPROVED client copy).
    - Homepage step 3: drop "Not a call centre."
    - Homepage ConvertBand: "No obligation, and no call centre." → "No obligation."
    - Plan My Trip form note: "No obligation, no call centre. Your details go only to India Visit." → "No obligation. Your details go only to India Visit."
    - EnquiryForm note: "We reply personally. No call centre, no spam." → "We reply personally."
- **#26** Why #4 "With You the Whole Way", body "24/7 On-Trip Support" → "Someone you know is on the phone, day or night, for every day of the trip." Copy and claim: it restates the 24/7 promise.
- **#27** Keep the two APPROVED forms: trust bar "20+ Years of Experience" and footer "20+ years".
  - Hero lede (B2) "20 years of arranging unhurried, private travel: Rajasthan to the backwaters, the Himalayas to Bhutan, Bali and Vietnam." → "Unhurried, private travel, from Rajasthan to the backwaters and the Himalayas to Bhutan, Bali and Vietnam."
  - Why #1 (B13): title "Twenty Years of It" → "Know-How on the Ground". Body "20 years arranging journeys across India, long enough to know which hill station is worth the drive in July." → "We know which hill station is worth the drive in July, and which is not."
  - "Curated" (B14): covered under #18.
- **#28 (rest)** Homepage corporate button "Corporate Travel" (repeats its eyebrow) → "Plan a Company Trip".
- **#32** A `signatureFeature` `.max(40)` can only land after the 20 over-length lines are rewritten; otherwise the build fails. Examples:
  - Bhutan → "Three Valleys and the Tiger's Nest"
  - Kerala & Southern Coast → "Kanyakumari, the Backwaters and the Hills"
  - Khajuraho → "Varanasi's Ghats and Khajuraho's Temples"
  - Taj and Agra → "Sunrise at the Taj Mahal"
  - Kerala in a Week → "Hills, a Houseboat and Varkala's Cliffs"
  - NE Root Bridges → "Root Bridges and the River Island"
  - Vietnam → "A Night on the Bay, the Lanterns of Hoi An"
- **#38** Use the heading "Cabin Category" when a train has one cabin class (Golden Chariot). It is one line in CabinCards once approved.
- **#39** Keep the heading. The bodies currently open with the heading's own words; open them with the next step instead:
  - Palace on Wheels: "Departures fill early, and cabin categories sell out at different rates. Tell us…" → "Tell us your dates and preferred cabin and we will check live availability with the operator."
  - Golden Chariot: "Departures fill early, and the train runs a single cabin class. Tell us…" → "The train runs a single cabin class. Tell us your dates and we will check live availability with the operator."
  - Deccan Odyssey: "Departures fill early, and the two cabin categories sell out at different rates. Tell us…" → "Tell us your dates and preferred cabin and we will check live availability with the operator."
- **#46**
  - Kerala:
    - Cut the "More about" paragraph that repeats the intro.
    - Delete "We run three." (the count is wrong and goes stale).
    - Intro "a twelve-day journey here covers" → "a journey here covers".
  - Ladakh:
    - "roughly May to September" → "June to September".
    - Use one number format: "between 3,350 and 5,500 metres (11,000–18,000 ft)", and Leh "3,500 metres".
- **#47** Copy, and a schema field to stop and ask about.
  - Rajasthan: link Amer Fort, City Palaces and The Bazaars to /cities/jaipur/. This needs an optional `cityLink` field on experience tiles in Zod and Tina.
  - Rajasthan: replace two of those Jaipur tiles with region-wide subjects, e.g. "Desert Camps" (Jaisalmer) and "Lake Palaces" (Udaipur).
  - Kerala: link "Fort Kochi" and "The Spice Trail" to /cities/kochi/, or replace one with "The Coast at Varkala".
- **#48** South & West: "Who is this journey really for?" → "Who is South and West India for?". Cut "the longest of any route we run".
- **#49**
  - Drop "actually / really / exactly" from the 8 FAQ questions (e.g. "When can you actually go?" → "When can you go?").
  - Vary the 31 uses of "rather than".
  - Keep one superlative: Ladakh "It is the least Indian-feeling part of India" → "Its culture is closer to Tibet's than to the plains below."
- **#52** One fact per hook:
  - Kerala → "A coast of backwaters, with tea country two hours inland."
  - Ladakh → "A high desert where the monasteries sit above 3,500 metres."
  - Bali → "The one Hindu island in Indonesia, terraced for rice."
  - Vietnam → "Hanoi to Hoi An, with a night on Ha Long Bay in between."
  - South & West → "The rock-cut caves of Ajanta and Ellora, and the Deccan's sultanate cities."
  - North East → "Root bridges grown by hand, in the wettest villages on earth."
  - Wildlife → "Reserves chosen for the animals rather than the numbers."
  - Rajasthan and Bhutan: unchanged.
- **#53** Remove the count eyebrows "6 destinations" and "3 destinations" on /destinations/.
- **#56** Copy and claims.
  - Jaipur: cut the duplicate "Two days… Three…" FAQ. Say "October to March" once.
  - Jaipur: flag three claims ⚑ for the client to confirm or cut: "We do not arrange elephant rides", "a dealer we have used for years" and "a number of our travellers fly in and out of Jaipur".
  - Kochi: "less a city than a set of islands…" → "Kochi is spread across islands and a strip of mainland…"
- **#59** Show each post's excerpt as a lede under the article H1. It is existing DRAFT copy in a new place; the excerpts need #71 first.
- **#64**
  - End no intro on "Here is…".
  - Open each article from its own subject rather than "X is the [superlative]…".
  - Cut "actually" (6 bodies) and "honest" (×4, Golden Triangle).
  - Give Bali, Bhutan and Vietnam their own caveats.
  - Metric units (Ladakh "3,500 metres", Vietnam "1,600 km").
- **#65** Vietnam: "December to March, when the north is cool and clear" conflicts with "damp and grey in February and March". Propose "October to December, and April, when the north is dry and mild". Claim ⚑ for the client.
- **#66** Kerala houseboat excerpt "What a night aboard a kettuvallam is actually like, which stretch of backwater to choose, and how houseboats differ from one another." → "What a night aboard a kettuvallam is like, and which stretch of backwater to choose." Update the meta description to match, or write the missing sections.
- **#67** In the body, "5 nights / 6 days" ×4 → "5 Nights · 6 Days". Title "Golden Triangle: 5 Days or 10? Which Itinerary Suits You" → "Golden Triangle: Six Days or Ten? Which Itinerary Suits You". The slug stays.
- **#71** Drop "actually" from six places:
  - Lede: "what a visa actually involves" → "what a visa involves".
  - Palace on Wheels excerpt: "is actually like" → "is like".
  - Kerala excerpt: "is actually like" → "is like".
  - Ladakh excerpt: "would actually pick" → "would pick".
  - Bhutan excerpt: "actually needs" → "needs".
  - First trip excerpt: "actually includes" → "includes".
- **#73** Copy and claim.
  - H2 "Seven cities, one unpacking" → "A week of India, unpacked once".
  - Card 1: cut "and it is a better one than most of the cities it stops in can offer". It ends "The train is the hotel."
  - Card 2 "Seven cities in eight days without a single hotel check-in, and without the 6am transfers that a road itinerary across Rajasthan would demand." → "A week of cities without a single hotel check-in, and without the early transfers a road itinerary would demand."
- **#75** "Each train is operated by its own operator, whose terms govern your booking and whose liability is set out in those terms. Full detail is published in our booking terms." → "Each train is run by its operator, and the operator's terms govern your booking. Full detail is in our booking terms."
- **#79**
  - H2 "Three steps, one point of contact" → "How a company trip comes together".
  - Conferences: drop "One point of contact who answers the phone on the morning it matters."
  - "The trip people actually compete for" → "The trip people compete for".
  - "what the trip is actually for" → "what the trip is for".
  - Numbers: "Twenty to two hundred people" → "20 to 200 people"; "Forty people" → "40 people".
- **#91** Claim and legal copy.
  - booking-terms: `updated="13 November 2026"`. That is the publication date; the policy text is unchanged since 12 Nov, and the 22 Nov edits only re-cased booking-step titles and added the GSTIN line. The prop already exists on Policy.
  - Slabs as a table (Notice before departure · Fee). Palace on Wheels: more than 95 days, 15% of the gross train ticket value; 65–94 days, 30%; 35–64 days, 55%; less than 34 days or no-show, 100%.
  - **The source text leaves day 95 and day 34 unassigned.** A table must not resolve that silently; the operator or client has to confirm. Golden Chariot and Deccan Odyssey are the same shape.
  - A table also needs a structured `slabs` field (schema).
- **#94** 404 lede "That page has moved or never existed. No harm done. The good stuff is all one click away." → "That page has moved or never existed. The homepage, every journey and a WhatsApp line to us are one click away below."

## 3. Changes for you to make in reserved files

The exact diff, tested in a scratch copy of the project (build and responsive check pass, captures checked), is at `/private/tmp/claude-501/-Users-ianshumanrai-Documents-India-Visit-Website/21df1583-61c3-4544-8f74-8b18d78256fb/scratchpad/lp/reserved-changes.patch`. It is cut against those files as they stood at 12:35. Apply it with `git apply`, or by hand:

1. **`src/components/EnquiryForm.astro`** (#15). In the submit Button, change
   `variant={onDark ? 'on-dark' : 'primary'}`
   to
   `variant={onDark ? (isFooter ? 'on-dark' : 'on-dark-solid') : 'primary'}`.
   The ConvertBand submit becomes the band's filled primary; the footer form stays an outline.
2. **`src/layouts/Policy.astro`** (#17, #12):
   - Add `import Breadcrumb from '../components/Breadcrumb.astro';`.
   - Replace the `<nav class="crumbs">…</nav>` with `<Breadcrumb tone="dark" items={[{ label: 'Home', href: '/' }, { label: heading }]} />`.
   - Delete the three `.crumbs` rules.
   - Wrap the notice and the policy body in one `<div class="prose-measure">`, and take `prose-measure` off `<p class="notice">` and `<div class="policy">`, so the notice is exactly the prose column's width.
3. **`src/pages/plan-my-trip.astro`** (#17, #90):
   - Breadcrumb: as in Policy, light tone; delete the two `.crumbs` rules.
   - Wrap `.formwrap` in `<div class="plan__main">` and move the mini-FAQ inside it, after the form, as `<section class="plan__mini" aria-labelledby="mini-heading">`. The heading takes `--text-2xl` and the cards stack, on off-white.
   - Change the `grid-area: form` rule from `.formwrap` to `.plan__main`.
   - Delete the separate off-white mini-FAQ band.
   - Phone order becomes intro, form, mini-FAQ, reassurance.
   - Optional while there: the dead `.side__mark { flex: none }` rule.
4. **Docs** (CLAUDE.md, your call):
   - Record that the measure is ~68 characters via `--container-prose: 34em` (CSS `68ch` measured 90+).
   - Record the tight rhythm step: 56/96px.
   - Record the same-colour band rule and `band-ruled`.
   - Record: ghost = underlined ink; `on-dark-solid` = the one action on a dark band.
   - Record the arrow rule: drawn arrow on onward text links only, ↗ for off-site.
   - Record the shared Breadcrumb component.
5. **Agency-ruling log.** No COPY_REGISTER edits are needed. No new visitor-facing string was written. "N min read" and "On this page" reuse existing strings, and the article trail's last step is the article's own title. The 9 agency rulings (the 3 declines and the 6 calls made in §1) belong in the review sheet under the escalation standard.

## 4. Files changed, checks, heroes

**Changed (agency files only):**

- `src/styles/tokens.css`, `src/styles/global.css`
- **New:** `src/components/Breadcrumb.astro`
- Components: `ArticleBody`, `ArticleCard`, `BookingStepper`, `Button`, `CabinCards`, `CounterStat`, `DayAccordion`, `FaqAccordion`, `GlanceTable`, `Header`, `InclusionsBlock`, `JourneyCard`, `Lotus` (comment only), `PracticalNotesGrid`, `StickyMobileBar`, `TransportChip`
- `src/assets/graphics/404-road.svg`
- Pages: `404`, `about`, `cities/[slug]`, `corporate`, `destinations/[slug]`, `destinations/index`, `dev/components` (demo button), `index`, `journeys/[slug]`, `journeys/index`, `luxury-trains`, `reviews`, `travel-guide/[slug]`, `travel-guide/index`
- `tina/config.ts`: the tripLabel hint only
- **Content flags and punctuation, no words:**
  - `src/content/posts/best-time-to-visit-ladakh.md` (`featured: true`)
  - `src/content/testimonials/slot-kerala-houseboat.json` and `slot-palace-on-wheels.json` (tripLabel middle dots)

I edited around your sort lines in `luxury-trains.astro` and `travel-guide/[slug].astro`; your `byId` stays the last tie-break in both.

**Checks** (own build at `scratchpad/lp/dist-triage`, 62 pages):

| Check | Result |
|---|---|
| `astro build` | pass |
| `astro check` | 0 errors, 0 warnings, 0 hints (78 files). The 8 known errors did not appear, so they seem resolved in the working tree. |
| check-links | PASS, 64 pages, 4,077 references |
| check-template-spec | PASS, 28 journeys |
| check-cms-images | PASS, 5 exempt, 0 outside |
| audit-hardcoded | AUDIT PASSED |
| check-responsive (private copy, port 9475) | PASS 360–1440 on `/`, Kerala, Palace on Wheels, Golden Chariot, Vietnam, `/destinations/` + Ladakh + Kerala, `/cities/jaipur/`, `/travel-guide/` + the Ladakh article, `/luxury-trains/`, `/corporate/`, `/about/`, `/reviews/`, `/journeys/`, 404, `/booking-terms/`; also patched Plan My Trip and `/privacy/` |

The article-card meta row clips its line-start dot by design and carries `data-allow-clip`. Captures were taken at 1280×900 and 390×844 of every changed page and checked.

**Heroes and text over photographs (please run `check:hero-contrast`):**

- **Journey heroes:** the H1 now has `hero__keep` spans, so line breaks change from 48rem. On phones the two ghost CTAs share a row, so the copy column is about 60px shorter.
- **/luxury-trains/ hero:** the attribution line is white, regular weight, with no lotus.
- **Hero breadcrumbs** (destinations, cities, trains): same white, new markup (`ol`/`li`, `nav[aria-label="Breadcrumb"]` kept, `.crumbs` kept).
- **Homepage destination tiles at <40rem:** Vietnam's tile is now 8:5 across both columns; its label is still `data-on-image`.

## 5. Not verified

- **Hero contrast:** it runs only against `dist/`, so it is yours to run.
- **Not run:** keyboard, no-JS and hero-video checks, and Lighthouse. Nothing was tested on a real phone.
- **Safari:** CSS subgrid (corporate steps, ≥52rem) and the `content: '/' / ''` alt-text syntax, which falls back to a plain `/` where unsupported, were not tested in Safari.
- **The 28 itinerary PDFs** are printed from the journey pages and were **not reprinted**. Cabins, stepper, chips, H1 and inclusions changed. Run `npm run pdf:build` before merging.
- **The reserved-file patch** was tested on a copy made at 12:35. If you have edited those files since, it may need re-cutting.
