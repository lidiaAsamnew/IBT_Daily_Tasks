# Addis Eats

Ethiopian food delivery for Addis Ababa — a Next.js (App Router) application: browse and search the menu, build a cart, create an account, place an order, follow it live on a map; staff get a kitchen queue and a sales dashboard.

**Live site:** `https://YOUR-APP.vercel.app` ← *replace with your deployment URL once deployed (see "Deploy")*

Built for the IBT College CodeOps course, Module 3 (Days 36–49). It is the original React/Vite Addis Eats app migrated to Next.js, keeping its screens, cart, category filter and contact details.

## Run it (from a fresh clone)

Requires Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local     # Windows: copy .env.example .env.local
npm run dev                    # http://localhost:3000
```

Without `DATABASE_URL` it stores data in `.data/db.json` (git-ignored). To try the staff screens, sign in with the `STAFF_PHONE` / `STAFF_PASSWORD` from `.env.local`; customers create their own account at `/signup`.

| Script | Does |
|---|---|
| `npm run dev` | development server |
| `npm run build` then `npm run start` | production build — **measure performance here, never on `dev`** |
| `npm test` | unit tests (`node --test`) |
| `npm run lint` | ESLint |

## Environment variables

Everything the app reads is in `.env.example`. **Secrets never go in git** (`.env*.local` is ignored).

| Variable | Needed | Notes |
|---|---|---|
| `SESSION_SECRET` | **yes** in production | ≥ 32 characters; different per environment. |
| `DATABASE_URL` | production/preview | Neon Postgres. Empty in development → local file. |
| `STAFF_PHONE`, `STAFF_PASSWORD`, `STAFF_NAME` | optional | Defines the one staff account. Both phone and password needed. |
| `NEXT_PUBLIC_SITE_URL` | optional | Your live origin. Falls back to Vercel's own URL variables. **Baked in at build time — changing it needs a rebuild.** It is public: never put a secret in a `NEXT_PUBLIC_` variable. |

## What is where

```
app/                routes (page.js, layout.js, loading.js, error.js, not-found.js)
  menu/             sidebar layout, search, filter, dish pages (+ generated preview images)
  checkout/ cart/   cart (client) and checkout (server action)
  orders/ track/    order history table, order status, live map (SSE)
  kitchen/ dashboard/   staff only
  signin/ signup/   account forms and server actions
  api/              route handlers: dishes, orders, me, order stream
components/         small shared pieces (Pager, OrderTable, Stepper…)
lib/                logic with no UI: orders, db, session, token, schema, format, csv, stats…
middleware.js       cheap redirect for private routes
data/menu.js        the catalogue
```

Design documents: **STRATEGY.md** (rendering per route) · **BOUNDARY.md** (server vs client) · **DATA.md** (every query) · **AUTH.md** (layers, three attacks) · **PERF.md** (budget) · **FUTURE.md** (what was cut) · **VERIFICATION.md** (what was and was not tested).

## What the app does (by lecture)

| Day | Delivered |
|---|---|
| 36 | App Router tree, `next/link`, `loading.js`, `error.js`, `not-found.js` (root and per segment), dynamic `menu/[id]` |
| 37 | Root + nested layouts (sidebar persists), static / ISR / SSG / dynamic chosen per route, Suspense streaming |
| 38 | Server components by default; client leaves for cart, search, nav, map, charts; `Providers`; hydration-safe cart |
| 39 | Route handlers with 401/403/404/422 and one error shape; one zod schema; server actions with `useActionState`; ownership checks |
| 41 | SWR: debounced search with `null` key and `keepPreviousData`, paging in the URL, order status polling seeded by the server |
| 42 | Phone + password accounts, hashed; httpOnly/secure/sameSite cookie; middleware + page + action layers; safe redirects; staff role |
| 43 | `next/image` everywhere, `next/font`, optimised images, `.env.example`, no third-party scripts |
| 44 | `metadataBase`, title template, `generateMetadata`, Open Graph (file + generated per dish), JSON-LD, sitemap, robots, canonical |
| 46 | Dashboard: KPIs, bar + line chart with data tables, sortable paged accessible order table, skeleton/empty/error states |
| 47 | Leaflet map (`ssr: false`), SSE with connection indicator, `lib/format.js` (ETB, dates), CSV export |
| 48 | Real buttons, keyboard-operable, 44 px targets, double-submit protection (disable + idempotency key) |
| 49 | Documents, README, verification, FUTURE.md |

## API

| Method & path | Auth | Returns |
|---|---|---|
| `GET /api/dishes?q=&category=&page=` | — | `{ dishes, total, page, pages }`; `422 { error, fieldErrors }` on bad input |
| `GET /api/dishes/:id` | — | the dish, or `404 { error }` |
| `GET /api/me` | cookie | `{ user: { id, name, role } \| null }` |
| `GET /api/orders` | signed in | `{ orders }` — your own only |
| `POST /api/orders` | signed in | `201` order · `400` bad JSON · `401` · `422` field errors; same `idempotencyKey` → `200` same order |
| `GET /api/orders/:id` | owner or staff | order · `401` · `403` · `404` |
| `DELETE /api/orders/:id` | owner | cancelled order · `403` · `409` once it is on the way |
| `GET /api/orders/:id/stream` | owner or staff | Server-Sent Events: status, courier position, ETA |

## Deploy (Vercel + Neon) — you do these steps; they need your accounts

1. **Push to GitHub.** `git init && git add . && git commit -m "Addis Eats" ` then create a repository and push. Check `git status` is clean and that `.env.local` is **not** listed.
2. **Vercel → Add New → Project →** import the repository. Framework: Next.js (auto). Don't deploy yet.
3. **Database:** in the project → **Storage** (or the Marketplace) → add **Neon Postgres**. It creates `DATABASE_URL` for you. (Without it, orders vanish whenever the serverless function restarts.)
4. **Environment variables** (Project → Settings → Environment Variables), set for **Production** and **Preview**:
   `SESSION_SECRET` (generate one: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`), `STAFF_PHONE`, `STAFF_PASSWORD`, optionally `NEXT_PUBLIC_SITE_URL`. Use a *different* `SESSION_SECRET` for Preview.
5. **Deploy.** Read the build log: it must finish, and the route table should match STRATEGY.md.
6. Put the live URL at the top of this README and in `NEXT_PUBLIC_SITE_URL`, then redeploy (public variables are baked in at build).

**Rollback:** Vercel → Deployments → pick the last good one → *Promote to Production*.

## After you deploy (Day 48–49 checks, on the live URL, in a private window)

1. Home loads; **view source** shows the headline, one `<h1>`, and absolute `og:image` URLs.
2. Paste a dish link into Telegram: a card with a picture appears.
3. Create a brand-new account → every screen shows a sensible empty state → place an order → follow it on `/track/…`.
4. **The three attacks** (AUTH.md): `curl -i -X POST https://YOUR-APP/api/orders -H "content-type: application/json" -d "{}"` → `401`; signed in as a second account, request the first account's order → `403`; `https://YOUR-APP/signin?next=https://example.com` then sign in → you stay on your own site.
5. Keyboard only: Tab through menu → cart → checkout. On a real phone: nothing hover-only.
6. `/sitemap.xml` and `/robots.txt` list real routes and no private ones. Search the page source for anything secret-looking.
7. Lighthouse (mobile, private window, three runs) → fill the *After* column in PERF.md.

## Known limitations

Read **AUTH.md** (sessions can't be revoked early; no rate limiting; no SMS verification) and **FUTURE.md** (no online payment; courier position is **simulated**; the catalogue is a file). The Neon storage driver and the framework integration are untested in my environment — see **VERIFICATION.md**.

Contact: Lidia Asamnew · AphoLi · 0900023344 · Ferensay legasiyon, Addis Ababa
