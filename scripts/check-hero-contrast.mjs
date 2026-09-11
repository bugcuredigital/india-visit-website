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
 * record where each piece of hero text sits, hide the text, photograph what
 * was behind it, and take the LIGHTEST ground pixel in each box — the worst
 * case for white type, not the average, because a headline is unreadable if
 * one word of it lands on a bright cloud.
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
 * DEFAULT SET — every page that renders a <Hero>, not just the homepage.
 * Design round 3 replaced the per-hero scrim with ONE gradient shared by all of
 * them, so a change here is a change everywhere, and an audit that defaults to
 * the homepage would have told us the good news only. One journey of each
 * variant, both city pages, two destinations, and the trains landing page —
 * which is every hero HEIGHT and every copy SHAPE the component can produce.
 */
const DEFAULT_PATHS = [
  '/',
  '/journeys/golden-triangle-5n-6d/',
  '/journeys/palace-on-wheels-7n-8d/',
  '/cities/jaipur/',
  '/cities/kochi/',
  '/destinations/rajasthan-golden-triangle/',
  '/destinations/kerala/',
  '/luxury-trains/',
];

const urls = process.argv.slice(2);
if (!urls.length) urls.push(...DEFAULT_PATHS.map((path) => `http://localhost:4321${path}`));

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9447;
const VIEWPORTS = [
  { label: 'mobile', width: 390, height: 844 },
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

/** WCAG relative luminance, then contrast against pure white. */
const contrastWithWhite = (r, g, b) =>
  1.05 / (0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b) + 0.05);

const failures = [];
const rows = [];

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
          large,
          size: Math.round(size),
          x: Math.round(rect.left), y: Math.round(rect.top),
          w: Math.round(rect.width), h: Math.round(rect.height),
        });
      }
      return { out, hero: { h: Math.round(heroBox.height) } };
    })()`);

    if (!boxes) {
      await send('Target.closeTarget', { targetId });
      continue;
    }

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
    const png = Buffer.from(data, 'base64');
    const { data: raw, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });

    for (const box of boxes.out) {
      let worst = Infinity;
      let worstPixel = null;
      const x0 = Math.max(0, box.x);
      const y0 = Math.max(0, box.y);
      const x1 = Math.min(info.width, box.x + box.w);
      const y1 = Math.min(info.height, box.y + box.h);
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = (y * info.width + x) * info.channels;
          const value = contrastWithWhite(raw[i], raw[i + 1], raw[i + 2]);
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
        size: box.size,
        large: box.large,
        worst,
        required,
        pixel: worstPixel,
        ok,
      });
      if (!ok) {
        failures.push(
          `${url} [${viewport.label}] "${box.text}" — ${worst.toFixed(2)}:1 ` +
            `on rgb(${worstPixel}) needs ${required}:1 (${box.size}px${box.large ? ', large' : ''})`,
        );
      }
    }

    await send('Target.closeTarget', { targetId });
  }
}

console.log('\nHero contrast — lightest ground pixel behind each run of white text\n');
for (const row of rows) {
  console.log(
    `  ${row.ok ? 'ok  ' : 'FAIL'}  ${row.worst.toFixed(2).padStart(5)}:1 ` +
      `(needs ${String(row.required).padEnd(3)})  ${row.viewport.padEnd(7)} ` +
      `${row.size}px${row.large ? ' L' : '  '}  "${row.text}"`,
  );
}

if (failures.length) {
  console.error(`\n  ${failures.length} contrast FAILURE(S):`);
  for (const failure of failures) console.error(`   · ${failure}`);
  process.exit(1);
}
console.log(`\n  ${rows.length} text runs measured, all pass WCAG AA.`);
process.exit(0);
