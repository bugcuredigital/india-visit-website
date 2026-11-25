# Phosphor icon provenance

The site uses **21** icons, all from [Phosphor
Icons](https://github.com/phosphor-icons/core), at the **thin** weight except where the
table says otherwise. Regenerate with
`npm run brand:icons`.

## Why these are copied, not installed

There is no `@phosphor-icons/*` dependency in `package.json` and there should
never be one. That package is a React component library; this is a static Astro
site with no React runtime, and importing a 1,500-icon set to draw 21 glyphs
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

## Design round 6: the hand-drawn glyphs

An external polish spec (`docs/design/EXTERNAL_POLISH_AUDIT.md`) found that the
site's hand-drawn glyphs (transfer chips, practical notes, the header's call
link) used three stroke weights (1.3, 1.4, 1.5) on two grids (16 and 20), and
swapped them for Lucide.
The finding was accepted and the implementation changed: Lucide is not the
authorised vocabulary, so each of the spec's twelve glyphs maps to its Phosphor
equivalent instead, at the regular weight (Phosphor's regular outline is the
spec's 1.5-on-24 line).

| Spec glyph | Phosphor | Where |
|---|---|---|
| car | `car-profile` | transfer chip: drive |
| train | `train` | transfer chip: train, overnight train |
| boat | `boat` | transfer chip: boat |
| plane | `airplane-tilt` | transfer chip: flight; practical notes: `plane` |
| walk | `footprints` | transfer chip: on foot |
| calendar | `calendar-blank` | practical notes: `calendar` |
| clock | `clock` (regular, exported as `clock-regular`) | practical notes: `clock` |
| route | `path` | practical notes: `pace` |
| file | `file-text` | practical notes: `passport` |
| banknote | `money` | practical notes: `currency` |
| cloud | `cloud` | practical notes: `weather` |
| phone | `phone` | header: call link |

Every one had a direct equivalent; nothing was mixed in from another set. The
spec's review-card quotation mark is Phosphor `quotes` (fill weight).

## The set

| Icon | Used for | Source |
|---|---|---|
| `clock` | trust bar — years of experience | [thin](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/thin/clock-thin.svg) |
| `map-trifold` | trust bar — curated journeys (counted from the catalogue) | [thin](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/thin/map-trifold-thin.svg) |
| `globe` | trust bar — regions (counted from the locked destination list) | [thin](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/thin/globe-thin.svg) |
| `chat-circle` | trust bar — 24/7 on-trip support | [thin](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/thin/chat-circle-thin.svg) |
| `users` | trust bar — travellers hosted (used once the client verifies the figure) | [thin](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/thin/users-thin.svg) |
| `map-pin` | trust bar — destinations (used once the client verifies the figure) | [thin](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/thin/map-pin-thin.svg) |
| `instagram-logo` | footer — Instagram profile link | [regular](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/instagram-logo.svg) |
| `facebook-logo` | footer — Facebook profile link | [regular](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/facebook-logo.svg) |
| `car-profile` | day-by-day transfer chip — drive | [regular](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/car-profile.svg) |
| `train` | day-by-day transfer chip — train and overnight train | [regular](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/train.svg) |
| `boat` | day-by-day transfer chip — boat | [regular](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/boat.svg) |
| `airplane-tilt` | day-by-day transfer chip — flight; practical notes — getting there (`plane`) | [regular](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/airplane-tilt.svg) |
| `footprints` | day-by-day transfer chip — on foot | [regular](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/footprints.svg) |
| `calendar-blank` | practical notes — best time to visit (`calendar`) | [regular](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/calendar-blank.svg) |
| `clock-regular` (Phosphor `clock`) | practical notes — ideal duration (`clock`) | [regular](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/clock.svg) |
| `path` | practical notes — pace, getting around (`pace`) | [regular](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/path.svg) |
| `file-text` | practical notes — visas and documents (`passport`) | [regular](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/file-text.svg) |
| `money` | practical notes — currency (`currency`) | [regular](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/money.svg) |
| `cloud` | practical notes — weather (`weather`) | [regular](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/cloud.svg) |
| `phone` | header — call link | [regular](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/regular/phone.svg) |
| `quotes` | testimonial cards — quotation badge (real reviews only; a placeholder keeps its lotus) | [fill](https://raw.githubusercontent.com/phosphor-icons/core/main/assets/fill/quotes-fill.svg) |
