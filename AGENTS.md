# Repository Guidelines

## Project Structure & Module Organization

- `public/index.html` contains the Chinese-language home page. `public/mistakes/` contains the built mistakes application; edit its React/TypeScript source under `client/mistakes/`, then run `npm run build`.
- `server/app.js` is the CommonJS Express entry point. It exposes `GET /api/hello`, mounts `/api/mistakes`, and serves `public/` for local use. Mistakes business modules live under `server/mistakes/`.
- `404.html` is the root-level error page. `data/` and `uploads/` reserve space for runtime content; only their `.gitkeep` files are tracked.
- `package.json` and `package-lock.json` define Node.js dependencies. `scripts/mistakes-smoke.cjs` checks the core workflow using an isolated temporary SQLite database.

## Build, Test, and Development Commands

- `npm ci --cache ./data/.npm-cache`: install dependencies reproducibly from the lockfile using a workspace-local cache.
- `npm run build`: type-check and build the frontend into `public/mistakes/`.
- `npm run dev`: start the Vite frontend at `http://127.0.0.1:5173/mistakes/`, proxying API requests to the configured backend.
- `npm run admin:create`: create an administrator using interactive prompts.
- `node server/app.js`: start the API on `127.0.0.1`, using `PORT` from `.env` or defaulting to `3000`.
- `node --check server/app.js`: check server JavaScript syntax.
- `curl.exe http://127.0.0.1:3000/api/hello`: smoke-test the running API on Windows; expect a JSON response with `success: true`.
- `npm run test:ai`: run `scripts/mistakes-ai-smoke.cjs` with a local mock AI and isolated database/uploads to check photo entry, knowledge ownership, automatic analysis, retries, recovery, conflicts and cleanup.
- `node scripts/mistakes-ai-fallback-smoke.cjs`: check analysis timeout routing, fallback retries/cancellation, and administrator settings/toasts on mobile and desktop with mocked AI and Chromium. Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to use a system Chromium.
- `npm run test:pages`: check page segmentation, per-question blue-answer entry, independent API profiles, figure review, background preparation, retries/recovery and shared-source cleanup using local mock Gemini/OpenAI services and an isolated database.
- `node scripts/mistakes-library-performance-smoke.cjs`: verify batch archiving, photo pagination/cache/ownership, server-side crop retries, source deletion, and mobile/desktop picker behavior. Set `CHROMIUM_PATH` to use system Chromium.
- `node scripts/mistakes-draft-selection-smoke.cjs`: after building, verify automatic 32-item loading, the 128-item page cap, append retries, filtered cross-page choices, export counts and bounded archive batches with partial failures on mobile and desktop. Set `CHROMIUM_PATH` to use system Chromium.
- `node scripts/mistakes-filter-smoke.cjs`: after building, verify mobile/desktop multi-select filters, subject/knowledge linkage, apply/cancel, filtered PDF contents, rating changes and review selection with isolated data. Set `CHROMIUM_PATH` to use system Chromium.
- `node scripts/mistakes-ai-quick-smoke.cjs`: after building, check mobile/desktop task entry, toast clearance, notification targeting, embedded review/conflicts, active editor retention, retry/cancel and full-task navigation using isolated data. Set `CHROMIUM_PATH` to use system Chromium.
- `npm run test:client`: check editor saving/draft recovery/conflicts, page upload cancellation/retry batches and review response ordering with local mocks.
- `node scripts/mistakes-ai-review-smoke.cjs`: after building, check first-click AI review filling and concurrent-edit conflicts for question/answer/analysis on desktop and mobile using real Chromium and an isolated database.
- `node scripts/mistakes-toast-drawer-smoke.cjs`: after building, check mobile toast record drawers, filter-preserving saves, late editor/detail updates after closing, nested AI review, photo targets, editor session retention, swipe closing, mobile/desktop list state and scroll restoration, burst notification aggregation and screen/PDF punctuation wrapping using real Chromium and isolated data.
- `node scripts/mistakes-toast-drawer-smoke.cjs --navigation-only`: run only mobile/desktop detail entry and list return checks, including repeated entry and browser Back/Forward scroll behavior.
- `npm run test:export`: check complete filtered/selected/single PDF exports, Chinese text, appendix pagination and image ownership with real Chromium and an isolated database/uploads. Install the matching Chromium first; see `docs/mistakes-export.md`.
- `npm run test:export-preview`: check PDF preview/retry, export settings, shared desktop dialogs/mobile drawers, AI task filters and homepage layout after closing using real Chromium and an isolated database.
- `npm run test:export-practice`: check practice PDF dividers/10–70mm spacing, desktop steppers, mobile wheel gestures and nested scrolling using real Chromium and an isolated database.
- `npm run test:backup`: check WAL snapshots, complete data/image/config restoration, graceful AI pause, read-only protection, administrator access, scheduling/retention and restore rollback using isolated local data and a mock AI.
- `node scripts/mistakes-followup-smoke.cjs`: after building, check follow-ups with a temporary SQLite database, local OpenAI/Gemini mocks and mobile/desktop Chromium. Covers model switching, credit settlement, cancellation and recovery, ownership, search isolation, model and Logo selectors, AI settings, and PDF preview/export. Set `CHROMIUM_PATH` to use a system Chromium.
- `node scripts/mistakes-frozen-account-smoke.cjs`: after building, check frozen-account login/access restrictions, owner-only data downloads, trash retention, reactivation and mobile/desktop download retry/logout. Set `CHROMIUM_PATH` to use system Chromium.
- `npm run backup:restore -- <archive.tar.gz> --confirm`: restore a full backup after stopping the Node service; creates a pre-restore rollback backup when current data exists.
- `node scripts/mistakes-upload-smoke.cjs`: check background photo uploads, deferred answer reuse, automatic retries and resume using mocked requests.
- `node scripts/mistakes-photo-preparation-smoke.cjs`: check compression worker deadlines and main-thread recovery using mocked compression.
- `npm test`: run the core mistakes/search smoke checks and CAPTCHA authentication smoke checks with isolated temporary databases under ignored `data/`.
- `node scripts/mistakes-captcha-smoke.cjs`: run only the CAPTCHA and authentication-limit checks using a mocked verification API.

Use the Express static server for local browser checks. Production can serve `public/` with Nginx and proxy `/api/mistakes/` to Node. No lint or format command is configured.

## Coding Style & Naming Conventions

Match existing files: four-space indentation, single quotes, semicolons, and `const` for server JavaScript; two-space indentation for HTML. Use CommonJS `require`, descriptive camelCase identifiers, and uppercase environment constants such as `PORT`. Keep page directories lowercase, retain `index.html` entry points, and preserve `lang="zh-CN"` for Chinese pages.

## Mobile-First Development

Avoid unnecessary secondary labels and descriptions. Let the layout do the explaining.

Prioritize the mobile experience when building or changing user-facing pages. Start with narrow-screen layouts and interactions, then adapt them for larger screens. Keep text readable, controls comfortable to tap, and primary actions easy to reach; prevent horizontal overflow and ensure dialogs, forms, tables, and navigation work on small screens. When checking a page change, inspect at a mobile viewport as well as desktop when practical.

## Testing Guidelines

No external test framework or coverage threshold is configured. For server changes, check syntax and run the core smoke script. For page changes, run `npm run build` and inspect rendering and navigation in a browser. Keep verification focused on changed behavior. New smoke scripts use the `scripts/*-smoke.cjs` naming convention and Node's built-in assertions; document their commands here.

## Commit & Pull Request Guidelines

History uses short, imperative descriptions such as `Configure .env port`; follow that style. PRs should explain the change, list verification performed, link relevant issues, and include screenshots for visible page changes.

Develop changes on `feature/<descriptive-name>` branches instead of committing directly to `main`, unless the user explicitly requests otherwise. Create a local checkpoint commit with an `[Auto]` title prefix after each completed modification task. Keep these commits on the feature branch for rollback; merge the feature into `main` using Squash and merge so each feature produces one formal commit. Preserve the local feature branch when its checkpoint history is still needed. Do not push, merge, or rewrite existing commit history unless explicitly requested.

## Configuration & Agent Completion

Keep secrets in ignored `.env` files. Do not commit runtime data, uploads, logs, or `node_modules/`.

Mark every task step `completed` only after its implementation and verification; leave no `pending` or `in_progress` steps at completion. Then run `git status --porcelain`. If this Git repository has changes, run `git add .` and create a local checkpoint commit with an `[Auto]` title prefix.
