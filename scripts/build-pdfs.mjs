#!/usr/bin/env node
/**
 * pdf:build — the twenty branded itinerary PDFs, printed from the pages.
 * ---------------------------------------------------------------------------
 * PRD §8.1 makes the itinerary PDF a gated lead magnet; Template Spec §6 says
 * the gated PDF must match the web page section-for-section, with the CMS
 * entry as the single source of truth. The simplest way to guarantee that is
 * to not have a second renderer at all: this script opens each built journey
 * page in headless Chrome, expands every day, switches to the print
 * stylesheet (src/styles/global.css, `@media print`) and prints it. The PDF
 * is the page. Regenerate whenever content changes; the files are committed
 * because Cloudflare's build image has no Chrome.
 *
 * Runs against the preview server (`npm run preview` first). Writes
 * public/downloads/<slug>.pdf for every journey in dist/journeys/. No npm
 * dependencies — Chrome over CDP with Node's built-in WebSocket, the same
 * harness as the other checks.
 *
 * Usage: node scripts/build-pdfs.mjs [slug ...]
 */
import { spawn } from 'node:child_process';
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist', 'journeys');
const OUT = join(ROOT, 'public', 'downloads');
const BASE = 'http://localhost:4321';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9451;

const wanted = process.argv.slice(2);
const slugs = (await readdir(DIST, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((slug) => !wanted.length || wanted.includes(slug))
  .sort();

if (!slugs.length) {
  console.error('No journey pages in dist/journeys — run `npm run build` first.');
  process.exit(1);
}

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--no-sandbox',
    '--disable-gpu',
    '--user-data-dir=/tmp/iv-pdf-profile',
    'about:blank',
  ],
  { stdio: 'ignore' },
);
const cleanup = () => {
  try {
    chrome.kill();
  } catch {}
};
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
const send = (method, params = {}, sessionId) =>
  new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
await send('Page.enable', {}, sessionId);
await send('Runtime.enable', {}, sessionId);
await send('Emulation.setDeviceMetricsOverride', { width: 1024, height: 1400, deviceScaleFactor: 1, mobile: false }, sessionId);

await mkdir(OUT, { recursive: true });

console.log(`\nBranded itinerary PDFs — ${slugs.length} journey page(s)\n`);
let failures = 0;

for (const slug of slugs) {
  const url = `${BASE}/journeys/${slug}/`;
  await send('Page.navigate', { url }, sessionId);
  await sleep(1200);

  /* Open every day and the intro; let lazy images load; then confirm the
     sections the Template Spec requires are present, so a PDF is never
     printed from a page that is missing one. */
  const { result } = await send(
    'Runtime.evaluate',
    {
      returnByValue: true,
      awaitPromise: true,
      expression: `(async () => {
        document.querySelectorAll('details').forEach((d) => { d.open = true; });
        document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; });
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((r) => setTimeout(r, 900));
        window.scrollTo(0, 0);
        const required = ['#introduction', '.day', '.badge--duration', '.routestrip', '.quickfacts'];
        const missing = required.filter((sel) => !document.querySelector(sel));
        return { title: document.title, days: document.querySelectorAll('details.day').length, missing };
      })()`,
    },
    sessionId,
  );
  const page = result.value;
  if (page.missing.length) {
    failures++;
    console.log(`  ✗ ${slug}  missing ${page.missing.join(', ')} — not printed`);
    continue;
  }

  await send('Emulation.setEmulatedMedia', { media: 'print' }, sessionId);
  const { data } = await send(
    'Page.printToPDF',
    {
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      transferMode: 'ReturnAsBase64',
    },
    sessionId,
  );
  await send('Emulation.setEmulatedMedia', { media: '' }, sessionId);

  const file = join(OUT, `${slug}.pdf`);
  await writeFile(file, Buffer.from(data, 'base64'));
  const { size } = await stat(file);
  console.log(`  ✓ ${slug.padEnd(40)} ${page.days} days  ${(size / 1024).toFixed(0).padStart(5)} KB`);
}

console.log(failures ? `\nFAIL: ${failures} page(s) were not printed.\n` : `\nPASS: ${slugs.length} PDF(s) written to public/downloads/.\n`);
ws.close();
cleanup();
process.exit(failures ? 1 : 0);
