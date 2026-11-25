/**
 * Phosphor icon extraction — the trust bar's glyph vocabulary.
 * ---------------------------------------------------------------------------
 * WHY THIS SCRIPT EXISTS AT ALL, given that the stack is locked:
 *
 * CLAUDE.md's skill-precedence rule overrides the `ui-ux-pro-max` skill's
 * design-system generation but admits its UX guidance, and the client
 * explicitly authorised its curated **Phosphor** set as the icon vocabulary in
 * design revision round 2. Choosing a glyph for "years of experience" is an
 * affordance question, not a brand-system question — and these are rendered in
 * OUR colour at OUR weight, never in Phosphor's.
 *
 * What this script deliberately does NOT do is add a dependency. There is no
 * `@phosphor-icons/react` here and there is not going to be one: that package
 * is a React component library, this is a static Astro site with no React, and
 * pulling in a 1,500-icon set to draw four glyphs would be absurd. Instead the
 * path data for exactly the icons we use is copied into the repo as a plain TS
 * module, so the icons cost one inline <svg> each and nothing at runtime.
 *
 * Weight is `thin` (Phosphor's lightest). The client asked for thin-line icons
 * beside big display numerals, and anything heavier competes with the numeral
 * instead of supporting it.
 *
 * Licence: Phosphor Icons is MIT, which permits this use with the copyright
 * notice preserved — it is preserved in the generated file's header and in
 * docs/brand/processed/PHOSPHOR-PROVENANCE.md.
 *
 * Usage: npm run brand:icons
 */
import { writeFileSync, mkdirSync } from 'node:fs';

const REPO = 'phosphor-icons/core';
const REF = 'main';
const WEIGHT = 'thin';
const OUT = 'src/lib/phosphor-icons.ts';
const PROVENANCE = 'docs/brand/processed/PHOSPHOR-PROVENANCE.md';

/**
 * Every icon the site uses, and what it is FOR. The `usedFor` note is the
 * point of this table: an icon whose meaning nobody recorded is an icon that
 * gets reused wrongly six months later.
 */
const ICONS = [
  { name: 'clock', usedFor: 'trust bar — years of experience' },
  { name: 'map-trifold', usedFor: 'trust bar — curated journeys (counted from the catalogue)' },
  { name: 'globe', usedFor: 'trust bar — regions (counted from the locked destination list)' },
  { name: 'chat-circle', usedFor: 'trust bar — 24/7 on-trip support' },
  { name: 'users', usedFor: 'trust bar — travellers hosted (used once the client verifies the figure)' },
  { name: 'map-pin', usedFor: 'trust bar — destinations (used once the client verifies the figure)' },
  /* The footer's social links (round 5). REGULAR weight, not thin: these sit
     at about 22px with no numeral beside them, where a thin line is under a
     pixel wide and reads as a smudge. */
  { name: 'instagram-logo', weight: 'regular', usedFor: 'footer — Instagram profile link' },
  { name: 'facebook-logo', weight: 'regular', usedFor: 'footer — Facebook profile link' },
  /* Design round 6 (an external polish spec, ported): the site's hand-drawn
     transfer, practical-note and header glyphs drew at three stroke weights
     on two grids. They are replaced by Phosphor
     equivalents, one set, one weight. REGULAR, for the same reason as the
     social icons: they render at 15–22px, where Phosphor's regular outline is
     exactly the spec's 1.5-on-24 line and the thin weight would be a 0.5–0.7px
     hairline. `key` names the export when a glyph is already in the set at
     another weight (the trust bar's clock is thin). */
  { name: 'car-profile', weight: 'regular', usedFor: 'day-by-day transfer chip — drive' },
  { name: 'train', weight: 'regular', usedFor: 'day-by-day transfer chip — train and overnight train' },
  { name: 'boat', weight: 'regular', usedFor: 'day-by-day transfer chip — boat' },
  { name: 'airplane-tilt', weight: 'regular', usedFor: 'day-by-day transfer chip — flight; practical notes — getting there (`plane`)' },
  { name: 'footprints', weight: 'regular', usedFor: 'day-by-day transfer chip — on foot' },
  { name: 'calendar-blank', weight: 'regular', usedFor: 'practical notes — best time to visit (`calendar`)' },
  { name: 'clock', key: 'clock-regular', weight: 'regular', usedFor: 'practical notes — ideal duration (`clock`)' },
  { name: 'path', weight: 'regular', usedFor: 'practical notes — pace, getting around (`pace`)' },
  { name: 'file-text', weight: 'regular', usedFor: 'practical notes — visas and documents (`passport`)' },
  { name: 'money', weight: 'regular', usedFor: 'practical notes — currency (`currency`)' },
  { name: 'cloud', weight: 'regular', usedFor: 'practical notes — weather (`weather`)' },
  { name: 'phone', weight: 'regular', usedFor: 'header — call link' },
  /* FILL weight: a solid mark in a burgundy badge, where an outline at 22px
     would read as a smudge on the dark ground. */
  { name: 'quotes', weight: 'fill', usedFor: 'testimonial cards — quotation badge (real reviews only; a placeholder keeps its lotus)' },
];

const results = [];

for (const icon of ICONS) {
  const weight = icon.weight ?? WEIGHT;
  /* Phosphor names the regular weight's files without a suffix. */
  const file = weight === 'regular' ? `${icon.name}.svg` : `${icon.name}-${weight}.svg`;
  const url = `https://raw.githubusercontent.com/${REPO}/${REF}/assets/${weight}/${file}`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error(`  FAILED ${icon.name} — HTTP ${response.status}`);
    process.exitCode = 1;
    continue;
  }
  const svg = await response.text();

  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  const paths = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]);

  /* A silently empty icon would render as a blank box that nobody notices in
     review. Fail the build of the icon set instead. */
  if (!viewBox || paths.length === 0) {
    console.error(`  FAILED ${icon.name} — no viewBox or no path data in the source SVG`);
    process.exitCode = 1;
    continue;
  }

  /* Phosphor's outline weights are drawn as FILLED paths, not stroked ones —
     the stroke is already converted to an outline. So these render with
     `fill: currentColor` and no stroke attribute, and "thin-line" is a
     property of the artwork rather than of our CSS. */
  if (/stroke=/.test(svg)) {
    console.warn(`  NOTE ${icon.name} — source carries a stroke attribute; check the render`);
  }

  const key = icon.key ?? icon.name;
  results.push({ ...icon, key, weight, viewBox, paths, bytes: svg.length, url });
  console.log(`  ${key.padEnd(14)} ${paths.length} path(s)  viewBox="${viewBox}"`);
}

const keys = results.map((r) => r.key);
const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
if (dupes.length) {
  console.error(`\n  Duplicate export key(s): ${dupes.join(', ')} — give one a \`key\`.`);
  process.exit(1);
}

if (results.length !== ICONS.length) {
  console.error('\n  Not every icon was extracted — refusing to write a partial set.');
  process.exit(1);
}

const entries = results
  .map(
    (r) => `  /** ${r.usedFor}${r.weight === WEIGHT ? '' : ` (${r.weight} weight)`}. */
  '${r.key}': {
    viewBox: '${r.viewBox}',
    paths: [\n${r.paths.map((d) => `      '${d}',`).join('\n')}\n    ],
  },`,
  )
  .join('\n');

writeFileSync(
  OUT,
  `/* GENERATED FILE — do not edit by hand. Regenerate with \`npm run brand:icons\`.
 * ---------------------------------------------------------------------------
 * Path data copied verbatim from Phosphor Icons (${WEIGHT} weight unless an
 * entry says otherwise),
 * https://github.com/${REPO}, MIT licence:
 *
 *   Copyright (c) 2023 Phosphor Icons
 *   Permission is hereby granted, free of charge, to any person obtaining a
 *   copy of this software and associated documentation files (the "Software"),
 *   to deal in the Software without restriction, including without limitation
 *   the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *   and/or sell copies of the Software, and to permit persons to whom the
 *   Software is furnished to do so, subject to the above copyright notice and
 *   this permission notice being included in all copies.
 *
 * These are FILLED outlines, not strokes — colour them with \`fill\`, and set
 * the visual weight by picking a different Phosphor weight in the script, not
 * by adding a stroke here.
 *
 * Why the data is copied rather than depended on: see the header of
 * scripts/brand/fetch-phosphor-icons.mjs. Provenance: ${PROVENANCE}.
 */

export interface PhosphorIcon {
  viewBox: string;
  paths: string[];
}

export const PHOSPHOR_ICONS = {
${entries}
} as const satisfies Record<string, PhosphorIcon>;

export type PhosphorIconName = keyof typeof PHOSPHOR_ICONS;
`,
);

mkdirSync('docs/brand/processed', { recursive: true });
writeFileSync(
  PROVENANCE,
  `# Phosphor icon provenance

The site uses **${results.length}** icons, all from [Phosphor
Icons](https://github.com/${REPO}), at the **${WEIGHT}** weight except where the
table says otherwise. Regenerate with
\`npm run brand:icons\`.

## Why these are copied, not installed

There is no \`@phosphor-icons/*\` dependency in \`package.json\` and there should
never be one. That package is a React component library; this is a static Astro
site with no React runtime, and importing a 1,500-icon set to draw ${results.length} glyphs
would ship a framework to solve a copy-paste problem. The path data below is
copied into \`src/lib/phosphor-icons.ts\`, so each icon costs one inline
\`<svg>\` and nothing at runtime.

## Licence

Phosphor Icons is **MIT**, which permits commercial use, modification and
redistribution provided the copyright notice travels with the copy. The notice
is reproduced in the header of the generated module.

## Why Phosphor at all

The client authorised the \`ui-ux-pro-max\` skill's curated Phosphor set as the
icon vocabulary in design revision round 2. Under CLAUDE.md's skill-precedence
rule that skill's **design-system generation stays overridden** — palette,
typography, styles and patterns all come from the locked brand system — but its
**UX guidance is admitted**, and which glyph reads as "years of experience" is a
UX question. The icons are drawn in our burgundy, at our size, beside our
typeface.

## Design round 6: the hand-drawn glyphs

An external polish spec (\`docs/design/EXTERNAL_POLISH_AUDIT.md\`) found that the
site's hand-drawn glyphs (transfer chips, practical notes, the header's call
link) used three stroke weights (1.3, 1.4, 1.5) on two grids (16 and 20), and
swapped them for Lucide.
The finding was accepted and the implementation changed: Lucide is not the
authorised vocabulary, so each of the spec's twelve glyphs maps to its Phosphor
equivalent instead, at the regular weight (Phosphor's regular outline is the
spec's 1.5-on-24 line).

| Spec glyph | Phosphor | Where |
|---|---|---|
| car | \`car-profile\` | transfer chip: drive |
| train | \`train\` | transfer chip: train, overnight train |
| boat | \`boat\` | transfer chip: boat |
| plane | \`airplane-tilt\` | transfer chip: flight; practical notes: \`plane\` |
| walk | \`footprints\` | transfer chip: on foot |
| calendar | \`calendar-blank\` | practical notes: \`calendar\` |
| clock | \`clock\` (regular, exported as \`clock-regular\`) | practical notes: \`clock\` |
| route | \`path\` | practical notes: \`pace\` |
| file | \`file-text\` | practical notes: \`passport\` |
| banknote | \`money\` | practical notes: \`currency\` |
| cloud | \`cloud\` | practical notes: \`weather\` |
| phone | \`phone\` | header: call link |

Every one had a direct equivalent; nothing was mixed in from another set. The
spec's review-card quotation mark is Phosphor \`quotes\` (fill weight).

## The set

| Icon | Used for | Source |
|---|---|---|
${results.map((r) => `| \`${r.key}\`${r.key === r.name ? '' : ` (Phosphor \`${r.name}\`)`} | ${r.usedFor} | [${r.weight}](${r.url}) |`).join('\n')}
`,
);

console.log(`\n  ${results.length} icons -> ${OUT}`);
console.log(`  provenance -> ${PROVENANCE}`);
