# UNSLOP_AUDIT.md: design round 5 remarks (audit only)

**Audited:** 12 November 2026, evening, after the consent and mobile-menu hotfix.
**Site:** production `a5a57de`, https://india-visit-website.pages.dev, at 1280×900 and 390×844.
**Status:** nothing in this document has been changed on the site. Every item waits for
approval, item by item, and becomes a design-round-5 remark after the 12 November demo.

The lens is the unslop sign list (spacing, generic patterns, AI-ish copy, decoration without
purpose, type, detail), applied **inside the locked system in CLAUDE.md**. The brand colours,
type, pill buttons, lotus glyphs and band watermarks, ink hero wash, burgundy bands and ink
footer are not up for review here. Each finding records where the execution falls short of
that direction. Five auditors split the 49 sitemap routes plus the three policy pages and the
404 by template, and captured and measured every finding on the live site before locating it
in the source. Copy findings are checked against `docs/COPY_REGISTER.md`, visual ones against
CLAUDE.md #5 and PAGE_TEMPLATES.

## Status, 13 November 2026

- **All 26 high items: approved by the client and fixed**, in PR #21
  (`74a9ddf`, live 16:08 IST). The client's rulings shaped #2, #3, #9, #30,
  #51, #58, #78 and #89. In that instruction, the client's numbers #23, #45,
  #47, #50 and #53 are this document's **#30, #51, #58, #78 and #89**.
- **Both documentation conflicts are settled** in CLAUDE.md: `font-display:
  optional` is kept and recorded with its rationale (the fix was the cache
  header), and the M4 type scale is recorded.
- The fixes surfaced work that is not on this list:
  - `check:hero-contrast` now scores text in its own colour, and found seven
    live failures. They were fixed: journey H1s white, breadcrumbs white
    rather than on-dark, the city state label on a burgundy ground.
  - ArticleCard had #42's cause.
  - The sweep for item 9 registered 72 more strings (COPY_REGISTER §S).
- **Rulings after the demo (13 Nov evening) on what the fixes surfaced:**
  - `/booking-terms/` (body APPROVED, K3) is published without the
    provisional notice and is indexed (PR #23).
  - **Queued for round 5:** with reduced motion, the phone's sticky bar shows
    from load, so the homepage's first screen has two crimson actions. Fix by
    demoting one of the two under the one-action rule; no new pattern for it.
  - Best Practices 81 is traced to Partytown (SESSION_LOG, 13 Nov evening).
    Fix or accept is a round-5 decision.
- **The 54 medium and 14 low items are not fixed.** The client's batch
  approvals arrive with the demo remarks as the round-5 list.

## How to read this

- Each line: `N. [TEMPLATE|PAGE-SPECIFIC] [severity] [category] — what. Where. Rule. Fix.`
  TEMPLATE means a shared component or template and shows on every page using it.
  PAGE-SPECIFIC means one page's content or override.
- **high**: visible in a page's first screen or on the demo path, breaks a locked CLAUDE.md rule,
  fails WCAG AA, is copy styled as final that the register does not hold, or breaks the layout
  at 390 or 1280. **med**: a visible inconsistency. **low**: polish.
- ★ = on the 12 November demo path. ✓ = re-checked on production by the editor after the
  auditor reported. Everything else rests on the auditor's capture or measurement.
- Where the editor changed an auditor's severity, the line says "calibrated".

## Skipped by ruling

TEMP-PHOTO and TEMP-VIDEO stand-ins; the null founder name and portrait and the provisional
founder quote; "Guest review coming soon"; the disabled PDF-download and newsletter forms;
em dashes (resolved 12 Nov); the dummy postal address; Deccan Odyssey's provisional day
content; policy legal text; the navigation bugs already reported (sticky bar and Expand all
after a client-side link).

## Two documentation conflicts, not drift

Decide each one, then record it in CLAUDE.md, so later audits stop flagging it.

- **Type scale.** H1 renders 56/34px and H2 36/24px (1280/390). That is the client's M4
  revision-2 step-down (`tokens.css:79-86`, SESSION_LOG), but CLAUDE.md still states the
  original clamps (72/40, 44/28). See item 20.
- **`font-display`.** CLAUDE.md says `swap`. `fonts.css` deliberately uses `optional` for
  Archivo 700 and Inter 600, a documented fix for a measured CLS of 0.132. The decision is
  defensible, but in production it now has a side effect. See item 2.

## What keeps recurring

1. **Crimson at rest.** The rule "exactly one action per viewport" is broken on most templates:
   the header pill, card links, itinerary numerals, ghost buttons, the aside on Plan My Trip
   (items 3, 4, 13, 14, 15, 80, 87, 92).
2. **Contrast the checker cannot see.** Breadcrumbs over photos, focus rings over heroes, field
   borders on dark grounds and one invisible eyebrow (5, 6, 7, 77). `check:hero-contrast` scores
   every run of text against white instead of its own colour, so it passes these.
3. **The display face often arrives too late.** First-time visitors, and many repeat views, see
   headings in the Arial fallback (2).
4. **One voice in every draft.** "X, not Y", "actually", "rather than", three-item hooks,
   intros that end "Here is…", one selling point repeated (18, 27, 49, 52, 64, 71, 79). There
   are also unregistered strings throughout (9), and three claims that are untrue or that
   nobody can check (51, 58, 89).
5. **Rhythm and grids.** Tight bands run below the locked minimum, neighbouring bands of one
   colour stack their padding, and grids sized for four leave rows mostly empty (10, 38, 45, 55, 69).

## Summary

| Template | high | med | low |
|---|---|---|---|
| A. Sitewide: shared components and tokens | 9 | 10 | 1 |
| B. Homepage | 1 | 6 | 1 |
| C. Journey, Variant A | 3 | 2 | 2 |
| D. Journey, Variant B | 1 | 3 | 2 |
| E. Journeys index | 1 | 0 | 0 |
| F. Destination | 2 | 5 | 1 |
| G. Destinations index | 1 | 1 | 1 |
| H. City | 0 | 3 | 0 |
| I. Article | 2 | 9 | 0 |
| J. Travel-guide index | 1 | 3 | 1 |
| K. Luxury trains landing | 0 | 3 | 1 |
| L. Corporate | 2 | 2 | 1 |
| M. About, Reviews, Plan My Trip, policies, 404 | 3 | 7 | 3 |
| **Total (94)** | **26** | **54** | **14** |

## A. Sitewide: shared components and tokens

1. [TEMPLATE] [high] [detail] ★✓ — The overlay header draws a 1px dark seam across every overlay hero at y=72 (pixels 130,90,65 → 70,50,48 → 131,90,65), at both widths. The header's ink gradient repeats into its transparent bottom border. Where: `Header.astro:218-244`. Rule: CLAUDE.md hero gradients, "no perceptible boundary". Fix: `background-repeat: no-repeat` on `.header--overlay`.
2. [TEMPLATE] [high] [type] ★✓ — The display face misses on most views. Archivo 700 and Inter 600 are `font-display: optional` (`fonts.css:88,120`), and the font files are served `cache-control: public, max-age=0, must-revalidate`. Every view revalidates them and often misses the ~100ms window, so H1s, H2s and button labels render in the Arial "Display Fallback". Four auditors saw this on cold loads; on /corporate/ at 390 it happened on 6 of 8 loads. Rule: CLAUDE.md locked stack, "type IS the design". Fix: cache `/_astro/*` as `public, max-age=31536000, immutable` (the file names are content-hashed) and test on a real phone. Separately, settle optional against swap and record the decision.
3. [TEMPLATE] [high] [generic-pattern] ★✓ — The header's crimson "Plan My Trip" is in every viewport, so any hero with its own CTA shows two. The first screen of / has two identical crimson "Plan My Trip" buttons to the same URL; Golden Triangle pairs it with "Customise This Journey". Where: `Header.astro:127`, `index.astro:231`. Rule: CLAUDE.md #5, one action per viewport. Fix: quiet the header pill while a hero CTA is on screen (the `.is-solid` toggle already exists).
4. [TEMPLATE] [high] [detail] ★✓ — The mobile header pill is meant to be hidden but shows. `Header.astro:421-423` sets `.header__cta{display:none}` below 48rem, but `Button.astro:56-57` `.btn{display:inline-flex}` has the same specificity and comes later, so it wins. The pill wraps onto two lines at 390, and every phone screen carries two fixed crimson routes to /plan-my-trip/ (the pill and the bar's "Enquire"). This was logged earlier as a cosmetic wrap; the cause is the cascade. Fix: `.header__actions .header__cta{display:none}` below 48rem.
5. [TEMPLATE] [high] [detail] ★ — Focus rings over heroes stay crimson: 1.75:1 on a header link and 3.02:1 on the hero CTA against the photograph. The yellow on-dark ring never applies, because neither the overlay header nor `<Hero>` carries `.on-dark`. Where: `global.css:99-109`, `Header.astro:44`, `Hero.astro:131`. Rule: WCAG 1.4.11 (3:1). Fix: `on-dark` on the hero content, and on the overlay header until it turns solid (yellow measures 6.3–10.9:1).
6. [TEMPLATE] [high] [detail] ★ — Hero breadcrumbs fail AA. They are `#E0CBD4` at 15px and measure 3.03–3.88:1 against the lightest ground pixel: 8 of 9 destinations, both cities and /luxury-trains/ (3.65:1). `check:hero-contrast` passes them because it scores every run against white (`scripts/check-hero-contrast.mjs:154,272`). Where: `destinations/[slug].astro:316-321`, `cities/[slug].astro:265-270`, `luxury-trains.astro:118-122,215-225`. Rule: AA 4.5:1; CLAUDE.md "legibility is verified rather than assumed". Fix: crumbs in `--color-on-dark` (5.6:1 or better), and make the checker score each run in its own colour.
7. [TEMPLATE] [high] [detail] ★ — Form fields on dark grounds: the border is 2.0:1 on the burgundy ConvertBand and 2.41:1 on the ink footer, and the field fill is 1.2:1. Where: `EnquiryForm.astro:291-295`. Rule: WCAG 1.4.11 (3:1). Fix: the on-dark border at about 50% opacity (≈3.5:1 and 4.9:1).
8. [TEMPLATE] [high] [spacing] — At 390 the fixed contact bar covers the last line of every page. At maximum scroll, the element under "© 2026 India Visit. All rights reserved." is the bar's WhatsApp link, because nothing reserves the bar's 52px. Where: `StickyMobileBar.astro:111-119`, `Footer.astro:233-239`. Fix: below 48rem, bottom padding equal to the bar height plus the safe-area inset.
9. [TEMPLATE] [high] [AI-ish copy] ★ — Agency strings that are not in the register render as finished copy (invariant #9). Spot-checked against the register by the editor:
   - **Articles:** "Travel this", "The journey behind the writing", "Questions this raises", "More from the guide", and "Planning this trip?" with "…we will draft it properly, day by day, with a price." (`travel-guide/[slug].astro:191-245`).
   - **Plan My Trip:** the lede (`plan-my-trip.astro:116-118`).
   - **Destinations:** the "More about" label and the closing-band body (`destinations/[slug].astro:297-298`), and the destination and city eyebrows.
   - **Cities:** the closing-band body "We will build Jaipur into a route that makes sense, rather than around it." (`cities/[slug].astro:246`).
   - **Luxury trains:** the disclosure note (`luxury-trains.astro:190-198`).
   - **Corporate:** the H2 "Three steps, one point of contact".

   Fix: register them all as DRAFT in one new COPY_REGISTER section. The ones that are false or that nobody can check are items 51, 58 and 89.
10. [TEMPLATE] [med] [spacing] ★ — `--space-section-tight` resolves to 79.2px at 1280 and 48px at 390, below the locked 96–128 / 56–72. It pads the trust bar, the corporate band, the footer top, journey and destination bands, and every Corporate, About, Reviews, Plan My Trip and policy section. Neighbouring bands of the same colour also stack their padding into 188–218px gaps (journey intro → highlights 188px; destination notes → FAQ 218px). Where: `tokens.css:99`. Rule: CLAUDE.md #5 section rhythm. Fix: `clamp(3.5rem, 2rem + 5vw, 6rem)` (56 to 96px), and alternate surfaces strictly or drop the top padding of a same-colour follower. Three auditors found this; one rated it high, calibrated to med.
11. [TEMPLATE] [med] [type] ★ — Every section opens with an uppercase crimson eyebrow tracked 0.1em: 10 on /, and "SPEAK TO A PERSON, NOT A PORTAL" wraps at 390. Footer headings and article categories repeat the treatment, destination eyebrows echo their own H2 ("JOURNEYS" over "Journeys in Kerala"), and city pages stack three uppercase label styles. /corporate/ already uses burgundy sentence case. Where: `global.css:224-235`, `Footer.astro:182-189`, `ArticleCard.astro:91-96`. Rule: signs.md, uppercase tracked labels; CLAUDE.md, crimson as punctuation. Fix: sentence case at normal tracking, burgundy on light grounds (the corporate treatment), and drop the echo eyebrows. Eyebrow styling is a design-language choice: confirm with the client before changing it.
12. [TEMPLATE] [med] [type] ★ — `--container-prose: 68ch` counts the width of Inter's "0", so lines run 85–97 characters at 17px in articles, policies and the About story. Where: `tokens.css:94`, `ArticleBody.astro:24-28`, `Policy.astro:71,79`. Rule: CLAUDE.md, measure ~68ch. Fix: about 54ch (≈31em), which gives about 70 characters a line, and the notice box at the prose width.
13. [TEMPLATE] [med] [generic-pattern] ★ — Crimson at rest:
    - "View journey →" on every journey card (one 1280 viewport on / holds 6 crimson links plus the header pill);
    - "Day 0X" numerals, transport and practical-note icons in the itinerary (up to 11 crimson marks per viewport on Kerala);
    - the booking-stepper rules and numerals (6 in one viewport).

    Where: `JourneyCard.astro:206-212`, `GlanceTable.astro:96-99`, `DayAccordion.astro:231-237`, `TransportChip.astro:86-90`, `PracticalNotesGrid.astro:75-78`, `BookingStepper.astro:48-67`. Rule: CLAUDE.md #5, "never floods a section"; burgundy for quiet details. Fix: burgundy or ink at rest; crimson on hover and on the one CTA.
14. [TEMPLATE] [med] [detail] ★✓ — The `ghost` button is borderless crimson text, and the ink `secondary` variant is used only on /dev/. Every secondary action on white is crimson ("Start a conversation →", and the 404's "All journeys" and "WhatsApp us"). Where: `Button.astro:115-118`. Rule: CLAUDE.md, "ghost/outline ink secondary". Fix: ghost in ink, or use `secondary`.
15. [TEMPLATE] [med] [generic-pattern] ★ — The ConvertBand has no primary: "WhatsApp us", the phone number and "Start planning" share one on-dark outline style. Less than a screen later the footer asks again ("Send a quick enquiry"), so there are two forms in two screens (2,618px at 390). On /plan-my-trip/ and /corporate/ the footer form stacks under the page's own form. Where: `ConvertBand.astro:56-72`, `EnquiryForm.astro:147`, `Footer.astro:110-113`. Rule: one action per viewport; T10 §4, "no other exits". Fix: a filled on-dark submit (today's hover state), and a Footer prop that drops the form column on pages that are already a form. The T14 footer reference is still pending, so review the second form with the client.
16. [TEMPLATE] [med] [detail] ★ — Header menus:
    - the burger never shows an open state (the bars never become an X);
    - on / the open white panel hangs under a header that is still transparent;
    - the 240px Destinations panel wraps "Rajasthan & the Golden Triangle" into a 69px row among 44px rows;
    - on train pages the header marks "Journeys" as current while the breadcrumb parent is Luxury Trains.

    Where: `Header.astro:39,222-259,347,433-471`. Fix: an X when expanded, a solid header while the menu is open, a panel of at least 17rem, and "Luxury Trains" as current on Variant B.
17. [TEMPLATE] [med] [detail] ★ — Breadcrumbs: journey pages show none (only BreadcrumbList JSON-LD), 12 templates each hand-build their own `.crumbs`, and the article trail omits the current page while the others include it. Where: `journeys/[slug].astro:170-193`, `destinations/[slug].astro:111,310`. Fix: one shared Breadcrumb component, added to the journey hero.
18. [TEMPLATE] [med] [AI-ish copy] ★ — One verbal tic runs across the site, "X, not Y":
    - "Speak to a person, not a portal" (A5 DRAFT)
    - "A conversation, not a form-filling exercise." (B9 DRAFT)
    - "Curated, not catalogued" (B14 DRAFT)
    - "A person, not an autoresponder." and "Not a brochure, and not a quote with three options." (J2/Q3 DRAFT)
    - "Not a booking form, a conversation." (G5 DRAFT)
    - "not a brochure" (F4 DRAFT)

    "Call centre" appears three times on / and twice on /plan-my-trip/ (A9, B22 DRAFT). Fix: keep one per page and elsewhere say what actually happens.
19. [TEMPLATE] [med] [decoration-without-purpose] ★ — The practical-notes icons are improvised:
    - "Pace" is clock hands without a dial, which reads as a broken mark;
    - the same icon stands in for "Fitness", "Sightings" and "Getting around";
    - the "Getting there" triangle reads as back or send;
    - pages with five notes leave the fifth alone on its own row at 1280.

    It appears on journeys, destinations and cities. Where: `PracticalNotesGrid.astro:22-30,69-73`. Rule: signs.md, one line-icon set; CLAUDE.md, the Phosphor vocabulary. Fix: glyphs from the trust bar's Phosphor set (or the lotus), and auto-fit columns.
20. [TEMPLATE] [low] [type] — The H1 (56/34px) and H2 (36/24px) render below the CLAUDE.md clamps (72/40, 44/28), because of the client's M4 revision-2 step-down. This is a documentation conflict, not drift. Fix: record the ruled scale in CLAUDE.md.

## B. Homepage (T1)

21. [PAGE-SPECIFIC] [high] [decoration-without-purpose] ★✓ — The hero scroll cue loops forever (`hero-cue 2.4s … infinite`). Where: `Hero.astro:437`. Rule: CLAUDE.md #4, 200–600ms with only Ken Burns exempt; signs.md, floating loops. Fix: a static chevron.
22. [TEMPLATE] [med] [type] ★ — The trust-bar numerals are larger than the H1: 57.6px against 56px at 1280, and 40px against 34px at 390 (also on /about/). CounterStat uses `clamp(2.5rem,4.5vw,3.75rem)` instead of `--text-stat`, which holds the ruled 2.75rem cap. Where: `CounterStat.astro:195`. Fix: use `--text-stat`.
23. [TEMPLATE] [med] [detail] ★ — From 768px up, stat 3 ("9 Regions") sits flush against its divider (0px against 20px on cells 2 and 4): the mobile odd-child reset is never undone inside the 48rem query. Also on /about/. Where: `CounterStat.astro:122-125,147-149`. Fix: reset `padding-inline-start` on `:nth-child(3)` at 48rem.
24. [PAGE-SPECIFIC] [med] [detail] ★ — The How It Works dotted rail runs from x=240 to x=1040, but the step markers are centred at 64, 475 and 885. It starts 150px clear of the first marker and runs 130px past the last. Where: `index.astro:697-711`. Fix: end the rail at the marker centres.
25. [PAGE-SPECIFIC] [med] [detail] ★ — Destination tiles:
    - each 384px tile is filled from a 256px-wide image (`sizes` 16rem), so they look soft at 1280;
    - Vietnam sits alone on row 5 at 390;
    - the grid is 1,940px tall at 390.

    Where: `index.astro:290,719-755`. Fix: `sizes` 24rem, and below 40rem span tile 9 across both columns.
26. [PAGE-SPECIFIC] [med] [generic-pattern] ★ — Why India Visit item 4's body is a three-word label ("24/7 On-Trip Support", which repeats the trust bar) next to bodies of 15–19 words. Where: `index.astro:193-195` (B16 APPROVED). Fix: a one-sentence body, registered as DRAFT.
27. [PAGE-SPECIFIC] [med] [AI-ish copy] ★ — "20 years" appears six times in three formats:
    - "20 years" (B2 DRAFT)
    - "20+ Years of Experience" (B4 APPROVED)
    - "Twenty years of it", followed by "20 years arranging…" (B13 DRAFT)
    - footer "20+ years" (A2 APPROVED)
    - "twenty years of planning" (L7 DRAFT)

    "Curated" appears three times plus the page title (A1, B14 DRAFT). Where: `index.astro:182,227`, `site-settings.ts:93`. Fix: one format, used twice at most; cut "curated" from the DRAFT lines.
28. [PAGE-SPECIFIC] [low] [AI-ish copy] ★ — CTA labels mix Title Case ("Explore Journeys", B3 APPROVED) with sentence case ("See the trains", unregistered; "Corporate travel →", B20 DRAFT, which repeats its own eyebrow), and arrows come three ways (a text →, an SVG, none). Where: `index.astro:234,455,484`. Fix: one case and one arrow treatment.

## C. Journey, Variant A (representative: Kerala with Houseboat)

29. [TEMPLATE] [high] [detail] ★ — Lotus bullets shrink when their text wraps. Highlight glyphs are 20px at 1280 but 4.9–11.7px at 390 across ten journeys, and inclusion glyphs drop to 8.7–13px. Where: `HighlightsGrid.astro:61-65`, `InclusionsBlock.astro:90-93` (a shrinkable flex item, plus `global.css:94` `max-width:100%`). Rule: CLAUDE.md #5, lotus = highlight bullet; signs.md, icons in many sizes. Fix: `flex: none` on `.highlights__glyph` and `.incl__glyph`.
30. [PAGE-SPECIFIC] [high] [AI-ish copy] ★✓ — Kerala's transport chips read "Drive · Drive 172 km" on Days 03, 05, 07 and 09 (172, 159, 109, 11 km), and Bhutan's Day 01 reads "Flight · Fly to Paro, or by road via Phuntsholing". These details have no separator, so the chip cannot remove the repeated word; the 12 Nov chip fix covered only separated details. Where: `kerala-with-houseboat-11n-12d.md:87,108,130,152`, `TransportChip.astro:42-46`. Fix: store "Drive: 172 km" like the other journeys, or let the pattern match a bare leading mode word.
31. [PAGE-SPECIFIC] [high] [AI-ish copy] ★✓ — On Golden Triangle's first screen, the pill "Delhi · Agra · Jaipur in Six Unhurried Days" sits on the route strip "DELHI · JAIPUR · AGRA · DELHI": the same dot chain in a different order, and it repeats the "5 Nights · 6 Days" pill. Golden Chariot pairs "Mysore…" with "MYSURU", two spellings in one hero. Where: `golden-triangle-5n-6d.md:5`, `golden-chariot-5n-6d.md:5`. Rule: COPY_REGISTER M2 DRAFT; Template Spec S1, "one short line". Fix: a line that adds a fact neither pill carries, and one spelling per page.
32. [TEMPLATE] [med] [detail] ★ — The phone hero is crowded. The signature pill wraps on 6 of 10 journeys (47–66 characters). With a three-line H1 the copy fills 588 of the 717px hero and leaves 130px of photograph, above three stacked CTAs of uneven width. At 1280, "Root / Bridges" and "Ha / Long Bay" break mid-name. Where: `journeys/[slug].astro:221-275,602-607`. Fix: cap `signatureFeature` at about 40 characters in Zod, set the two outline CTAs side by side at 390, and use non-breaking spaces inside place names.
33. [TEMPLATE] [med] [detail] ★ — Itinerary at a Glance stays a three-column table on phones (84/123/148px columns, 108–162px rows, 1,618px for Kerala's 12 days), although the component promises a definition list on mobile. Where: `GlanceTable.astro:9-11,55-108`. Rule: Template Spec S5. Fix: stack each row at full width below 48rem.
34. [PAGE-SPECIFIC] [low] [detail] ★ — "Explore Kochi →" shows on 4 of 12 Kerala days, including "Kochi to Munnar" and the departure day, because the chip matches any city named in the title. Where: `journeys/[slug].astro:165-168`. Fix: match the overnight city.
35. [TEMPLATE] [low] [type] ★ — At 390 day titles run 2–4 lines with one-word last lines, and the "Day 0X" label sits centred 34px down a 92px title. Where: `DayAccordion.astro:216-220,240-246`. Fix: `text-wrap: balance`, and the day number aligned to the top.

## D. Journey, Variant B (representative: Palace on Wheels)

36. [TEMPLATE] [high] [AI-ish copy] ★✓ — The operator attribution renders twice in a row under "Policies & cancellation" (three times on the page): "Operated by RTDC, the Rajasthan Tourism Development Corporation… Operator terms apply to your journey." then "Operated by RTDC (Rajasthan Tourism Development Corporation…). Full booking terms". Golden Chariot and Deccan Odyssey do the same. Where: `PoliciesAccordion.astro:33-39`. Rule: CLAUDE.md #6; COPY_REGISTER P4 DRAFT. Fix: render `operatorDisclosure` once, with the booking-terms link.
37. [TEMPLATE] [med] [spacing] ★ — Cabin facility lists stretch to match the tallest card (two one-line items become 135px and 110px bars), and the cards lift on hover though they hold no link. Where: `CabinCards.astro:114-123,139-150`. Fix: `align-content: start`, and no hover lift.
38. [PAGE-SPECIFIC] [med] [decoration-without-purpose] — Golden Chariot shows one cabin card, flagged "TOP TIER", in a four-column grid (three quarters of the row empty), while its copy says the train runs a single cabin class. Deccan's two cards leave half the row empty. Where: `CabinCards.astro:42,80-84`. Fix: no flag for a single cabin, a singular heading, auto-fit columns.
39. [TEMPLATE] [med] [AI-ish copy] ★ — The availability band repeats its heading: "Departures fill early: check availability for your dates" over "Departures fill early, and cabin categories sell out at different rates…". Where: `palace-on-wheels-7n-8d.md:276`, `golden-chariot-5n-6d.md:260` (C4, M6 DRAFT). Fix: open the body with the next step.
40. [TEMPLATE] [low] [spacing] ★ — At 1280 the booking stepper is six 183px columns, with the 15px body running 5–10 lines and starting 21px lower where a title wraps. The cabin disclosure uses a crimson rule where the rest of the page uses burgundy. Where: `BookingStepper.astro:48-67`, `CabinCards.astro:60`. Fix: a 3×2 grid with burgundy rules and numerals.
41. [TEMPLATE] [low] [type] ★ — "What's included" and "Not included" are H2s at 23px against 36px elsewhere, and pages without exclusions leave half the grid empty. Where: `InclusionsBlock.astro:63-73`. Fix: one H2 over two H3 columns, and a single column when there are no exclusions.

## E. Journeys index

42. [TEMPLATE] [high] [detail] — The Tadoba card breaks the 4:3 card shape: its portrait file (1400×1750) renders 278×347 at 1280, the last row grows to 495px, and the three train cards beside it carry about 117px of blank. Any portrait upload, including the client's own archive in M5, will do the same. Where: `JourneyCard.astro:131-140`. Rule: PAGE_TEMPLATES, card image 4:3; CLAUDE.md, "a photograph swap can never reflow the page". Fix: `overflow: hidden; min-height: 0` on `.card__media`, with the image absolutely filling it.

## F. Destination (representative: Kerala; the other eight spot-checked)

43. [TEMPLATE] [high] [spacing] — The "Reading before you go" H2 sits flush on the article photos: a 0px gap at both widths, with descenders touching the images, because the section has no `.sectionhead` wrapper. On Kerala, Rajasthan, Ladakh, Bhutan, Bali and Vietnam. Where: `destinations/[slug].astro:271-275`. Fix: reuse `.sectionhead` (2.25rem margin).
44. [TEMPLATE] [high] [AI-ish copy] — Dropping `{shortLabel}` into fixed sentences breaks the grammar: "Journeys in Wildlife", "Shall we plan Wildlife?", "a day-by-day plan for Wildlife and a price", "Journeys in North East", "More about North East", "Shall we plan South & West?". Where: `destinations/[slug].astro:136,163,297-298` (D4/D5 DRAFT register the headings only). Fix: a CMS field for the in-sentence form ("the North East", "a wildlife trip"), with the body registered.
45. [TEMPLATE] [med] [generic-pattern] — `auto-fill minmax(17rem)` always builds four columns at 1280. One card fills 23% of the row on Ladakh, Bhutan, Bali and Vietnam (twice per page), two cards fill 49% on South & West, North East and Kerala's reading row, and the "All journeys" pill is stranded at the far right. Where: `destinations/[slug].astro:425-429`. Fix: for one or two cards, the FAQ's heading-left, content-right layout.
46. [PAGE-SPECIFIC] [med] [AI-ish copy] — Two pages contradict themselves:
    - **Kerala:** the "More about" expander repeats the intro word for word, contradicts it ("a twelve-day journey" against "in a week"), and says "We run three." above four cards.
    - **Ladakh:** gives "roughly May to September" against "June to September", and mixes "eleven and eighteen thousand feet" with "11,500 feet".

    Where: `kerala.md:10,90,97`, `ladakh.md:14,18,23,39` (D3/N DRAFT). Fix: cut the repeated paragraph; one season and one number format.
47. [PAGE-SPECIFIC] [med] [generic-pattern] — "What defines" repeats the city pages instead of linking to them. 3 of Rajasthan's 4 tiles are Jaipur's, with the same photos and caption. Kerala's "Fort Kochi" and "The spice trail" re-word Kochi. No destination page links to /cities/. Where: `rajasthan-golden-triangle.md:20-36`, `kerala.md:20-37` (D3/D6 DRAFT). Rule: CLAUDE.md, destination pages are the entry points to cities. Fix: link those tiles to the city pages, and give the other tiles region-wide subjects.
48. [PAGE-SPECIFIC] [med] [AI-ish copy] — South & West reads like one journey's page ("Who is this journey really for?", "the longest of any route we run"), above two journey cards. Where: `south-west-india.md:29-42` (D3 DRAFT). Fix: rewrite it for the region.
49. [TEMPLATE] [med] [AI-ish copy] — The same tics recur across destination and city prose:
    - "actually", "really" or "exactly" in 8 of 36 FAQ questions;
    - "rather than" 31 times;
    - two pages claim the same superlative: Ladakh is "the least Indian-feeling part of India" and the North East is "the least like the rest of it".

    Where: `src/content/destinations/*.md` (D3/N DRAFT). Fix: cut the intensifiers, vary the contrasts, keep one superlative.
50. [TEMPLATE] [low] [type] — The FAQ H2 stacks into three one-word lines (124px) in its 18rem column, and the taglines end on one- or two-word last lines. Where: `FaqAccordion.astro:78-83`. Fix: `text-wrap: balance`.

## G. Destinations index

51. [PAGE-SPECIFIC] [high] [AI-ish copy] — Unregistered group lines styled as final copy, one of them untrue:
    - "Three neighbours we plan as carefully as we plan home." (Vietnam does not border India)
    - "From the Thar desert to the backwaters, plus the wildlife reserves that cut across all of it."
    - closing band: "Somewhere else in mind?" / "These are the regions we know best, not the limits of what we will plan…"

    Where: `destinations/index.astro:68,73,169-170` (D1 covers only the H1 and lede). Fix: register them, and make the Beyond India line factual.
52. [PAGE-SPECIFIC] [med] [AI-ish copy] — Read in a row, the nine hooks follow one formula: 7 of 9 are "A, B and C" triples ("Hill tea, tiger country and a network of canals…"), and the same strings are the destination hero lines. Where: destination `tagline` fields (D3 DRAFT). Fix: one concrete fact per hook, in varied shapes.
53. [PAGE-SPECIFIC] [low] [type] — One screen gives counts in three formats: "six across India" (lede), "6 DESTINATIONS" (eyebrow) and "8 journeys" (cards). Where: `destinations/index.astro:102,121`. Fix: drop the count eyebrows.

## H. City (representative: Jaipur; Kochi spot-checked)

54. [TEMPLATE] [med] [type] — "About Jaipur" is an H2 rendered at 15px uppercase crimson, while every other H2 is 36px display, including the FAQ heading in the same two-column layout. Three uppercase label styles appear within 1.5 screens. Where: `cities/[slug].astro:276,318,352`. Fix: a normal H2 and one label style.
55. [TEMPLATE] [med] [spacing] — Grids that don't fit their content: three 32–51-word practical notes sit in a four-column grid (74% of the row, 6–8 lines per column), and six journey cards in four columns break 4+2 on Jaipur. Where: `PracticalNotesGrid.astro:69-73`, `cities/[slug].astro:188,437-441`. Fix: three columns for three notes, and a three-up journey grid.
56. [PAGE-SPECIFIC] [med] [AI-ish copy] — The provisional prose repeats itself and states unconfirmed operating claims in the client's voice:
    - Jaipur gives "October to March" three times and duplicates its "Two days… Three…" FAQ;
    - "We do not arrange elephant rides", "a dealer we have used for years", "a number of our travellers fly in and out of Jaipur";
    - Kochi opens with "less a city than a set of islands…".

    Where: `jaipur.md:15,36,83,90,96,100-116`, `kochi.md:22` (D6 DRAFT, review sheet §16; no ⚑). Fix: cut the duplicate FAQ, and flag the claims ⚑ for the client.

## I. Article (representative: Best Time to Visit Ladakh; the other seven spot-checked)

57. [TEMPLATE] [high] [spacing] ✓ — An article with fewer than four H2s gets no table of contents but keeps the two-column grid at 64rem and wider. The body falls into the 256px TOC column: about 28 characters a line beside an empty 880px column (the Kerala houseboat guide at 1280). Where: `travel-guide/[slug].astro:62-63,343-348`. Fix: use the grid only when the TOC renders.
58. [TEMPLATE] [high] [AI-ish copy] ✓ — The author block under all eight agency-drafted articles says "Every itinerary on this site was written by the person who plans them, not by a content team." COPY_REGISTER §M records the journey titles, intros and highlights as written or rewritten by the agency, and the string is not registered. Where: `travel-guide/[slug].astro:215-219`. Rule: invariant #9 (compare G1 ⚑). Fix: register it, and cut the second sentence or replace it with something that can be checked.
59. [TEMPLATE] [med] [spacing] ★ — The "slim" hero is 1,041px tall at 1280 (a 16:9 photograph). The first paragraph starts at y=1,193, so the demo article's first screen has no text. Where: `travel-guide/[slug].astro:146-159,330-335`. Rule: T9 §1, "slim". Fix: show the excerpt as a lede under the H1, and crop the photo to 21:9.
60. [TEMPLATE] [med] [spacing] ★ — On mobile the table of contents is a fixed list of 4–8 links, so the first paragraph starts at y=894–1,063 on an 844px screen. Where: `travel-guide/[slug].astro:166-179`. Rule: T9 §2, "collapsible mobile". Fix: a closed `<details>` below 64rem.
61. [TEMPLATE] [med] [detail] — Lists in the article body show no bullets or numbers, because Tailwind's reset is never undone. The Palace on Wheels list that "runs in six steps" has no numbers. Where: `ArticleBody.astro:43-46`. Fix: decimal numbers on `ol`, a marker on `ul`.
62. [TEMPLATE] [med] [spacing] ★ — The required journey card comes after the last paragraph (T9 §3 puts it mid-body). It sits alone in an 880px row (~600px blank), and its hairline runs 151px past the text column. Where: `travel-guide/[slug].astro:186-208,386-402`. Fix: place it after the second H2, inside the text column.
63. [TEMPLATE] [med] [generic-pattern] ★ — "Related" shows the three newest posts, but seven share the date 2026-09-12, so file order decides. Bali, Ladakh and First Trip fill 21 of the 24 related slots; Golden Triangle, Kerala, Palace on Wheels and Vietnam are never recommended; and the Palace on Wheels guide recommends the Bali visa guide. Where: `travel-guide/[slug].astro:69-72`. Fix: rank by shared category or destination, with the date only as a tiebreak.
64. [PAGE-SPECIFIC] [med] [AI-ish copy] ★ — The eight drafts share one formula:
    - 7 of 8 open "X is the [superlative]…, and…";
    - 6 of 8 intros end on "Here is…";
    - "actually" appears in 6 bodies, "honest" 4 times in Golden Triangle, "rather than" 6 times in Bali;
    - Bali, Bhutan and Vietnam share one outline and the same italic "rules change" caveat;
    - units mix: Ladakh says "eleven and a half thousand feet" in the body and "3,500 metres" in the FAQ, and Vietnam says "a thousand miles".

    Where: `src/content/posts/*.md` (L1–L7, I4 DRAFT). Fix: write each opening and closing from its own subject, cut the repeats, use metric units.
65. [PAGE-SPECIFIC] [med] [AI-ish copy] — The Vietnam guide contradicts itself on season. It says "Hanoi's winter can be damp and grey in February and March", then suggests "December to March, when the north is cool and clear", and gives the centre's dry season as February–August. Where: `vietnam-evisa-guide-indian-passport.md:93,104` (L4 DRAFT ⚑). Fix: make the advice agree before approval.
66. [PAGE-SPECIFIC] [med] [AI-ish copy] — The Kerala houseboat guide is a 161-word stub ("1 min read"), while its excerpt and meta promise how boats differ, how to choose between them and what is included on board. Where: `kerala-houseboat-guide.md:4,29,32-44` (I4 DRAFT). Fix: write those sections, or trim the excerpt.
67. [PAGE-SPECIFIC] [med] [type] — The Golden Triangle guide writes "5 nights / 6 days" four times where the card reads "5N · 6D", and its title "5 Days or 10?" matches none of its itineraries (the shortest is six days; its FAQ says "Six days is the honest minimum"). Where: `golden-triangle-5-days-vs-10-days.md:5,23,52,63,75,88` (L6 DRAFT). Rule: CLAUDE.md #7, the middle dot. Fix: "5 Nights · 6 Days", and retitle. The auditor rated it high; calibrated to med because it is DRAFT body copy, off the demo path.

## J. Travel-guide index

68. [PAGE-SPECIFIC] [high] [detail] — The featured card, the first thing on screen, is broken. Its 21:9 rule targets `.card__media`, a class ArticleCard doesn't have (it uses `.post__frame`), so the photo renders 4:3 at 1200×900. It comes from a 352px file (`sizes` 22rem, stretched ~3.4×, soft), with a 19px title under it. Where: `travel-guide/index.astro:258-260`, `ArticleCard.astro:42,69-74,98-101`. Rule: T8 §2. Fix: target `.post__frame`, and give the featured card its own image sizes and title size.
69. [PAGE-SPECIFIC] [med] [spacing] — The grid runs 3+3+1 at 1280, leaving Kerala alone beside two empty slots: the leftover row the client ruled out for the homepage strip. Where: `travel-guide/index.astro:305-312`. Fix: feature two posts side by side, so the grid is 3+3.
70. [TEMPLATE] [med] [generic-pattern] — Every card reads "September 2026" (7 of 8 posts share one date), so "latest" is a tie and file order picks the featured post. T8 §4 asks for reading time on cards. Where: `ArticleCard.astro:29-33,48-53`, `travel-guide/index.astro:25-31`. Fix: show reading time, and pin the featured post.
71. [PAGE-SPECIFIC] [med] [AI-ish copy] — "actually" appears six times on the page (the lede plus 5 of 8 excerpts), and two excerpts open the same way ("What a week on the Palace on Wheels is actually like" / "What a night aboard a kettuvallam is actually like"). Where: `travel-guide/index.astro:64-66`, post excerpts (I1, I4, L1–L7 DRAFT). Fix: rewrite the excerpts.
72. [PAGE-SPECIFIC] [low] [detail] — Filter problems:
    - the chips count only the grid ("All 7" of 8 articles; "Planning & Visas 3" of 4);
    - the featured card ignores the filter;
    - at 390 the four chips take three rows;
    - the H1 "Travel guide" sits under the breadcrumb "Travel Guide".

    Where: `travel-guide/index.astro:35-37,63,101-117`. Fix: count all posts, filter the featured card, use one casing.

## K. Luxury trains landing

73. [PAGE-SPECIFIC] [med] [AI-ish copy] ★ — "Why by train" describes one train on a page for three: "Seven cities, one unpacking" and "Seven cities in eight days… a road itinerary across Rajasthan" are about the Palace on Wheels. "A better one than most of the cities it stops in can offer" is a claim nobody can check. Where: `luxury-trains.astro:43-59,134` (E2, E3 DRAFT). Fix: reasons that are true of all three trains, and drop the comparison. The hero breadcrumb contrast is item 6.
74. [PAGE-SPECIFIC] [med] [detail] ★ — The cards sort by nights, and file order breaks the seven-night tie. The Deccan Odyssey, with its provisional programme, comes first; the Palace on Wheels, the train on the demo path, sits in the middle. Where: `luxury-trains.astro:36-37`. Fix: an explicit order, Palace on Wheels first.
75. [PAGE-SPECIFIC] [med] [spacing] ★ — The two-line disclosure note gets its own section, with 188px above and below it, the largest gap on the page; its "operated by its own operator" is unregistered. Where: `luxury-trains.astro:190-198`. Fix: the last line of the FAQ section, with tighter wording.
76. [PAGE-SPECIFIC] [low] [decoration-without-purpose] ★ — A lotus fronts the operator disclosure, set as a yellow semibold highlight, so a legal line reads like a selling point; at 390 the lotus floats between its two lines. Where: `luxury-trains.astro:124-127,239-247`. Fix: drop the lotus.

## L. Corporate

77. [PAGE-SPECIFIC] [high] [detail] ★✓ — The eyebrow "How we work with companies" is burgundy on the burgundy band (1.00:1): invisible at both widths. A scoped `.eyebrow{color:burgundy}` beats `global.css:233` `.on-dark .eyebrow`. Where: `corporate.astro:254-256`, used at `:168`. Rule: AA; CLAUDE.md #5, yellow on dark grounds. Fix: limit the burgundy override to light grounds, so this one returns to yellow.
78. [PAGE-SPECIFIC] [high] [generic-pattern] ★ — "Send us a brief" is the leisure form unchanged (Travel month "Not sure yet", "Anything you'd like us to know?", "Start planning"). The lede beside it asks for "numbers, rough dates and a budget band", and the form collects none of them. Where: `corporate.astro:226-237`, `EnquiryForm.astro:117-148` (T5 §6; F6, A8 DRAFT). Fix: a corporate EnquiryForm layout (company, group size, dates, budget band) with a registered "Send the brief" button.
79. [PAGE-SPECIFIC] [med] [AI-ish copy] ★ — One selling point is made four times:
    - "a single person who answers the phone for the whole trip" (F1)
    - "One point of contact who answers the phone on the morning it matters" (F2)
    - the H2 "Three steps, one point of contact" (unregistered)
    - "a named person to take your questions" (F4)

    "actually" appears twice, and number styles mix ("20 years…" against "Twenty to two hundred", "Forty people"). Where: `corporate.astro:67-100,132-134,169`. Fix: the phone promise in the hero only, and one number style.
80. [PAGE-SPECIFIC] [med] [generic-pattern] ★ — At 390 the corporate sticky bar reorders to [Call][Form][WhatsApp], but the crimson fill stays on "Form", while the page means to lead with Call. Where: `StickyMobileBar.astro:148` (T5 §7). Fix: in the corporate layout, put the crimson fill on Call.
81. [PAGE-SPECIFIC] [low] [decoration-without-purpose] ★ — Only step 03's title carries a yellow lotus, and it marks nothing. Step 02's title wraps, so the step bodies start at 289, 315 and 289px. Where: `corporate.astro:101,177`. Fix: drop the lotus and align the bodies.

## M. About, Reviews, Plan My Trip, policies, 404

82. [PAGE-SPECIFIC] [med] [AI-ish copy] — About repeats itself and changes voice. The H1 "Every trip on this site was planned by a person" (G1 DRAFT) restates the homepage H1 (B1); "Every itinerary on this site" comes back in G3; the voice moves from "I" to "India Visit began" to "We". The founder quote's own repetition is part of the skipped provisional quote. Where: `about.astro:95,129-143,66`. Fix: give the H1 its own claim, and keep one voice.
83. [PAGE-SPECIFIC] [low] [generic-pattern] — About's philosophy is three identical lotus-topped columns. T6 §4 names two ideas, so "Nothing bought off a shelf" fills a third, and the first title wraps, so its body starts 27px lower. Where: `about.astro:52-68,165-175` (G3 DRAFT). Fix: two columns.
84. [PAGE-SPECIFIC] [low] [spacing] — About's hero copy is centred on the 440px portrait slot, which puts its breadcrumb at 245–256px where sibling pages have it at 152px. Where: `about.astro:228`. Fix: `align-items: start`.
85. [PAGE-SPECIFIC] [med] [generic-pattern] — Reviews' filter chips count placeholder slots as reviews ("All 2 · India 1 · Trains 1" over two "coming soon" slots, with 0 real reviews), and the wall builds three 379px tracks for two cards. Where: `reviews.astro:38-40,56,123,291`. Rule: CLAUDE.md #9. Fix: count real reviews, show chips only when real reviews span two or more categories, and use two columns.
86. [PAGE-SPECIFIC] [low] [type] — The review trip pill reads "Palace on Wheels, 7N/8D" where the cards read "7N · 8D". Where: `testimonials/slot-*.json:2`. Rule: CLAUDE.md #7. Fix: "Palace on Wheels · 7N · 8D".
87. [PAGE-SPECIFIC] [high] [generic-pattern] ★ — On Plan My Trip, crimson goes everywhere except the task:
    - the header's crimson "Plan My Trip" links to the page you are on, with no `aria-current`;
    - the aside's phone number and "WhatsApp us" are crimson;
    - "Next" is solid ink, with the same fill, shape and 44px height as a selected chip;
    - at step 4, four crimson actions share one viewport.

    Where: `Header.astro:127`, `plan-my-trip.astro:551-565,689,769`. Rule: CLAUDE.md #5. Fix: a quiet current-page state for the header CTA here, Next as the crimson primary, and the aside contacts in ink.
88. [PAGE-SPECIFIC] [high] [spacing] ★ — At 390 the Plan My Trip form starts at about 1,020–1,050px on an 844px screen. The whole first screen is reassurance, and the page has no sticky bar. Where: `plan-my-trip.astro:105-165`. Rule: T10; CLAUDE.md #5. Fix: on mobile, put the form right after the H1 and lede.
89. [PAGE-SPECIFIC] [high] [AI-ish copy] ★✓ — Two promises that are not in the register, one of them a data-sharing claim made while /privacy/ is still a placeholder: "We reply personally, and quickly: never a call centre and never a bot." and "No obligation, no call centre, and we never pass your details on." Where: `plan-my-trip.astro:142,350`. Rule: CLAUDE.md #9. Fix: register both as ⚑ promises for the client, or cut them to one neutral line.
90. [PAGE-SPECIFIC] [med] [spacing] ★ — At 1280 the step-1 card is 407px tall beside an 885px aside, which leaves about 480px of white under the form. Where: `plan-my-trip.astro:449-452`. Fix: stretch the card, or move "Before you send it" under it.
91. [TEMPLATE] [med] [detail] — No policy page shows "Last updated" (none passes `updated`, including booking-terms, whose body is APPROVED, K3). The booking-terms cancellation slabs are run-in sentences on a 6,198px page. Where: `Policy.astro:58`, `booking-terms.astro:74-90`. Rule: T12. Fix: pass `updated`, and set the slabs as a table (notice period · charge). The policy measure is item 12.
92. [PAGE-SPECIFIC] [med] [generic-pattern] — The 404 has three crimson actions in one row (the primary, plus "All journeys" and "WhatsApp us" as crimson ghost buttons), four with the header CTA. Where: `404.astro:43-47`. Fix: `variant="secondary"` (the cause is item 14). The auditor rated it high; calibrated to med because it is off the demo path and the cause is sitewide.
93. [PAGE-SPECIFIC] [med] [detail] — The 404 lotus's margin-top computes to 0. The page's scoped `.lost__mark` never matches the Lotus component's span, so the glyph sits on the graphic's bottom edge, and the note at `Lotus.astro:32-33` is wrong. Where: `404.astro:36,83-85`. Fix: put the margin on a wrapper the page owns, and correct the note.
94. [PAGE-SPECIFIC] [med] [generic-pattern] — The 404 is the stock composition: a 420px road-into-sunset thumbnail over a centred H1 and buttons. T13 asks for a full-bleed image with a lotus watermark. The SVG uses the off-palette colours #3D0A1E and #2A1520, and "The good stuff is all one click away" (K1 DRAFT) is filler. Where: `404.astro:35,66-73`, `404-road.svg:14-20`. Fix: a full-width burgundy band with BandWatermark and palette-only fills, and a lede that says where the links go.

## Parked with a skipped state (check when it goes live)

- **The PDF-download gate** (disabled, so skipped by ruling). Two things will need fixing before it goes live:
  - its copy is unregistered and promises twice: "Take it with you", "Download this itinerary", "…it is sent to you straight away.", and "The PDF is the same itinerary as this page, section for section. We may follow up once. No list, no spam." (with "section for section" said twice in one block; `journeys/[slug].astro:401-406`, `EnquiryForm.astro:153`);
  - its fields measure 1.15:1 against the off-white band they sit on (`journeys/[slug].astro:398`).

  Register the copy, and put the gate on white.

## Evidence

Captures, crops and probe outputs are in this session's scratchpad (`scratchpad/audit/a1-chrome-home/`,
`a2-journeys/`, `a3-destinations/`, `a4-guide-trains/`, `a5-corporate-rest/`). The scratchpad is
temporary, so copy anything wanted for round 5 into `reports/` before it goes.

---

Lens: the unslop sign list by Damir Sokolovsky ([@heydamir](https://x.com/heydamir)), CC BY 4.0.
