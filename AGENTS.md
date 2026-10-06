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
- `npm test`: run the Node assertion/fetch smoke runner in `scripts/mistakes-smoke.cjs`, checking invitation registration, two-account isolation, mistake operations, review records and statistics. Temporary data stays under ignored `data/` and is removed after the run.

Use the Express static server for local browser checks. Production can serve `public/` with Nginx and proxy `/api/mistakes/` to Node. No lint or format command is configured.

## Coding Style & Naming Conventions

Match existing files: four-space indentation, single quotes, semicolons, and `const` for server JavaScript; two-space indentation for HTML. Use CommonJS `require`, descriptive camelCase identifiers, and uppercase environment constants such as `PORT`. Keep page directories lowercase, retain `index.html` entry points, and preserve `lang="zh-CN"` for Chinese pages.

## Testing Guidelines

No external test framework or coverage threshold is configured. For server changes, check syntax and run the core smoke script. For page changes, run `npm run build` and inspect rendering and navigation in a browser. Keep verification focused on changed behavior. New smoke scripts use the `scripts/*-smoke.cjs` naming convention and Node's built-in assertions; document their commands here.

## Commit & Pull Request Guidelines

History uses short, imperative descriptions such as `Configure .env port`; follow that style. PRs should explain the change, list verification performed, link relevant issues, and include screenshots for visible page changes.

## Configuration & Agent Completion

Keep secrets in ignored `.env` files. Do not commit runtime data, uploads, logs, or `node_modules/`.

Mark every task step `completed` only after its implementation and verification; leave no `pending` or `in_progress` steps at completion. Then run `git status --porcelain`. If this Git repository has changes, run `git add .` and commit with `Auto checkpoint: [timestamp] - After AI session completed`.
