# CLAUDE.md

## Project Overview

Receipt Splitter — a single-file web app for splitting bills among friends. Users scan receipts with OCR, claim items, and calculate who owes what. Supports real-time collaboration via room codes.

## Architecture

- **Single HTML file** (`index.html`) — the entire app lives here. No build tools, no Node.js.
- **React 18 + Babel Standalone** — JSX is transpiled in-browser via CDN.
- **Tailwind CSS** — loaded via CDN.
- **Lucide Icons** — loaded via CDN.
- **Firebase Realtime Database** — powers room-based real-time sync between users.
- **Azure Document Intelligence** — the sole OCR provider (BYOK endpoint + key; 500 free pages/mo on the F0 tier).

## Development

- Open `index.html` directly in a browser, or use VS Code Live Server.
- All code changes go in `index.html`. There is no build step.
- `receipt_splitter.tsx` at root is a reference/source file, not what gets deployed.
- `Static Archive/` contains older versions for reference.

## Deployment

- Hosted on **GitHub Pages** from the `main` branch.
- Push to `main` triggers automatic deployment (~1 min).
- The `.nojekyll` file ensures GitHub Pages serves the HTML as-is.

## Key Conventions

- Keep everything in the single `index.html` file — do not split into multiple files.
- All dependencies are CDN-loaded. Do not introduce npm/package.json.
- API keys are stored in browser `localStorage`, never hardcoded.
- Room data is ephemeral in Firebase (auto-expires after 7 days).

## Testing

- No automated test suite. Test manually by opening `index.html` in a browser.
- Sample receipts for manual testing are in `Test Receipts/` (not committed to repo).
- A dev-only console invariant warns if the sum of per-person totals ever drifts from the bill total on the results screen.

## History

- **2026-06-04** — **Phase 1–4 quick wins.** Pinned all CDN deps + added Subresource Integrity (React/ReactDOM `18.3.1`, Babel `@7.29.7`, Lucide `@latest`→`1.17.0`); the in-browser dep set is now frozen against a breaking CDN major. Cut wasted work: the top-level `lucide.createIcons()` effect is keyed (no longer runs every render) and per-item claimed quantities are memoized (`claimedQtyByItem`). Firebase writes for qty/tax/tip are debounced (~400ms, flushed on blur) instead of one write per keystroke. UX: blocking `alert()`/`prompt()` replaced with a non-blocking toast; the scan screen leads with Scan / Enter-manually / "Try a sample receipt" and tucks the Azure key into a collapsible "Scan settings" panel. A11y: `role/aria-checked` checkbox, `inputmode`/`min` on numeric inputs, `onKeyPress`→`onKeyDown`, and modal Esc-to-close/autofocus/backdrop-close/`role=dialog`. Cleanup: removed dead `personInputRef` + duplicated add-person handler (one `addPerson` helper now), stripped debug `console.log`. (Deferred: modal Tab focus-trap, magic-string centralization, and the bigger items — share-model consolidation, Firebase security rules, the light build.)
- **2026-06-04** — Removed Google Cloud Vision OCR entirely. It relied on a brittle custom `parseReceiptText` parser whose skip-patterns were hardcoded to specific test receipts (merchant names, etc.) and did not generalize. **Azure Document Intelligence is now the sole OCR engine.** Same pass fixed a partial-claim split-math bug (per-person shares now reconcile exactly to the bill while still splitting unclaimed items among everyone), guarded divide-by-zero and orphaned-item crashes, fixed the broken native-share summary text, corrected the auto-detected tip type, and added a React error boundary.
