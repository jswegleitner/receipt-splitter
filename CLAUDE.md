# CLAUDE.md

## Project Overview

Receipt Splitter — a single-file web app for splitting bills among friends. Users scan receipts with OCR, claim items, and calculate who owes what. Supports real-time collaboration via room codes.

## Architecture

- **Single-file *output*** — source lives in `src/`; the **light build** (`npm run build`) emits one self-contained `index.html`, which is the deployed file. (The old "everything hand-written in index.html" rule is superseded by "single-file output, optional build" — see Phase 5 in the history.)
- **React 18** — JSX is pre-compiled and React is bundled in by **esbuild** at build time (no in-browser Babel, no React CDN). Entry: `src/app.jsx`; renders via `createRoot`.
- **Money math** — pure, framework-free functions in `src/calc.js`, unit-tested in `test/calc.test.js`. `app.jsx` delegates to them via thin wrappers.
- **Tailwind CSS** — compiled and purged by the **Tailwind CLI** at build time (`src/index.css` + `tailwind.config.cjs`), inlined into `index.html` (no Tailwind CDN).
- **Icons** — inline SVG components (Lucide paths) in `src/app.jsx` via the `LucideSvg` helper; no icon CDN. (Lucide-via-CDN was removed because lucide@1.x's `createIcons()` didn't bind to its named exports, so icons never rendered.)
- **Firebase Realtime Database** — powers room-based real-time sync; still loaded via the compat CDN (`src/index.template.html`), used through the global `firebase`.
- **Azure Document Intelligence** — the sole OCR provider (BYOK endpoint + key; 500 free pages/mo on the F0 tier).

## Development

- **Edit source in `src/`**, not `index.html` (the latter is a generated build artifact — do not hand-edit it).
  - `src/app.jsx` — the whole React app. `src/calc.js` — money math. `src/index.css` — Tailwind entry. `src/index.template.html` — HTML shell with `/*__STYLES__*/` and `/*__APP__*/` placeholders.
- `npm install` once, then:
  - `npm run build` → regenerates `index.html` from `src/`.
  - `npm test` → runs the money-math unit tests (Node's built-in runner).
- To see changes: `npm run build`, then open `index.html` (or VS Code Live Server). There is no watch mode yet; rebuild after edits.
- `receipt_splitter.tsx` at root is an old reference file; `Static Archive/` holds older versions.

## Deployment

- Hosted on **GitHub Pages** from the `main` branch — unchanged by the build.
- **Build locally (`npm run build`) and commit the regenerated `index.html`**; push to `main` triggers deployment (~1 min). (Pages serves the static file; it does not run the build. A CI/Actions build is a possible future step.)
- The `.nojekyll` file ensures GitHub Pages serves the HTML as-is.

## Key Conventions

- **Edit `src/`, run `npm run build`, commit the resulting `index.html`.** Never hand-edit `index.html`.
- Output stays a single self-contained `index.html` (only Firebase remains a CDN dependency).
- Keep the build dep set tiny (esbuild, tailwindcss, react/react-dom) to limit npm supply-chain exposure. `node_modules/` and `.build/` are gitignored.
- API keys are stored in browser `localStorage`, never hardcoded.
- Room data is ephemeral in Firebase (auto-expires after 7 days).

## Testing

- `npm test` runs `test/calc.test.js` — the standing **Σ(person totals) == bill** invariant across full/partial/shared/leftover/zero-tax-tip scenarios (Node's built-in `node:test`, no extra deps). Run it after touching `src/calc.js`.
- The same invariant also warns at runtime via a dev-only console check on the results screen.
- For UI changes, still smoke-test in a browser: `npm run build`, open `index.html`, walk scan/enter → review → split → results.
- Sample receipts for manual testing are in `Test Receipts/` (not committed to repo); the in-app "Try a sample receipt" button also loads a demo.

## History

- **2026-06-04** — **Phase 5 light build (adopted).** Source moved to `src/` (`app.jsx`, `calc.js`, `index.css`, `index.template.html`); `npm run build` (esbuild + Tailwind CLI, see `build.mjs`) emits the single self-contained `index.html`. Drops the ~3 MB in-browser Babel and the React/Tailwind CDNs (output went from CDN-heavy to ~200 KB total, self-contained except Firebase). JSX now bundled at build time; app mounts via `createRoot`. Money math extracted into pure `src/calc.js` with `test/calc.test.js` locking in Σ(person totals)==bill (8 cases, `node:test`). The no-build/no-npm rule is superseded by "single-file output, optional local build"; deploy is unchanged (commit the built `index.html`, push to `main`).
- **2026-06-04** — **Icons → inline SVG; dropped the Lucide CDN.** All icons render reliably now (the `<Icon>`/`lucide.createIcons()` path was broken on lucide@1.x — named exports carry no `.name`, so it emitted an empty `data-lucide` and rendered nothing while the placeholder still reserved `w-6 h-6`, which is what pushed button labels off-center). Replaced with a tiny `LucideSvg` helper + per-icon SVG components (DollarSign/Camera/Plus/Users/Share2/Check, plus the existing inline `XIcon`); removed the lucide `<script>`+SRI, the destructure, and both `createIcons` effects. One fewer CDN dependency.
- **2026-06-04** — **Phase 1–4 quick wins.** Pinned all CDN deps + added Subresource Integrity (React/ReactDOM `18.3.1`, Babel `@7.29.7`, Lucide `@latest`→`1.17.0`); the in-browser dep set is now frozen against a breaking CDN major. Cut wasted work: the top-level `lucide.createIcons()` effect is keyed (no longer runs every render) and per-item claimed quantities are memoized (`claimedQtyByItem`). Firebase writes for qty/tax/tip are debounced (~400ms, flushed on blur) instead of one write per keystroke. UX: blocking `alert()`/`prompt()` replaced with a non-blocking toast; the scan screen leads with Scan / Enter-manually / "Try a sample receipt" and tucks the Azure key into a collapsible "Scan settings" panel. A11y: `role/aria-checked` checkbox, `inputmode`/`min` on numeric inputs, `onKeyPress`→`onKeyDown`, and modal Esc-to-close/autofocus/backdrop-close/`role=dialog`. Cleanup: removed dead `personInputRef` + duplicated add-person handler (one `addPerson` helper now), stripped debug `console.log`. (Deferred: modal Tab focus-trap, magic-string centralization, and the bigger items — share-model consolidation, Firebase security rules, the light build.)
- **2026-06-04** — Removed Google Cloud Vision OCR entirely. It relied on a brittle custom `parseReceiptText` parser whose skip-patterns were hardcoded to specific test receipts (merchant names, etc.) and did not generalize. **Azure Document Intelligence is now the sole OCR engine.** Same pass fixed a partial-claim split-math bug (per-person shares now reconcile exactly to the bill while still splitting unclaimed items among everyone), guarded divide-by-zero and orphaned-item crashes, fixed the broken native-share summary text, corrected the auto-detected tip type, and added a React error boundary.
