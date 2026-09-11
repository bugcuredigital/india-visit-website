/**
 * Content collections — Zod schemas for all five collections.
 * ---------------------------------------------------------------------------
 * CLAUDE.md invariant #8: a malformed CMS entry must fail the build LOUDLY.
 * Never render a broken page silently. That is why almost nothing here is
 * `.optional()` without a reason, and why Variant B's extra modules are
 * enforced structurally rather than by editor discipline.
 *
 * Field naming is camelCase everywhere (CLAUDE.md). The Template Spec §4
 * listing is the field inventory; its snake_case is illustrative only.
 *
 * `tina/config.ts` must mirror these field-for-field in M7.
 */
import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

/* ---------------------------------------------------------------- shared -- */

const PACE = ['relaxed', 'moderate', 'active'] as const;
const IDEAL_FOR = ['couples', 'families', 'seniors', 'first-timers', 'solo', 'groups'] as const;
const TRANSPORT = ['flight', 'overnight-train', 'train', 'drive', 'boat', 'walk'] as const;

/** Per-day transfer chip. The Western & Southern India doc mixes flights and
 *  overnight trains mid-trip, so this is per-day, never per-trip. */
const transportSchema = z.object({
  mode: z.enum(TRANSPORT),
  /** Human detail shown on the chip, e.g. "Drive 172 km" or "Overnight train". */
  detail: z.string().min(1),
});

const faqSchema = z
  .array(
    z.object({
      question: z.string().min(1),
      answer: z.string().min(1),
    }),
  )
  .min(1);

/**
 * A file the client uploaded through the CMS. Tina's repo-based media land in
 * `/public/uploads/`, and Astro's `image()` helper cannot be used for them —
 * `image()` resolves files Vite can process, and the public directory is
 * copied verbatim. So anything that is not an image (video, at present) is a
 * validated path string rather than an asset reference.
 *
 * The regex is the guard rail: a typo, an absolute URL to somebody else's CDN,
 * or a file left outside the media folder fails the build with a message that
 * says what to do, rather than shipping a hero that silently never plays.
 */
const uploadPath = (extension: string) =>
  z
    .string()
    .regex(
      new RegExp(`^/uploads/[A-Za-z0-9._-]+\\.${extension}$`),
      `Must be a file uploaded through the CMS media manager — a path like ` +
        `"/uploads/hero.${extension}". Files live in /public/uploads/, and the path ` +
        `starts with /uploads/ (not /public/uploads/ and not a full URL).`,
    );

const seoSchema = z.object({
  metaTitle: z.string().min(1).max(70),
  metaDescription: z.string().min(1).max(180),
  /** Falls back to the hero image, then to the sitewide brand card. */
  ogImage: z.string().optional(),
});

/* -------------------------------------------------------------- journeys -- */

/**
 * Fields common to both variants. Everything the Template Spec marks ● is
 * required here, which is what guarantees all 20 pages look like one another.
 */
const journeyBase = (image: () => z.ZodTypeAny) => ({
  title: z.string().min(1),
  /** "Custom Journey" (A) / "Luxury Train — Fixed Departures" (B). */
  tripTypeTag: z.string().min(1),

  heroImage: image(),
  heroImageAlt: z.string().min(1),
  gallery: z.array(image()).default([]),

  nights: z.number().int().nonnegative(),
  days: z.number().int().positive(),
  routeCities: z.array(z.string().min(1)).min(2),
  startCity: z.string().min(1),
  endCity: z.string().min(1),

  signatureFeature: z.string().min(1).optional(),

  /** Editorial fields the client assigns per trip (PRD Open Question #14).
   *  Required — they drive the Quick Facts bar, which is a required section. */
  pace: z.enum(PACE),
  idealFor: z.array(z.enum(IDEAL_FOR)).min(1),
  bestSeason: z.string().min(1),

  /** S4 — verb-led highlight, rendered with the lotus glyph. */
  highlights: z
    .array(
      z.object({
        /** The bold verb-led lead, e.g. "Cruise". */
        lead: z.string().min(1),
        text: z.string().min(1),
      }),
    )
    .min(5)
    .max(8),

  /** S5 — the scannable table; each row anchors to its day in S6. */
  glanceRows: z
    .array(
      z.object({
        dayNo: z.number().int().positive(),
        destination: z.string().min(1),
        signatureExperience: z.string().min(1),
      }),
    )
    .min(1),

  /** S6 — day-by-day accordion. */
  itineraryDays: z
    .array(
      z.object({
        dayNo: z.number().int().positive(),
        title: z.string().min(1),
        transport: transportSchema.optional(),
        narrative: z.string().min(1),
        /** "Overnight in Munnar" — always the last line of a day. */
        overnight: z.string().min(1),
        /**
         * 0–4 photographs for this day (PRD v1.5). Supersedes the single
         * optional `image` field — a 0–4 list subsumes a 0–1 one, and having
         * both would leave an editor guessing which to fill.
         *
         * A plain list rather than a list of {src, alt} pairs, matching
         * `gallery` above, and they render with `alt=""`. That is the correct
         * WCAG call rather than a shortcut: these sit directly beside a
         * narrative that already describes the day, so alt text would repeat
         * to a screen-reader user what they have just read. It also keeps the
         * Tina field a plain image list, which is what the CMS is good at.
         */
        dayImages: z.array(image()).max(4).default([]),
        /** Set when the copy still needs the client's sign-off (M5). */
        provisional: z.boolean().default(false),
      }),
    )
    .min(1),

  mapGraphic: image().optional(),

  /** S13 — icon-led practical grid. High SEO value. */
  practicalNotes: z
    .array(
      z.object({
        icon: z.string().min(1),
        label: z.string().min(1),
        text: z.string().min(1),
      }),
    )
    .min(1),

  /** S14 — has a sensible default in the template, overridable per journey. */
  customiseCopy: z.string().optional(),

  /** S15 — editorially assigned, 3 cards. Empty until siblings exist. */
  related: z.array(reference('journeys')).max(3).default([]),

  /** Gated PDF download; generated in M5, so optional until then. */
  pdfFile: z.string().optional(),

  /** Optional "from" price in INR. Rendered ONLY when siteSettings.showPrices
   *  is true (PRD Open Question #1). Train pages never show pricing at all. */
  priceFrom: z.number().int().positive().optional(),

  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  seo: seoSchema,
});

const inclusionsSchema = z.array(z.string().min(1)).min(1);

/**
 * Variant A — Custom Journey. Inclusions stay optional until the client
 * decides between per-trip lists and a standardised block (Open Question #13).
 */
const journeyVariantA = (image: () => z.ZodTypeAny) =>
  z.object({
    ...journeyBase(image),
    variant: z.literal('A'),
    inclusions: inclusionsSchema.optional(),
    exclusions: inclusionsSchema.optional(),
  });

/**
 * Variant B — Fixed-Departure Luxury Train. The five extra modules are
 * REQUIRED, so a train page physically cannot ship without its operator
 * disclosure, cancellation policies or booking process.
 *
 * Note what is absent: any tariff field. Operator tariffs are never published
 * (CLAUDE.md invariant #6, permanent). There is deliberately nowhere to put a
 * price on a train page, and `priceFrom` is rejected below.
 */
const journeyVariantB = (image: () => z.ZodTypeAny) =>
  z
    .object({
      ...journeyBase(image),
      variant: z.literal('B'),

      /** Verbatim from the operator — required on B. */
      inclusions: inclusionsSchema,
      exclusions: inclusionsSchema,

      cabinCategories: z
        .array(
          z.object({
            name: z.string().min(1),
            facilities: z.array(z.string().min(1)).min(1),
            /** Top tier is visually flagged. */
            flagship: z.boolean().default(false),
          }),
        )
        .min(2),

      /** Season-labelled; changes yearly, so it is a plain editable string.
       *  Stays generic until the schedule half of Open Question #15 resolves. */
      departureInfo: z.string().min(1),
      departureSeasonLabel: z.string().min(1),

      /** The 6-step confirmation process, as a numbered stepper. */
      bookingSteps: z
        .array(
          z.object({
            step: z.number().int().positive(),
            title: z.string().min(1),
            detail: z.string().min(1),
          }),
        )
        .min(3),

      policies: z
        .array(
          z.object({
            heading: z.string().min(1),
            body: z.string().min(1),
          }),
        )
        .min(1),

      /** "India Visit is an authorised booking agent (GSA); the train is
       *  operated by RTDC. Operator terms apply." Never buried. */
      operatorDisclosure: z.string().min(1),
      operatorName: z.string().min(1),
      /** Every B page links here (invariant #6). */
      bookingTermsUrl: z.string().default('/booking-terms/'),
    });

const journeys = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journeys' }),
  schema: ({ image }) =>
    z
      .discriminatedUnion('variant', [journeyVariantA(image), journeyVariantB(image)])
      /**
       * Cross-field rules live here rather than inside a variant, because
       * discriminatedUnion members must stay plain objects.
       *
       * Refinements are used deliberately: Astro's error formatter rewrites
       * the messages attached to type-level checks (a rejected `priceFrom`
       * would print "Expected type undefined, received number"), but it prints
       * a refinement's message verbatim. Invariant #8 asks for failures that
       * are LOUD, which means the message has to explain itself to whoever is
       * editing content — not just name the field.
       */
      .superRefine((data, ctx) => {
        if (data.variant === 'B' && data.priceFrom !== undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['priceFrom'],
            message:
              'Operator tariffs are never published (CLAUDE.md invariant #6). Remove priceFrom from this luxury-train page — cabin cards render "Enquire for pricing".',
          });
        }
        if (data.glanceRows.length !== data.itineraryDays.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['glanceRows'],
            message:
              `The at-a-glance table has ${data.glanceRows.length} rows but the itinerary has ${data.itineraryDays.length} days. Each glance row anchors to its day (Template Spec S5), so the two must match.`,
          });
        }
      }),
});

/* ---------------------------------------------------------- destinations -- */

const destinations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/destinations' }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      /** One evocative line under the H1. */
      tagline: z.string().min(1),
      heroImage: image(),
      heroImageAlt: z.string().min(1),
      /** Short label for the homepage tile strip (7 curated tiles). */
      shortLabel: z.string().min(1),
      region: z.enum(['india', 'beyond-india']),
      practicalNotes: z
        .array(
          z.object({
            icon: z.string().min(1),
            label: z.string().min(1),
            text: z.string().min(1),
          }),
        )
        .min(1),
      /** SEO workhorse — 4 to 6 questions. */
      faq: faqSchema.max(8),
      /** Auto-listed by tag; this is the manual ordering override. */
      relatedJourneys: z.array(reference('journeys')).default([]),
      order: z.number().int().default(99),
      seo: seoSchema,
    }),
});

/* ---------------------------------------------------------------- cities -- */

/**
 * City pages — PAGE_TEMPLATES T15, added in PRD v1.5.
 *
 * These sit BENEATH destinations rather than beside them. A destination sells
 * a region; a city answers "what is there to see in Jaipur" and then routes
 * the reader to the journeys that go there. That is why the journeys section
 * is the conversion core of the template and why it is computed rather than
 * curated: a new journey through Jaipur should appear on the Jaipur page
 * without anyone remembering to add it.
 *
 * The set is deliberately open-ended. Two exist at M4 to prove the template;
 * the rest is M5/Phase-2 content work, prioritised by the client from the
 * candidate list in docs/CLIENT_REVIEW_SHEET.md §16.
 */
const cities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cities' }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      /** "Rajasthan" — rendered beside the H1 and in the quick-facts strip. */
      state: z.string().min(1),
      /** One line under the H1. Positioning, not a description. */
      hook: z.string().min(1),

      heroImage: image(),
      heroImageAlt: z.string().min(1),

      /** T15 §b — the scannable strip directly under the hero. */
      quickFacts: z.object({
        region: z.string().min(1),
        bestMonths: z.string().min(1),
        nearestAirport: z.string().min(1),
        nearestRail: z.string().min(1),
        knownFor: z.string().min(1),
      }),

      /** T15 §c — 2–3 short paragraphs in the editorial voice. */
      intro: z.array(z.string().min(1)).min(2).max(3),

      /** T15 §d — image-led experience tiles, name plus one line. */
      experiences: z
        .array(
          z.object({
            name: z.string().min(1),
            text: z.string().min(1),
            image: image(),
            imageAlt: z.string().min(1),
          }),
        )
        .min(4)
        .max(8),

      /** T15 §f — the gallery band. */
      photoStrip: z
        .array(
          z.object({
            image: image(),
            alt: z.string().min(1),
          }),
        )
        .min(3)
        .max(6),

      /** T15 §g — getting there / getting around / best time. */
      practicalNotes: z
        .array(
          z.object({
            icon: z.string().min(1),
            label: z.string().min(1),
            text: z.string().min(1),
          }),
        )
        .min(1),

      /** T15 §h — the SEO workhorse. */
      faq: faqSchema.max(8),

      /**
       * Journeys are matched AUTOMATICALLY from each journey's `routeCities`;
       * this is the ordering override and the escape hatch for a trip that
       * belongs here but does not name the city in its route.
       */
      relatedJourneys: z.array(reference('journeys')).default([]),

      /**
       * Other spellings this city goes by in journey routes and day titles —
       * "Cochin" for Kochi, "Amer" for Amber, "Benares" for Varanasi. Without
       * this the automatic match silently misses trips that plainly visit the
       * place, which is the worst kind of failure: the page looks finished and
       * is quietly missing its conversion core.
       */
      routeAliases: z.array(z.string().min(1)).default([]),

      /**
       * TRUE until the client has read the page. The two seeded cities are
       * written by the agency from public knowledge — accurate to the best of
       * our reading, but not yet the client's own words about places they sell.
       * Logged in docs/CLIENT_REVIEW_SHEET.md §16.
       */
      provisional: z.boolean().default(true),

      order: z.number().int().default(99),
      seo: seoSchema,
    }),
});

/* ----------------------------------------------------------------- posts -- */

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      category: z.enum(['planning-visas', 'best-time', 'guides']),
      heroImage: image(),
      heroImageAlt: z.string().min(1),
      excerpt: z.string().min(1).max(300),
      publishDate: z.coerce.date(),
      /** Freshness signal for search. */
      updatedDate: z.coerce.date().optional(),
      author: z.string().default('India Visit'),
      /** Every article's conversion job: at least one embedded journey card. */
      embeddedJourneys: z.array(reference('journeys')).min(1),
      faq: faqSchema.optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
      seo: seoSchema,
    }),
});

/* ---------------------------------------------------------- testimonials -- */

const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/testimonials' }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      /** City or country — foreign and Indian mix matters for the personas. */
      origin: z.string().min(1),
      tripRef: reference('journeys').optional(),
      tripLabel: z.string().min(1),
      quote: z.string().min(1),
      photo: image().optional(),
      /**
       * MUST be true to render. Never publish a testimonial without recorded
       * consent — the component filters on this and the schema refuses false,
       * so an un-consented entry fails the build rather than leaking.
       */
      consentConfirmed: z.boolean().refine((v) => v === true, {
        message:
          'consentConfirmed must be true. A testimonial without recorded consent must never be published — get written consent or delete the entry.',
      }),
      category: z.enum(['india', 'international', 'trains', 'corporate']),
      featured: z.boolean().default(false),
    }),
});

/* --------------------------------------------------------- siteSettings -- */

/**
 * The singleton. Everything user-editable that is not page content lives here
 * (CLAUDE.md invariant #1). Trust figures are NULLABLE on purpose: null means
 * the stat is not rendered, so an unverified number is structurally impossible
 * to publish (PRD Open Question #2).
 */
const siteSettings = defineCollection({
  loader: file('./src/content/siteSettings/settings.json'),
  schema: ({ image }) =>
      z.object({
      siteName: z.string().min(1),
      tagline: z.string().min(1),

      phone: z.string().min(1),
      phoneHref: z.string().startsWith('tel:'),
      whatsappNumber: z.string().min(1),
      whatsappDefaultMessage: z.string().min(1),
      email: z.string().email(),
      address: z.string().min(1),

      socials: z.object({
        instagram: z.string().url().nullable(),
        facebook: z.string().url().nullable(),
        youtube: z.string().url().nullable(),
        linkedin: z.string().url().nullable(),
      }),

      gtmContainerId: z.string().regex(/^GTM-[A-Z0-9]+$/).nullable(),
      metaPixelId: z.string().regex(/^\d+$/).nullable(),

      foundingYear: z.number().int().min(1900).max(2100).nullable(),
      travellerCount: z.number().int().positive().nullable(),
      destinationCount: z.number().int().positive().nullable(),
      aggregateRating: z.number().min(1).max(5).nullable(),
      yearsExperience: z.number().int().positive(),
      supportPromise: z.string().min(1),

      /**
       * Homepage hero (PAGE_TEMPLATES T1 §1, PRD v1.5) — full-screen, with a
       * background video behind the copy.
       *
       * The POSTER is required and the video is not, and that asymmetry is the
       * whole LCP-safety story in one schema rule: the poster is the largest
       * contentful paint on the homepage and always renders, while the video
       * is a flourish that arrives after `window.load` and is never fetched at
       * all for `prefers-reduced-motion` or `Save-Data` visitors. A hero with
       * no video is a working hero; a hero with no poster is a blank screen.
       *
       * Both formats are nullable and both may be null — that is the
       * poster-only state, which is exactly what the page should render before
       * the client uploads anything.
       */
      homeHero: z.object({
        poster: image(),
        posterAlt: z.string().min(1),
        /** WebM first where present: smaller at equal quality. */
        videoWebm: uploadPath('webm').nullable(),
        videoMp4: uploadPath('mp4').nullable(),
      }),

      /** Global gate for every priceFrom on the site. Default off. */
      showPrices: z.boolean(),

      responseSla: z.string().nullable(),

      /**
       * The homepage's "Meet your travel consultant" section (PAGE_TEMPLATES
       * T1 v2 §6) — the trust centrepiece of the page, and therefore the part
       * that must never contain anything invented.
       *
       * `name` is NULLABLE and null until the client supplies it: presenting a
       * made-up name for a real consultancy's founder would be a fabrication,
       * not a placeholder. The section renders without the name line rather than
       * with a guess. `portrait` is likewise null until a real photograph
       * arrives, falling back to the neutral grey portrait slot — a stock
       * photograph of a stranger is not an option here for the same reason.
       *
       * `quote` is agency-drafted and PROVISIONAL until approved; it is logged
       * in docs/CLIENT_REVIEW_SHEET.md.
       */
      founder: z.object({
        name: z.string().min(1).nullable(),
        role: z.string().min(1),
        quote: z.string().min(1),
        /** A real asset reference, not a path string — so dropping the client's
         *  photograph in is a content edit with no code change. */
        portrait: image().nullable(),
        portraitAlt: z.string().min(1),
      }),

      /**
       * Greppable inventory of fields still holding placeholder values.
       * JSON cannot carry comments, so this array is where the `DUMMY DATA`
       * flags live — `grep -rn "DUMMY DATA" src/content/` finds them, and
       * `npm run audit:hardcoded` fails the launch check while it is non-empty.
       * Empty this array only when every listed field holds a real value.
       */
      _dummyDataFlags: z.array(z.string()).default([]),
  }),
  });

export const collections = { journeys, destinations, cities, posts, testimonials, siteSettings };
