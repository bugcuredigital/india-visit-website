# SITE_STATUS.md — where the India Visit website is, right now

**Updated:** 2026-09-11 (M5 content migration) · **Branch:** `m5-content` (from `m4-templates`, PR #3 still open)

This file is the one-page answer to "what is live, what is provisional, and
what is blocking". It is updated in the same commits as the work it describes.
Detail lives in `SESSION_LOG.md` (the running narrative), `docs/CLIENT_REVIEW_SHEET.md`
(what needs the client) and `docs/COPY_REGISTER.md` (which words are whose).

## Milestones

| Milestone | Status | Gate |
|---|---|---|
| M0 Pre-flight · M1 Scaffold · M2 Schema · M3 Components | **Merged** | passed |
| M4 Page templates (three design rounds) | **Built, PR #3 open** | gate evidence posted; the round-3 DESIGN VERDICT arrived as a placeholder and is awaited |
| **M5 Content migration** | **Built — this branch** | evidence in `reports/m5-gate-summary.json`; two ⚑ items below |
| M7 Tina CMS *(pulled forward — runs next)* | not started | the owner edits, swaps an image and publishes from the dashboard |
| M6 Forms, lead function, GTM *(runs after M7)* | not started | test lead in inbox + Sheet; Turnstile server-verified; PDF release |
| M8 SEO, analytics, hardening · M9 Launch | not started | PRD §16 checklist |

## What is on the site

| | Count | Notes |
|---|---|---|
| Pages built | **54** | + sitemap; `/dev/components/` and the three provisional policy pages are excluded from it |
| Journeys | **20 of 20** | 17 Variant A · 3 Variant B. All 20 pass Template Spec §6 |
| Destinations | 9 of 9 | full prose written in M5; `experiences` tiles on Rajasthan and Kerala only (photos) |
| City pages | 2 | Jaipur, Kochi — the rest is M5/Phase-2 content per PRD v1.5 |
| Travel Guide articles | **8 of 8** | the PRD §7.8 launch set |
| Branded PDFs | **20 of 20** | printed from the pages by `npm run pdf:build`; gate form on every journey |
| Testimonials | 0 real, 2 placeholder slots | awaiting consented reviews (Open Q#3) |
| Photography | 0 client, **52 TEMP-PHOTO**, 1 TEMP-VIDEO | every one CMS-fed; replaced by the archive with no code change |

## ⚑ Blocking or needs the client before launch

1. **Deccan Odyssey day-by-day** — the supplied document has none; eight
   provisional days built from the route. Must not launch until the operator's
   programme is supplied. (`CLIENT_REVIEW_SHEET.md` §22)
2. **Legal copy** for `/privacy/`, `/terms/`, `/cancellation/` — structure only,
   `noindex`, needs the client's adviser. (§19)
3. **PDF gating is not real until M6** — the files sit in `public/downloads/`
   and the gate form is a shell; M6 moves them behind the lead function.
4. **Copy approval** — every drafted string is `DRAFT` in `docs/COPY_REGISTER.md`
   until struck or approved.

## Provisional (renders, flagged, reversible)

- Pace / "ideal for" tags on all 20 journeys (Open Q#14)
- Train operator names and advance percentages on the two new trains (§22)
- Four visa/entry articles' regulatory facts (§24)
- Items omitted from the client's documents in the port — hotel names,
  elephant rides, the sanctuary painting (§23)
- Founder name/portrait, trust figures, association logos, aggregate rating,
  response SLA — all null and unrendered

## Next action

Client review of the M5 evidence and §22–§25; then **M7 — Tina wiring** on a
`m7-tina` branch: `tina/config.ts` mirroring every Zod schema field-for-field,
repo media to `/public/uploads/`, editor smoke tests, and the dashboard
session that is the M7 gate.
