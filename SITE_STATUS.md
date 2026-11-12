# SITE_STATUS.md — where the India Visit website is, right now

**Updated:** 2026-11-12, at the pre-demo freeze · **Production:** `main` at
`7a07fd4`, https://india-visit-website.pages.dev · **Demo:** 7 pm IST today,
route in `DEMO_PATH.md` · **Frozen:** nothing merges until after the demo

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
| **M7 Tina CMS** *(pulled forward)* | **Live on Tina Cloud** (client project connected 2026-11-12) | The first production save corrupted an image path and broke the build; root cause fixed and guarded. **Open:** the live image round trip on Tina Cloud (runbook M7 step 4a). The client's Tadoba test save on 12 Nov never reached GitHub; the check is **parked to 13 Nov** and `/admin` stays closed to saves until then |
| M6 Forms, lead function, GTM *(runs after M7)* | **M6-minimal LIVE** (2026-11-12, 18:04 IST) | Enquiry forms and Plan My Trip post to `functions/api/lead.ts` (validation, honeypot, Resend), sent from `enquiries@india-visit.com` to `info@india-visit.com` with the visitor as reply-to. The production test lead (14:33) was confirmed in the inbox by the client. The PDF gate and the newsletter still read "Launching shortly". Turnstile, the Sheet webhook, the PDF release and GTM follow after the demo |
| M8 SEO, analytics, hardening · M9 Launch | not started | PRD §16 checklist |

## What is on the site

| | Count | Notes |
|---|---|---|
| Pages built | **54** | + sitemap; `/dev/components/` and the three provisional policy pages are excluded from it |
| Journeys | **20 of 20** | 17 Variant A · 3 Variant B. All 20 pass Template Spec §6 |
| Destinations | 9 of 9 | |
| City pages | 2 | Jaipur, Kochi |
| Travel Guide articles | **8 of 8** | the PRD §7.8 launch set |
| Branded PDFs | **20 of 20** | reprinted 2026-11-12 (real contact line, today's copy); still public at `/downloads/` |
| Lead forms | **102 live**, 21 not yet | live on every page (enquiry forms, Plan My Trip); the 20 PDF download forms and the newsletter read "Launching shortly" |
| Contact details | **real** | +91 98102 41121 (call and WhatsApp), info@india-visit.com (Cloudflare Email Routing to Gmail; Resend only sends, its "receiving" stays off). The address is still dummy and flagged |
| Photography | 0 client, **51 TEMP-PHOTO** + 1 TEMP-VIDEO | all under `/public/uploads/` in the form Tina writes. The client's Drive folder is inventoried but **blocked on rights** (below) |
| Visible em dashes | **0** (was 1,101) | house rule: at most one per screen (CLAUDE.md #7) |

## ⚑ Blocking or needs the client

1. **Photo rights (P4)**, `CLIENT_REVIEW_SHEET.md` §27. The Drive folder (455
   images, 204 at ≥1600px) holds third-party images: four carry a
   photographer's mark ("© Nick Mayo" twice, Dhrubazaan Photography,
   PrassyPhotography) and one is from Wikimedia. Those five never ship. No
   image reads as the client's own. Four swaps for the demo-path slots are
   pre-picked and wait for the client to mark each own / licensed / neither.
2. **CMS saves.** Hold all `/admin` saves until (a) Tina Cloud shows `main`
   indexed at the latest commit and (b) one deliberate test save (one word and
   one image, Tadoba) produces a clean diff and a green build (runbook M7
   step 4a). Parked to 13 Nov by the client.
3. **Deccan Odyssey day-by-day**: eight provisional days until the operator's
   programme arrives (`CLIENT_REVIEW_SHEET.md` §22). Do not launch it as-is.
4. **Legal copy** for `/privacy/`, `/terms/`, `/cancellation/`: structure only,
   `noindex`, needs the client's adviser (§19).
5. **PDF gating is not real until the M6 PDF release**: the files are public,
   and the PDF form reads "Launching shortly".
6. **Copy approval**: drafted strings stay `DRAFT` in `docs/COPY_REGISTER.md`
   (§A–§R) until struck or approved.

## Provisional (renders, flagged, reversible)

- Pace / "ideal for" tags on all 20 journeys (Open Q#14)
- Train operator names and advance percentages on the two newer trains (§22)
- Four visa/entry articles' regulatory facts (§24)
- Items omitted from the client's documents in the port (§23)
- Founder name and portrait, trust figures, association logos, aggregate
  rating, response SLA: all null and unrendered. The founder quote is our draft (B11)

## Next action

1. **13 Nov, client + agency:** Tina Cloud → Configuration → `main`: index
   complete (Reindex if not), then the Tadoba test save (one word, one image).
   The agency reads the diff and rules on `/admin` image editing (M7 4a).
2. **Client:** photo rights, §27.
3. **Agency, after the demo:** M6 proper (Turnstile, Sheet webhook, PDF release,
   GTM), then M8. Generalise `check:hero-contrast` to banners below the fold
   (the homepage trains banner was measured by hand on 12 Nov). Cosmetic: at
   390px the header's Plan My Trip pill wraps onto two lines (unchanged since
   design round 3).
