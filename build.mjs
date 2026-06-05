// Light build: source in src/ → one self-contained index.html (the deployed file).
//   - esbuild pre-compiles JSX and bundles React in (no in-browser Babel / React CDN).
//   - Tailwind CLI emits a purged, minified stylesheet (no Tailwind CDN).
//   - Both are inlined into src/index.template.html.
// Firebase stays a CDN dependency (the app uses the compat global `firebase`).
//
// Usage:  npm run build   (then commit the regenerated index.html)
import esbuild from 'esbuild';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const r = (...p) => path.join(root, ...p);
mkdirSync(r('.build'), { recursive: true });

// 1) Bundle the app (React + app) → minified IIFE, kept in memory.
const result = await esbuild.build({
  entryPoints: [r('src/app.jsx')],
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['es2020'],
  jsx: 'automatic',
  charset: 'utf8',
  legalComments: 'none',
  define: { 'process.env.NODE_ENV': '"production"' },
  write: false,
});
const appJs = result.outputFiles[0].text;

// 2) Tailwind CSS (purged + minified) via its CLI, invoked through node for
//    cross-platform reliability (avoids .cmd/shell quirks on Windows).
const twPkg = JSON.parse(readFileSync(r('node_modules/tailwindcss/package.json'), 'utf8'));
const twBin = r('node_modules/tailwindcss', typeof twPkg.bin === 'string' ? twPkg.bin : twPkg.bin.tailwindcss);
execFileSync(
  process.execPath,
  [twBin, '-i', r('src/index.css'), '-o', r('.build/tailwind.css'), '--minify'],
  { stdio: 'inherit' }
);
const css = readFileSync(r('.build/tailwind.css'), 'utf8');

// 3) Inline both into the single-file template.
//    Escape any literal </script> in the bundle so it can't close our tag.
//    Use function replacers so `$` in the payloads isn't treated as a pattern.
const safeJs = appJs.replace(/<\/script>/gi, '<\\/script>');
const tpl = readFileSync(r('src/index.template.html'), 'utf8');
const html = tpl
  .replace('/*__STYLES__*/', () => css)
  .replace('/*__APP__*/', () => safeJs);
writeFileSync(r('index.html'), html);

const kb = (s) => (Buffer.byteLength(s) / 1024).toFixed(1);
console.log(`build OK → index.html  (js ${kb(appJs)} KB, css ${kb(css)} KB, total ${kb(html)} KB)`);
