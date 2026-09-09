/**
 * Full-page screenshots that actually match what a visitor sees.
 * ---------------------------------------------------------------------------
 * Getting this right took three attempts, and the failure modes are worth
 * recording because each one produced *plausible* images that were wrong:
 *
 *   1. A tall `--window-size` distorts the layout, because `svh`-based heroes
 *      size themselves against the viewport: an 11000px window turned a
 *      `min-height: 85svh` hero into a 9000px monster.
 *
 *   2. A normal viewport plus `captureBeyondViewport: true` fixes the height
 *      but MISRENDERS wide content: on the itinerary hero it rasterised the
 *      content box at its pre-layout width, so the H1, the badges and both
 *      CTAs appeared sliced off at the viewport edge — in an image where the
 *      rest of the page was laid out correctly. A DOM probe at the same moment
 *      reported the correct 390px widths, so nothing but a side-by-side
 *      against a viewport-only capture would catch it. Screenshots of a
 *      responsive bug and screenshots of a capture bug look identical.
 *
 *   3. What this script does now: capture the VIEWPORT ONLY — the one path
 *      Chrome renders faithfully — at successive scroll offsets, then stitch
 *      the tiles with sharp. Slower, and truthful.
 *
 * Elements that are `position: fixed` or `sticky` are hidden after the first
 * tile, otherwise the header and the sticky action bar repeat down the whole
 * image.
 *
 * Usage: node scripts/screenshot.mjs <url> <out.png> [width] [height]
 */
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import sharp from 'sharp';

const [url, out, widthArg, heightArg] = process.argv.slice(2);
if (!url || !out) {
  console.error('usage: node scripts/screenshot.mjs <url> <out.png> [width] [height]');
  process.exit(1);
}
const WIDTH = Number(widthArg ?? 1280);
const HEIGHT = Number(heightArg ?? 900);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9444;

const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`,
  '--no-sandbox', '--disable-gpu', '--force-device-scale-factor=1',
  '--user-data-dir=/tmp/iv-shot-profile', 'about:blank'], { stdio: 'ignore' });
process.on('exit', () => { try { chrome.kill(); } catch {} });

async function wsUrl() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const j = await r.json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error('devtools never came up');
}

const ws = new WebSocket(await wsUrl());
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let id = 1; const pending = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) {
    const { res, rej } = pending.get(m.id); pending.delete(m.id);
    m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result);
  }
};
const send = (method, params = {}, sessionId) => {
  const n = id++;
  return new Promise((res, rej) => {
    pending.set(n, { res, rej });
    ws.send(JSON.stringify({ id: n, method, params, sessionId }));
  });
};

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
await send('Page.enable', {}, sessionId);
await send('Runtime.enable', {}, sessionId);
await send('Emulation.setDeviceMetricsOverride',
  { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: WIDTH < 768 }, sessionId);
await send('Page.navigate', { url }, sessionId);
await sleep(1800);

const evaluate = async (expression) => {
  const { result } = await send('Runtime.evaluate', { expression, returnByValue: true }, sessionId);
  return result.value;
};

/* Reveal every entrance element so nothing captures mid-animation, and pin the
   sticky bar to its shown state. */
await evaluate(`document.querySelectorAll('.fade-up, .fade-up-stagger')
  .forEach(el => el.classList.add('is-visible'));
  document.querySelectorAll('[data-sticky-bar]').forEach(el => el.classList.add('is-in'));`);

/* Kill smooth scrolling for the duration of the capture. global.css sets
   `scroll-behavior: smooth` on <html> — a real UX decision, and the reason two
   earlier attempts produced images with a duplicated strip of page: scrollTo()
   ANIMATES, so the offset read back and the pixels captured belonged to
   different moments. Nothing about the layout changes; only the scrolling. */
await evaluate(`(() => {
  const style = document.createElement('style');
  style.textContent = 'html, :root { scroll-behavior: auto !important; }';
  document.head.append(style);
})()`);
await sleep(600);

/** Wait until the scroll offset stops moving, then return where it settled. */
const settledScrollY = async () => {
  let previous = -1;
  for (let i = 0; i < 20; i++) {
    const y = await evaluate('window.scrollY');
    if (y === previous) return Math.round(y);
    previous = y;
    await sleep(60);
  }
  return Math.round(previous);
};

const pageHeight = await evaluate('document.documentElement.scrollHeight');
const tileTops = [];
for (let y = 0; y < pageHeight; y += HEIGHT) {
  tileTops.push(Math.min(y, Math.max(pageHeight - HEIGHT, 0)));
}

const tiles = [];
for (const [index, requested] of tileTops.entries()) {
  await evaluate(`window.scrollTo(0, ${requested})`);

  /* After the first tile, fixed and sticky chrome would repeat in every frame.
     `visibility` rather than `display`, so nothing reflows mid-capture. */
  if (index === 1) {
    await evaluate(`window.__shotHidden = [...document.querySelectorAll('body *')].filter(el => {
      const p = getComputedStyle(el).position;
      return p === 'fixed' || p === 'sticky';
    });
    window.__shotHidden.forEach(el => { el.style.visibility = 'hidden'; });`);
  }

  /* Composite at the offset the browser ACTUALLY settled on, not the one asked
     for: the last tile is clamped to the maximum scroll, and lazy content can
     shift things by a few pixels. */
  const actual = await settledScrollY();
  await sleep(index === 0 ? 400 : 200);

  const shot = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
  tiles.push({ top: actual, buffer: Buffer.from(shot.data, 'base64') });
}

/* Each tile contributes ONLY the rows between its own offset and the next
   tile's, so no row can ever be drawn twice. Compositing whole 900px tiles and
   letting them overlap looks equivalent but is not: a tile's pixels and its
   reported scroll offset can disagree by a dozen pixels, and the overlap then
   repeats a strip of the page — it duplicated a paragraph and a form label in
   the middle of the enquiry band, which reads as a rendering bug in the
   component. Cropping to the exact delta removes the failure mode rather than
   narrowing it. */
const slices = await Promise.all(
  tiles.map(async (tile, i) => {
    const nextTop = i + 1 < tiles.length ? tiles[i + 1].top : pageHeight;
    const height = Math.max(1, Math.min(nextTop - tile.top, HEIGHT));
    return {
      input: await sharp(tile.buffer)
        .extract({ left: 0, top: 0, width: WIDTH, height })
        .png()
        .toBuffer(),
      top: tile.top,
      left: 0,
    };
  }),
);

await sharp({
  create: {
    width: WIDTH, height: pageHeight, channels: 3,
    background: { r: 255, g: 255, b: 255 },
  },
})
  .composite(slices)
  .png()
  .toFile(out);

console.log(`${out} — ${WIDTH}x${pageHeight} from ${tiles.length} viewport tiles at ${WIDTH}x${HEIGHT}`);
ws.close();
process.exit(0);
