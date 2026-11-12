# SITE_STATUS.md — where the India Visit website is, right now

**Updated:** 2026-11-12, consolidated demo round · **Production:** `main` at
https://india-visit-website.pages.dev · **Demo:** 7 pm today, route in `DEMO_PATH.md`

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
| **M7 Tina CMS** *(pulled forward)* | **Live on Tina Cloud** (client project connected 2026-11-12) | The first production save corrupted an image path and broke the build; root cause fixed and guarded (see below). **Open:** the live image round trip on Tina Cloud (runbook M7 step 4a) |
| M6 Forms, lead function, GTM *(runs after M7)* | **M6-minimal deployed, switched off** | `functions/api/lead.ts` (validation, honeypot, Resend) is live but every button still reads "Launching shortly" until an end-to-end test email lands. Turnstile, the Sheet webhook, the PDF release and GTM follow after the demo |
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
| Contact details | **real** | +91 98102 41121 (call and WhatsApp), info@india-visit.com. The address is still dummy and flagged |
| Photography | 0 client, **51 TEMP-PHOTO** + 1 TEMP-VIDEO | all now under `/public/uploads/` in the form Tina writes. The client's Drive folder is inventoried but **blocked on rights** (below) |
| Visible em dashes | **0** (was 1,101) | house rule: at most one per screen (CLAUDE.md #7) |

## ⚑ Blocking or needs the client

1. **Photo rights (P4).** The Drive folder (455 images, 204 at ≥1600px) holds
   third-party copyrighted images: `Golden Triangle Tour/Fatehpur 2.jpg` and
   `Rajasthan/Fateh pur 5.jpg` carry a visible "© Nick Mayo" watermark, one North
   East file is from Wikimedia, and every file's metadata is stripped. Nothing
   is published until the client confirms which images they own or licensed.
   Candidates for the demo-path slots are pre-selected (session log).
2. **Resend (P5).** The DNS records come from Resend's own dashboard (the DKIM
   key is per account): add `india-visit.com` there, paste the records into
   Cloudflare DNS (DNS only), create a sending key, and set `RESEND_API_KEY` in
   Cloudflare Pages (Production + Preview). Then one test email → the buttons go live.
3. **CMS saves.** Hold all `/admin` saves until (a) Tina Cloud shows `main`
   indexed at the latest commit and (b) one deliberate test save on a non-demo
   journey produces a clean diff (runbook M7 step 4a).
4. **Deccan Odyssey day-by-day**: eight provisional days until the operator's
   programme arrives (`CLIENT_REVIEW_SHEET.md` §22). Do not launch it as-is.
5. **Legal copy** for `/privacy/`, `/terms/`, `/cancellation/`: structure only,
   `noindex`, needs the client's adviser (§19).
6. **PDF gating is not real until the M6 PDF release**: the files are public.
7. **Copy approval**: drafted strings stay `DRAFT` in `docs/COPY_REGISTER.md`
   (§A–§R) until struck or approved.

## Provisional (renders, flagged, reversible)

- Pace / "ideal for" tags on all 20 journeys (Open Q#14)
- Train operator names and advance percentages on the two newer trains (§22)
- Four visa/entry articles' regulatory facts (§24)
- Items omitted from the client's documents in the port (§23)
- Founder name and portrait, trust figures, association logos, aggregate
  rating, response SLA: all null and unrendered. The founder quote is our draft (B11)

## Next action

1. **Client:** Resend key (P5), photo rights (P4), the Tina Cloud index check
   and one test save (M7 4a).
2. **Agency, after the demo:** M6 proper (Turnstile, Sheet webhook, PDF release,
   GTM), then M8. Generalise `check:hero-contrast` to banners below the fold
   (the homepage trains banner was measured by hand today).
