/**
 * Full-page screenshots at a realistic viewport.
 * ---------------------------------------------------------------------------
 * Naive headless captures get this wrong twice over:
 *   1. a tall --window-size distorts the layout, because `svh`-based heroes
 *      size themselves against the viewport
 *   2. below-fold content is mid-entrance-animation, so it captures as blank
 *
 * So: set a NORMAL viewport, mark every entrance element as already revealed,
 * then capture beyond the viewport in one pass.
 *
 * Usage: node scripts/screenshot.mjs <url> <out.png> [width] [height]
 */
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import { writeFileSync } from 'node:fs';

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
  return new Promise((res, rej) => { pending.set(n, { res, rej }); ws.send(JSON.stringify({ id: n, method, params, sessionId })); });
};

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
await send('Page.enable', {}, sessionId);
await send('Runtime.enable', {}, sessionId);
await send('Emulation.setDeviceMetricsOverride',
  { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: WIDTH < 768 }, sessionId);
await send('Page.navigate', { url }, sessionId);
await sleep(1800);

// Reveal every entrance element so nothing captures mid-animation.
await send('Runtime.evaluate', {
  expression: `document.querySelectorAll('.fade-up, .fade-up-stagger')
    .forEach(el => el.classList.add('is-visible'));
    document.querySelectorAll('[data-sticky-bar]').forEach(el => el.classList.add('is-in'));`,
}, sessionId);
await sleep(600);

const { result } = await send('Runtime.evaluate', {
  returnByValue: true,
  expression: 'JSON.stringify({ h: document.documentElement.scrollHeight, w: document.documentElement.scrollWidth })',
}, sessionId);
const { h, w } = JSON.parse(result.value);

const shot = await send('Page.captureScreenshot', {
  format: 'png',
  captureBeyondViewport: true,
  clip: { x: 0, y: 0, width: w, height: h, scale: 1 },
}, sessionId);

writeFileSync(out, Buffer.from(shot.data, 'base64'));
console.log(`${out} — ${w}x${h} at ${WIDTH}px viewport`);
ws.close();
process.exit(0);
