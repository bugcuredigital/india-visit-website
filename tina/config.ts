/**
 * TinaCMS schema — mirrors src/content.config.ts field-for-field (M7).
 * ---------------------------------------------------------------------------
 * RULES OF THIS FILE
 *
 * 1. The Zod schemas in src/content.config.ts are THE validator (CLAUDE.md
 *    invariant #8). Tina is the editor. If the two disagree, the build fails
 *    loudly on the Zod side and the site stays up on the last good build —
 *    which is the behaviour the M7 gate asks for. So this file is written to
 *    match Zod, not to replace it, and every constraint that Zod enforces but
 *    Tina cannot express (the Variant B modules being required on B, the
 *    at-a-glance row count matching the day count) is stated in a field
 *    description so the editor sees it.
 *
 * 2. Field names are camelCase and identical to the Zod keys — the content
 *    files are shared, so there is nothing to translate.
 *
 * 3. MEDIA. Repo-based, in /public/uploads/ (CLAUDE.md locked stack). Tina
 *    stores an image as "/uploads/<file>"; Astro's image() helper (which is
 *    what gives every photograph its AVIF/WebP set — invariant #3) needs a
 *    path relative to the content file. Verified in M7 by experiment: a content
 *    entry referencing "../../../public/uploads/<file>" builds thirteen
 *    optimised variants into dist/_astro/. So every image field carries the
 *    same parse/format pair: the editor sees and picks "/uploads/<file>", the
 *    file on disk holds "../../../public/uploads/<file>". Paths that do not
 *    start with /uploads/ (the TEMP-PHOTO set under src/assets/) pass through
 *    untouched, so nothing already on the site is disturbed until the client
 *    replaces it.
 *
 * 4. REFERENCES. Tina stores a reference as the target's file path
 *    ("src/content/journeys/x.md"); Astro's reference() wants the entry id
 *    ("x"). The same parse/format idea maps between them.
 *
 * 5. BODY. The markdown body of every .md collection is a plain textarea, not
 *    Tina's rich-text editor. Rich-text round-trips through an MDX AST and can
 *    re-serialise punctuation and emphasis; the client's prose is the product,
 *    and a plain textarea gives it back byte for byte.
 *
 * 6. VISUAL EDITING is deliberately absent. Tina's contextual editing on Astro
 *    now requires `output: 'server'` (an SSR adapter), and the stack is locked
 *    to static output with no exceptions. The admin at /admin is a complete
 *    forms-based editor for every collection, which is what the M7 gate
 *    exercises. Recorded in SESSION_LOG.md and the runbook.
 */
import { defineConfig, type Collection, type TinaField } from 'tinacms';

/* ------------------------------------------------------------ media paths -- */

const UPLOADS_STORED = '../../../public/uploads/';
const UPLOADS_TINA = '/uploads/';

/**
 * Every mapper is STRING-GUARDED and ARRAY-AWARE. Tina hands `ui.parse` and
 * `ui.format` the raw field value, which for a list field is the whole array
 * and for an empty optional field is null or undefined. The first version of
 * this file called `value.startsWith` unguarded; on `gallery: []` that threw
 * "value.startsWith is not a function" inside the form and the entire journey
 * editor failed to render — caught by driving the real form in M7's smoke
 * test, not by the API tests, which bypass these functions entirely.
 */
type Mapper = (value: unknown) => unknown;
const each = (fn: (value: string) => string): Mapper => (value) => {
  if (Array.isArray(value)) return value.map((item) => (typeof item === 'string' ? fn(item) : item));
  return typeof value === 'string' ? fn(value) : value;
};

/** Tina → file: "/uploads/x.jpg" becomes "../../../public/uploads/x.jpg". */
const toStored = each((value) =>
  value.startsWith(UPLOADS_TINA) ? UPLOADS_STORED + value.slice(UPLOADS_TINA.length) : value,
);

/** file → Tina: the reverse, leaving src/assets paths as they are. */
const toTina = each((value) =>
  value.startsWith(UPLOADS_STORED) ? UPLOADS_TINA + value.slice(UPLOADS_STORED.length) : value,
);

const imageField = (name: string, label: string, description?: string, required = true): TinaField => ({
  type: 'image',
  name,
  label,
  required,
  description,
  ui: {
    parse: (value: any) => toStored(value) as any,
    format: (value: any) => toTina(value) as any,
  },
});

/* ------------------------------------------------------------- references -- */

const refToStored = each((value) => value.replace(/^src\/content\/[^/]+\//, '').replace(/\.(md|json)$/, ''));
const refToTina = (collection: string, ext: 'md' | 'json') =>
  each((value) => (value.startsWith('src/content/') ? value : `src/content/${collection}/${value}.${ext}`));

const journeyRef = (name: string, label: string, description?: string): TinaField => ({
  type: 'reference',
  name,
  label,
  description,
  collections: ['journeys'],
  ui: {
    parse: (value: any) => refToStored(value) as any,
    format: (value: any) => refToTina('journeys', 'md')(value) as any,
  },
});

/* ------------------------------------------------------- shared sub-fields -- */

const seoFields: TinaField = {
  type: 'object',
  name: 'seo',
  label: 'SEO',
  required: true,
  fields: [
    { type: 'string', name: 'metaTitle', label: 'Meta title', required: true, description: 'At most 70 characters.' },
    {
      type: 'string',
      name: 'metaDescription',
      label: 'Meta description',
      required: true,
      description: 'At most 180 characters.',
      ui: { component: 'textarea' },
    },
    { type: 'string', name: 'ogImage', label: 'Social image (optional)', description: 'Falls back to the hero, then the brand card.' },
  ],
};

const faqFields = (max: number): TinaField => ({
  type: 'object',
  name: 'faq',
  label: 'FAQ',
  list: true,
  description: `Rendered as an accordion with FAQPage schema. At most ${max}.`,
  ui: { itemProps: (item: any) => ({ label: item?.question || 'Question' }) },
  fields: [
    { type: 'string', name: 'question', label: 'Question', required: true },
    { type: 'string', name: 'answer', label: 'Answer', required: true, ui: { component: 'textarea' } },
  ],
});

const practicalNotesFields: TinaField = {
  type: 'object',
  name: 'practicalNotes',
  label: 'Practical notes',
  list: true,
  required: true,
  description: 'Icon-led grid. Icons: calendar, plane, clock, pace, passport, currency.',
  ui: { itemProps: (item: any) => ({ label: item?.label || 'Note' }) },
  fields: [
    {
      type: 'string',
      name: 'icon',
      label: 'Icon',
      required: true,
      options: ['calendar', 'plane', 'clock', 'pace', 'passport', 'currency'],
    },
    { type: 'string', name: 'label', label: 'Label', required: true },
    { type: 'string', name: 'text', label: 'Text', required: true, ui: { component: 'textarea' } },
  ],
};

const bodyField: TinaField = {
  type: 'string',
  name: 'body',
  label: 'Body (markdown)',
  isBody: true,
  ui: { component: 'textarea' },
};

/* --------------------------------------------------------------- journeys -- */

const journeys: Collection = {
  name: 'journeys',
  label: 'Journeys',
  path: 'src/content/journeys',
  format: 'md',
  ui: {
    filename: {
      readonly: false,
      slugify: (values: any) =>
        `${(values?.title as string | undefined) ?? 'journey'}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
    },
  },
  fields: [
    {
      type: 'string',
      name: 'variant',
      label: 'Variant',
      required: true,
      options: [
        { value: 'A', label: 'A — Custom journey' },
        { value: 'B', label: 'B — Luxury train, fixed departures' },
      ],
      description:
        'Variant B REQUIRES the cabin categories, inclusions, exclusions, departures, booking steps, policies and operator disclosure below, and must not carry a price. The build refuses a B entry without them.',
    },
    { type: 'string', name: 'title', label: 'Title', required: true },
    {
      type: 'string',
      name: 'tripTypeTag',
      label: 'Trip-type tag',
      required: true,
      description: '"Custom Journey" or "Luxury Train — Fixed Departures".',
    },
    { type: 'string', name: 'signatureFeature', label: 'Signature feature (one line)' },

    imageField('heroImage', 'Hero image', 'Full-bleed, 3:2. This is the page\'s largest image — a calm composition works best.'),
    { type: 'string', name: 'heroImageAlt', label: 'Hero image alt text', required: true },
    {
      type: 'image',
      name: 'gallery',
      label: 'Gallery',
      list: true,
      ui: {
        parse: (value: any) => toStored(value) as any,
        format: (value: any) => toTina(value) as any,
      },
    },

    { type: 'number', name: 'nights', label: 'Nights', required: true },
    { type: 'number', name: 'days', label: 'Days', required: true },
    {
      type: 'string',
      name: 'routeCities',
      label: 'Route cities (in order)',
      list: true,
      required: true,
      description: 'At least two. City pages link automatically when a name matches.',
    },
    { type: 'string', name: 'startCity', label: 'Start city', required: true },
    { type: 'string', name: 'endCity', label: 'End city', required: true },

    {
      type: 'string',
      name: 'pace',
      label: 'Pace',
      required: true,
      options: ['relaxed', 'moderate', 'active'],
    },
    {
      type: 'string',
      name: 'idealFor',
      label: 'Ideal for',
      list: true,
      required: true,
      options: ['couples', 'families', 'seniors', 'first-timers', 'solo', 'groups'],
    },
    { type: 'string', name: 'bestSeason', label: 'Best season', required: true },

    {
      type: 'object',
      name: 'highlights',
      label: 'Journey highlights',
      list: true,
      required: true,
      description: 'Five to eight. Verb-led: the bold lead ("Cruise") then the rest of the sentence.',
      ui: { itemProps: (item: any) => ({ label: item?.lead ? `${item.lead} …` : 'Highlight' }) },
      fields: [
        { type: 'string', name: 'lead', label: 'Lead verb', required: true },
        { type: 'string', name: 'text', label: 'Text', required: true, ui: { component: 'textarea' } },
      ],
    },

    {
      type: 'object',
      name: 'glanceRows',
      label: 'Itinerary at a glance',
      list: true,
      required: true,
      description: 'One row per day — the count MUST equal the number of days below, or the build refuses the entry.',
      ui: { itemProps: (item: any) => ({ label: item?.dayNo ? `Day ${item.dayNo} — ${item.destination ?? ''}` : 'Row' }) },
      fields: [
        { type: 'number', name: 'dayNo', label: 'Day number', required: true },
        { type: 'string', name: 'destination', label: 'Destination', required: true },
        { type: 'string', name: 'signatureExperience', label: 'Signature experience', required: true },
      ],
    },

    {
      type: 'object',
      name: 'itineraryDays',
      label: 'Day by day',
      list: true,
      required: true,
      ui: { itemProps: (item: any) => ({ label: item?.dayNo ? `Day ${item.dayNo} — ${item.title ?? ''}` : 'Day' }) },
      fields: [
        { type: 'number', name: 'dayNo', label: 'Day number', required: true },
        {
          type: 'string',
          name: 'title',
          label: 'Title',
          required: true,
          description: 'Pattern: "Place — Evocative Phrase" (with the em dash).',
        },
        {
          type: 'object',
          name: 'transport',
          label: 'Transport chip (optional)',
          fields: [
            {
              type: 'string',
              name: 'mode',
              label: 'Mode',
              options: ['flight', 'overnight-train', 'train', 'drive', 'boat', 'walk'],
            },
            { type: 'string', name: 'detail', label: 'Detail', description: 'Short — e.g. "Drive — 172 km". It wraps, but it should not need to.' },
          ],
        },
        { type: 'string', name: 'narrative', label: 'Narrative', required: true, ui: { component: 'textarea' } },
        { type: 'string', name: 'overnight', label: 'Overnight line', required: true, description: '"Overnight in Munnar", or "Departure" on the last day.' },
        {
          type: 'image',
          name: 'dayImages',
          label: 'Day images (0–4)',
          list: true,
          description: 'Up to four. Two render side by side; more become a grid.',
          ui: {
            parse: (value: any) => toStored(value) as any,
            format: (value: any) => toTina(value) as any,
          },
        },
        { type: 'boolean', name: 'provisional', label: 'Provisional (awaiting confirmed copy)' },
      ],
    },

    imageField('mapGraphic', 'Route map graphic (optional)', undefined, false),

    { type: 'string', name: 'inclusions', label: 'Inclusions', list: true, description: 'Required on Variant B, verbatim from the operator.' },
    { type: 'string', name: 'exclusions', label: 'Exclusions', list: true, description: 'Required on Variant B.' },

    {
      type: 'object',
      name: 'cabinCategories',
      label: 'Cabin categories (Variant B)',
      list: true,
      ui: { itemProps: (item: any) => ({ label: item?.name || 'Cabin' }) },
      fields: [
        { type: 'string', name: 'name', label: 'Name', required: true },
        { type: 'string', name: 'facilities', label: 'Facilities', list: true, required: true },
        { type: 'boolean', name: 'flagship', label: 'Flagship (visually flagged)' },
      ],
    },
    { type: 'string', name: 'departureSeasonLabel', label: 'Departure season label (Variant B)', description: 'e.g. "2026–27 season".' },
    {
      type: 'string',
      name: 'departureInfo',
      label: 'Departures text (Variant B)',
      ui: { component: 'textarea' },
      description: 'Stays generic ("Seasonal departures — enquire for current dates") until the schedule question resolves.',
    },
    {
      type: 'object',
      name: 'bookingSteps',
      label: 'Booking steps (Variant B)',
      list: true,
      ui: { itemProps: (item: any) => ({ label: item?.step ? `${item.step}. ${item.title ?? ''}` : 'Step' }) },
      fields: [
        { type: 'number', name: 'step', label: 'Step number', required: true },
        { type: 'string', name: 'title', label: 'Title', required: true },
        { type: 'string', name: 'detail', label: 'Detail', required: true, ui: { component: 'textarea' } },
      ],
    },
    {
      type: 'object',
      name: 'policies',
      label: 'Policies (Variant B)',
      list: true,
      ui: { itemProps: (item: any) => ({ label: item?.heading || 'Policy' }) },
      fields: [
        { type: 'string', name: 'heading', label: 'Heading', required: true },
        { type: 'string', name: 'body', label: 'Body', required: true, ui: { component: 'textarea' } },
      ],
    },
    { type: 'string', name: 'operatorName', label: 'Operator name (Variant B)' },
    {
      type: 'string',
      name: 'operatorDisclosure',
      label: 'Operator disclosure (Variant B)',
      ui: { component: 'textarea' },
      description: 'Rendered in the cabin section header and never buried. Operator tariffs are never published anywhere.',
    },
    { type: 'string', name: 'bookingTermsUrl', label: 'Booking terms URL (Variant B)', description: 'Normally /booking-terms/.' },

    practicalNotesFields,
    { type: 'string', name: 'customiseCopy', label: 'Enquiry band copy (optional)', ui: { component: 'textarea' } },
    {
      /* A plain list of slugs, NOT a list of reference fields. Tina cannot
         make a reference field a list, and wrapping one in an object list
         saved `related: [{}]` — which Zod refused, because the site expects
         `related: [slug, slug]`. The slug is the journey's filename. */
      type: 'string',
      name: 'related',
      label: 'Related journeys (up to 3 slugs)',
      list: true,
      description: 'The filename of each journey, e.g. golden-triangle-5n-6d. Leave empty and the section is omitted.',
    },
    { type: 'string', name: 'pdfFile', label: 'PDF file path', description: 'Set by npm run pdf:build — /downloads/<slug>.pdf. Leave as is.' },
    {
      type: 'number',
      name: 'priceFrom',
      label: 'Price from (INR, optional)',
      description: 'Renders only while "Show prices" is on in Site settings. Never on Variant B.',
    },
    { type: 'boolean', name: 'featured', label: 'Featured on the homepage' },
    { type: 'boolean', name: 'draft', label: 'Draft (hidden from the site)' },
    seoFields,
    bodyField,
  ],
};

/* ----------------------------------------------------------- destinations -- */

const destinations: Collection = {
  name: 'destinations',
  label: 'Destinations',
  path: 'src/content/destinations',
  format: 'md',
  ui: { allowedActions: { create: false, delete: false } },
  fields: [
    { type: 'string', name: 'name', label: 'Name', required: true, description: 'The nine names are locked (CLAUDE.md); edit the words, not the set.' },
    { type: 'string', name: 'tagline', label: 'Tagline', required: true },
    imageField('heroImage', 'Hero image'),
    { type: 'string', name: 'heroImageAlt', label: 'Hero image alt text', required: true },
    { type: 'string', name: 'shortLabel', label: 'Short label (homepage tile)', required: true },
    { type: 'string', name: 'region', label: 'Region', required: true, options: ['india', 'beyond-india'] },
    {
      type: 'string',
      name: 'intro',
      label: 'Intro (two or three sentences)',
      required: true,
      ui: { component: 'textarea' },
      description: 'Short on purpose — the journey cards must stay within one scroll. The long version is the body.',
    },
    {
      type: 'object',
      name: 'experiences',
      label: '"What defines it" tiles (3–6, optional)',
      list: true,
      description: 'Leave empty and the section is omitted rather than shown with placeholders.',
      ui: { itemProps: (item: any) => ({ label: item?.name || 'Tile' }) },
      fields: [
        { type: 'string', name: 'name', label: 'Name', required: true },
        { type: 'string', name: 'text', label: 'One line', required: true },
        imageField('image', 'Image', '4:3 tile.'),
        { type: 'string', name: 'imageAlt', label: 'Image alt text', required: true },
      ],
    },
    practicalNotesFields,
    faqFields(8),
    {
      type: 'string',
      name: 'relatedJourneys',
      label: 'Journeys (ordered slugs)',
      list: true,
      description: 'The filename of each journey, e.g. kerala-in-a-week-7n-8d, in the order the cards should appear.',
    },
    { type: 'number', name: 'order', label: 'Order' },
    seoFields,
    bodyField,
  ],
};

/* ----------------------------------------------------------------- cities -- */

const cities: Collection = {
  name: 'cities',
  label: 'City pages',
  path: 'src/content/cities',
  format: 'md',
  fields: [
    { type: 'string', name: 'name', label: 'City', required: true },
    { type: 'string', name: 'state', label: 'State', required: true },
    { type: 'string', name: 'hook', label: 'One-line hook', required: true },
    imageField('heroImage', 'Hero image'),
    { type: 'string', name: 'heroImageAlt', label: 'Hero image alt text', required: true },
    {
      type: 'object',
      name: 'quickFacts',
      label: 'Quick facts',
      required: true,
      fields: [
        { type: 'string', name: 'region', label: 'State / region', required: true },
        { type: 'string', name: 'bestMonths', label: 'Best months', required: true },
        { type: 'string', name: 'nearestAirport', label: 'Nearest airport', required: true },
        { type: 'string', name: 'nearestRail', label: 'Nearest railway station', required: true },
        { type: 'string', name: 'knownFor', label: 'Known for', required: true },
      ],
    },
    {
      type: 'string',
      name: 'intro',
      label: 'Intro paragraphs (2–3)',
      list: true,
      required: true,
      ui: { component: 'textarea' },
    },
    {
      type: 'object',
      name: 'experiences',
      label: 'What to see and do (4–8 tiles)',
      list: true,
      required: true,
      ui: { itemProps: (item: any) => ({ label: item?.name || 'Tile' }) },
      fields: [
        { type: 'string', name: 'name', label: 'Name', required: true },
        { type: 'string', name: 'text', label: 'One line', required: true },
        imageField('image', 'Image', '4:3 tile.'),
        { type: 'string', name: 'imageAlt', label: 'Image alt text', required: true },
      ],
    },
    {
      type: 'object',
      name: 'photoStrip',
      label: 'Photo strip (3–6)',
      list: true,
      required: true,
      fields: [imageField('image', 'Image'), { type: 'string', name: 'alt', label: 'Alt text', required: true }],
    },
    practicalNotesFields,
    faqFields(8),
    {
      type: 'string',
      name: 'relatedJourneys',
      label: 'Journeys — manual override (optional slugs)',
      list: true,
      description: 'Journeys whose route names this city are listed automatically; add journey filenames here to reorder or add one.',
    },
    { type: 'string', name: 'routeAliases', label: 'Other spellings in routes', list: true, description: '"Cochin" for Kochi, "Amer" for Amber.' },
    { type: 'boolean', name: 'provisional', label: 'Provisional (not yet reviewed by you)' },
    { type: 'number', name: 'order', label: 'Order' },
    seoFields,
    bodyField,
  ],
};

/* ------------------------------------------------------------------ posts -- */

const posts: Collection = {
  name: 'posts',
  label: 'Travel Guide articles',
  path: 'src/content/posts',
  format: 'md',
  ui: {
    filename: {
      readonly: false,
      slugify: (values: any) =>
        `${(values?.title as string | undefined) ?? 'article'}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
    },
  },
  fields: [
    { type: 'string', name: 'title', label: 'Title', required: true },
    {
      type: 'string',
      name: 'category',
      label: 'Category',
      required: true,
      options: [
        { value: 'planning-visas', label: 'Planning & Visas' },
        { value: 'best-time', label: 'Best Time to Visit' },
        { value: 'guides', label: 'Destination Guides' },
      ],
    },
    imageField('heroImage', 'Hero image'),
    { type: 'string', name: 'heroImageAlt', label: 'Hero image alt text', required: true },
    { type: 'string', name: 'excerpt', label: 'Excerpt', required: true, ui: { component: 'textarea' }, description: 'At most 300 characters.' },
    { type: 'datetime', name: 'publishDate', label: 'Publish date', required: true, ui: { dateFormat: 'YYYY-MM-DD' } },
    { type: 'datetime', name: 'updatedDate', label: 'Updated date (optional)', ui: { dateFormat: 'YYYY-MM-DD' } },
    { type: 'string', name: 'author', label: 'Author', description: 'Defaults to India Visit.' },
    {
      type: 'string',
      name: 'embeddedJourneys',
      label: 'Journeys to embed (at least one slug)',
      list: true,
      required: true,
      description: 'The article\'s conversion job — at least one journey filename, e.g. bhutan-paro-thimphu-punakha-7n-8d.',
    },
    faqFields(8),
    { type: 'boolean', name: 'featured', label: 'Featured' },
    { type: 'boolean', name: 'draft', label: 'Draft (hidden from the site)' },
    seoFields,
    bodyField,
  ],
};

/* ----------------------------------------------------------- testimonials -- */

const testimonials: Collection = {
  name: 'testimonials',
  label: 'Testimonials',
  path: 'src/content/testimonials',
  format: 'json',
  fields: [
    {
      type: 'boolean',
      name: 'placeholder',
      label: 'Placeholder slot (no review yet)',
      description: 'A placeholder carries NO name, origin, quote or photo — the build refuses them — and shows "Guest review coming soon".',
    },
    { type: 'string', name: 'name', label: 'Guest name', description: 'Real reviews only.' },
    { type: 'string', name: 'origin', label: 'City or country' },
    journeyRef('tripRef', 'Journey taken (optional)'),
    { type: 'string', name: 'tripLabel', label: 'Trip label', required: true, description: 'e.g. "Kerala with Houseboat, 11N/12D".' },
    { type: 'string', name: 'quote', label: 'Quote', ui: { component: 'textarea' } },
    imageField('photo', 'Guest photo (optional — only with photo consent)', undefined, false),
    {
      type: 'boolean',
      name: 'consentConfirmed',
      label: 'Written consent recorded',
      description: 'Must be ON for a real review to publish, and OFF on a placeholder. Never publish a review without recorded consent.',
    },
    { type: 'string', name: 'category', label: 'Category', required: true, options: ['india', 'international', 'trains', 'corporate'] },
    { type: 'boolean', name: 'featured', label: 'Featured' },
    { type: 'string', name: '_dummyDataFlags', label: 'Placeholder flags', list: true, description: 'Internal: which fields still hold placeholder values.' },
  ],
};

/* ----------------------------------------------------------- siteSettings -- */

const siteSettings: Collection = {
  name: 'siteSettings',
  label: 'Site settings',
  path: 'src/content/siteSettings',
  format: 'json',
  match: { include: 'settings' },
  ui: { allowedActions: { create: false, delete: false }, global: true },
  fields: [
    {
      type: 'object',
      name: 'settings',
      label: 'Settings',
      required: true,
      fields: [
        { type: 'string', name: 'siteName', label: 'Site name', required: true },
        { type: 'string', name: 'tagline', label: 'Tagline', required: true },
        { type: 'string', name: 'phone', label: 'Phone (with country code)', required: true },
        { type: 'string', name: 'phoneHref', label: 'Phone link', required: true, description: 'tel:+91… — digits only after "tel:", and it must match the phone above.' },
        { type: 'string', name: 'whatsappNumber', label: 'WhatsApp number', required: true },
        { type: 'string', name: 'whatsappDefaultMessage', label: 'WhatsApp prefilled message', required: true, ui: { component: 'textarea' } },
        { type: 'string', name: 'email', label: 'Email', required: true },
        { type: 'string', name: 'address', label: 'Address', required: true },
        {
          type: 'object',
          name: 'socials',
          label: 'Social profiles',
          fields: [
            { type: 'string', name: 'instagram', label: 'Instagram URL' },
            { type: 'string', name: 'facebook', label: 'Facebook URL' },
            { type: 'string', name: 'youtube', label: 'YouTube URL' },
            { type: 'string', name: 'linkedin', label: 'LinkedIn URL' },
          ],
        },
        { type: 'string', name: 'gtmContainerId', label: 'GTM container ID', description: 'GTM-XXXXXXX. Empty = no analytics loads.' },
        { type: 'string', name: 'metaPixelId', label: 'Meta Pixel ID', description: 'Managed inside GTM; digits only.' },
        { type: 'number', name: 'foundingYear', label: 'Founding year', description: 'Leave empty until verified — nothing renders a guess.' },
        { type: 'number', name: 'travellerCount', label: 'Travellers served', description: 'Leave empty until verified.' },
        { type: 'number', name: 'destinationCount', label: 'Destinations covered', description: 'Leave empty until verified.' },
        { type: 'number', name: 'aggregateRating', label: 'Aggregate rating (1–5)', description: 'Leave empty until verified.' },
        { type: 'number', name: 'yearsExperience', label: 'Years of experience', required: true },
        { type: 'string', name: 'supportPromise', label: 'Support promise', required: true },
        {
          type: 'object',
          name: 'homeHero',
          label: 'Homepage hero',
          required: true,
          fields: [
            imageField('poster', 'Poster image (required)', 'The LCP element — always renders. 16:9, calm composition.'),
            { type: 'string', name: 'posterAlt', label: 'Poster alt text', required: true },
            { type: 'string', name: 'videoWebm', label: 'Hero video — WebM (optional)', description: 'Upload to the media library first, then paste its path: /uploads/<file>.webm. About 15 MB at most; 1080p ceiling; the poster still renders first.' },
            { type: 'string', name: 'videoMp4', label: 'Hero video — MP4 (optional)', description: 'As above: /uploads/<file>.mp4.' },
          ],
        },
        {
          type: 'object',
          name: 'pageHeroes',
          label: 'Fixed-page heroes',
          required: true,
          fields: [
            {
              type: 'object',
              name: 'luxuryTrains',
              label: 'Luxury trains landing page',
              required: true,
              fields: [imageField('image', 'Hero image'), { type: 'string', name: 'alt', label: 'Alt text', required: true }],
            },
          ],
        },
        { type: 'boolean', name: 'showPrices', label: 'Show "from" prices on journeys', required: true },
        { type: 'string', name: 'responseSla', label: 'Response-time promise', description: 'Leave empty until you commit to one.' },
        {
          type: 'object',
          name: 'founder',
          label: 'Your consultant (homepage + About)',
          required: true,
          fields: [
            { type: 'string', name: 'name', label: 'Name', description: 'Leave empty and the section renders without a name — never a guess.' },
            { type: 'string', name: 'role', label: 'Role', required: true },
            { type: 'string', name: 'quote', label: 'Quote', required: true, ui: { component: 'textarea' } },
            imageField('portrait', 'Portrait (4:5)', 'Leave empty for the neutral placeholder.', false),
            { type: 'string', name: 'portraitAlt', label: 'Portrait alt text', required: true },
          ],
        },
        { type: 'string', name: '_dummyDataFlags', label: 'Placeholder flags', list: true, description: 'Internal inventory of fields still holding placeholder values. Remove an entry when its field holds a real value.' },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ config -- */

export default defineConfig({
  /* Tina Cloud edits the branch it is pointed at. Cloudflare exposes the branch
     being built; locally it falls back to main. */
  branch: process.env.TINA_BRANCH || process.env.CF_PAGES_BRANCH || 'main',
  /* Both null until the client's Tina Cloud project exists; local mode needs
     neither and is what the M7 smoke tests run against. */
  clientId: process.env.TINA_PUBLIC_CLIENT_ID ?? null,
  token: process.env.TINA_TOKEN ?? null,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      publicFolder: 'public',
      mediaRoot: 'uploads',
      static: false,
    },
  },
  schema: {
    collections: [journeys, destinations, cities, posts, testimonials, siteSettings],
  },
});
