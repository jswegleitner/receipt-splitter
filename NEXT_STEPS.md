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

## 🧰 Environment

- **Node v24.16.0** installed at `C:\Program Files\nodejs` (npm 11.13.0). Added to **user PATH** this session — open a new terminal for `node`/`npm` to resolve. (Chocolatey couldn't set machine PATH without admin; the binary install was fine.)
- **Offline JSX syntax check recipe** (no project deps needed):
  1. `Invoke-WebRequest https://unpkg.com/@babel/standalone/babel.min.js -OutFile $env:TEMP\babel-standalone.js`
  2. Run a tiny Node script that extracts the `<script type="text/babel">` body from `index.html` and calls `Babel.transform(code, { presets: ['react'] })`. (A working copy was left at `%TEMP%\verify_jsx.js`.)

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

### Bigger items
- **2.1 Collapse 5 share mechanisms into 2** — keep "Split together (live)" = room code, "Share results" = `?share=` link. Retire the broken `?s=` path and the base64 manual claim-code + Import modal.
- **6. Firebase security/concurrency** — commit restrictive security rules; stop `cleanupOldRooms` from downloading the entire `rooms` tree to every visitor; lengthen 5-char room codes; switch claims writes from whole-object `set()` to per-person child paths (kills last-write-wins clobbering + most `__placeholder__` code).
- **5. Light build (adopted; Node now ready)** — esbuild to drop the ~3MB in-browser Babel, Tailwind CLI purge, and a unit test that locks in the Σ(person totals)==bill invariant. Output stays a single `index.html`. Add only esbuild + tailwindcss (+ a test runner) to keep npm supply-chain exposure small.

### Secondary / informational
- **Commercial path** (only if pursued): thin serverless proxy to hide a shared OCR key + enable payments/rate-limits, then Stripe, analytics, PWA, custom domain. See the strategy docs already in the repo.

## To resume in a new chat
Point it at this file and the plan: e.g. *"Continue the Receipt Splitter plan — Phase 0 and the Phase 1–4 quick wins are done (see NEXT_STEPS.md). Start the bigger items: 2.1 share-model consolidation, Phase 6 Firebase security, Phase 5 light build."*

**Recommended before the bigger items:** browser smoke-test the quick-win changes — new scan screen (Scan/Enter/Sample/Join + collapsible Azure settings), toasts on share/copy, Esc-closes-modals, debounced typing still syncs in a room, and the Σ(person totals)==bill console invariant stays quiet.
