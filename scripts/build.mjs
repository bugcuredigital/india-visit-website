#!/usr/bin/env node
/**
 * `npm run build` — the production build, with the CMS admin when it can be.
 * ---------------------------------------------------------------------------
 * `tinacms build` compiles the /admin editor and, when Tina Cloud credentials
 * are present, checks the schema against the cloud project. Without the
 * credentials it cannot run — and the client's Tina Cloud project does not
 * exist yet — so a build script that always called it would break every
 * Cloudflare deploy until it did. This one runs the Tina step only when
 * TINA_PUBLIC_CLIENT_ID and TINA_TOKEN are both set, and always runs the Astro
 * build. Adding the two variables in the Cloudflare Pages dashboard is what
 * switches the admin on in production; no code changes.
 */
import { spawnSync } from 'node:child_process';

const hasCloud = Boolean(process.env.TINA_PUBLIC_CLIENT_ID && process.env.TINA_TOKEN);

const run = (cmd, args) => {
  const result = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) process.exit(result.status ?? 1);
};

if (hasCloud) {
  console.log('\n[build] Tina Cloud credentials present — building the /admin editor.\n');
  run('npx', ['tinacms', 'build']);
} else {
  console.log('\n[build] No Tina Cloud credentials (TINA_PUBLIC_CLIENT_ID / TINA_TOKEN) — skipping the /admin build. The site builds as usual.\n');
}
run('npx', ['astro', 'build']);
