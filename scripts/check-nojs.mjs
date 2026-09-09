/**
 * No-JS content check.
 * Entrance animations start content at opacity 0 and rely on script to reveal
 * it, so a scripting failure could hide whole sections. This asserts that with
 * script execution DISABLED every animated element is still fully visible.
 *
 * Usage: node scripts/check-nojs.mjs [url]
 */
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const URL_TO_TEST = process.argv[2] ?? 'http://localhost:4321/dev/components/';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9333;

const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`,
  '--no-sandbox', '--disable-gpu', '--user-data-dir=/tmp/iv-nojs-profile', 'about:blank'],
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
await send('Emulation.setEmulatedMedia',
  { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] }, sessionId);

let failures = 0;
for (const scripting of [true, false]) {
  await send('Emulation.setScriptExecutionDisabled', { value: !scripting }, sessionId);
  await send('Page.navigate', { url: URL_TO_TEST }, sessionId);
  await sleep(1400);
  const { result } = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const els = [...document.querySelectorAll('.fade-up, .fade-up-stagger > *')];
      const hidden = els.filter(el => Number(getComputedStyle(el).opacity) < 0.99);
      return { total: els.length, hidden: hidden.length,
               sample: hidden.slice(0,3).map(e => e.tagName.toLowerCase() + '.' + (e.className||'').toString().slice(0,30)) };
    })()`,
  }, sessionId);
  const { total, hidden, sample } = result.value;
  const label = scripting ? 'scripting ENABLED ' : 'scripting DISABLED';
  if (!scripting && hidden > 0) {
    console.log(`  ${label}: ${hidden}/${total} animated elements INVISIBLE — content loss`);
    console.log(`    e.g. ${sample.join(', ')}`);
    failures++;
  } else if (!scripting) {
    console.log(`  ${label}: 0/${total} hidden — all content visible without JS`);
  } else {
    console.log(`  ${label}: ${total} animated elements found, ${hidden} still mid-animation (fine)`);
  }
}

console.log();
console.log(failures === 0
  ? 'PASS: entrance animations degrade to plain visible content without JavaScript.'
  : 'FAIL: content is hidden when JavaScript does not run.');
ws.close();
process.exit(failures ? 1 : 0);
