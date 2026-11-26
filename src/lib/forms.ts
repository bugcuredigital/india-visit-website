/**
 * Which forms are live.
 * ---------------------------------------------------------------------------
 * Every form posts to `/api/lead` (functions/api/lead.ts). A form whose switch
 * is off renders its submit button disabled, labelled "Launching Shortly" — the
 * client's instruction for the 2026-11-12 demo: a dead form click is worse
 * than no form. A "we'll call you" message over a form that sends nothing was
 * the other option and was not used: it would promise a call to a real
 * visitor that never comes.
 *
 * LEADS_LIVE flips to true only after an end-to-end test email has landed in
 * the inbox (client rule, 2026-11-12) — never on the strength of a deploy.
 * Flipped 2026-11-12 after the production test lead (14:33 IST) was confirmed
 * in the inbox by the client.
 */

/** The enquiry forms (every EnquiryForm layout except the PDF gate) and Plan-My-Trip. */
export const LEADS_LIVE = true;

/** The itinerary-PDF gate: waits for the PDF release (runbook M6 step 2a). */
export const PDF_GATE_LIVE = false;

/** The Travel Guide newsletter: waits for a list to send it from. */
export const NEWSLETTER_LIVE = false;

/** The disabled button's label — the client's own words. */
export const FORMS_PENDING_LABEL = 'Launching Shortly';

/** Shown in place of the form once the lead function confirms — the client's own words. */
export const LEAD_SUCCESS = "Thank you — we'll reply personally within a day.";

/** Shown under the button if sending fails. Agency draft (COPY_REGISTER §R). */
export const LEAD_ERROR = 'Sorry, that did not go through. Please call or WhatsApp us.';

/**
 * The itinerary-PDF gate's success state: one line and the download link,
 * shown in place of the form once the lead function releases the file.
 * Agency drafts (COPY_REGISTER §V, escalated for the owner's approval with
 * the PDF release; the gate stays off until then).
 */
export const PDF_READY = 'Your itinerary is ready.';
export const PDF_DOWNLOAD_LABEL = 'Download the PDF';

/**
 * Why a form was refused, field by field. Written under the button by the
 * browser script and returned by the lead function, so the two never disagree.
 * Agency drafts (COPY_REGISTER §R4).
 */
export const FIELD_MESSAGES = {
  name: 'Please tell us your name.',
  phone: 'Please give a phone or WhatsApp number.',
  email: 'Please check your email address.',
  company: 'Please tell us the company name.',
  consent: 'Please tick the consent box so we can reply.',
  tooLong: 'That is longer than we can take.',
  fallback: 'Please check the form and try again.',
} as const satisfies Record<string, string>;

/** A field's message by its name, or the fallback for a field without one. */
export const fieldMessage = (name: string): string =>
  (FIELD_MESSAGES as Record<string, string | undefined>)[name] ?? FIELD_MESSAGES.fallback;

/**
 * Budget bands, deliberately without figures. One list for the Plan My Trip
 * stepper and the corporate brief (round 5, #78), so the two never disagree.
 */
export const BUDGET_BANDS = ['Rather not say', 'Comfortable', 'Premium', 'No ceiling'];

/**
 * The spam honeypot's field name. It must mean nothing to browser AutoFill:
 * the first names ("companyUrl", "companyWebsite") matched AutoFill's "company"
 * pattern, so a visitor who filled the form from their contact card could fill
 * it unseen and be dropped as a bot (2026-11-12).
 */
export const HONEYPOT_FIELD = 'leaveEmpty';
