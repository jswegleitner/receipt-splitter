# Receipt Splitter — Work Status & Next Steps

> Handoff doc for resuming in a fresh chat. Full plan lives at
> `C:\Users\jwegleitner\.claude\plans\please-review-this-code-lively-stearns.md`.

## ✅ Done this session — Phase 0 (correctness/crash hotfixes + Google removal)

All in [index.html](index.html), documented in [CLAUDE.md](CLAUDE.md) history. **Verified:** real Babel transpile passes (0 syntax errors) and the split math was proven to reconcile to the bill across multiple scenarios.

- **0.1 Split math fixed** — partially-claimed items no longer overcharge. Claimers pay unit-price × claimed qty; unclaimed remainder still splits among everyone. Your 12-beer example now totals $60 (was $65). Applied in `getPersonSubtotal` and the results render.
- **0.2 Divide-by-zero guarded** on `people.length`; "Calculate Split" disabled when there are 0 people.
- **0.3 Orphaned-item crash fixed** — deleting a claimed item no longer blanks the results page.
- **0.4 Bad-data coercion** — `normalizeItems`/`normalizePeople` helpers coerce numbers + strip placeholders on every load (`joinRoom`, `subscribeToRoom`, `loadSession`).
- **0.5 Native share fixed** — `grandTotal` → `totalBill` (mobile share sheet works again).
- **0.6 Error boundary** added around `ReactDOM.render` with a "Start Over" fallback.
- **0.7 Google OCR removed entirely** (~357 lines: brittle `parseReceiptText`, Google handler, provider toggle, key field, state/savers). **Azure is the sole OCR engine.** Fixed auto-detected tip type (`'dollar'`→`'amount'`).
- **Reconciliation invariant** — dev-console warning if per-person totals ever drift from the bill on the results screen.

### Recommended before moving on
- Browser smoke-test: open `index.html` in VS Code Live Server → scan/enter → review → split → results. Confirm totals add up and the console stays quiet.

## 🧰 Environment & build

- **Node v24.16.0** at `C:\Program Files\nodejs` (npm 11.13.0). **Gotcha:** `node`/`npm` are *not* on PATH in fresh shells here. Either open a new terminal, or prefix commands: PowerShell `$env:Path = "C:\Program Files\nodejs;$env:Path"; npm ...`.
- **Build workflow** (deps already installed; `node_modules/` is gitignored):
  - `npm run build` → bundles `src/` into the deployed `index.html` (esbuild + Tailwind CLI; see `build.mjs`).
  - `npm test` → runs `test/calc.test.js` (the Σ(person totals)==bill guard, `node:test`).
  - **Edit `src/`, never hand-edit `index.html`** (it's generated). Commit the rebuilt `index.html` alongside `src/` changes; push to `main` deploys (GitHub Pages).
- The old in-browser-Babel JSX-check recipe is obsolete — esbuild now reports syntax errors at build time.

## ⏭️ Next steps (from the approved plan, in priority order)

### ✅ Quick wins — Phases 1–4 — DONE (this session)
All in [index.html](index.html). **Verified:** full Babel transpile passes (0 syntax errors) and all CDN SRI hashes re-verified against fresh unpkg downloads.
- **1.1 ✅** `lucide.createIcons()` top-level effect no longer runs every render — keyed on the state that swaps screens/sections (`step`, `selectedPerson`, `isConnected`, `roomCode`, modal toggles). Per-`Icon` mount effects (already `[]`) remain the workhorse; this is the safety net. (Used a keyed array rather than bare `[]` so icons still render on screen transitions.)
- **1.2 ✅** Pinned + SRI: React/ReactDOM `18.3.1`, Babel `@7.29.7`, **Lucide `@latest`→`1.17.0`** (same version `@latest` resolved to today, so behavior is unchanged — just frozen against a future major). `crossorigin="anonymous"` added where missing. Tailwind CDN left as-is (Phase 5 replaces it); Firebase already pinned.
- **1.3 ✅** Per-item claimed quantity memoized in `claimedQtyByItem` (`useMemo` on `items`/`claims`/`claimQuantities`); `getTotalClaimedQuantity`/`getUnclaimedQuantity` now read the map.
- **1.4 ✅** `syncToRoomDebounced` (~400ms/field) + `flushSyncField` on blur. Wired into `updateClaimQuantity`, `updateTax`, `updateTip`. Toggling a claim off cancels the pending qty write so it can't resurrect the claim.
- **2.3 ✅** Toast system (`showToast`, bottom-center, info/success/error) replaces **all** `alert()`/`prompt()` (the rare clipboard-fail `prompt` fallbacks became error toasts — `navigator.clipboard` works on HTTPS/GitHub Pages).
- **2.2 ✅** Value-first scan screen: **Scan / Enter manually** as two equal primary buttons, **"Try a sample receipt"** demo + "Join a friend's room" as secondary links, Azure endpoint/key moved into a collapsible **"⚙️ Scan settings"** panel (auto-opens if you try to scan without a key). Stale "parser looks for lines…" note corrected for Azure.
- **3.x ✅ (mostly)** `role="checkbox"`+`aria-checked` on the claim checkbox; `inputmode="decimal"`+`min` on all numeric inputs; `onKeyPress`→`onKeyDown` everywhere; modals get **Esc-to-close, autofocus, backdrop-click close, `role="dialog"`/`aria-modal`**; `aria-label`/`htmlFor` added across inputs. *Viewport already allows zoom* (no `maximum-scale`/`user-scalable=no`), and per-item status already pairs color with text — nothing to change there. **Deferred:** a full Tab focus-trap inside modals (Esc + autofocus shipped).
- **4.x ✅ (mostly)** Removed dead `personInputRef`; collapsed the duplicated 37-line inline add-person handler + dead `addPerson` into one `addPerson(rawName)`; stripped the spammy `createRoom` `console.log` (+ benign catch-block logs). **Deferred:** centralizing magic strings (step names / room field names) — high churn, low impact; skipped for now.

### ✅ Phase 5 light build — DONE
Source now lives in `src/` (`app.jsx`, `calc.js`, `index.css`, `index.template.html`); `npm run build` (esbuild + Tailwind CLI, see `build.mjs`) emits the single self-contained `index.html` (the deployed file). Dropped the ~3 MB in-browser Babel + React/Tailwind CDNs → ~200 KB total, self-contained except Firebase. Money math extracted to pure `src/calc.js` with `test/calc.test.js` (8 cases) locking in Σ(person totals)==bill; run `npm test`. Also dropped the broken Lucide CDN for inline-SVG icons. **Workflow now: edit `src/`, `npm run build`, commit the rebuilt `index.html`.** Deploy unchanged (GitHub Pages from `main`).

### ⏭️ Remaining bigger items (priority order)
1. **Phase 6 — Firebase security/concurrency (do next; real data exposure today).** Commit restrictive Realtime DB security rules; stop `cleanupOldRooms` (`src/app.jsx`) from `database.ref('rooms').get()` on every load (downloads *all* users' receipts to *every* visitor + lets any client `remove()` rooms) — scope to a query, move server-side, or drop it; lengthen the 5-char room codes; switch claims/claimQuantities from whole-object `set()` to per-person child paths (kills last-write-wins clobbering of concurrent guests + most `__placeholder__` code).
2. **2.1 — Collapse 5 share mechanisms into 2.** Keep "Split together (live)" = room code and "Share results" = `?share=` link. Retire the broken `?s=` path and the entire base64 manual claim-code system (`generateMyClaimsCode`/`submitMyClaims`/`importFriendClaims` + Import modal). Removes the most confusing flow + dead code.

### Polish / smaller deferred
- Modal **Tab focus-trap** (Esc + autofocus + backdrop-close already shipped).
- **Magic-string constants** (step names, room field names) — now easy as `src/constants.js`.
- **SRI on the two Firebase compat `<script>`s** in `src/index.template.html` (the only remaining CDN).
- **Real-time clarity (2.4):** sync-status from Firebase `.info/connected` (`isConnected` is set true and never reset, so the UI lies on disconnect); disable host-only controls for guests with a hint; confirm-before-removing-a-person.
- **OCR feedback (2.5):** better Azure error guidance + a thumbnail of the scanned image.
- Delete the stale `receipt_splitter.tsx` reference file at root.

### Build/DX niceties (optional, now that the build exists)
- `npm run dev` watch mode (esbuild `--watch` + tailwind `--watch`).
- A GitHub Actions workflow to `npm test` on push, and optionally **build in CI** so only `src/` is committed (avoids the noisy minified-`index.html` diffs) and Pages deploys the artifact.

### Secondary / informational
- **Commercial path** (only if pursued, and only after Phase 6): thin serverless proxy to hide a shared OCR key + enable payments/rate-limits, then Stripe, analytics, PWA, custom domain. See the strategy docs already in the repo.

## To resume in a new chat
Point it at this file: e.g. *"Continue the Receipt Splitter plan — Phases 0–5 + quick wins are done (see NEXT_STEPS.md). Start Phase 6 (Firebase security)."* Remember the build workflow: edit `src/`, `npm run build`, commit the rebuilt `index.html`.
