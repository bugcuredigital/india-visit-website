/**
 * Horizontal-overflow check across the supported range (360px–1440px).
 * "Works 360px–1440px" is in CLAUDE.md's definition of done, and a screenshot
 * cannot prove it — headless window sizes are clamped by the OS, so a clipped
 * capture is not evidence either way. This measures scrollWidth vs the layout
 * viewport over CDP instead.
 *
 * TWO checks, because scrollWidth alone is not enough:
 *   1. document scrollWidth vs the layout viewport — the page-level scrollbar
 *   2. CLIPPED overflow — content wider than the viewport inside an
 *      `overflow: clip/hidden` ancestor. This produces NO document scrollbar,
 *      so check 1 passes while the content is genuinely cut off. It is how the
 *      hero's grid blowout (a 775px content box inside a 390px hero, headline
 *      and both CTAs sliced off) got as far as a screenshot in M4. Any element
 *      wider than the viewport is reported, whether or not it scrolls the page.
 *      Deliberate internal scrollers opt out with `data-allow-clip`.
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
console.log('  ' + '-'.repeat(74));

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
      const label = (el) => ({
        tag: el.tagName.toLowerCase(),
        // SVG's .className is an SVGAnimatedString, not a string.
        cls: (el.getAttribute('class') || '').slice(0, 40),
      });

      /* SVG internals are not layout boxes: a <path> routinely extends past
         its <svg> viewBox, and the clipping is intrinsic to SVG rather than a
         responsive bug. The root <svg> itself IS measured. */
      const isSvgInternal = (el) => el.parentElement instanceof SVGElement;

      let worst = null;
      const consider = (el, over) => {
        if (!worst || over > worst.over) worst = { over, ...label(el) };
      };

      // 1. anything sticking out past the viewport, scrollbar or not
      for (const el of document.querySelectorAll('body *')) {
        if (el.closest('[data-allow-clip]') || isSvgInternal(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const over = Math.max(r.right - vw, r.width - vw);
        if (over > 1) consider(el, Math.round(over));
      }

      // 2. content clipped inside an overflow:clip/hidden box. This is the
      //    case check 1 cannot see: no page scrollbar, content just gone.
      //    The opt-out is honoured on EITHER side — the clipping box or the
      //    overflowing child — because "scrolls/clips on purpose" is a fact
      //    about that pair, and marking the child is the natural place for
      //    something like the Ken Burns wrapper.
      let clipped = null;
      for (const el of document.querySelectorAll('body *')) {
        if (el.closest('[data-allow-clip]') || el instanceof SVGElement) continue;
        const cs = getComputedStyle(el);
        if (cs.overflowX !== 'clip' && cs.overflowX !== 'hidden') continue;
        for (const child of el.children) {
          if (child.hasAttribute('data-allow-clip')) continue;
          const over = Math.round(child.getBoundingClientRect().width - el.clientWidth);
          if (over > 1 && (!clipped || over > clipped.over)) {
            clipped = { over, ...label(el), child: label(child) };
          }
        }
      }

      return { vw, sw, worst, clipped };
    })()`,
  }, sessionId);

  const { vw, sw, worst, clipped } = result.value;
  const scrolls = sw > vw + 1;
  const bad = scrolls || Boolean(worst) || Boolean(clipped);
  if (bad) failed = true;

  const status = scrolls ? 'OVERFLOW' : clipped || worst ? 'CLIPPED' : 'ok';
  const hit = worst ?? clipped;
  const detail = hit ? `<${hit.tag} class="${hit.cls}"> +${hit.over}px` : '—';
  console.log(
    `  ${String(width).padStart(5)}   ${String(sw).padStart(11)}   ` +
    `${status.padEnd(8)} ${detail}`
  );
  if (clipped) {
    console.log(
      `          └─ clipped inside <${clipped.tag} class="${clipped.cls}">: ` +
      `child <${clipped.child.tag} class="${clipped.child.cls}"> is ` +
      `${clipped.over}px wider — no page scrollbar, content simply cut off`
    );
  }
}

console.log();
console.log(failed
  ? 'FAIL: horizontal overflow or clipped content found — the page must never\n      scroll sideways, and must never hide content behind an overflow box.'
  : 'PASS: no horizontal overflow and no clipped content, 360px to 1440px.');

ws.close();
cleanup();
process.exit(failed ? 1 : 0);
