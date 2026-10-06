# Repository Guidelines

## Project Structure & Module Organization

- `public/index.html` contains the Chinese-language home page; `public/mistakes/index.html` contains the mistakes notebook landing page. Keep new static pages under `public/` and place related assets alongside them.
- `server/app.js` is the CommonJS Express entry point. It currently exposes `GET /api/hello` and does not serve the static pages.
- `404.html` is the root-level error page. `data/` and `uploads/` reserve space for runtime content; only their `.gitkeep` files are tracked.
- `package.json` and `package-lock.json` define Node.js dependencies. No test directory or build pipeline currently exists.

## Build, Test, and Development Commands

- `npm ci`: install dependencies reproducibly from the lockfile.
- `node server/app.js`: start the API on `127.0.0.1`, using `PORT` from `.env` or defaulting to `3000`.
- `node --check server/app.js`: check server JavaScript syntax.
- `curl.exe http://127.0.0.1:3000/api/hello`: smoke-test the running API on Windows; expect a JSON response with `success: true`.
- `npm test`: currently a placeholder that exits with an error; it is not a functioning test suite.

Serve `public/` separately with your static web server for browser checks. There are no configured build, lint, or format commands.

## Coding Style & Naming Conventions

Match existing files: four-space indentation, single quotes, semicolons, and `const` for server JavaScript; two-space indentation for HTML. Use CommonJS `require`, descriptive camelCase identifiers, and uppercase environment constants such as `PORT`. Keep page directories lowercase, retain `index.html` entry points, and preserve `lang="zh-CN"` for Chinese pages.

## Testing Guidelines

No testing framework or coverage threshold is configured. For server changes, check syntax and verify affected routes, status codes, and JSON responses. For page changes, inspect rendering and navigation in a browser. If adding automated tests, document their runner, naming convention, and command in this guide.

## Commit & Pull Request Guidelines

History uses short, imperative descriptions such as `Configure .env port`; follow that style. PRs should explain the change, list verification performed, link relevant issues, and include screenshots for visible page changes.

## Configuration & Agent Completion

Keep secrets in ignored `.env` files. Do not commit runtime data, uploads, logs, or `node_modules/`.

Mark every task step `completed` only after its implementation and verification; leave no `pending` or `in_progress` steps at completion. Then run `git status --porcelain`. If this Git repository has changes, run `git add .` and commit with `Auto checkpoint: [timestamp] - After AI session completed`.
