/**
 * The site's measurement layer: GTM events, and the campaign a visitor came from.
 * ---------------------------------------------------------------------------
 * GTM runs in Partytown's worker (Base.astro). Main-thread code reaches it only
 * through `dataLayer.push`, which astro.config.mjs forwards to the worker. Every
 * push here is harmless while no container is set: the array just fills.
 *
 * Events (runbook M6 step 6; set up in the GTM UI, LAUNCH_DAY.md step D):
 *   lead_form_submit   an enquiry the lead function accepted (lead-form.ts)
 *   corporate_submit   a corporate brief it accepted (lead-form.ts)
 *   pdf_download       an itinerary PDF it released (lead-form.ts)
 *   wa_click           any WhatsApp link
 *   call_click         any tel: link
 *   virtual_page_view  a page reached through the site's own links. Astro's
 *                      router changes pages without a reload, and a tag in a
 *                      worker cannot see the history change, so GA4 would
 *                      otherwise count one page per visit.
 * Parameters: lead_type, journey_slug, click_location; virtual_page_view
 * carries page_location and page_title.
 *
 * Campaign: the first utm_* parameters seen in a visit are kept in
 * sessionStorage, and lead-form.ts writes them into the form's hidden `utm`
 * field, so the lead email and the Sheet say where the visitor came from.
 */

type Params = Record<string, string | undefined>;

export const UTM_KEY = 'iv-utm';

/** One event to GTM. Never throws: measurement must not break a page. */
export function track(event: string, params: Params = {}): void {
  try {
    const clean = Object.fromEntries(Object.entries(params).filter(([, value]) => value));
    // Partytown replaces `push` with its forwarder; an array either way.
    const host = window as unknown as { dataLayer?: unknown[] };
    host.dataLayer = host.dataLayer ?? [];
    host.dataLayer.push({ event, ...clean });
  } catch {
    /* measurement is never worth an error */
  }
}

/** The journey a page belongs to, from its URL. */
export const journeyOfPage = (): string | undefined =>
  /^\/journeys\/([a-z0-9-]+)\/$/.exec(location.pathname)?.[1];

/** The campaign this visit arrived with, as "utm_source=…&utm_medium=…". */
export function campaign(): string {
  try {
    return sessionStorage.getItem(UTM_KEY) ?? '';
  } catch {
    return '';
  }
}

// First touch of the visit: keep the landing page's utm_* parameters.
try {
  const utm = [...new URLSearchParams(location.search)]
    .filter(([key, value]) => key.startsWith('utm_') && value)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
    .slice(0, 300);
  if (utm && !sessionStorage.getItem(UTM_KEY)) sessionStorage.setItem(UTM_KEY, utm);
} catch {
  /* private mode or storage blocked: the lead simply arrives without a campaign */
}

/** Where on the page a link sits, in words GA4 reports read well. */
function locationOf(link: Element): string {
  const marked = link.closest<HTMLElement>('[data-track-location]');
  if (marked?.dataset.trackLocation) return marked.dataset.trackLocation;
  if (link.closest('[data-sticky-bar]')) return 'sticky_bar';
  if (link.closest('header')) return 'header';
  if (link.closest('footer')) return 'footer';
  if (link.closest('.hero')) return 'hero';
  return 'page';
}

// WhatsApp and call links, wherever they are, however the page was reached.
document.addEventListener(
  'click',
  (event) => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link) return;
    const href = link.getAttribute('href') ?? '';
    const params = { click_location: locationOf(link), journey_slug: journeyOfPage() };
    if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) track('wa_click', params);
    else if (href.startsWith('tel:')) track('call_click', params);
  },
  true,
);

// Pages reached through the router. The first page is GA4's own page_view.
let lastPage = location.href;
document.addEventListener('astro:page-load', () => {
  if (location.href === lastPage) return;
  lastPage = location.href;
  track('virtual_page_view', { page_location: location.href, page_title: document.title });
});
