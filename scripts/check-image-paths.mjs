#!/usr/bin/env node
/**
 * check:image-paths — every image in src/content must survive a Tina Cloud save.
 * ---------------------------------------------------------------------------
 * The rule (src/content.config.ts, `cmsImage`): an image field holds
 * "/uploads/<file>" and that file exists in public/uploads/. On Tina Cloud any
 * other form is rewritten on EVERY save of the document, even a save that never
 * touched the image, and the result breaks the build. That happened on
 * 2026-11-12: a title-only save turned "../../assets/temp-photos/x.jpg" into
 * "/uploads../../assets/temp-photos/x.jpg".
 *
 * Runs before `astro build` (scripts/build.mjs) and lists EVERY offender, with
 * the file, the field and the fix, instead of Astro's first ImageNotFound. It
 * also replays Tina Cloud's own open→save mapping over every value and fails if
 * one would not come back byte for byte. Which fields are images is read from
 * the schema: every key declared with `cmsImage(image)`, so a new image field
 * joins the check automatically.
 *
 * Usage: node scripts/check-image-paths.mjs
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONTENT = join(ROOT, 'src', 'content');
const PUBLIC = join(ROOT, 'public');

/* The same pattern as CMS_IMAGE_PATH in src/content.config.ts. */
const CMS_IMAGE_PATH = /^\/uploads\/(?:[A-Za-z0-9._-]+\/)*[A-Za-z0-9._-]+\.(?:jpe?g|png|webp|avif)$/;

/* ---- Tina Cloud's media mapping, as @tinacms/graphql 2.4.11 does it ----------
   resolveMediaRelativeToCloud (document opens) and resolveMediaCloudToRelative
   (document saves), with mediaRoot "uploads". Local mode skips both, which is
   why a local smoke test cannot see this class of bug. */
const MEDIA_ROOT = '/uploads';
const ASSETS = 'https://assets.tina.io/check-client';
const ABSOLUTE_URL = /^https?:\/\//;
const toCloud = (value) => {
  if (ABSOLUTE_URL.test(value)) return value;
  const stripped = value.replace(MEDIA_ROOT, '');
  return ABSOLUTE_URL.test(stripped) ? stripped : `${ASSETS}${stripped}`;
};
const toRelative = (value) => (value.startsWith(ASSETS) ? `${MEDIA_ROOT}${value.slice(ASSETS.length)}` : value);
const tinaRoundTrip = (value) => toRelative(toCloud(value));

/* The replica must reproduce the corruption that was actually observed, or it
   proves nothing about the paths that pass. */
const observed = tinaRoundTrip('../../assets/temp-photos/TEMP-PHOTO-journey-leh-ladakh.jpg');
if (observed !== '/uploads../../assets/temp-photos/TEMP-PHOTO-journey-leh-ladakh.jpg') {
  console.error(`check-image-paths: the Tina mapping replica no longer reproduces the 2026-11-12 corruption (got ${observed}).`);
  process.exit(2);
}

/* ---- image keys, read from the schema --------------------------------------- */
const schema = await readFile(join(ROOT, 'src', 'content.config.ts'), 'utf8');
const IMAGE_KEYS = new Set(
  [...schema.matchAll(/(\w+):\s*(?:z\.array\(\s*)?cmsImage\(image\)/g)].map((match) => match[1]),
);
if (!IMAGE_KEYS.size) {
  console.error('check-image-paths: found no cmsImage(image) fields in src/content.config.ts — has the helper been renamed?');
  process.exit(2);
}

/* ---- walk the content -------------------------------------------------------- */
async function* files(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if (/\.(md|mdx|json)$/.test(entry.name)) yield path;
  }
}

const readData = async (path) => {
  const text = await readFile(path, 'utf8');
  if (path.endsWith('.json')) return JSON.parse(text);
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? yaml.load(match[1]) : {};
};

const exists = async (path) => stat(path).then((s) => s.isFile(), () => false);

const problems = [];
let checked = 0;
let documents = 0;

const visit = async (node, trail, file) => {
  if (Array.isArray(node)) {
    for (const [index, item] of node.entries()) await visit(item, `${trail}[${index}]`, file);
    return;
  }
  if (!node || typeof node !== 'object') return;
  for (const [key, value] of Object.entries(node)) {
    const here = trail ? `${trail}.${key}` : key;
    if (IMAGE_KEYS.has(key) && value != null && (typeof value === 'string' || Array.isArray(value))) {
      const values = Array.isArray(value) ? value.map((v, i) => [v, `${here}[${i}]`]) : [[value, here]];
      for (const [path, field] of values) {
        if (typeof path !== 'string') continue;
        checked++;
        if (!CMS_IMAGE_PATH.test(path)) {
          problems.push({ file, field, path, why: 'not a "/uploads/<file>" path — the CMS rewrites this form on save' });
        } else if (!(await exists(join(PUBLIC, path)))) {
          problems.push({ file, field, path, why: `no such file in public${path.slice(0, path.lastIndexOf('/') + 1)}` });
        } else if (tinaRoundTrip(path) !== path) {
          problems.push({ file, field, path, why: `a Tina Cloud save would turn it into ${tinaRoundTrip(path)}` });
        }
      }
    } else if (typeof value === 'object') {
      await visit(value, here, file);
    }
  }
};

for await (const path of files(CONTENT)) {
  documents++;
  const file = relative(ROOT, path);
  let data;
  try {
    data = await readData(path);
  } catch (error) {
    problems.push({ file, field: '(frontmatter)', path: '', why: `could not be parsed: ${error.message.split('\n')[0]}` });
    continue;
  }
  await visit(data, '', file);
}

console.log(`\nImage paths — ${checked} value(s) in ${documents} content file(s); fields: ${[...IMAGE_KEYS].join(', ')}\n`);
if (problems.length) {
  for (const p of problems) console.log(`  ✗ ${p.file}  ${p.field}\n      "${p.path}"\n      ${p.why}`);
  console.log(
    `\nFAIL: ${problems.length} image path(s) would break the build or the next CMS save.\n` +
      `Fix: re-pick the image in /admin, or set the field to "/uploads/<file>" for a file in public/uploads/.\n`,
  );
  process.exit(1);
}
console.log('PASS: every image path is "/uploads/<file>", exists, and survives Tina Cloud\'s open→save mapping unchanged.\n');
