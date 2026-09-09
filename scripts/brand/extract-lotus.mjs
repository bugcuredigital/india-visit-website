/**
 * Extract the lotus glyph from the brand kit PDF as true vector.
 * ---------------------------------------------------------------------------
 * The client (BugCure), who authored the brand kit, authorised recreating the
 * lotus because no standalone vector file was supplied. It turns out no
 * *tracing* is needed: page 7 of docs/brand/india_visit_brand_kit.pdf draws
 * the lotus as Bezier paths filled in brand burgundy (.4549 .0706 .2196 rg =
 * #741238). This script interprets that page's content stream and converts
 * those paths to SVG, so the result is geometrically identical to the
 * original artwork rather than an approximation of it.
 *
 * Output: src/assets/brand/lotus.svg — single colour, fill="currentColor", so
 * one file inherits crimson / plum / white from whatever context uses it.
 *
 * Usage: node scripts/brand/extract-lotus.mjs [--page N] [--out path]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PDF = join(ROOT, 'docs/brand/india_visit_brand_kit.pdf');
const argv = process.argv.slice(2);
const PAGE = Number(argv[argv.indexOf('--page') + 1] || 7);
const OUT = argv.includes('--out')
  ? argv[argv.indexOf('--out') + 1]
  : join(ROOT, 'src/assets/brand/lotus.svg');

/** The lotus fill, as written in the PDF. */
const TARGET = [0.4549, 0.0706, 0.2196];
const NEAR = (a, b) => Math.abs(a - b) < 0.02;

const pdf = readFileSync(PDF);

function objStream(num) {
  const re = new RegExp(`(?<![0-9])${num}\\s+0\\s+obj`, 'g');
  const m = re.exec(pdf.toString('latin1'));
  if (!m) throw new Error(`object ${num} not found`);
  let p = pdf.indexOf('stream', m.index) + 6;
  if (pdf[p] === 0x0d && pdf[p + 1] === 0x0a) p += 2;
  else if (pdf[p] === 0x0a || pdf[p] === 0x0d) p += 1;
  const end = pdf.indexOf('endstream', p);
  const raw = pdf.subarray(p, end);
  try { return inflateSync(raw).toString('latin1'); } catch { return raw.toString('latin1'); }
}

// Page objects, in document order -> their /Contents stream numbers.
const text = pdf.toString('latin1');
const contents = [];
for (const m of text.matchAll(/\/Type\s*\/Page[^s]/g)) {
  const seg = text.slice(m.index, m.index + 900);
  const c = seg.match(/\/Contents\s+(\d+)\s+0\s+R/);
  if (c) contents.push(Number(c[1]));
}
const stream = objStream(contents[PAGE - 1]);

/* ---- minimal PDF content-stream interpreter ---------------------------- */
// Matrix [a b c d e f]: (x,y) -> (a x + c y + e, b x + d y + f)
const mul = (m, n) => [
  m[0] * n[0] + m[1] * n[2], m[0] * n[1] + m[1] * n[3],
  m[2] * n[0] + m[3] * n[2], m[2] * n[1] + m[3] * n[3],
  m[4] * n[0] + m[5] * n[2] + n[4], m[4] * n[1] + m[5] * n[3] + n[5],
];
const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

const tokens = stream.match(/-?\d*\.?\d+|\/[^\s/<>\[\]()]+|[A-Za-z*']+|<<|>>|\[|\]/g) ?? [];
let ctm = [1, 0, 0, 1, 0, 0];
let fill = [0, 0, 0];
const stack = [];
const operands = [];
let cur = [];            // current subpath commands (already in device space)
let curStart = null;
const collected = [];    // { d, fill }

const num = (i) => Number(operands[operands.length + i]);

for (const t of tokens) {
  if (/^-?\d*\.?\d+$/.test(t)) { operands.push(t); continue; }
  if (t.startsWith('/') || t === '<<' || t === '>>' || t === '[' || t === ']') { operands.push(t); continue; }

  switch (t) {
    case 'q': stack.push({ ctm, fill }); operands.length = 0; break;
    case 'Q': { const s = stack.pop(); if (s) { ctm = s.ctm; fill = s.fill; } operands.length = 0; break; }
    case 'cm': ctm = mul([num(-6), num(-5), num(-4), num(-3), num(-2), num(-1)], ctm); operands.length = 0; break;
    case 'rg': fill = [num(-3), num(-2), num(-1)]; operands.length = 0; break;
    case 'g': { const v = num(-1); fill = [v, v, v]; operands.length = 0; break; }
    case 'k': { // CMYK -> RGB, good enough for colour matching
      const [c, m2, y2, k] = [num(-4), num(-3), num(-2), num(-1)];
      fill = [(1 - c) * (1 - k), (1 - m2) * (1 - k), (1 - y2) * (1 - k)];
      operands.length = 0; break;
    }
    case 'm': { const [x, y] = apply(ctm, num(-2), num(-1)); cur.push(`M${x.toFixed(2)} ${y.toFixed(2)}`); curStart = [x, y]; operands.length = 0; break; }
    case 'l': { const [x, y] = apply(ctm, num(-2), num(-1)); cur.push(`L${x.toFixed(2)} ${y.toFixed(2)}`); operands.length = 0; break; }
    case 'c': {
      const [x1, y1] = apply(ctm, num(-6), num(-5));
      const [x2, y2] = apply(ctm, num(-4), num(-3));
      const [x3, y3] = apply(ctm, num(-2), num(-1));
      cur.push(`C${x1.toFixed(2)} ${y1.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)} ${x3.toFixed(2)} ${y3.toFixed(2)}`);
      operands.length = 0; break;
    }
    case 'v': { // current point as first control
      const [x2, y2] = apply(ctm, num(-4), num(-3));
      const [x3, y3] = apply(ctm, num(-2), num(-1));
      cur.push(`S${x2.toFixed(2)} ${y2.toFixed(2)} ${x3.toFixed(2)} ${y3.toFixed(2)}`);
      operands.length = 0; break;
    }
    case 'y': {
      const [x1, y1] = apply(ctm, num(-4), num(-3));
      const [x3, y3] = apply(ctm, num(-2), num(-1));
      cur.push(`C${x1.toFixed(2)} ${y1.toFixed(2)} ${x3.toFixed(2)} ${y3.toFixed(2)} ${x3.toFixed(2)} ${y3.toFixed(2)}`);
      operands.length = 0; break;
    }
    case 're': {
      const [x, y, w, h] = [num(-4), num(-3), num(-2), num(-1)];
      const p1 = apply(ctm, x, y), p2 = apply(ctm, x + w, y), p3 = apply(ctm, x + w, y + h), p4 = apply(ctm, x, y + h);
      cur.push(`M${p1[0].toFixed(2)} ${p1[1].toFixed(2)}L${p2[0].toFixed(2)} ${p2[1].toFixed(2)}L${p3[0].toFixed(2)} ${p3[1].toFixed(2)}L${p4[0].toFixed(2)} ${p4[1].toFixed(2)}Z`);
      operands.length = 0; break;
    }
    case 'h': if (cur.length) cur.push('Z'); operands.length = 0; break;
    case 'f': case 'F': case 'f*': case 'B': case 'B*': case 'b': case 'b*': {
      if (cur.length) collected.push({ d: cur.join(''), fill: [...fill] });
      cur = []; operands.length = 0; break;
    }
    case 'S': case 's': case 'n': cur = []; operands.length = 0; break;
    default: operands.length = 0;
  }
}

const lotus = collected.filter((p) => p.fill.every((v, i) => NEAR(v, TARGET[i])));
console.log(`page ${PAGE}: ${collected.length} filled paths, ${lotus.length} in brand burgundy`);
if (!lotus.length) throw new Error('no burgundy lotus paths found on this page');

/* ---- normalise into a tight, square-ish viewBox ------------------------ */
const nums = lotus.flatMap((p) => [...p.d.matchAll(/-?\d+\.?\d*/g)].map((m) => Number(m[0])));
const xs = nums.filter((_, i) => i % 2 === 0), ys = nums.filter((_, i) => i % 2 === 1);
const minX = Math.min(...xs), maxX = Math.max(...xs);
const minY = Math.min(...ys), maxY = Math.max(...ys);
const w = maxX - minX, h = maxY - minY;
console.log(`  bounds ${w.toFixed(1)} x ${h.toFixed(1)} (aspect ${(w / h).toFixed(3)})`);

// Rewrite coordinates translated to the origin, rounded to 2dp.
const shift = (d) => d.replace(/(-?\d+\.?\d*)\s+(-?\d+\.?\d*)/g,
  (_, a, b) => `${(Number(a) - minX).toFixed(2)} ${(Number(b) - minY).toFixed(2)}`);
const paths = lotus.map((p) => shift(p.d)).join(' ');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w.toFixed(2)} ${h.toFixed(2)}" fill="currentColor" role="img" aria-hidden="true">
  <!-- India Visit lotus. Vector paths extracted verbatim from page ${PAGE} of the
       brand kit PDF (fill .4549 .0706 .2196 = #741238) — geometrically identical
       to the original artwork, not a trace. Regenerate: npm run brand:lotus -->
  <path fill-rule="evenodd" d="${paths}"/>
</svg>
`;
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, svg);
console.log(`  wrote ${OUT} (${(svg.length / 1024).toFixed(1)}KB, ${lotus.length} subpaths)`);
