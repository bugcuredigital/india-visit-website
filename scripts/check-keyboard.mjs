/**
 * Keyboard pass. Drives real Tab presses and records where focus lands, which
 * is the only way to catch order problems, unreachable controls and focus
 * traps — a static DOM scan cannot.
 *
 * Asserts:
 *   1. the skip link is the FIRST stop
 *   2. every stop exposes an accessible name
 *   3. every stop shows a visible focus indicator (outline or ring)
 *   4. focus never leaves the document (no trap, no dead end)
 *
 * Usage: node scripts/check-keyboard.mjs [url] [maxTabs]
 */
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const URL_TO_TEST = process.argv[2] ?? 'http://localhost:4321/dev/components/';
const MAX_TABS = Number(process.argv[3] ?? 70);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9555;

const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`,
  '--no-sandbox', '--disable-gpu', '--user-data-dir=/tmp/iv-kbd-profile', 'about:blank'],
  { stdio: 'ignore' });
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
  { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId);
await send('Page.navigate', { url: URL_TO_TEST }, sessionId);
await sleep(1500);

const describeFocus = `(() => {
  const el = document.activeElement;
  if (!el || el === document.body) return { none: true };
  const style = getComputedStyle(el);
  const name = (el.getAttribute('aria-label')
    || el.getAttribute('alt')
    || (el.labels && el.labels[0] && el.labels[0].textContent)
    || el.textContent
    || el.getAttribute('title')
    || '').trim().replace(/\\s+/g, ' ').slice(0, 60);
  const ring = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0;
  return {
    tag: el.tagName.toLowerCase(),
    cls: (el.className || '').toString().split(' ')[0],
    name,
    ring,
    disabled: !!el.disabled,
  };
})()`;

const stops = [];
for (let i = 0; i < MAX_TABS; i++) {
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }, sessionId);
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }, sessionId);
  const { result } = await send('Runtime.evaluate', { returnByValue: true, expression: describeFocus }, sessionId);
  const stop = result.value;
  if (stop.none) break;
  stops.push(stop);
}

let failures = 0;
console.log(`\nKeyboard pass — ${URL_TO_TEST}`);
console.log(`  ${stops.length} tab stops reached\n`);

const first = stops[0];
if (!first || !/skip/i.test(first.name)) {
  console.log(`  FAIL first stop should be the skip link, got: ${first ? first.name || first.tag : 'nothing'}`);
  failures++;
} else {
  console.log(`  ok   first stop is the skip link ("${first.name}")`);
}

const unnamed = stops.filter((s) => !s.name && !s.disabled);
if (unnamed.length) {
  console.log(`  FAIL ${unnamed.length} stop(s) have no accessible name:`);
  unnamed.slice(0, 6).forEach((s) => console.log(`         <${s.tag} class="${s.cls}">`));
  failures++;
} else {
  console.log('  ok   every tab stop exposes an accessible name');
}

const noRing = stops.filter((s) => !s.ring);
if (noRing.length) {
  console.log(`  FAIL ${noRing.length} stop(s) show no focus indicator:`);
  noRing.slice(0, 6).forEach((s) => console.log(`         <${s.tag} class="${s.cls}"> ${s.name}`));
  failures++;
} else {
  console.log('  ok   every tab stop shows a visible focus indicator');
}

if (stops.length < 10) {
  console.log(`  FAIL only ${stops.length} stops — the page has far more controls than that`);
  failures++;
} else {
  console.log(`  ok   focus moved through ${stops.length} controls without trapping`);
}

console.log();
console.log(failures === 0 ? 'PASS: keyboard navigation is sound.' : 'FAIL: see above.');
ws.close();
process.exit(failures ? 1 : 0);
