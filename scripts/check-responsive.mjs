/**
 * Horizontal-overflow check across the supported range (360px–1440px).
 * "Works 360px–1440px" is in CLAUDE.md's definition of done, and a screenshot
 * cannot prove it — headless window sizes are clamped by the OS, so a clipped
 * capture is not evidence either way. This measures scrollWidth vs the layout
 * viewport over CDP instead.
 *
 * Usage: node scripts/check-responsive.mjs [url] [...widths]
 * Requires a preview server already running. No npm dependencies (uses the
 * Node built-in WebSocket, Node 22+).
 */
import { spawn } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';

const URL_TO_TEST = process.argv[2] ?? 'http://localhost:4321/';
const WIDTHS = process.argv.slice(3).length
  ? process.argv.slice(3).map(Number)
  : [360, 390, 412, 768, 1024, 1280, 1440];

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9222;

const chrome = spawn(CHROME, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  '--no-sandbox',
  '--disable-gpu',
  '--user-data-dir=/tmp/iv-responsive-profile',
  'about:blank',
], { stdio: 'ignore' });

const cleanup = () => { try { chrome.kill(); } catch {} };
process.on('exit', cleanup);

async function getWsUrl() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      const json = await res.json();
      if (json.webSocketDebuggerUrl) return json.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error('Chrome DevTools endpoint never came up');
}

const ws = new WebSocket(await getWsUrl());
await new Promise((resolve, reject) => {
  ws.onopen = resolve;
  ws.onerror = reject;
});

let nextId = 1;
const pending = new Map();
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
  }
};

function send(method, params = {}, sessionId) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
}

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
await send('Page.enable', {}, sessionId);
await send('Runtime.enable', {}, sessionId);

let failed = false;
console.log(`\nHorizontal-overflow check — ${URL_TO_TEST}\n`);
console.log('  width   scrollWidth   status   widest offending element');
console.log('  ' + '-'.repeat(68));

for (const width of WIDTHS) {
  await send('Emulation.setDeviceMetricsOverride', {
    width, height: 900, deviceScaleFactor: 1, mobile: width < 768,
  }, sessionId);
  await send('Page.navigate', { url: URL_TO_TEST }, sessionId);
  await sleep(700);

  const { result } = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const vw = document.documentElement.clientWidth;
      const sw = document.documentElement.scrollWidth;
      let worst = null;
      if (sw > vw) {
        for (const el of document.querySelectorAll('*')) {
          const r = el.getBoundingClientRect();
          if (r.right > vw + 1) {
            const over = Math.round(r.right - vw);
            if (!worst || over > worst.over) {
              worst = { over, tag: el.tagName.toLowerCase(),
                        cls: (el.className || '').toString().slice(0, 40) };
            }
          }
        }
      }
      return { vw, sw, worst };
    })()`,
  }, sessionId);

  const { vw, sw, worst } = result.value;
  const overflows = sw > vw + 1;
  if (overflows) failed = true;
  const detail = worst ? `<${worst.tag} class="${worst.cls}"> +${worst.over}px` : '—';
  console.log(
    `  ${String(width).padStart(5)}   ${String(sw).padStart(11)}   ` +
    `${(overflows ? 'OVERFLOW' : 'ok').padEnd(8)} ${detail}`
  );
}

console.log();
console.log(failed
  ? 'FAIL: horizontal overflow found — the page must never scroll sideways.'
  : 'PASS: no horizontal overflow from 360px to 1440px.');

ws.close();
cleanup();
process.exit(failed ? 1 : 0);
