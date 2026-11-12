#!/usr/bin/env node
/**
 * check:cms-images — every photograph on the site must be editable.
 * ---------------------------------------------------------------------------
 * The rule (design round 3, image control): every image and video a visitor
 * sees must arrive through a content-collection field, so that when the Tina
 * dashboard lands in M7 the client can swap any of them without a code change.
 * An image imported straight into a component is invisible to the CMS, and the
 * M5 photo swap turns from a content task into an engineering task.
 *
 * WHAT THIS ACTUALLY CHECKS. Astro resolves images through ES imports, so the
 * question "is this image CMS-fed?" is answerable statically: an image that
 * comes from content has NO import — it arrives as `entry.data.heroImage` or
 * `settings.pageHeroes.x.image`, resolved by the `image()` schema helper. So
 * any asset import inside src/pages, src/components, src/layouts or src/lib is
 * an image the CMS cannot reach, and the check is: are there any, and is each
 * one on the short list of things that are deliberately not content?
 *
 * THE EXEMPTIONS, and why each is not a loophole:
 *
 *   · `?raw` and `?url` — the file is inlined as markup or referenced as a
 *     font. The lotus glyph and the 404 road are brand furniture: they are
 *     drawn in the brand's colours, they carry no information, and an editor
 *     swapping them would be changing the logo, not the photography.
 *   · src/assets/brand/ — the logo. Same argument, and CLAUDE.md already
 *     governs it ("approved artwork only, never redrawn").
 *   · src/assets/placeholders/ — the neutral grey slots. These are what
 *     renders when a CMS field is EMPTY, which is the opposite of bypassing
 *     the CMS: each one sits behind a `?? placeholder` on a nullable field.
 *
 * Anything else fails, by name, with the file and line that introduced it.
 *
 * Exit code 0 = clean, 1 = at least one image outside the CMS.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/* fileURLToPath, not `.pathname`: this repository's path contains a space, and
   a URL pathname percent-encodes it — every readdir then silently returns
   nothing and the audit reports a triumphant zero. */
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SCAN = ['src/pages', 'src/components', 'src/layouts', 'src/lib'];

const ASSET = /\.(jpe?g|png|webp|avif|gif|svg|mp4|webm|mov)$/i;

/** [prefix, why it is allowed] — order matters only for the message. */
const EXEMPT_PATHS = [
  ['src/assets/brand/', 'brand mark — approved artwork, governed by CLAUDE.md invariant #5'],
  ['src/assets/placeholders/', 'neutral placeholder — renders when a CMS field is empty'],
  ['src/assets/fonts/', 'self-hosted font'],
];

const walk = async (dir) => {
  const out = [];
  let entries;
  try {
    entries = await readdir(join(ROOT, dir), { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(path)));
    else if (/\.(astro|ts|tsx|js|mjs)$/.test(entry.name)) out.push(path);
  }
  return out;
};

const findings = { violations: [], exempt: [] };

for (const dir of SCAN) {
  for (const file of await walk(dir)) {
    const source = await readFile(join(ROOT, file), 'utf8');
    const lines = source.split('\n');

    lines.forEach((line, index) => {
      /* Both `import x from './y.jpg'` and a bare `import './y.css'`. */
      const match = line.match(/from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/);
      if (!match) return;
      const spec = match[1] ?? match[2];
      if (!spec) return;

      const [path, query] = spec.split('?');
      if (!ASSET.test(path)) return;

      const record = { file, line: index + 1, spec };

      if (query === 'raw' || query === 'url') {
        findings.exempt.push({ ...record, why: `?${query} — inlined markup or font URL, not a content image` });
        return;
      }

      /* Resolve ../.. against the importing file's directory so the exemption
         list can be written as repo paths rather than as relative guesses. */
      const resolved = relative(ROOT, join(ROOT, file, '..', path)).replaceAll('\\', '/');
      const exemption = EXEMPT_PATHS.find(([prefix]) => resolved.startsWith(prefix));
      if (exemption) {
        findings.exempt.push({ ...record, resolved, why: exemption[1] });
        return;
      }

      findings.violations.push({ ...record, resolved });
    });
  }
}

const pad = (value, width) => String(value).padEnd(width);

console.log('\nCMS-IMAGE AUDIT — every photograph must be a content field\n');

if (findings.exempt.length) {
  console.log('  Exempt (deliberate, documented):');
  for (const item of findings.exempt) {
    console.log(`    ${pad(`${item.file}:${item.line}`, 44)} ${item.why}`);
  }
  console.log('');
}

if (findings.violations.length) {
  console.log('  NOT CMS-FED — an editor cannot change these:');
  for (const item of findings.violations) {
    console.log(`    ${pad(`${item.file}:${item.line}`, 44)} ${item.resolved}`);
  }
  console.log(
    '\n  Fix: move the image into the content collection that owns the page, or — for a\n' +
      '  fixed page with no collection of its own — into siteSettings.pageHeroes, and read\n' +
      '  it from there. See CLAUDE.md, image control.\n',
  );
  process.exit(1);
}

console.log(`  PASS — ${findings.exempt.length} exempt, 0 images outside the CMS.\n`);
