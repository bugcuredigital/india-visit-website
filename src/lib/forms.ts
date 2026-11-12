/**
 * Which forms are live.
 * ---------------------------------------------------------------------------
 * Every form posts to `/api/lead` (functions/api/lead.ts). A form whose switch
 * is off renders its submit button disabled, labelled "Launching shortly" — the
 * client's instruction for the 2026-11-12 demo: a dead form click is worse
 * than no form. A "we'll call you" message over a form that sends nothing was
 * the other option and was not used: it would promise a call to a real
 * visitor that never comes.
 *
 * LEADS_LIVE flips to true only after an end-to-end test email has landed in
 * the inbox (client rule, 2026-11-12) — never on the strength of a deploy.
 */

/** The enquiry forms (every EnquiryForm layout except the PDF gate) and Plan-My-Trip. */
export const LEADS_LIVE = false;

/** The itinerary-PDF gate: waits for the PDF release (runbook M6 step 2a). */
export const PDF_GATE_LIVE = false;

/** The Travel Guide newsletter: waits for a list to send it from. */
export const NEWSLETTER_LIVE = false;

/** The disabled button's label — the client's own words. */
export const FORMS_PENDING_LABEL = 'Launching shortly';

/** Shown in place of the form once the lead function confirms — the client's own words. */
export const LEAD_SUCCESS = "Thank you — we'll reply personally within a day.";

/** Shown under the button if sending fails. Agency draft (COPY_REGISTER §R). */
export const LEAD_ERROR = 'Sorry, that did not go through. Please call or WhatsApp us.';
