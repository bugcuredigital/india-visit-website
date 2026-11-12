# Phosphor icon provenance

The site uses **6** icons, all from [Phosphor
Icons](https://github.com/phosphor-icons/core) at the **thin** weight. Regenerate with
`npm run brand:icons`.

## Why these are copied, not installed

There is no `@phosphor-icons/*` dependency in `package.json` and there should
never be one. That package is a React component library; this is a static Astro
site with no React runtime, and importing a 1,500-icon set to draw 6 glyphs
would ship a framework to solve a copy-paste problem. The path data below is
copied into `src/lib/phosphor-icons.ts`, so each icon costs one inline
`<svg>` and nothing at runtime.

## Licence

Phosphor Icons is **MIT**, which permits commercial use, modification and
redistribution provided the copyright notice travels with the copy. The notice
is reproduced in the header of the generated module.

## Why Phosphor at all

The client authorised the `ui-ux-pro-max` skill's curated Phosphor set as the
icon vocabulary in design revision round 2. Under CLAUDE.md's skill-precedence
rule that skill's **design-system generation stays overridden** — palette,
typography, styles and patterns all come from the locked brand system — but its
**UX guidance is admitted**, and which glyph reads as "years of experience" is a
UX question. The icons are drawn in our burgundy, at our size, beside our
typeface.

## The set

| Icon | Used for | Source |
|---|---|---|
| `clock` | trust bar — years of experience | [thin](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/thin/clock-thin.svg) |
| `map-trifold` | trust bar — curated journeys (counted from the catalogue) | [thin](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/thin/map-trifold-thin.svg) |
| `globe` | trust bar — regions (counted from the locked destination list) | [thin](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/thin/globe-thin.svg) |
| `chat-circle` | trust bar — 24/7 on-trip support | [thin](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/thin/chat-circle-thin.svg) |
| `users` | trust bar — travellers hosted (used once the client verifies the figure) | [thin](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/thin/users-thin.svg) |
| `map-pin` | trust bar — destinations (used once the client verifies the figure) | [thin](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/thin/map-pin-thin.svg) |
