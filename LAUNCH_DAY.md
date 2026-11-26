# LAUNCH_DAY.md — taking India Visit live on its own domain

**Prepared:** 26 November 2026 (launch-prep session). **Owner on the day:** the agency, with the
client reachable for the one sign-off in step 1.

Launch day is three moves, in this order: **policies live → noindex lift → domain attach**. Everything
else is done beforehand (part A) or is a check with a known answer (parts C–E). Nothing in this file
asks for a decision on the day: the decisions are listed in A0 and must be settled first.

Where things are: the Cloudflare dashboard (Workers & Pages → `india-visit-website`; the
`india-visit.com` zone; Turnstile), Google (the lead Sheet, GTM, GA4, Search Console), Tina Cloud, and
this repo. Production today is https://india-visit-website.pages.dev, built from `main`.

---

## A. Before launch day (all must be ticked; none of it is done on the day)

### A0. Decisions, settled in writing

| # | Decision | Recommended | Why it matters on the day |
|---|---|---|---|
| D1 | The domain | `india-visit.com` (the leads already send from `enquiries@india-visit.com`, its DNS is on Cloudflare, and it serves nothing today: error 522, origin down) | Step C1 attaches it |
| D2 | The canonical host | **Apex** `https://india-visit.com`, with `www` redirecting to it | Steps C2 and C3: one host is canonical, the other 301s |
| D3 | The legal copy for `/privacy/`, `/terms/`, `/cancellation/` | Received from the client's adviser, approved | Step B1 publishes it |
| D4 | Plan My Trip's line "Your details go only to India Visit" (COPY_REGISTER S2) | Reconciled with the final privacy policy (client ruling, 13 Nov) | Published with B1 |
| D5 | The PDF success lines (COPY_REGISTER §V) | Approved | A4 switches the PDF form on |
| D6 | Launch blockers in SITE_STATUS "Blocking": photo rights (§27: watermarked or third-party images never ship), Deccan Odyssey's provisional days (§22: do not launch as-is) | Resolved, or the affected pages held back | Not a step: a go/no-go condition |

### A1. Turnstile (bot check on every form)
1. Cloudflare → Turnstile → Add widget. Name "India Visit website". Hostname `india-visit-website.pages.dev`
   (covers every preview, since a hostname covers its subdomains). **Add `india-visit.com` now too**, so
   the day needs no Turnstile step. Mode: Managed. Pre-clearance: No.
2. Pages → Settings → Variables and Secrets, **Preview first**:
   `PUBLIC_TURNSTILE_SITE_KEY` (Text) = the site key; `TURNSTILE_SECRET_KEY` (Secret) = the secret key.
   Add the same two to **Production only after A5 has passed on a preview**: the moment both are in
   Production and it redeploys, every live form requires Turnstile, and a wrong hostname or key would
   refuse real enquiries (the visitor is told to call or WhatsApp; nothing is lost silently, but leads
   would stop).
3. Redeploy (any push, or Deployments → latest → Retry). The site key is read at build time.

### A2. The lead Sheet (a copy of every lead)
1. In the Google account that will own the leads (the client's, per runbook M10), create a Sheet.
2. Extensions → Apps Script → replace `Code.gs` with `scripts/sheet-webhook/lead-sheet.gs` → Save.
3. Project Settings → Script Properties → `SHARED_SECRET` = a random string (`openssl rand -hex 32`).
4. Deploy → New deployment → Web app → Execute as **Me**, access **Anyone** → copy the `/exec` URL.
5. Pages variables (Production and Preview): `SHEET_WEBHOOK_URL` (Secret) = the `/exec` URL;
   `SHEET_WEBHOOK_SECRET` (Secret) = the same random string.
   The script refuses anything without the secret, and adds a "Leads" tab with a header row on the first lead.

### A3. GTM and GA4
1. GA4: a property and a Web data stream (URL `https://india-visit.com`) → its `G-…` ID.
2. GTM: a Web container → its `GTM-…` ID → set it in `/admin` → Site settings → GTM container ID
   (or hand it to the agency). Nothing loads until it is set (`Base.astro`).
3. In the container:
   - **Google tag**, the `G-…` ID, trigger *Initialization – All Pages*.
   - **Custom Event triggers**: `lead_form_submit`, `corporate_submit`, `pdf_download`, `wa_click`,
     `call_click`, `virtual_page_view`.
   - **GA4 Event tags**: one per trigger, event name `{{Event}}`, except `virtual_page_view`, which is a
     GA4 Event named **`page_view`** with parameters `page_location` and `page_title` from Data Layer
     Variables of the same names. (The site changes pages without a reload, and GTM runs in a worker that
     cannot see that, so the site pushes `virtual_page_view` itself; `src/scripts/tracking.ts`.)
   - Data Layer Variables worth registering as event parameters: `lead_type`, `journey_slug`, `click_location`.
4. GA4 → Admin → Key events: `lead_form_submit`, `corporate_submit`, `pdf_download`.
5. Submit → Publish.
6. Verify: GA4 → Realtime while clicking a WhatsApp link on the preview. **GTM's Preview mode does not
   work with Partytown**; Realtime and DebugView do. Then Lighthouse on the five usual pages: Performance
   ≥ 90 with GTM firing (runbook M6 gate).
7. Meta Pixel, if wanted later: through GTM only. Its script host does not send CORS headers, so it
   needs a Partytown proxy rule first (an agency change, not a GTM setting).

### A4. The PDF release
1. Pages variable (Production and Preview): `PDF_LINK_SECRET` (Secret) = a random string.
2. Agency: flip `PDF_GATE_LIVE` to `true` in `src/lib/forms.ts`, **only after** D5 and an authorised
   test on the preview (A5). The PDFs have been gated since the launch-prep merge either way:
   `/downloads/<journey>.pdf` without a valid signature redirects to the journey page.

### A5. Authorised end-to-end tests (the runbook M6 gate)
On the preview of the branch that carries A1–A4, one labelled test of each, with the client's go-ahead:
- an enquiry (journey page), a corporate brief (`/corporate/`), Plan My Trip, and the PDF form;
- each arrives in `info@india-visit.com` within a minute, with a Sheet row ("Email sent": sent);
- the PDF form shows "Your itinerary is ready." and the link opens the PDF;
- GA4 Realtime shows `lead_form_submit`, `corporate_submit`, `pdf_download`.
Name the test leads so nobody replies to them, and delete their Sheet rows afterwards.

### A6. Rollback drill (once, for real, before the day; runbook M9)
Pages → Deployments → the deployment before the current production one → ⋯ → **Rollback to this
deployment** → confirm the site serves it (`curl -s https://india-visit-website.pages.dev/ | grep -c <a
string that changed>`) → roll forward to the latest the same way. Note how long each took.

### A7. Tina Cloud
Tina Cloud → the project → Configuration → **Site URLs**: add `https://india-visit.com` (keep the
pages.dev entry). Without it the editor at `https://india-visit.com/admin/` cannot sign in.

---

## B. Launch day, part 1: policies live, noindex lift

### B1. Publish the policies (on the client's sign-off, D3 and D4)
1. Branch from `main`. Paste the approved copy into `src/pages/privacy.astro`, `terms.astro`,
   `cancellation.astro` (the section structure is already there for the adviser to fill).
2. In `src/lib/policies.mjs`, delete the three paths from `PROVISIONAL_POLICY_PATHS`. That one list
   removes the provisional notice and the `noindex`, and puts the pages into the sitemap.
3. D4's line on Plan My Trip, if the reconciliation changed it. Register the copy in
   `docs/COPY_REGISTER.md` as APPROVED (the client's).
4. `npm run build`, then `npm run check:links`, `check:structured-data`, `check:cms-images`, `audit:hardcoded`.
5. PR → preview → check: the three pages carry no `noindex` (`curl -s <preview>/privacy/ | grep -c noindex`
   → 0), and `<preview>/sitemap-0.xml` lists them.
6. **Do not merge yet**: B1 merges in C4, together with the domain switch, as one deploy.

There is nothing else to "lift": production has never been `noindex` as a whole. Cloudflare marks only
preview deployments `noindex` (`x-robots-tag`), and `/dev/` and `/404` stay `noindex` by design.

---

## C. Launch day, part 2: the domain

Before starting, write down the **current production deployment** (Pages → Deployments, the one marked
Production): it is the rollback target.

### C1. Attach the apex
1. Zone `india-visit.com` → DNS → Records. **Export or screenshot every record first.**
2. Delete only the **A/AAAA records for `india-visit.com` and `www`** (they point at the dead origin).
   **Do not touch** the MX records (`route1/2/3.mx.cloudflare.net`: Email Routing to the inbox), the SPF
   and DMARC TXT records, or Resend's DKIM and `send` records: leads stop arriving if they go.
3. Pages → `india-visit-website` → Custom domains → Set up a custom domain → `india-visit.com` →
   Activate. Cloudflare adds the record itself (same account and zone).
4. Wait for **Active** and the certificate (usually minutes). Check: `curl -sI https://india-visit.com/`
   → `HTTP/2 200`, `server: cloudflare`.

### C2. Attach `www` and redirect it
1. Custom domains → add `www.india-visit.com` → Activate.
2. Zone → Rules → Redirect Rules → Create: *When* hostname equals `www.india-visit.com`; *Then* dynamic
   redirect to `concat("https://india-visit.com", http.request.uri.path)`, status **301**, preserve query
   string.
3. Check: `curl -sI https://www.india-visit.com/journeys/` → `301`, `location: https://india-visit.com/journeys/`.
4. Zone → SSL/TLS → Edge Certificates: **Always Use HTTPS** on. Check: `curl -sI http://india-visit.com/` → 301 to https.

### C3. The pages.dev address
Account → Bulk Redirects → a list with one entry: `india-visit-website.pages.dev` →
`https://india-visit.com`, 301, *preserve path suffix*, *preserve query string*, *include subdomains*
**off** (previews must keep working) → a Bulk Redirect rule enabling the list. Check:
`curl -sI https://india-visit-website.pages.dev/about/` → 301 to `https://india-visit.com/about/`, and a
preview URL still answers 200.

### C4. SITE_URL, and the one deploy
1. Pages → Settings → Variables: `SITE_URL` = `https://india-visit.com`, **Production only**.
2. Merge the B1 pull request. Its build is the first with the new SITE_URL: canonicals, Open Graph
   URLs, structured data, `sitemap-index.xml` and the `Sitemap:` line in `robots.txt` all move to the domain.
3. When the deployment is live, check:
   - `curl -s https://india-visit.com/ | grep -o '<link rel="canonical"[^>]*>'` → `https://india-visit.com/`
   - `curl -s https://india-visit.com/robots.txt | tail -2` → `Sitemap: https://india-visit.com/sitemap-index.xml`
   - `curl -s https://india-visit.com/sitemap-0.xml | grep -c '<loc>https://india-visit.com'` → every page,
     the three policies included
   - locally, the same build passes `SITE_URL=https://india-visit.com npm run build && npm run check:structured-data`
     (it fails on any URL in structured data that is not on the canonical origin).

---

## D. Smoke tests on https://india-visit.com (expected answers)

| Test | How | Expected |
|---|---|---|
| Lead → inbox + Sheet | One labelled enquiry on a journey page | Email in `info@india-visit.com` within a minute; Sheet row, "Email sent" = sent; GA4 Realtime `lead_form_submit` |
| Corporate brief | One labelled brief on `/corporate/` | Subject "New corporate brief: …"; `corporate_submit` |
| PDF | The PDF form on a journey page (once A4 is live) | "Your itinerary is ready." and the link opens the PDF; the bare `/downloads/<journey>.pdf` redirects to the journey page; `pdf_download` |
| WhatsApp | Tap the header WhatsApp on a phone | WhatsApp opens on +91 98102 41121 with the greeting; `wa_click` |
| Call | Tap Call on a phone | The dialler with +91 98102 41121; `call_click` |
| Turnstile | The form on a phone and on desktop | No visible challenge for an ordinary visit; the lead goes through |
| 404 | `/no-such-page/` | The branded 404 page, status 404 |
| Redirects | `/contact/`, `www.`, `http://`, pages.dev | 301s to `/plan-my-trip/`, the apex, https, the domain |
| Headers | `curl -sI https://india-visit.com/` | `content-security-policy`, `strict-transport-security`, `x-frame-options`, `referrer-policy`, `permissions-policy` |
| Editor | `https://india-visit.com/admin/` | Tina signs in (A7) |
| Speed | Lighthouse mobile on `/`, `/journeys/`, `/journeys/taj-and-agra-1n-2d/`, `/reviews/`, `/corporate/` | Performance ≥ 90 (85 is the launch floor), Accessibility ≥ 95, SEO ≥ 95, LCP ≤ 2.2s home / 2.0s others |
| Rich results | Google's Rich Results Test on `/`, one journey, one article, one destination | Organization (TravelAgency), Breadcrumbs, Article valid; FAQ markup valid (Google shows FAQ results only for government and health sites, so no FAQ snippet is expected) |

Delete the test leads' Sheet rows afterwards.

## E. Search Console
1. Search Console → Add property → **Domain** `india-visit.com` → verify (Cloudflare can add the TXT
   record for you).
2. Sitemaps → submit `https://india-visit.com/sitemap-index.xml`.
3. URL Inspection → Request indexing, one by one: `/`, `/journeys/`, `/destinations/`, `/luxury-trains/`,
   `/corporate/`, `/travel-guide/`, `/plan-my-trip/`, `/destinations/rajasthan-golden-triangle/`,
   `/destinations/kerala/`, `/journeys/rajasthan-classic-12n-13d/`, `/journeys/palace-on-wheels-7n-8d/`.
4. From day one, watch Pages (Indexing) and Core Web Vitals (field data, the real verdict on speed).

## F. If something goes wrong

| What broke | Undo |
|---|---|
| The new build (anything in the site) | Pages → Deployments → the production deployment noted before C → Rollback (practised in A6). Seconds. |
| The domain (certificate, DNS) | Pages → Custom domains → remove `india-visit.com` and `www`; restore the A/AAAA records from the C1 export. The site stays up on pages.dev throughout; remove the C3 Bulk Redirect so pages.dev serves again. |
| Leads not arriving | Pages → Functions → Real-time logs: every submission logs one outcome line (`sent`, `refused: …`, `failed: resend`, `sheet: …`). A Turnstile problem shows as `refused: turnstile`; removing `TURNSTILE_SECRET_KEY` and redeploying turns the check off without a code change. |
| Analytics | GTM container ID back to empty in `/admin` removes every tag on the next deploy. |

## G. Afterwards
- `SITE_STATUS.md`: production is the domain; the freeze returns; the launch recorded in `SESSION_LOG.md`.
- Optional hardening, any time: zone → Security → WAF → Rate limiting rule on `/api/lead`, POST, 5
  requests per 10 seconds per IP → Block for 10 seconds (the free plan's one rule).
- Agrandir Grand, if licensed, remains a one-token-plus-font-file change (CLAUDE.md).
