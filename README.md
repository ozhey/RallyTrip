# Rally Trip

Website for [rallytrip.com](https://www.rallytrip.com): a rally-raid shop (roadbooks, Garmin, intercoms…), navigation courses and rally trips abroad.

**Stack:** Next.js 16 (App Router, server-rendered + ISR) · React 19 · Firebase 13 (Realtime Database, Auth, Storage) · Vitest · Playwright.

Product data lives in the Firebase Realtime Database and is edited from the admin page (`/admin/`). Every page is pre-rendered to HTML, so search engines see the full content.

The same code builds in two modes:

| Mode | Command | Used for | Admin edits go live |
|---|---|---|---|
| **Static** (`STATIC_EXPORT=true`) | `npm run build:static` → `out/` | GitHub Pages (current hosting) | on the next scheduled rebuild (≤ ~15–20 min) |
| **Server** | `npm run build` | a Node/edge host, e.g. Cloudflare Workers (planned) | immediately (ISR + `updateTag`) |

URLs end with `/` in both modes (`trailingSlash: true`). The only per-mode files are `app/products/[[...slug]]/page.server.js` / `page.static.js` (picked via `pageExtensions`) and `src/lib/actions.static.js` (aliased in for static builds).

## Requirements

- Node.js 24 (`.nvmrc`)
- Java 21+ — only for the local Firebase emulators (`brew install openjdk@21`)

## Setup

```bash
npm install
cp .env.example .env.local   # then fill in the values
```

`.env.local` values come from Firebase console → ⚙ Project settings → General → *Your apps* → Web app → *SDK setup and configuration* → **Config** (`apiKey`, `authDomain`, `databaseURL`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`). The web config is public by design; access is controlled by the database/storage rules. `ADMIN_EMAILS` (comma-separated) limits who can refresh the cache after an admin edit.

## Development

| Command | What it does |
|---|---|
| `npm run dev` | Dev server against the database in `.env.local` (**production** data — careful in `/admin`). |
| `npm run emulators` + `npm run seed` + `npm run dev:emulator` | Fully local: Firebase emulators (DB, Auth, Storage) seeded with test data. Admin login: `admin@rallytrip.test` / `admin-password`. Emulator UI: http://localhost:4000 |
| `npm run seed -- backup/<date>/db.json` | Seed the emulators with a real DB export instead of the test fixture. |
| `npm run build && npm start` | Production server build locally. |
| `npm run build:static && npm run serve:static` | Static (GitHub Pages) build, served like GitHub Pages at http://localhost:3201 |
| `npm run lint` | ESLint (Next.js core-web-vitals rules). |
| `npm test` | Unit tests (Vitest). |
| `npm run test:e2e` / `npm run test:e2e:static` | End-to-end tests (Playwright) on the server / static build against freshly started emulators. Run `npx playwright install chromium` once. |
| `npm run backup` | Download the live database and every image it references into `backup/<date>/` (git-ignored). |

## Firebase security

- **Accounts:** only created from the Firebase console (Authentication → Settings → User actions → *Enable create (sign-up)* is off). There is no sign-up in the site.
- **Rules:** everyone can read; only the emails in `ADMIN_EMAILS` can write (database: `products`, `quill`, `abroad`; storage: `products/**` images up to 10 MB).
- Rules live as templates in `firebase/*.template*`. `npm run rules` fills in `ADMIN_EMAILS` and writes `firebase/database.rules.json` + `firebase/storage.rules` (git-ignored, since the repo is public).
- Deploy them with `npx firebase login` (once) then `npm run rules:deploy`, or paste the generated files into the console (Realtime Database → Rules, Storage → Rules).
- The emulators/tests use the same templates plus the test admin `admin@rallytrip.test`; `tests/e2e/security.spec.js` checks that anonymous and non-admin writes are rejected.

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds the static site and publishes `out/` to the `gh-pages` branch (served at www.rallytrip.com):

- on every push to `master`, on demand (Actions → *Deploy to GitHub Pages* → *Run workflow*), and
- every 15 minutes **only if the data changed**: it hashes the whole database (`scripts/data-version.mjs`) and compares it with the live `/data-version.txt`.

Notes:
- GitHub disables scheduled workflows in a repo with no activity for 60 days (it emails a warning first). If that happens, re-enable it from the Actions tab — otherwise admin edits stop going live until the next push.
- GitHub's cron can run late by several minutes under load.

### Moving to Cloudflare later
1. Add the OpenNext Cloudflare adapter (`@opennextjs/cloudflare`, `wrangler.jsonc`, an R2 bucket for the incremental cache) and deploy the **server** build (`npm run build`, not `build:static`).
2. Set the `.env.local` variables (incl. `ADMIN_EMAILS`) in the Cloudflare project.
3. Point rallytrip.com DNS to Cloudflare (nameservers at Domain The Net), add the domain to the Worker, and add it to Firebase Auth → Authorized domains if it changes.
4. Delete `.github/workflows/deploy.yml` and disable GitHub Pages.

Before this rewrite the site was a hash-routed SPA (`rallytrip.com/#/products/...`). Old links still work: a tiny script in `app/layout.js` redirects `#/path` to `/path`, and `public/service-worker.js` removes the old app's service worker from returning visitors' browsers.

## Project layout

```
app/                     routes (server components), sitemap.js, robots.js
  products/[[...slug]]/  /products, /products/<category>[/<subcategory>[/<id>]]
  admin/                 client-only admin panel (noindex)
src/components/          shared UI (NavBar, Footer, product cards…)
src/containers/          page bodies (Home, Products, Abroad, NavGuide, Admin)
src/lib/                 data access (firebase/), product helpers, SEO/site constants
src/links.js             product categories
tests/                   unit setup, e2e specs, fixtures
scripts/                 backup, emulator seeding, live-vs-local screenshot comparison
```

## Making changes

### Adding a category
Controlled solely by `src/links.js`. Add another link (and optional sub-links).

### Removing a category
Also in `src/links.js`. Removing a link does **not** remove its products — they still appear on the main products page. Hide or delete the category's products first; after the link is removed they can no longer be edited from the admin UI.
