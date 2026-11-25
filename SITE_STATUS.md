# SITE_STATUS.md — where the India Visit website is, right now

**Updated:** 2026-11-25, design round 6 approved and live · **Production:**
`main` at PR #33 (`e38c171`), live since 25 Nov 13:06 IST; `main` then moved
only by docs, https://india-visit-website.pages.dev · **Freeze:** re-frozen
after PR #34 (docs). No agency merges until the next working session, which
carries the round-5 medium and low triage (pre-approved). The client's own
edits through `/admin` stay open

This file is the one-page answer to "what is live, what is provisional, and
what is blocking". It is updated in the same commits as the work it describes.
Detail lives in `SESSION_LOG.md` (the running narrative), `docs/CLIENT_REVIEW_SHEET.md`
(what needs the client) and `docs/COPY_REGISTER.md` (which words are whose).

## Milestones

| Milestone | Status | Gate |
|---|---|---|
| M0 Pre-flight · M1 Scaffold · M2 Schema · M3 Components | **Merged** | passed |
| M4 Page templates (three design rounds) | **Merged** | DESIGN VERDICT: **APPROVED** (client, 2026-11-12) |
| M5 Content migration | **Merged** | evidence in `reports/m5-gate-summary.json`; two ⚑ items below |
| **M7 Tina CMS** *(pulled forward)* | **GATE PASSED** (2026-11-14, by ruling) · `/admin` **fully open** | The first production save (12 Nov) corrupted an image path and broke the build; root cause fixed, and `check:image-paths` guards every build. The live round trip on Tina Cloud (runbook M7 step 4a) passed on 14 Nov: a title and an image swapped on Tadoba changed exactly those two values, the image path stayed `/uploads/…`, the build went green and the swapped hero was served as AVIF/WebP. The test values were restored (PR #25) |
| M6 Forms, lead function, GTM *(runs after M7)* | **M6-minimal LIVE** (2026-11-12, 18:04 IST) | Enquiry forms and Plan My Trip post to `functions/api/lead.ts` (validation, honeypot, Resend), sent from `enquiries@india-visit.com` to `info@india-visit.com` with the visitor as reply-to. Every test lead landed complete in the inbox: 14:33 on 12 Nov, then the 18:52 post-fix test and a 19:12 Plan My Trip submission that evening, so Plan My Trip is verified end to end before and after the consent fix. The PDF gate and the newsletter still read "Launching shortly". Turnstile, the Sheet webhook, the PDF release and GTM follow after the demo |
| **Design round 5** (the unslop audit) | **26 high items fixed** (PR #21, 13 Nov) | `docs/UNSLOP_AUDIT.md`. The 54 medium and 14 low items are **pre-approved as a batch** (25 Nov, with the round-6 verdict) and go into the next working session, ruled by the agency under the escalation standard (session log, 25 Nov). Done ahead of it (pre-approved 14 Nov): Best Practices **100**, through Partytown 1.0.5 (PR #26), and with reduced motion a phone hero's primary steps down beside the sticky bar's crimson Enquire (PR #27) |
| **Design round 6** (external polish spec) | **Merged, live** (PR #33, 25 Nov 13:06 IST) | DESIGN VERDICT: **APPROVED as built** (25 Nov). All ten declines endorsed; §29.7 ruled (a form field is visible against its ground, now in CLAUDE.md); the rest of §29 ruled by the agency. `docs/design/EXTERNAL_POLISH_AUDIT.md`, written by the owner's outside designer against a static mirror, ported into the components rule by rule (no override stylesheet). Icons Phosphor throughout. The full suite passed on production: 610 contrast runs all AA, Lighthouse budgets held, LCP unchanged |
| M8 SEO, analytics, hardening · M9 Launch | not started | PRD §16 checklist |

## What is on the site

| | Count | Notes |
|---|---|---|
| Pages built | **62** | + sitemap; `/dev/components/` and the three provisional policy pages are excluded from it |
| Journeys | **28** | 25 Variant A · 3 Variant B. All 28 pass Template Spec §6. The eight short programmes (22 Nov) are the client's own documents; `/journeys/` groups them as Short Breaks (every trip of four days or fewer, with Tadoba), and `/corporate/` lists them too until she rules (review sheet §28.1) |
| Destinations | 9 of 9 | |
| City pages | 2 | Jaipur, Kochi |
| Travel Guide articles | **8 of 8** | the PRD §7.8 launch set |
| Branded PDFs | **28 of 28** | all reprinted 2026-11-24 for round 6 (they print the page's own styles); still public at `/downloads/` |
| Lead forms | **115 live**, 29 not yet (counted in `dist/`, 22 Nov) | live on every page (enquiry forms, Plan My Trip, and since 13 Nov the corporate brief: company, group size, dates, budget band); the 28 PDF download forms and the newsletter read "Launching Shortly" |
| Contact details | **all real** | +91 98102 41121 (call and WhatsApp; every call button), second line +91 98102 24108 (shown under it), info@india-visit.com (Cloudflare Email Routing to Gmail; Resend only sends, its "receiving" stays off), B-33 Geetanjali Enclave, IInd Floor, New Delhi 110017, Instagram and Facebook (footer icons, JSON-LD `sameAs`), GSTIN on `/corporate/` and `/booking-terms/`. Only the WhatsApp prefill wording awaits approval |
| Photography | **1 client** (the founder portrait, from her About Us, 21 Nov), **59 TEMP-PHOTO** (eight new heroes for the short programmes, 22 Nov) + 1 TEMP-VIDEO | all under `/public/uploads/` in the form Tina writes. The client's Drive folder is inventoried but **blocked on rights** (below) |
| Visible em dashes | **0** (was 1,101) | house rule: at most one per screen (CLAUDE.md #7) |

## ⚑ Blocking or needs the client

1. **Photo rights (P4)**, `CLIENT_REVIEW_SHEET.md` §27. The Drive folder (455
   images, 204 at ≥1600px) holds third-party images: four carry a
   photographer's mark ("© Nick Mayo" twice, Dhrubazaan Photography,
   PrassyPhotography) and one is from Wikimedia. Those five never ship. No
   image reads as the client's own. Four swaps for the demo-path slots are
   pre-picked and wait for the client to mark each own / licensed / neither.
2. **Deccan Odyssey day-by-day**: eight provisional days until the operator's
   programme arrives (`CLIENT_REVIEW_SHEET.md` §22). Do not launch it as-is.
3. **Legal copy** for `/privacy/`, `/terms/`, `/cancellation/`: structure only,
   `noindex`, needs the client's adviser (§19). `/booking-terms/` is not one of
   them: its text is APPROVED (K3), and since the client's ruling of 13 Nov it
   carries no notice and is indexed. **Launch gate, at the same sign-off:**
   Plan My Trip's "Your details go only to India Visit" (COPY_REGISTER S2) is
   reconciled with the final privacy policy (client ruling, 13 Nov evening; no
   action before then).
4. **PDF gating is not real until the M6 PDF release**: the files are public,
   and the PDF form reads "Launching Shortly".
5. **Copy approval**: drafted strings stay `DRAFT` in `docs/COPY_REGISTER.md`
   (§A–§S) until struck or approved. §S (13 Nov) registers every string the
   round-5 sweep found unregistered; its ⚑ rows are claims for the client.
6. **Three questions from the client's About Us** (`CLIENT_REVIEW_SHEET.md`
   §14): whether the footer's © line should carry India TajMahal Tour
   Operators; whether Nepal and Sri Lanka, which her text names, become
   destination pages (none created); and any dated milestones for the
   two-stop About timeline.
7. **Five questions from round 5** (`CLIENT_REVIEW_SHEET.md` §28): where the
   eight short programmes belong (both pages until she says), the GSTIN in
   the footer, Darjeeling and Khajuraho's nearest-fit destination pages, her
   Instagram reels (the homepage section is built and absent until three
   exist), and any of her own photographs for the eight new pages.

## Provisional (renders, flagged, reversible)

- Pace / "ideal for" tags on the original 20 journeys, and the pace on the
  eight short programmes, whose "Ideal for" is the client's own line (Open
  Q#14)
- Train operator names and advance percentages on the two newer trains (§22)
- Four visa/entry articles' regulatory facts (§24)
- Items omitted from the client's documents in the port (§23)
- Trust figures (travellers, destinations), association logos, aggregate
  rating, response SLA: all null and unrendered. The founder's name, role,
  portrait and lines, the founding year (2005) and the legal entity are the
  client's own since 21 Nov (her About Us; COPY_REGISTER §T)

## Next action

1. **Agency, next working session:** the round-5 medium and low triage (54
   medium and 14 low items, `docs/UNSLOP_AUDIT.md`), pre-approved as a batch.
   The agency rules each item: the audit's intent where it complies with the
   locked rules, the locked rules where it does not. Only an item that changes
   words on the site, the brand's identity or a claim made to clients goes to
   the owner; the rest are logged as agency rulings in the review sheet. Check
   first which items round 6 already answered. In the same session, a
   deterministic tie-break for the homepage's featured row, whose ties
   currently follow the build machine's file order (session log, 25 Nov).
2. **Client:** review sheet §28 (round 5), §14 (About Us) and §27 (photo
   rights). `/admin` is open for everyday edits; the first new photo uploaded
   through it is worth a look at its commit.
3. **Later, when scheduled:** M6 proper (Turnstile, Sheet webhook, PDF
   release, GTM), then M8. Generalise `check:hero-contrast` to banners below
   the fold (the homepage trains banner was measured by hand on 12 Nov; the
   destination tiles joined through `data-on-image` in round 6).
