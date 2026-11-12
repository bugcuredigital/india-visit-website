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
];

const results = [];

for (const icon of ICONS) {
  const url = `https://raw.githubusercontent.com/${REPO}/${REF}/assets/${WEIGHT}/${icon.name}-${WEIGHT}.svg`;
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

  results.push({ ...icon, viewBox, paths, bytes: svg.length, url });
  console.log(`  ${icon.name.padEnd(14)} ${paths.length} path(s)  viewBox="${viewBox}"`);
}

if (results.length !== ICONS.length) {
  console.error('\n  Not every icon was extracted — refusing to write a partial set.');
  process.exit(1);
}

const entries = results
  .map(
    (r) => `  /** ${r.usedFor}. */
  '${r.name}': {
    viewBox: '${r.viewBox}',
    paths: [\n${r.paths.map((d) => `      '${d}',`).join('\n')}\n    ],
  },`,
  )
  .join('\n');

writeFileSync(
  OUT,
  `/* GENERATED FILE — do not edit by hand. Regenerate with \`npm run brand:icons\`.
 * ---------------------------------------------------------------------------
 * Path data copied verbatim from Phosphor Icons (${WEIGHT} weight),
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
Icons](https://github.com/${REPO}) at the **${WEIGHT}** weight. Regenerate with
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

## The set

| Icon | Used for | Source |
|---|---|---|
${results.map((r) => `| \`${r.name}\` | ${r.usedFor} | [${WEIGHT}](${r.url}) |`).join('\n')}
`,
);

console.log(`\n  ${results.length} icons -> ${OUT}`);
console.log(`  provenance -> ${PROVENANCE}`);
