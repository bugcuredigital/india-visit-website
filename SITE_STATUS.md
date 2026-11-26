# SITE_STATUS.md — where the India Visit website is, right now

**Updated:** 2026-11-26, launch prep · **Production:** `main` at PR #35
(`c4f9b98`), live since 26 Nov 13:21 IST; `main` then moved only by docs,
https://india-visit-website.pages.dev · **Freeze:** re-frozen after PR #36
(docs). No agency merges until the keys arrive and the launch work resumes
(`LAUNCH_DAY.md`). The client's own edits through `/admin` stay open

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
| M6 Forms, lead function, GTM *(runs after M7)* | **M6-minimal LIVE** (2026-11-12, 18:04 IST) | Enquiry forms and Plan My Trip post to `functions/api/lead.ts` (validation, honeypot, Resend), sent from `enquiries@india-visit.com` to `info@india-visit.com` with the visitor as reply-to. Every test lead landed complete in the inbox: 14:33 on 12 Nov, then the 18:52 post-fix test and a 19:12 Plan My Trip submission that evening, so Plan My Trip is verified end to end before and after the consent fix. **Launch prep (26 Nov, PR #35): the rest of M6 is built and waits only for keys.** Turnstile (server-side, script on first touch of a form), the Sheet copy of every lead, UTM capture, the PDF release (signed hour-long links; `/downloads/*` gated now) and the GTM events. Each key switches its own step on (`LAUNCH_DAY.md` A1–A4); until then the forms work exactly as before. The PDF form and the newsletter still read "Launching Shortly" |
| **Design round 5** (the unslop audit) | **26 high items fixed** (PR #21, 13 Nov) | `docs/UNSLOP_AUDIT.md`. The 54 medium and 14 low items were **ruled on 26 Nov** (PR #35) under the escalation standard: 43 fixed, 5 already settled, 20 escalated to the owner (review sheet §30), 3 parts declined on locked rules. Done ahead of it (pre-approved 14 Nov): Best Practices **100**, through Partytown 1.0.5 (PR #26), and with reduced motion a phone hero's primary steps down beside the sticky bar's crimson Enquire (PR #27) |
| **Design round 6** (external polish spec) | **Merged, live** (PR #33, 25 Nov 13:06 IST) | DESIGN VERDICT: **APPROVED as built** (25 Nov). All ten declines endorsed; §29.7 ruled (a form field is visible against its ground, now in CLAUDE.md); the rest of §29 ruled by the agency. `docs/design/EXTERNAL_POLISH_AUDIT.md`, written by the owner's outside designer against a static mirror, ported into the components rule by rule (no override stylesheet). Icons Phosphor throughout. The full suite passed on production: 610 contrast runs all AA, Lighthouse budgets held, LCP unchanged |
| M8 SEO, analytics, hardening | **Prepared** (26 Nov, PR #35) | Redirects (`/contact/`, the old site's sections), security headers with an enforced CSP, structured data checked on every page (`check:structured-data`; the Schema.org validator clean), robots.txt from SITE_URL, one policy switch for the sitemap. Search Console and the device QA matrix are launch-day steps |
| M9 Launch | **Runbook ready** | `LAUNCH_DAY.md`: decisions D1–D6 before the day, then policies, domain, smoke tests, Search Console, rollback by symptom |

## What is on the site

| | Count | Notes |
|---|---|---|
| Pages built | **62** | + sitemap; `/dev/components/` and the three provisional policy pages are excluded from it |
| Journeys | **28** | 25 Variant A · 3 Variant B. All 28 pass Template Spec §6. The eight short programmes (22 Nov) are the client's own documents; `/journeys/` groups them as Short Breaks (every trip of four days or fewer, with Tadoba), and `/corporate/` lists them too until she rules (review sheet §28.1) |
| Destinations | 9 of 9 | |
| City pages | 2 | Jaipur, Kochi |
| Travel Guide articles | **8 of 8** | the PRD §7.8 launch set |
| Branded PDFs | **28 of 28** | all reprinted 2026-11-26 (the batch changed the journey pages they print from); **gated since 26 Nov**: a bare `/downloads/` path redirects to its journey, and the form releases a signed link once it is switched on |
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
4. **The PDF form's switch** (`PDF_GATE_LIVE`): the files are gated, and the
   form goes live once its two lines are approved (COPY_REGISTER §V, review
   sheet §30.3) and a test on the preview passes.
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
8. **Launch preparation, review sheet §30**: the site's address and the www
   choice (30.1–30.2), the PDF lines (30.3), five facts only the client can
   confirm (30.4–30.8: the trains' cancellation bands leave day 95 and day 34
   in none) and the proposed wording from the audit batch (30.9–30.20).

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

1. **The user (the agency):** the keys and IDs, with the steps in
   `LAUNCH_DAY.md` part A: Turnstile (Preview first), the Sheet's `/exec` URL
   and secret, `PDF_LINK_SECRET`, the GTM container ID. Then the go-ahead for
   the authorised test leads on a preview (A5).
2. **Agency, when the keys land:** redeploy; the A5 tests (inbox and Sheet
   within a minute); Lighthouse with GTM firing (≥ 90); Turnstile into
   Production once A5 passes; `PDF_GATE_LIVE` on once §V is approved.
3. **Client:** review sheet §30, §28, §14, §27, and the legal copy (§19).
4. **Launch day:** `LAUNCH_DAY.md` parts B to E.
