# India Visit website: complete record of the UI polish changes

This one file is the full reference for the UI polish done on the India Visit
website. It is written for another Claude chat that has not seen the work.
Every change is in this file: nothing else is needed to understand it.

## 1. Background

- The live site is `india-visit-website.pages.dev`. It is built with Astro and Tailwind v4 and hosted on Cloudflare Pages.
- The Astro source code was not available during this work. So the polish was done on a saved copy ("mirror") of the built site: 52 static HTML pages plus the `_astro` assets.
- The live site is unchanged. Nothing has been deployed.

## 2. Rules the client set

1. Do not change content (text or images).
2. Do not change page structure.
3. Do not change the colour theme. Every colour used is an existing design token (`--color-burgundy`, `--color-crimson`, `--color-yellow`, `--color-ink`, `--color-white`, `--color-offwhite`, and so on) or a transparent mix of one.
4. Change fonts only if really needed. None were changed.

## 3. The changes: there are exactly three

**Change A: one new stylesheet, `polish.css`.**
It holds all the visual changes. The full file is in section 10. It is presentation only.

**Change B: one line added to every page.**
This tag was added as the last thing in `<head>` on all 52 pages, so the polish loads after the site's own styles:

```html
<link rel="stylesheet" href="/polish.css">
```

**Change C: icons swapped.**
The site's hand-drawn SVG glyphs were replaced with one consistent line-icon set (Lucide geometry, ISC licence). Each icon keeps its meaning, position and colour. Each swapped `<svg>` got `viewBox="0 0 24 24"`, the class `iv-icon`, `aria-hidden="true"` and a `data-icon="name"` attribute. The script that did this is in section 9: its `MAP` lists the start of each old path and the icon that replaced it.

Number of icons swapped across the 52 pages:

| Icon | Count | Icon | Count |
| --- | --- | --- | --- |
| car | 56 | clock | 22 |
| phone | 52 | train | 18 |
| plane | 39 | boat | 13 |
| calendar | 31 | file | 8 |
| route | 31 | walk | 4 |
| banknote | 3 | cloud | 1 |

No text, image, link, heading or layout element was added, removed or reordered.

## 4. What `polish.css` covers

The file has ten numbered sections:

1. **Type rendering and rhythm:** font smoothing, tighter heading tracking, balanced heading wraps, one eyebrow style everywhere, tabular numbers in columns.
2. **Header.**
3. **Buttons, pills and links.**
4. **Cards and image frames:** one corner radius for every photo frame.
5. **Icons:** practical-note icons in a soft tinted badge, transport chips on the day-by-day, round bordered accordion chevrons, long titles wrap instead of pushing the control off the edge.
6. **Forms:** white fields with a visible edge on light surfaces, matching fields on dark surfaces, selects get the site's chevron.
7. **Sections:** hairline dividers between quick facts, two-column journey introduction on desktop, practical notes as quiet cards, itinerary table, call-out notices, long-form reading measure.
8. **Bolder section treatments:** eyebrow lead-in rule, "How it works" solid markers with a connector between steps, "Why India Visit" reasons as cards, stat icons in a badge, destination tiles with the name on the photograph, offset block behind the consultant portrait.
9. **Inner pages:** journey highlights as soft panels, itinerary-at-a-glance on a white sheet, day number as a pill, included / not included as two panels, download form on its own card, photo-and-text tiles as cards, guide posts as cards, each question in its own panel, steps on dark bands, plan my trip, policies with clearly separated blocks.
10. **Reviews** (home section and the `/reviews/` page): card styling with a burgundy top border, a quotation badge on every card, "coming soon" shown as a calm headline, trip pill, cards share the full row on the home page, fuller wall on the reviews page, tinted intro, dashed "more to come" note. Guide articles also get one centred reading column.

## 5. How the CSS is written

- Selectors double a class on purpose, for example `:root .review.review`. This raises specificity so the polish wins over the site's own styles without `!important`.
- Selectors target the class names that exist in the built HTML. In the Astro source these same class names are in the components' markup, and Astro adds scoped `data-astro-cid-*` attributes. Check that the selectors still win once the file is imported in the source build.
- All motion is inside `@media (prefers-reduced-motion: no-preference)`.
- Colours use `color-mix()` on existing tokens. No new colour values define the theme. Shadows use `rgb(26 21 35 / alpha)`, which is the ink colour.
- The site hides content until scroll with `.fade-up` and `.fade-up-stagger`, and shows it by adding `is-visible`. Screenshots taken without scrolling look empty unless that class is added.

## 6. Status

- **Section 10 (reviews) was written last and has not been visually checked.** It should be looked at on the home page and on `/reviews/`, at desktop and mobile widths.
- Nothing has been ported to the Astro source or deployed.

## 7. Porting to the real Astro source

A prompt for Claude Code that applies this work to the source should ask for the following:

1. Add `polish.css` to the project and import it last in the base layout, after the site's global styles, so it loads on every page.
2. Replace the old icon paths with the Lucide paths in the components where the icons are defined. Use the `MAP` and `I` tables in section 9 below: match each old path by the start of its `d` attribute. Keep the stroke widths listed. Add the `iv-icon` class and `data-icon` attribute, because `polish.css` targets them.
3. Do not change content, structure or the colour theme.
4. Build, then compare each page type against the polished mirror: home, a journey page, a destination page, a city page, a travel guide article, reviews, plan my trip, corporate, luxury trains, and a policy page.
5. Check the reviews section first, since it is unverified.

## 8. Pages on the site (52)

- `/`
- `/about/`
- `/booking-terms/`
- `/cancellation/`
- `/cities/jaipur/`
- `/cities/kochi/`
- `/corporate/`
- `/destinations/`
- `/destinations/bali/`
- `/destinations/bhutan/`
- `/destinations/kerala/`
- `/destinations/ladakh/`
- `/destinations/north-east-india/`
- `/destinations/rajasthan-golden-triangle/`
- `/destinations/south-west-india/`
- `/destinations/vietnam/`
- `/destinations/wildlife/`
- `/journeys/`
- `/journeys/bali-5n-6d/`
- `/journeys/bhutan-paro-thimphu-punakha-7n-8d/`
- `/journeys/deccan-odyssey-7n-8d/`
- `/journeys/golden-chariot-5n-6d/`
- `/journeys/golden-triangle-5n-6d/`
- `/journeys/golden-triangle-amritsar-11n-12d/`
- `/journeys/golden-triangle-jhalana-6n-7d/`
- `/journeys/golden-triangle-varanasi-9n-10d/`
- `/journeys/kerala-in-a-week-7n-8d/`
- `/journeys/kerala-southern-coast-12n-13d/`
- `/journeys/kerala-with-houseboat-11n-12d/`
- `/journeys/leh-ladakh-kashmir-10n-11d/`
- `/journeys/north-east-india-6n-7d/`
- `/journeys/north-east-root-bridges-majuli-6n-7d/`
- `/journeys/palace-on-wheels-7n-8d/`
- `/journeys/rajasthan-classic-12n-13d/`
- `/journeys/rajasthan-jawai-10n-11d/`
- `/journeys/tadoba-tiger-trails-2n-3d/`
- `/journeys/vietnam-hanoi-halong-hoian-7n-8d/`
- `/journeys/western-southern-india-12n-13d/`
- `/luxury-trains/`
- `/plan-my-trip/`
- `/privacy/`
- `/reviews/`
- `/terms/`
- `/travel-guide/`
- `/travel-guide/bali-visa-on-arrival-indians-best-season/`
- `/travel-guide/best-time-to-visit-ladakh/`
- `/travel-guide/bhutan-for-indian-travellers/`
- `/travel-guide/first-trip-to-india-practical-guide/`
- `/travel-guide/golden-triangle-5-days-vs-10-days/`
- `/travel-guide/kerala-houseboat-guide/`
- `/travel-guide/palace-on-wheels-complete-guide/`
- `/travel-guide/vietnam-evisa-guide-indian-passport/`

## 9. The icon swap script (`apply-polish.mjs`), in full

```js
// Applies the polish layer to every mirrored page. Idempotent.
//  1. links /polish.css as the last stylesheet in <head>
//  2. swaps the hand-drawn glyphs for one consistent line-icon set
//     (Lucide geometry, ISC licence) — same meaning, same position, same colour
import fs from 'node:fs';
import path from 'node:path';

import { fileURLToPath } from 'node:url';
const ROOT = fileURLToPath(new URL('../site', import.meta.url));
const LINK = '<link rel="stylesheet" href="/polish.css">';

const I = {
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  train: '<rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><path d="M8 15h.01"/><path d="M16 15h.01"/>',
  boat: '<path d="M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z"/><path d="M21 14 10 2 3 14h18Z"/><path d="M10 2v16"/>',
  walk: '<path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  banknote: '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
};

// [first characters of the old path's d attribute, new icon, stroke width]
const MAP = [
  ['M2.5 10h11l-1-3.5h-9Z', 'car', 1.75],
  ['M4 3h8v7H4Zm0 7 1.5 3', 'train', 1.75],
  ['M2.5 9.5h11L12 13H4Z', 'boat', 1.75],
  ['M2 9.5 14 6l-1.5 4.5', 'plane', 1.75],
  ['M8 3.5v3l2.5 2M8 6.5', 'walk', 1.75],
  ['M2.5 11 17 6l-2 5.5', 'plane', 1.5],
  ['M10 3.5v4l3 2M3.5 10h2', 'route', 1.5],
  ['M4 6h12v10H4Zm0 3.5h12', 'calendar', 1.5],
  ['M10 4.5a5.5 5.5 0 1 0 0 11', 'clock', 1.5],
  ['M5 3.5h10v13H5Z', 'file', 1.5],
  ['M10 4v12M7 7h4.5', 'banknote', 1.5],
  ['M6 12a3 3 0 1 1 .8-5.9', 'cloud', 1.5],
  ['M4.5 2.5h2.2l1.5 3.6', 'phone', 1.6],
];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p); else if (e.name === 'index.html') files.push(p);
  }
})(ROOT);

const totals = { pages: 0, linked: 0, icons: {} };
for (const f of files) {
  let h = fs.readFileSync(f, 'utf8');
  const before = h;
  for (const [prefix, name, sw] of MAP) {
    const re = new RegExp(`<svg\\b([^>]*)>\\s*<path d="${esc(prefix)}[^>]*>\\s*</path>\\s*</svg>`, 'g');
    h = h.replace(re, (_, attrs) => {
      let a = attrs.replace(/viewBox="[^"]*"/, 'viewBox="0 0 24 24"');
      a = /class="/.test(a) ? a.replace(/class="([^"]*)"/, 'class="$1 iv-icon"') : ` class="iv-icon"${a}`;
      if (!/aria-hidden/.test(a)) a += ' aria-hidden="true"';
      totals.icons[name] = (totals.icons[name] || 0) + 1;
      return `<svg${a} data-icon="${name}"><g fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${I[name]}</g></svg>`;
    });
  }
  if (!h.includes(LINK)) { h = h.replace('</head>', `${LINK}</head>`); totals.linked++; }
  if (h !== before) fs.writeFileSync(f, h);
  totals.pages++;
}
console.log(JSON.stringify(totals));
```

## 10. `polish.css`, in full

```css
/* ==========================================================================
   India Visit — UI polish layer
   --------------------------------------------------------------------------
   Loaded after the site's own styles. Presentation only: no content, no
   markup structure and no brand colours are changed — every colour below is
   one of the existing design tokens (or a transparent mix of one).

   To port into the Astro source: import this file last in the base layout.
   ========================================================================== */

:root {
  --polish-tint: color-mix(in srgb, var(--color-burgundy) 6%, transparent);
  --polish-ring: color-mix(in srgb, var(--color-crimson) 16%, transparent);
  --polish-ring-dark: color-mix(in srgb, var(--color-yellow) 26%, transparent);
  --polish-shadow-rest: 0 1px 2px rgb(26 21 35 / 0.04), 0 4px 14px rgb(26 21 35 / 0.04);
  --polish-radius-field: 10px;
}

/* --------------------------------------------------------------------------
   1. Type rendering and rhythm
   -------------------------------------------------------------------------- */

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

::selection {
  background-color: var(--color-burgundy);
  color: var(--color-on-dark);
}

/* Display type: the expanded face reads sleeker a touch tighter at size. */
:root h1 { letter-spacing: -0.022em; text-wrap: balance; }
:root h2 { letter-spacing: -0.018em; text-wrap: balance; }
:root h3 { letter-spacing: -0.012em; text-wrap: balance; }

:root p,
:root li,
:root dd { text-wrap: pretty; }

/* One eyebrow style everywhere: smaller, wider-tracked, quieter. */
:root .eyebrow,
:root .head__category,
:root .intro__label,
:root .post__category {
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
  font-weight: 600;
}

:root .quickfacts__label,
:root .side__heading,
:root .side__label,
:root .glance thead th.glance__th,
:root .glance thead th {
  letter-spacing: 0.14em;
}

:root .footer .footer__heading {
  font-size: var(--text-xs);
  letter-spacing: 0.16em;
}

:root .crumbs { font-size: var(--text-xs); letter-spacing: 0.01em; }

:root .card .card__title,
:root .post .post__title { letter-spacing: -0.012em; line-height: 1.2; }

:root .stat .stat__label { letter-spacing: 0.02em; }

/* Numbers that sit in columns should line up. */
:root .glance,
:root .card__pill,
:root .day__no,
:root .footer__phone,
:root .side__phone { font-variant-numeric: tabular-nums lining-nums; }

/* --------------------------------------------------------------------------
   2. Header
   -------------------------------------------------------------------------- */

@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  :root .header.header:not(.header--overlay),
  :root .header.header--overlay.is-solid {
    background-color: rgb(255 255 255 / 0.94);
    -webkit-backdrop-filter: blur(16px);
    backdrop-filter: blur(16px);
  }
}

:root .header .header__link { letter-spacing: -0.005em; }

:root .header .header__icon svg.iv-icon { width: 19px; height: 19px; }

:root .header .menu__panel {
  padding: 0.5rem;
  border-radius: var(--radius-lg);
  box-shadow: 0 1px 2px rgb(26 21 35 / 0.05), 0 16px 40px rgb(26 21 35 / 0.12);
}

/* --------------------------------------------------------------------------
   3. Buttons, pills and links
   -------------------------------------------------------------------------- */

:root .btn { letter-spacing: -0.005em; }

@media (prefers-reduced-motion: no-preference) {
  :root .btn:active:not(:disabled) { transform: translateY(1px); }

  :root .pill svg,
  :root .related__all svg {
    transition: transform var(--duration-fast) var(--ease-brand);
  }
  :root .pill:hover svg,
  :root .related__all:hover svg { transform: translateX(3px); }
}

:root .filter .filter__btn { min-height: 40px; letter-spacing: -0.005em; }

/* --------------------------------------------------------------------------
   4. Cards and image frames
   -------------------------------------------------------------------------- */

:root .card.card { box-shadow: var(--polish-shadow-rest); }
@media (prefers-reduced-motion: no-preference) {
  :root .card.card:hover,
  :root .card.card:focus-within { box-shadow: var(--shadow-lift-hover); }
}

/* One corner radius for every photo frame. */
:root .tile .tile__frame,
:root .post .post__frame { border-radius: var(--radius-lg); }

:root .quote.quote { box-shadow: var(--polish-shadow-rest); }

:root .author.author { border: 1px solid var(--color-card-border); }

/* --------------------------------------------------------------------------
   5. Icons
   -------------------------------------------------------------------------- */

svg.iv-icon { overflow: visible; }

/* Practical-note icons sit in a soft tinted badge instead of floating. */
:root .note__icon.note__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background-color: var(--polish-tint);
  color: var(--color-burgundy);
}
:root .note__icon.note__icon svg.iv-icon { width: 22px; height: 22px; }

/* Transport chips on the day-by-day. */
:root .chip .chip__icon.iv-icon { width: 15px; height: 15px; flex: none; }
:root .chip:has(> .chip__icon) { gap: 0.45rem; padding: 0.32rem 0.8rem 0.32rem 0.65rem; }

/* Accordion chevrons become a round, bordered control. */
:root svg.day__chevron,
:root svg.faq__chevron,
:root svg.policy__chevron {
  box-sizing: content-box;
  padding: 11px 9px;
  border: 1px solid var(--color-burgundy-hairline);
  border-radius: 50%;
  color: var(--color-burgundy);
  flex: none;
}
@media (prefers-reduced-motion: no-preference) {
  :root svg.day__chevron,
  :root svg.faq__chevron,
  :root svg.policy__chevron {
    transition: transform var(--duration-base) var(--ease-brand),
      background-color var(--duration-fast) var(--ease-brand),
      border-color var(--duration-fast) var(--ease-brand),
      color var(--duration-fast) var(--ease-brand);
  }
}
:root details[open] > summary > svg.day__chevron,
:root details[open] > summary > svg.faq__chevron,
:root details[open] > summary > svg.policy__chevron {
  border-color: var(--color-burgundy);
}
@media (hover: hover) {
  :root summary:hover > svg.day__chevron,
  :root summary:hover > svg.faq__chevron,
  :root summary:hover > svg.policy__chevron {
    background-color: var(--color-burgundy);
    border-color: var(--color-burgundy);
    color: var(--color-white);
  }
}

/* Let long titles wrap instead of pushing the control off the edge. */
:root .day__summary { grid-template-columns: auto minmax(0, 1fr) auto; }
:root .faq__summary { grid-template-columns: minmax(0, 1fr) auto; }
:root .day__title,
:root .faq__question { overflow-wrap: break-word; }
@media (max-width: 39.999rem) {
  :root .day__summary { gap: 0.75rem; }
  :root svg.day__chevron,
  :root svg.faq__chevron,
  :root svg.policy__chevron { padding: 9px 7px; }
}

:root .day__summary:hover .day__title,
:root .faq__summary:hover .faq__question { color: var(--color-burgundy); }

@media (prefers-reduced-motion: no-preference) {
  :root .day__title,
  :root .faq__question { transition: color var(--duration-fast) var(--ease-brand); }

  :root .floater.floater { transition: transform var(--duration-fast) var(--ease-brand); }
  :root .floater.floater:hover { transform: scale(1.06); }
}

/* --------------------------------------------------------------------------
   6. Forms
   -------------------------------------------------------------------------- */

:root .form .form__input.form__input,
:root .field.field {
  border-radius: var(--polish-radius-field);
}

@media (prefers-reduced-motion: no-preference) {
  :root .form .form__input.form__input,
  :root .field.field {
    transition: border-color var(--duration-fast) var(--ease-brand),
      box-shadow var(--duration-fast) var(--ease-brand),
      background-color var(--duration-fast) var(--ease-brand);
  }
}

/* Light surfaces: white fields with a visible edge (they were off-white on
   off-white, which made them hard to find). */
:root .form:not(.form--on-dark) .form__input.form__input {
  background-color: var(--color-white);
  border-color: var(--color-burgundy-hairline);
}
:root .form:not(.form--on-dark) .form__input.form__input:hover,
:root .field.field:hover {
  border-color: color-mix(in srgb, var(--color-burgundy) 42%, transparent);
}
:root .form:not(.form--on-dark) .form__input.form__input:focus,
:root .field.field:focus {
  border-color: var(--color-crimson);
  box-shadow: 0 0 0 4px var(--polish-ring);
}

/* Dark surfaces. */
:root .form.form--on-dark .form__input.form__input {
  border-color: color-mix(in srgb, var(--color-on-dark) 34%, transparent);
}
:root .form.form--on-dark .form__input.form__input:hover {
  border-color: color-mix(in srgb, var(--color-on-dark) 62%, transparent);
}
:root .form.form--on-dark .form__input.form__input:focus {
  border-color: var(--color-yellow);
  box-shadow: 0 0 0 4px var(--polish-ring-dark);
}

/* Selects get the same chevron the rest of the site uses. */
:root .form select.form__input.form__input {
  -webkit-appearance: none;
  appearance: none;
  padding-right: 2.5rem;
  background-repeat: no-repeat;
  background-position: right 0.95rem center;
  background-size: 12px 8px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5l5-5' fill='none' stroke='%23674e59' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}
:root .form.form--on-dark select.form__input.form__input {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5l5-5' fill='none' stroke='%23f7f5f6' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}
:root .form.form--on-dark select.form__input option { color: var(--color-ink); }

:root .form .form__consent input { border-radius: 4px; }

/* --------------------------------------------------------------------------
   7. Sections
   -------------------------------------------------------------------------- */

/* Quick facts: hairline dividers between the five facts on wide screens. */
@media (min-width: 64rem) {
  :root .quickfacts .quickfacts__grid { column-gap: 0; }
  :root .quickfacts .quickfacts__grid > * { padding-inline: 1.25rem; }
  :root .quickfacts .quickfacts__grid > *:first-child { padding-inline-start: 0; }
  :root .quickfacts .quickfacts__grid > *:last-child { padding-inline-end: 0; }
  :root .quickfacts .quickfacts__grid > * + * { border-inline-start: 1px solid var(--color-hairline); }
}

/* Journey introduction: use the full measure as two columns on desktop
   rather than one narrow column beside an empty half. */
@media (min-width: 64rem) {
  :root .intro .intro__body.prose-measure {
    max-width: none;
    columns: 2;
    column-gap: 4rem;
  }
  :root .intro .intro__body.prose-measure > p { break-inside: avoid; }
  :root .intro .intro__body.prose-measure > p + p { margin-top: 0; }
}

/* Practical notes become quiet cards. */
:root .notes.notes { gap: 1.25rem; }
:root .notes.notes > * {
  padding: 1.5rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-lg);
}
:root .notes .note__label { margin-top: 1.1rem; letter-spacing: -0.012em; }
:root .notes .note__text { font-size: var(--text-sm); color: var(--color-ink-muted); }

/* Itinerary table. */
:root .glance tbody tr { transition: background-color var(--duration-fast) var(--ease-brand); }
:root .glance th:first-child,
:root .glance td:first-child { padding-left: 0.75rem; }
:root .glance tbody tr > :first-child { border-top-left-radius: 0; }

/* Call-out notices. */
:root .notice.notice,
:root .days__notice.days__notice {
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

/* Long-form reading. */
:root .prose li::marker,
:root .policy li::marker { color: var(--color-crimson); }

:root .prose a,
:root .policy a {
  text-decoration-thickness: 1px;
  text-underline-offset: 0.2em;
}
:root .prose a:hover,
:root .policy a:hover { text-decoration-thickness: 2px; }

:root .prose blockquote { border-radius: 0; padding-left: 1.5rem; }

:root .footer .footer__link { text-underline-offset: 0.25em; text-decoration-thickness: 1px; }

/* --------------------------------------------------------------------------
   8. Bolder section treatments
   -------------------------------------------------------------------------- */

/* Eyebrows get a short lead-in rule. */
:root .eyebrow:not(:has(.lotus))::before,
:root .head__category::before {
  content: "";
  display: inline-block;
  width: 1.75rem;
  height: 2px;
  margin-right: 0.7rem;
  border-radius: 2px;
  background-color: currentColor;
  vertical-align: middle;
  translate: 0 -1px;
}

/* How it works: solid markers, and a connector that runs from each step to
   the next (it used to float between the columns, starting mid-air). */
:root .how.how::before { display: none; }
:root .how__node.how__node {
  position: relative;
  z-index: 1;
  width: 56px;
  height: 56px;
  border: 0;
  background-color: var(--color-yellow);
  color: var(--color-plum);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--color-yellow) 16%, transparent);
}
:root .how__node .how__num { font-size: var(--text-xl); }
:root .how__step:has(.how__node) .how__title { margin-top: 1.5rem; }
@media (min-width: 48rem) {
  :root .how__step:has(.how__node):not(:last-child)::after {
    content: "";
    position: absolute;
    top: 27px;
    left: calc(56px + 1rem);
    right: calc(-2rem + 1rem);
    height: 2px;
    border-radius: 2px;
    background-image: linear-gradient(
      to right,
      color-mix(in srgb, var(--color-yellow) 70%, transparent),
      color-mix(in srgb, var(--color-yellow) 18%, transparent)
    );
  }
}
@media (max-width: 47.999rem) {
  /* Stacked: marker on the left, a vertical thread down to the next step. */
  :root .how:has(.how__node) { gap: 0; }
  :root .how__step:has(.how__node) {
    display: grid;
    grid-template-columns: 56px minmax(0, 1fr);
    column-gap: 1.25rem;
    padding-bottom: 2.25rem;
  }
  :root .how__step:has(.how__node) .how__node { grid-row: 1 / span 2; }
  :root .how__step:has(.how__node) .how__title { margin-top: 0.35rem; }
  :root .how__step:has(.how__node) .how__detail { grid-column: 2; }
  :root .how__step:has(.how__node):not(:last-child)::after {
    content: "";
    position: absolute;
    top: calc(56px + 0.75rem);
    bottom: 0.75rem;
    left: 27px;
    width: 2px;
    border-radius: 2px;
    background-color: color-mix(in srgb, var(--color-yellow) 30%, transparent);
  }
}

/* Why India Visit: each reason is a card. */
:root .why.why { gap: 1.25rem; }
:root .why.why > li {
  margin: 0;
  padding: 1.75rem 1.5rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--polish-shadow-rest);
}
@media (prefers-reduced-motion: no-preference) {
  :root .why.why > li {
    transition: transform var(--duration-fast) var(--ease-brand),
      box-shadow var(--duration-fast) var(--ease-brand),
      border-color var(--duration-base) var(--ease-brand);
  }
  :root .why.why > li:hover {
    transform: translate3d(0, -4px, 0);
    border-color: var(--color-burgundy-hairline);
    box-shadow: var(--shadow-lift-hover);
  }
}
:root .why .why__head { justify-content: space-between; }
:root .why .why__mark,
:root .philosophy .philosophy__mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background-color: var(--polish-tint);
}
:root .why .why__no { font-size: var(--text-xs); letter-spacing: 0.16em; opacity: 0.7; }
:root .why .why__title { margin-top: 1.5rem; font-size: var(--text-xl); }

/* Stat icons sit in a badge. */
:root .stat .stat__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-bottom: 1rem;
  border-radius: var(--radius-md);
  background-color: var(--polish-tint);
}
:root .stat .stat__icon svg { width: 24px; height: 24px; }
:root .on-dark .stat .stat__icon {
  background-color: color-mix(in srgb, var(--color-on-dark) 10%, transparent);
}

/* Destination tiles: the name sits on the photograph. */
:root .tile__link:has(> .tile__label) { position: relative; display: block; }
:root .tile__link:has(> .tile__label)::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: var(--radius-lg);
  background-image: linear-gradient(
    to top,
    color-mix(in srgb, var(--color-ink) 78%, transparent) 0%,
    color-mix(in srgb, var(--color-ink) 30%, transparent) 26%,
    transparent 52%
  );
  pointer-events: none;
}
:root .tile__link:has(> .tile__label) > .tile__label.tile__label {
  position: absolute;
  z-index: 1;
  left: 1.1rem;
  right: 1.1rem;
  bottom: 1rem;
  margin: 0;
  color: var(--color-white);
}
:root .tile__link:has(> .tile__label):hover > .tile__label.tile__label { color: var(--color-yellow); }
:root .tiles:has(.tile__image) .tile__label.tile__label { letter-spacing: -0.012em; }
@media (min-width: 48rem) {
  :root .tiles:has(.tile__image) .tile__label.tile__label { font-size: var(--text-xl); }
}
@media (max-width: 47.999rem) {
  :root .tile__link:has(> .tile__label) > .tile__label.tile__label { left: 0.85rem; right: 0.85rem; bottom: 0.8rem; }
}

/* Consultant portrait: an offset block behind the frame. */
:root .consultant__frame.consultant__frame {
  box-shadow: 16px 16px 0 var(--polish-tint);
}
:root .intro__portrait.intro__portrait {
  box-shadow: 16px 16px 0 var(--polish-tint);
}

/* --------------------------------------------------------------------------
   9. Inner pages
   -------------------------------------------------------------------------- */

/* Journey highlights: each highlight is a soft panel with a badge. */
:root .highlights.highlights { gap: 1rem 1.25rem; }
:root .highlights .highlights__item {
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem 1.4rem;
  background-color: var(--color-offwhite);
  border: 1px solid var(--color-hairline);
  border-radius: var(--radius-lg);
}
:root .highlights .highlights__glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-top: 0;
  border-radius: var(--radius-md);
  background-color: var(--color-white);
  border: 1px solid var(--color-card-border);
}
:root .highlights .highlights__text { font-size: var(--text-base); max-width: none; }

/* Itinerary at a glance: the table sits on a white sheet. */
:root .glance__scroll.glance__scroll {
  padding: 0.5rem 1.5rem 0.25rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--polish-shadow-rest);
}
:root .glance th:first-child,
:root .glance td:first-child { padding-left: 0; }
:root .glance tbody tr:last-child > * { border-bottom: 0; }
:root .glance tbody tr:hover { background-color: var(--color-offwhite); }

/* Day by day: the day number is a pill. */
:root .day .day__no {
  padding: 0.3rem 0.7rem;
  border-radius: var(--radius-pill);
  background-color: var(--polish-tint);
  color: var(--color-burgundy);
  font-size: var(--text-xs);
  letter-spacing: 0.08em;
}

/* Included / not included: two panels. */
:root .incl.incl { gap: 1.25rem; align-items: start; }
:root .incl.incl > * {
  padding: clamp(1.5rem, 1rem + 1.5vw, 2.25rem);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-lg);
}
:root .incl.incl > :first-child { background-color: var(--color-offwhite); }
:root .incl .incl__heading { margin-bottom: 1.25rem; }
:root .incl .incl__item-plain { border-left-color: var(--color-burgundy-hairline); }

/* Download form sits on its own card. */
:root .pdfgate .form {
  padding: clamp(1.25rem, 0.75rem + 1.5vw, 2rem);
  background-color: var(--color-white);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--polish-shadow-rest);
}

/* Photo-and-text tiles (what defines a place, what to see) become cards. */
:root .tile:has(> .tile__name) {
  overflow: clip;
  background-color: var(--color-white);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--polish-shadow-rest);
}
:root .tile:has(> .tile__name) > .tile__frame { border-radius: 0; }
:root .tile:has(> .tile__name) > .tile__name { margin-top: 1.15rem; padding-inline: 1.25rem; font-size: var(--text-xl); }
:root .tile:has(> .tile__name) > .tile__text { padding: 0 1.25rem 1.4rem; font-size: var(--text-sm); }

/* Guide posts become cards. */
:root .post.post {
  overflow: clip;
  background-color: var(--color-white);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--polish-shadow-rest);
}
:root .post.post > .post__frame { border-radius: 0; }
:root .post.post > :not(.post__frame) { padding-inline: 1.25rem; }
:root .post.post > :last-child { padding-bottom: 1.4rem; }
:root .post .post__link::after { border-radius: var(--radius-lg); }
@media (prefers-reduced-motion: no-preference) {
  :root .post.post {
    transition: transform var(--duration-fast) var(--ease-brand),
      box-shadow var(--duration-fast) var(--ease-brand);
  }
  :root .post.post:hover { transform: translate3d(0, -4px, 0); box-shadow: var(--shadow-lift-hover); }
}

/* Questions: each one is its own panel. */
:root .faq .faq__item + .faq__item { margin-top: 0.75rem; }
:root .faq .faq__panel.faq__panel,
:root .faq .faq__item:last-child .faq__panel.faq__panel {
  padding-inline: 1.5rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-lg);
}
:root .faq .faq__panel[open] {
  border-color: var(--color-burgundy-hairline);
  box-shadow: var(--polish-shadow-rest);
}
:root .faq .faq__question { font-size: var(--text-xl); }

/* Steps on dark bands (corporate, trains) and belief lists become panels. */
:root .on-dark .how > li:not(:has(.how__node)) {
  padding: 1.5rem;
  background-color: color-mix(in srgb, var(--color-on-dark) 7%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-on-dark) 16%, transparent);
  border-radius: var(--radius-lg);
}
:root .philosophy.philosophy { gap: 1.25rem; }
:root .philosophy.philosophy > li,
:root .mini .mini__item {
  padding: 1.75rem 1.5rem;
  background-color: var(--color-white);
  border: 1px solid var(--color-card-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--polish-shadow-rest);
}
:root .philosophy .philosophy__title { margin-top: 1.25rem; font-size: var(--text-xl); }
:root .mini.mini { gap: 1.25rem; }

/* Plan my trip. */
:root .formwrap.formwrap { box-shadow: 0 1px 2px rgb(26 21 35 / 0.04), 0 18px 48px rgb(26 21 35 / 0.07); }
:root .next .next__no {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--polish-tint);
  color: var(--color-burgundy);
  font-size: var(--text-xs);
}
:root .next .next__item { align-items: flex-start; }

/* Policies: each heading opens a new, clearly separated block. */
:root .policy.prose-measure > h2:not(:first-child) {
  margin-top: 2.5rem;
  padding-top: 2.25rem;
  border-top: 1px solid var(--color-hairline);
}
:root .policy.prose-measure > h2::before {
  content: "";
  display: block;
  width: 1.75rem;
  height: 2px;
  margin-bottom: 0.9rem;
  border-radius: 2px;
  background-color: var(--color-crimson);
}

/* --------------------------------------------------------------------------
   10. Reviews (home section and the reviews page)
   -------------------------------------------------------------------------- */

:root .review.review,
:root .quote.quote {
  display: flex;
  flex-direction: column;
  min-height: 17rem;
  padding: 2rem 2rem 1.75rem;
  background-color: var(--color-white);
  background-image: linear-gradient(
    155deg,
    var(--color-white) 55%,
    color-mix(in srgb, var(--color-burgundy) 7%, var(--color-white)) 100%
  );
  border: 1px solid var(--color-card-border);
  border-top: 3px solid var(--color-burgundy);
  box-shadow: 0 1px 2px rgb(26 21 35 / 0.04), 0 14px 36px rgb(26 21 35 / 0.07);
}
@media (prefers-reduced-motion: no-preference) {
  :root .review.review,
  :root .quote.quote {
    transition: transform var(--duration-fast) var(--ease-brand),
      box-shadow var(--duration-fast) var(--ease-brand);
  }
  :root .review.review:hover,
  :root .quote.quote:hover {
    transform: translate3d(0, -4px, 0);
    box-shadow: 0 2px 4px rgb(26 21 35 / 0.05), 0 22px 48px rgb(26 21 35 / 0.11);
  }
}

/* A quotation badge opens every card. */
:root .review.review::before,
:root .quote.quote::before {
  content: "";
  flex: none;
  width: 48px;
  height: 48px;
  margin-bottom: 1.5rem;
  border-radius: var(--radius-md);
  background-color: var(--color-burgundy);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 22px 22px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e5c745'%3E%3Cpath d='M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z'/%3E%3Cpath d='M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z'/%3E%3C/svg%3E");
}

:root .review .review__watermark,
:root .quote .quote__watermark { top: -1.5rem; right: -1.5rem; opacity: 0.09; }

:root .review .review__quote,
:root .quote .quote__body p { font-size: var(--text-xl); line-height: 1.55; }

/* "Coming soon" reads as a calm headline rather than small italic text. */
:root .review .review__pending,
:root .quote .quote__pending {
  flex: 1;
  align-items: flex-start;
  font-family: var(--font-display);
  font-style: normal;
  font-size: var(--text-xl);
  line-height: 1.35;
  letter-spacing: -0.012em;
  color: var(--color-ink);
}
:root .review .review__pendingmark,
:root .quote .quote__pendingmark { display: none; }

:root .review .review__by,
:root .quote .quote__meta { margin-top: auto; padding-top: 1.25rem; }
:root .review .review__pending + .review__by { margin-top: 1.5rem; }

:root .review .review__trip,
:root .quote .quote__trip {
  margin-top: 0;
  padding: 0.35rem 0.85rem;
  background-color: var(--polish-tint);
  border-color: transparent;
  letter-spacing: 0.01em;
}

/* Home: the cards share the full row instead of leaving an empty column. */
@media (min-width: 64rem) {
  :root .quotes.quotes { grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); }
}

/* Reviews page: fuller wall, tinted intro, and a dashed "more to come" note. */
:root .wall.wall { grid-template-columns: repeat(auto-fit, minmax(min(21rem, 100%), 1fr)); }
:root main:has([data-review-wall]) > .intro { background-color: var(--color-offwhite); }
:root .wall__note.wall__note {
  max-width: none;
  margin-top: 2rem;
  padding: 1.25rem 1.5rem;
  border: 1px dashed var(--color-burgundy-hairline);
  border-radius: var(--radius-lg);
  text-align: center;
  font-style: normal;
}

/* Guide articles: one centred reading column for title, picture and text
   (articles with a table-of-contents sidebar keep their own grid). */
@media (min-width: 64rem) {
  :root article:not(:has(.body--toc)) > .head > .container-content,
  :root article:not(:has(.body--toc)) .container-content.body {
    max-width: calc(46rem + 2 * var(--space-gutter));
  }
  :root article:not(:has(.body--toc)) .body .prose,
  :root article:not(:has(.body--toc)) .body .author { max-width: none; }
}
```
