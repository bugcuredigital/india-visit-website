/**
 * Hero contrast — measured against the actual pixels behind the actual text.
 * ---------------------------------------------------------------------------
 * Heroes are the one place on this site where text sits on a photograph, and
 * they have now produced three contrast failures across two review rounds:
 * overlay nav links on a pale sunrise sky, an H1 on bright sandstone, and a
 * gradient tuned so defensively that it erased the photograph instead.
 *
 * Every one of those was found by eye, late. None of them could be caught by a
 * token-level contrast check, because the background is not a token — it is
 * whatever the photograph happens to be doing at that y position, plus a
 * gradient, plus a video frame nobody has seen.
 *
 * So this measures it the only way that is actually true: render the page,
 * record where each piece of hero text sits AND what colour it is, hide the
 * text, photograph what was behind it, and score every ground pixel in each
 * box against that colour, keeping the WORST: not the average, because a
 * headline is unreadable if one word of it lands on a bright cloud.
 *
 * In the run's OWN colour (round 5). Until 13 Nov 2026 every run was scored
 * as if it were white, which is right for the H1 and wrong for anything
 * lighter-than-ink-but-not-white: the breadcrumbs in on-dark-muted (#E0CBD4)
 * measured 3.0-3.9:1 on eleven heroes and the check passed them all. A
 * breadcrumb in the hero that this check cannot find now fails it too.
 *
 * Thresholds are WCAG AA: 4.5:1 for normal text, 3:1 for large text (>=24px
 * bold, or >=18.66px bold / >=24px regular per the spec).
 *
 * Caveat worth knowing: on a video hero this measures ONE frame — whichever is
 * showing when the capture runs. It is a floor, not a proof. The gradient still
 * has to be built for a frame nobody has seen, which is why the veil is tuned
 * against the copy's position rather than against this clip.
 *
 * Usage: node scripts/check-hero-contrast.mjs [url ...]
 */
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import sharp from 'sharp';

/**
 * COVERAGE CONTRACT — every page with text over imagery, discovered, not listed.
 * ---------------------------------------------------------------------------
 * Round 3 widened this check from the homepage to eight hand-picked hero pages
 * and it found 33 failures the homepage alone would have hidden. The client's
 * ruling made that widening the permanent definition, with one refinement: a
 * hand-picked list has to be maintained, and a new template type would not be
 * on it until somebody remembered. So the default set is discovered from the
 * build instead: every page in `dist/` whose HTML contains a `.hero` section
 * (the one component that puts copy over a photograph or video) is audited,
 * at both breakpoints. A new template that uses <Hero> joins the audit the
 * moment it is built, with no edit here.
 *
 * And on mobile a second time with prefers-reduced-motion (14 Nov 2026): that
 * is the only state in which a phone hero's primary is an outline over the
 * photograph rather than solid crimson (Hero.astro, one crimson action per
 * viewport), and it has no Ken Burns, so its ground differs too.
 *
 * Text ON a photograph outside a hero joins too (design round 6). The
 * destination tiles moved their names onto the picture, over an ink scrim, and
 * that is text over imagery like any hero line. Every such run carries
 * `data-on-image` in the markup; a page with one is discovered the same way a
 * hero page is, each run is scrolled into view, its photograph waited for,
 * and the ground behind it scored like hero copy. A page that marks a run this
 * check then fails to measure fails it, the same rule as the breadcrumbs.
 *
 * Pass URLs explicitly to audit a subset; with no arguments the contract is
 * the whole site.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

const discoverHeroPages = async () => {
  const walk = async (dir) => {
    const out = [];
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) out.push(...(await walk(path)));
      else if (entry.name === 'index.html') out.push(path);
    }
    return out;
  };
  const pages = [];
  for (const file of await walk(DIST)) {
    const html = await readFile(file, 'utf8');
    if (!/class="hero hero--/.test(html) && !/data-on-image/.test(html)) continue;
    const route = '/' + relative(DIST, file).replace(/index\.html$/, '').replaceAll('\\', '/');
    if (route.startsWith('/dev/')) continue;
    pages.push(route);
  }
  return pages.sort();
};

const urls = process.argv.slice(2);
if (!urls.length) {
  const discovered = await discoverHeroPages();
  if (!discovered.length) {
    console.error('No built pages with a <Hero> found in dist/ — run `npm run build` first.');
    process.exit(1);
  }
  console.log(`\nCoverage contract: ${discovered.length} page(s) with text over imagery (heroes, and data-on-image runs), discovered from dist/\n`);
  urls.push(...discovered.map((path) => `http://localhost:4321${path}`));
}

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9447;
const VIEWPORTS = [
  { label: 'mobile', width: 390, height: 844 },
  { label: 'mobile-rm', width: 390, height: 844, reducedMotion: true },
  { label: 'desktop', width: 1440, height: 900 },
];

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-sandbox',
    '--disable-gpu',
    '--force-device-scale-factor=1',
    '--user-data-dir=/tmp/iv-contrast-profile',
    'about:blank',
  ],
  { stdio: 'ignore' },
);
process.on('exit', () => {
  try {
    chrome.kill();
  } catch {}
});

async function wsUrl() {
  for (let i = 0; i < 40; i++) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const json = await response.json();
      if (json.webSocketDebuggerUrl) return json.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error('devtools never came up');
}

const ws = new WebSocket(await wsUrl());
await new Promise((res, rej) => {
  ws.onopen = res;
  ws.onerror = rej;
});
let id = 1;
const pending = new Map();
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { res, rej } = pending.get(message.id);
  pending.delete(message.id);
  message.error ? rej(new Error(JSON.stringify(message.error))) : res(message.result);
};
const send = (method, params = {}, sessionId) => {
  const n = id++;
  return new Promise((res, rej) => {
    pending.set(n, { res, rej });
    ws.send(JSON.stringify({ id: n, method, params, sessionId }));
  });
};

const linear = (channel) => {
  const s = channel / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};

const luminance = ([r, g, b]) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);

/** "rgb(a, b, c)" / "rgba(a, b, c, d)" → [r, g, b, alpha]. */
const parseColour = (value) => {
  const parts = (value.match(/[\d.]+/g) || []).map(Number);
  return [parts[0] ?? 255, parts[1] ?? 255, parts[2] ?? 255, parts.length >= 4 ? parts[3] : 1];
};

/** WCAG contrast of a text colour on one ground pixel. A translucent text
 *  colour is composited over that pixel first, as the browser draws it. */
const contrastOn = ([tr, tg, tb, ta], ground) => {
  const text = [tr, tg, tb].map((c, i) => ta * c + (1 - ta) * ground[i]);
  const a = luminance(text);
  const b = luminance(ground);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

const failures = [];
const rows = [];

/** Score every box against the ground pixels in one viewport capture. */
const scoreBoxes = async (png, list, url, viewport, kind) => {
  const { data: raw, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  for (const box of list) {
    const colour = parseColour(box.colour);
    let worst = Infinity;
    let worstPixel = null;
    const x0 = Math.max(0, box.x);
    const y0 = Math.max(0, box.y);
    const x1 = Math.min(info.width, box.x + box.w);
    const y1 = Math.min(info.height, box.y + box.h);
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * info.width + x) * info.channels;
        const value = contrastOn(colour, [raw[i], raw[i + 1], raw[i + 2]]);
        if (value < worst) {
          worst = value;
          worstPixel = [raw[i], raw[i + 1], raw[i + 2]];
        }
      }
    }
    if (!worstPixel) continue;

    const required = box.large ? 3 : 4.5;
    const ok = worst >= required;
    rows.push({
      url,
      viewport: viewport.label,
      text: box.text,
      colour: box.colour,
      crumb: Boolean(box.crumb),
      kind,
      size: box.size,
      large: box.large,
      worst,
      required,
      pixel: worstPixel,
      ok,
    });
    if (!ok) {
      failures.push(
        `${url} [${viewport.label}]${kind === 'on-image' ? ' (on image)' : ''} "${box.text}" — ${worst.toFixed(2)}:1 ` +
          `(${box.colour} on rgb(${worstPixel})) needs ${required}:1 (${box.size}px${box.large ? ', large' : ''})`,
      );
    }
  }
};

for (const url of urls) {
  for (const viewport of VIEWPORTS) {
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    await send('Page.enable', {}, sessionId);
    await send('Runtime.enable', {}, sessionId);
    await send(
      'Emulation.setDeviceMetricsOverride',
      {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.width < 768,
      },
      sessionId,
    );
    if (viewport.reducedMotion) {
      await send(
        'Emulation.setEmulatedMedia',
        { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] },
        sessionId,
      );
    }
    await send('Page.navigate', { url }, sessionId);
    await sleep(2200);

    const evaluate = async (expression) => {
      const { result } = await send(
        'Runtime.evaluate',
        { expression, returnByValue: true },
        sessionId,
      );
      return result.value;
    };

    /* Collect every visible run of light-coloured text drawn over the hero:
       the hero's own copy, and the overlay header sitting on top of it. */
    const boxes = await evaluate(`(() => {
      const hero = document.querySelector('.hero');
      if (!hero) return null;
      const heroBox = hero.getBoundingClientRect();
      const nodes = [
        ...hero.querySelectorAll('.hero__content :is(h1, h2, p, span, a, li)'),
        ...document.querySelectorAll('header a, header button'),
      ];
      const out = [];
      for (const node of nodes) {
        const text = (node.textContent || '').trim();
        if (!text) continue;
        // Only leaf-ish runs: a wrapper's box spans its children and would
        // measure ground its own glyphs never touch.
        if (node.querySelector('h1, h2, p, span, a, li')) continue;
        const rect = node.getBoundingClientRect();
        if (rect.width < 4 || rect.height < 4) continue;
        if (rect.bottom <= heroBox.top || rect.top >= heroBox.bottom) continue;
        const style = getComputedStyle(node);
        if (style.visibility === 'hidden' || style.opacity === '0') continue;
        // Skip text that sits on its own solid ground (buttons, chips): the
        // photograph is not its background and a token check covers it.
        // The walk must STOP at the hero or the header. Letting it run to
        // <body> found body's opaque white and silently excluded every
        // overlay nav link — which is the exact element that failed contrast
        // in review round 1, so the check was blind to its own reason for
        // existing.
        let el = node, opaque = false;
        while (el && el !== hero && el.tagName !== 'HEADER' && el !== document.body) {
          const bg = getComputedStyle(el).backgroundColor;
          const parts = bg.match(/[\\d.]+/g);
          if (parts && parts.length >= 3 && (parts.length < 4 || Number(parts[3]) > 0.5)) { opaque = true; break; }
          el = el.parentElement;
        }
        if (opaque) continue;
        const size = parseFloat(style.fontSize);
        const weight = Number(style.fontWeight) || 400;
        const large = size >= 24 || (size >= 18.66 && weight >= 700);
        out.push({
          text: text.slice(0, 44),
          colour: style.color,
          crumb: Boolean(node.closest('nav[aria-label="Breadcrumb"], .crumbs')),
          large,
          size: Math.round(size),
          x: Math.round(rect.left), y: Math.round(rect.top),
          w: Math.round(rect.width), h: Math.round(rect.height),
        });
      }
      const crumbs = hero.querySelectorAll('.hero__content :is(nav[aria-label="Breadcrumb"], .crumbs)').length;
      return { out, crumbs, hero: { h: Math.round(heroBox.height) } };
    })()`);

    if (boxes) {
      /* Hide the type, keep everything behind it exactly as it was. */
      await evaluate(`(() => {
        const style = document.createElement('style');
        style.id = 'iv-hide-hero-text';
        style.textContent =
          '.hero__content, header a, header button { visibility: hidden !important; }';
        document.head.append(style);
      })()`);
      await sleep(350);

      const { data } = await send(
        'Page.captureScreenshot',
        { format: 'png', captureBeyondViewport: false },
        sessionId,
      );

      // Coverage, stated rather than assumed: a hero that renders a breadcrumb
      // must yield at least one measured breadcrumb run.
      if (boxes.crumbs && !boxes.out.some((box) => box.crumb)) {
        failures.push(`${url} [${viewport.label}] has a hero breadcrumb but no breadcrumb text was measured`);
      }

      await scoreBoxes(Buffer.from(data, 'base64'), boxes.out, url, viewport, 'hero');
    }

    /* ---- Text ON a photograph outside the hero (data-on-image) ------------
       Fixed and sticky layers are hidden (the header, the phone action bar):
       they are not the ground under a tile. Entrance animations are settled,
       and smooth scrolling is turned off so a jump lands where it is sent. */
    const marked = await evaluate(`(() => {
      const runs = document.querySelectorAll('[data-on-image]');
      if (!runs.length) return 0;
      const style = document.createElement('style');
      style.id = 'iv-on-image-prep';
      style.textContent =
        'html { scroll-behavior: auto !important; } ' +
        '*, *::before, *::after { transition: none !important; animation: none !important; } ' +
        'html.js .fade-up, html.js .fade-up-stagger > * { opacity: 1 !important; transform: none !important; }';
      document.head.append(style);
      for (const el of document.querySelectorAll('body *')) {
        const position = getComputedStyle(el).position;
        if (position === 'fixed' || position === 'sticky') el.style.setProperty('visibility', 'hidden', 'important');
      }
      return runs.length;
    })()`);

    const measured = new Set();
    for (let pass = 0; marked && measured.size < marked && pass < 60; pass++) {
      const { result } = await send(
        'Runtime.evaluate',
        {
          awaitPromise: true,
          returnByValue: true,
          expression: `(async () => {
            const runs = [...document.querySelectorAll('[data-on-image]')];
            const done = ${JSON.stringify([...measured])};
            const next = runs.findIndex((el, i) => !done.includes(i));
            if (next < 0) return [];
            runs[next].scrollIntoView({ block: 'center', behavior: 'instant' });
            await new Promise((r) => setTimeout(r, 300));
            // The photograph behind the run, and every other one in view,
            // must be loaded and decoded before the capture means anything.
            const inView = [...document.images].filter((img) => {
              const r = img.getBoundingClientRect();
              return r.bottom > 0 && r.top < innerHeight;
            });
            const t0 = performance.now();
            while (inView.some((img) => !img.complete || !img.naturalWidth) && performance.now() - t0 < 8000) {
              await new Promise((r) => setTimeout(r, 100));
            }
            await Promise.all(inView.map((img) => img.decode().catch(() => {})));
            await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
            const out = [];
            runs.forEach((el, i) => {
              if (done.includes(i)) return;
              const r = el.getBoundingClientRect();
              const whole = r.top >= 0 && r.bottom <= innerHeight;
              if (!(whole || i === next) || r.width < 4 || r.height < 4) return;
              const st = getComputedStyle(el);
              const size = parseFloat(st.fontSize);
              const weight = Number(st.fontWeight) || 400;
              out.push({
                i,
                text: (el.textContent || '').trim().slice(0, 44),
                colour: st.color,
                large: size >= 24 || (size >= 18.66 && weight >= 700),
                size: Math.round(size),
                x: Math.round(r.left), y: Math.round(Math.max(0, r.top)),
                w: Math.round(r.width), h: Math.round(Math.min(r.bottom, innerHeight) - Math.max(0, r.top)),
              });
            });
            return out;
          })()`,
        },
        sessionId,
      );
      const batch = result.value || [];
      if (!batch.length) break;

      await evaluate(`(() => {
        const style = document.createElement('style');
        style.id = 'iv-hide-on-image';
        style.textContent = '[data-on-image] { visibility: hidden !important; }';
        document.head.append(style);
      })()`);
      await sleep(120);
      const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }, sessionId);
      await evaluate(`document.getElementById('iv-hide-on-image')?.remove()`);

      await scoreBoxes(Buffer.from(data, 'base64'), batch, url, viewport, 'on-image');
      for (const box of batch) measured.add(box.i);
    }
    if (marked && measured.size < marked) {
      failures.push(`${url} [${viewport.label}] marks ${marked} run(s) data-on-image but measured ${measured.size}`);
    }

    await send('Target.closeTarget', { targetId });
  }
}

console.log('\nHero contrast — worst ground pixel behind each run, scored in the run\'s own colour\n');
for (const row of rows) {
  console.log(
    `  ${row.ok ? 'ok  ' : 'FAIL'}  ${row.worst.toFixed(2).padStart(5)}:1 ` +
      `(needs ${String(row.required).padEnd(3)})  ${row.viewport.padEnd(9)} ` +
      `${row.size}px${row.large ? ' L' : '  '}${row.crumb ? ' crumb' : row.kind === 'on-image' ? ' image' : '      '}  "${row.text}"  ${row.colour}`,
  );
}
const crumbRows = rows.filter((row) => row.crumb);
console.log(`\n  Breadcrumb runs measured: ${crumbRows.length} (${crumbRows.filter((row) => !row.ok).length} failing)`);
const imageRows = rows.filter((row) => row.kind === 'on-image');
console.log(`  On-image runs measured (outside heroes): ${imageRows.length} (${imageRows.filter((row) => !row.ok).length} failing)`);

if (failures.length) {
  console.error(`\n  ${failures.length} contrast FAILURE(S):`);
  for (const failure of failures) console.error(`   · ${failure}`);
  process.exit(1);
}
console.log(`\n  ${rows.length} text runs measured, all pass WCAG AA.`);
process.exit(0);
