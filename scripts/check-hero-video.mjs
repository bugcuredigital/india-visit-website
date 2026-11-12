/**
 * Hero-video LCP-safety check.
 * ---------------------------------------------------------------------------
 * The homepage hero carries a background clip, and PRD §12 makes the pattern
 * mandatory rather than advisory. The rules are easy to state and easy to
 * break by accident — someone adds a `src`, someone drops `preload="none"`,
 * someone "simplifies" the boot script — and every one of those breaks costs
 * megabytes on the critical path while the page still *looks* perfect. So the
 * rules get a test.
 *
 * What is asserted, against a real browser and a real network log:
 *
 *   1. The served HTML contains NO video source and `preload="none"` — the
 *      static half, checked before a browser is involved.
 *   2. Nothing requests the clip before `window.load` fires.
 *   3. After load, sources attach, the element reaches `is-ready`, and it is
 *      actually playing (currentTime advances). A video that never plays is a
 *      3MB download for a still frame.
 *   4. `prefers-reduced-motion: reduce` never requests the clip AT ALL.
 *   5. `Save-Data: on` never requests the clip AT ALL.
 *
 * 4 and 5 are the ones worth having a machine check. "We respect Save-Data" is
 * trivially satisfiable by hiding the video after downloading it, which helps
 * nobody and is indistinguishable from the real thing by eye.
 *
 * Usage: node scripts/check-hero-video.mjs [url]   (default http://localhost:4321/)
 */
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const url = process.argv[2] ?? 'http://localhost:4321/';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9446;
const VIDEO_PATTERN = /\.(mp4|webm)(\?|$)/i;

const failures = [];
const notes = [];
const check = (ok, message) => {
  (ok ? notes : failures).push(`${ok ? 'ok  ' : 'FAIL'}  ${message}`);
  return ok;
};

/* ------------------------------------------------- 1. the static half ----- */
const html = await (await fetch(url)).text();
const videoTag = html.match(/<video\b[^>]*>([\s\S]*?)<\/video>/i);

if (!videoTag) {
  console.error(`No <video> element at ${url} — nothing to check.`);
  process.exit(1);
}

check(/preload="none"/i.test(videoTag[0]), 'served <video> carries preload="none"');
check(!/\ssrc=/i.test(videoTag[0]), 'served <video> has no src attribute');
check(!/<source\b/i.test(videoTag[1]), 'served <video> has no <source> children');
check(!/\sposter=/i.test(videoTag[0]), 'served <video> has no poster attribute (the <picture> is the poster)');

/* ------------------------------------------------- the browser half ------- */
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-sandbox',
    '--disable-gpu',
    '--autoplay-policy=no-user-gesture-required',
    '--user-data-dir=/tmp/iv-herovideo-profile',
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
const listeners = [];
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { res, rej } = pending.get(message.id);
    pending.delete(message.id);
    message.error ? rej(new Error(JSON.stringify(message.error))) : res(message.result);
    return;
  }
  for (const listener of listeners) listener(message);
};
const send = (method, params = {}, sessionId) => {
  const n = id++;
  return new Promise((res, rej) => {
    pending.set(n, { res, rej });
    ws.send(JSON.stringify({ id: n, method, params, sessionId }));
  });
};

/**
 * Loads the page in a fresh tab and reports what happened to the video.
 * `beforeLoad` is injected into a clean document, which is the only way to
 * fake `navigator.connection` convincingly — patching it after the script has
 * already read it would test nothing.
 */
async function run({ label, reducedMotion = false, saveData = false, settle = 4000 }) {
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

  const requests = [];
  let loadFiredAt = null;
  const started = Date.now();
  const listener = (message) => {
    if (message.sessionId !== sessionId) return;
    if (message.method === 'Network.requestWillBeSent' && VIDEO_PATTERN.test(message.params.request.url)) {
      requests.push({ url: message.params.request.url, at: Date.now() - started });
    }
    if (message.method === 'Page.loadEventFired') loadFiredAt = Date.now() - started;
  };
  listeners.push(listener);

  await send('Page.enable', {}, sessionId);
  await send('Network.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);
  await send(
    'Emulation.setDeviceMetricsOverride',
    { width: 390, height: 844, deviceScaleFactor: 1, mobile: true },
    sessionId,
  );
  if (reducedMotion) {
    await send(
      'Emulation.setEmulatedMedia',
      { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] },
      sessionId,
    );
  }
  if (saveData) {
    await send(
      'Page.addScriptToEvaluateOnNewDocument',
      {
        source: `Object.defineProperty(navigator, 'connection', {
          configurable: true,
          get: () => ({ saveData: true, effectiveType: '4g' }),
        });`,
      },
      sessionId,
    );
  }

  await send('Page.navigate', { url }, sessionId);
  await sleep(settle);

  const { result } = await send(
    'Runtime.evaluate',
    {
      expression: `(() => {
        const el = document.querySelector('[data-hero-video]');
        if (!el) return { missing: true };
        return {
          sources: el.querySelectorAll('source').length,
          ready: el.classList.contains('is-ready'),
          currentTime: el.currentTime,
          paused: el.paused,
          preload: el.preload,
        };
      })()`,
      returnByValue: true,
    },
    sessionId,
  );

  listeners.splice(listeners.indexOf(listener), 1);
  await send('Target.closeTarget', { targetId });

  return { label, requests, loadFiredAt, state: result.value };
}

/* ---- 2 + 3. the default path --------------------------------------------- */
const normal = await run({ label: 'default' });

check(normal.state.sources > 0, 'default: sources attach after load');
check(normal.state.ready === true, 'default: video reaches is-ready');
check(normal.state.currentTime > 0 && !normal.state.paused, 'default: video is actually playing');
check(normal.requests.length > 0, 'default: the clip is requested');

if (normal.requests.length && normal.loadFiredAt !== null) {
  const earliest = Math.min(...normal.requests.map((r) => r.at));
  check(
    earliest >= normal.loadFiredAt,
    `default: clip requested AFTER window.load (load ${normal.loadFiredAt}ms, first request ${earliest}ms)`,
  );
}

/* ---- 4 + 5. the two opt-outs --------------------------------------------- */
for (const [label, options] of [
  ['prefers-reduced-motion: reduce', { reducedMotion: true }],
  ['Save-Data: on', { saveData: true }],
]) {
  const result = await run({ label, ...options, settle: 3500 });
  check(result.requests.length === 0, `${label}: the clip is never requested (${result.requests.length} request(s))`);
  check(result.state.sources === 0, `${label}: no <source> is attached`);
  check(result.state.ready === false, `${label}: the poster stays, video never revealed`);
}

/* --------------------------------------------------------------- report --- */
console.log(`\nHero video — ${url}\n`);
for (const line of [...notes, ...failures]) console.log(`  ${line}`);

if (failures.length) {
  console.error(`\n  ${failures.length} check(s) FAILED. See PRD §12 for the required pattern.`);
  process.exit(1);
}
console.log(`\n  ${notes.length} checks passed.`);
process.exit(0);
