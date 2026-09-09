/**
 * Hero image sizing — shared between the <Hero> component and the preload
 * link a page puts in its head.
 * ---------------------------------------------------------------------------
 * CLAUDE.md invariant #3 asks for the hero to be BOTH `fetchpriority="high"`
 * and *preloaded*. `<Image>` gives the first; only a `<link rel="preload">` in
 * the head gives the second, and the head is a different render position from
 * the component, so the two have to agree on the candidate set by construction
 * rather than by someone remembering.
 *
 * That is what this module is: one widths array, and one function that asks
 * astro:assets for exactly the same variants the component will request. Same
 * options in means the same content hashes out, so the preload and the <img>
 * resolve to one URL and the browser downloads it once.
 *
 * If you change HERO_WIDTHS, both sides change together. If you pass different
 * widths to <Hero> than to heroPreload(), the build emits two different srcsets
 * and the preload becomes a wasted download — so don't.
 */
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

/**
 * Heroes are full-bleed, so the top end is deliberately large. The 768 rung
 * exists for a specific reason: a 412px phone at DPR 1.75 needs 721px, and
 * with only 640 and 960 on offer the browser must take 960 — a third more
 * pixels than it can display, on the LCP resource. Rungs are cheap; wasted
 * bytes on the largest-contentful paint are not.
 */
export const HERO_WIDTHS = [640, 768, 960, 1280, 1920, 2400];

/** Heroes always span the viewport. */
export const HERO_SIZES = '100vw';

/**
 * Invariant #3 asks for AVIF/WebP. AVIF first because it is roughly a third
 * smaller at the same quality, and the hero IS the LCP element on every page
 * that has one; WebP is the fallback for Safari before 16.4.
 */
export const HERO_FORMATS = ['avif', 'webp'] as const;

/**
 * Hero encode quality. Lower than you might reach for by default, and
 * deliberately so: the hero is the LCP resource on every page that has one, and
 * with real photography it went from a 15KB flat graphic to a 75KB photograph —
 * which moved LCP from 1.7s to 2.4s on its own. AVIF holds detail well down
 * here: 42 lands the 960w candidate at 56KB against 76KB at Astro's default,
 * a 26% saving on the LCP resource, and the difference is not visible at any
 * size a hero is actually displayed. 35 would save more but starts to soften
 * fine architectural detail, which is the one thing these photographs are for.
 *
 * It MUST be the same value on both sides. `<Picture>` and the head preload
 * both read it from here, because a quality mismatch would generate two
 * different files and the preload would become a second download rather than a
 * head start.
 */
export const HERO_QUALITY = 42;

export interface HeroPreload {
  href: string;
  imagesrcset: string;
  imagesizes: string;
  type: string;
}

/**
 * Preloads the AVIF candidate set ONLY — deliberately not both formats.
 * A browser honours a preload's `type`, so emitting an AVIF and a WebP
 * preload would make every browser that supports both download the hero
 * twice. Browsers without AVIF (Safari < 16.4) skip this preload entirely and
 * load the WebP from the <picture> as usual: no preload, no double fetch, and
 * `fetchpriority="high"` still applies.
 */
export async function heroPreload(
  image: ImageMetadata,
  widths: number[] = HERO_WIDTHS,
): Promise<HeroPreload> {
  const optimised = await getImage({
    src: image,
    widths,
    sizes: HERO_SIZES,
    format: 'avif',
    quality: HERO_QUALITY,
  });

  return {
    href: optimised.src,
    imagesrcset: optimised.srcSet.attribute,
    imagesizes: HERO_SIZES,
    type: `image/${optimised.options.format ?? 'avif'}`,
  };
}
