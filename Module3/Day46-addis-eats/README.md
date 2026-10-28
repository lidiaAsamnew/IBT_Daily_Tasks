# Addis Eats - Day 46 (data representation)

Built on the Day 44 project (Days 40 and 45 skipped). New dependency: `recharts`, so run `npm install` (not `npm ci`), then `npm run dev`.
See **DASHBOARD.md** for the chart-or-table choices, the four states and how to force each one.

## What Day 46 adds
| Where | What |
|---|---|
| `app/dashboard/page.js` | Staff-only server component: aggregates orders, passes 6 + 14 summary rows to the charts, one page of rows to the table. |
| `app/dashboard/RevenueChart.jsx`, `OrdersChart.jsx` | The only client code on the page: Recharts bar (revenue by neighbourhood, axis from 0, ETB) and line (orders per day), fixed height, labelled. |
| `components/DataTable.jsx` | The same chart data as a real table beneath each chart. |
| `app/orders/OrderTable.jsx`, `Pager.jsx` | Real table markup (caption, `th scope`, `aria-sort`), right-aligned ETB totals, sorting and paging as links in the URL. Used by `/orders` and `/dashboard`. |
| `app/orders/page.js` | The card list became the table; Track and Cancel kept; empty state for a customer with no orders. |
| `app/orders/loading.js`, `error.js`, `app/dashboard/loading.js`, `error.js`, `components/EmptyState.jsx` | Loading skeletons, error screens with retry, empty states. `app/orders/[id]/` has its own so it is not covered by the table skeleton. |
| `components/StateDemo.jsx` | "See every state" links: `?demo=slow`, `?demo=empty`, `?demo=error`, `?data=sample`. |
| `lib/format.js`, `lib/order-query.js`, `lib/stats.js`, `lib/sample-orders.js` | ETB/date formatting, validated sort and paging, aggregation, labelled sample data. |
| `components/AccountMenu.jsx`, `app/robots.js` | Staff get a Dashboard link; `/dashboard` is disallowed for crawlers. |

---

# Addis Eats - Day 44 (metadata and SEO)

Built on the Day 43 project (Day 40 skipped). Same setup: `npm install`, `npm run dev`, `.env.local` with `SESSION_SECRET`.
See **SEO.md** for what every route sets and how to verify it in the page source.

## What Day 44 adds
| Where | What |
|---|---|
| `app/layout.js`, `lib/site.js` | `metadataBase` (from `NEXT_PUBLIC_SITE_URL`, default `https://addiseats.et`), title template `%s · Addis Eats`, default title and description. |
| `lib/seo.js` | `pageMetadata()` (title, description, canonical, Open Graph, Twitter) and `privateMetadata()` (noindex). |
| `app/page.js`, `app/menu/page.js` | Own description; canonical (`/menu` covers `?q=&page=`); Restaurant JSON-LD on `/`. |
| `app/menu/[id]/page.js` | `generateMetadata` from the dish (name, ETB price, description) and MenuItem JSON-LD from the same object. |
| `app/opengraph-image.jsx`, `app/menu/opengraph-image.jsx`, `app/menu/[id]/opengraph-image.jsx`, `lib/og.jsx` | 1200x630 preview cards with `ImageResponse`: site-wide, menu, one per dish. |
| `app/sitemap.js`, `app/robots.js` | Sitemap from the dish records; private routes left out and disallowed. |
| `app/icon.png`, `app/apple-icon.png` | Favicon and touch icon by file convention. |
| `app/cart`, `checkout`, `signin`, `orders`, `orders/[id]`, `kitchen` | Title + description, `noindex`; `/signin` also has a canonical. |
| `components/JsonLd.jsx`, `lib/jsonld.js` | One script writer (escapes `<`) and the two JSON-LD builders. |

---

# Addis Eats - Day 43 (optimisation and environment)

Built on the Day 42 project (Day 40 skipped). Same setup: `npm install`, `npm run dev`, `.env.local` with `SESSION_SECRET`.
**Measure on a production build:** `npm run build && npm run start`. See **PERF.md** for the method and the table to fill in.
`next/font/google` downloads Inter during `npm run build`, so the first build needs internet access.

## What Day 43 adds
| Where | What |
|---|---|
| `components/DishCard.jsx`, `app/menu/[id]/page.js` | Dish art replaced by `next/image`: real `width`/`height` (800x600), `sizes`, meaningful `alt`. |
| `app/page.js` | Hero is `next/image` with `priority` - the only `priority` image in the app. |
| `lib/dishes.js` | Each dish has `image` and `alt`. |
| `public/dishes/*` | Six 800x600 JPEGs and `hero.webp`, rendered from the old plate art by `scripts/make-dish-images.py`. Overwrite with real photographs at the same names/size. |
| `app/layout.js`, `app/globals.css` | `next/font/google` (Inter, latin subset, `display: swap`) applied on `<html>`; first in `--font-sans`. |
| `components/Analytics.jsx` | `next/script`, `lazyOnload`; loads nothing unless `NEXT_PUBLIC_ANALYTICS_SRC` is set. |
| `next.config.mjs` | `images.remotePatterns` (`cdn.addiseats.et`) and AVIF/WebP formats. |
| `.env.example`, `.gitignore` | Public vs server-only variables documented; ignore rule is `.env*.local`. |
| `PERF.md` | Method, before/after tables (to fill from your own Lighthouse runs), what caused each change. |

`DishArt` is kept for the 404 page only.

---

# Addis Eats - Day 42 (middleware and authentication)

Built on the Day 41 project. Same setup: `npm install`, `npm run dev`, `.env.local` with `SESSION_SECRET`.
See **AUTH.md** for every protected route, its three layers, and the three attacks.

## What Day 42 adds
| Where | What |
|---|---|
| `middleware.js` | Layer 1. Redirects to `/signin?next=...` when the cookie is missing or malformed. Matcher: `/checkout` and `/orders` only. |
| `lib/token.js`, `lib/session.js` | Signed, expiring cookie (httpOnly, secure, sameSite, 7-day maxAge) and the one `getSession()` helper. |
| `lib/users.js` | Demo accounts with scrypt-hashed passwords and a `staff` role. |
| `lib/safe-next.js` | Open-redirect check for `next`. |
| `app/signin/*` | Phone + password sign-in; returns to `next` afterwards. |
| `app/actions.js` | `signIn`, `signOut`; `placeOrder` and `cancelOrder` check the session (and ownership) inside. |
| `app/orders/page.js` | Private; query scoped with `getOrdersFor(user.id)`. |
| `app/orders/[id]/page.js`, `app/api/orders/*` | Session + ownership checks; `POST /api/orders` needs a session. |
| `app/kitchen/page.js` | Staff only, checked on the server. |
| `components/AccountMenu.jsx`, `app/api/session/route.js` | Header shows Sign in / name / Sign out / Kitchen without making pages dynamic. |
| `AUTH.md` | Routes, layers, attacks. |

## Try it
Demo accounts: `0911000001` / `almaz-demo`, `0911000002` / `dawit-demo` (customers), `0911000003` / `selam-demo` (staff).
1. Signed out, open `/checkout` -> redirected to `/signin?next=/checkout`, and back to `/checkout` after signing in.
2. Place an order as Almaz; sign out; sign in as Dawit: `/orders` is empty and Almaz's `/orders/ord_...` is a 404 screen.
3. As Almaz open `/kitchen`: "Staff only". As Selam: all orders.
4. `/signin?next=https://evil.com` and `?next=//evil.com`: you land on `/`.

If sign-in seems to do nothing (Safari, or a LAN address), the `secure` cookie was refused over http: add `INSECURE_DEV_COOKIES=1` to `.env.local`.
Orders live in memory, so restarting the server clears them.

---

# Day 41 (kept as is)


Next.js 15 App Router, JavaScript, Tailwind CSS v4, zod, SWR. Built on the Day 39 project (Day 40 was skipped).

    npm install        # adds swr (use install, not ci: package-lock.json is updated by it)
    npm run dev        # http://localhost:3000

See **DATA.md** for every query: its key, refresh rule and one line of reasoning.

## What Day 41 adds
| Where | What |
|---|---|
| `lib/fetcher.js` | The one fetcher for every query; throws `FetchError` for non-OK responses. |
| `app/orders/[id]/page.js` | Server component: renders the order, hands it to the client as the first paint. |
| `app/orders/OrderStatus.jsx` | `useSWR` + `fallbackData`, polls every 5 s, stops when delivered or cancelled. |
| `app/api/orders/[id]/route.js` | `GET` one order (200 / 404), `no-store`. The kitchen is simulated: placed -> preparing (15 s) -> on the way (45 s) -> delivered (90 s). |
| `app/menu/SearchBox.jsx` | Debounced search, `null` key when empty, `keepPreviousData`, paging with `?q=&page=`. |
| `app/api/dishes/route.js` | Now also `?q=&page=` (3 per page). With no query it still returns the full array, as on Day 39. 400 for a bad `page`. |
| `lib/useDebounce.js`, `lib/stages.js` | Small helpers. |
| `app/menu/page.js` | Wraps the existing server-rendered menu in `<SearchBox>` (`<Suspense>`); still static. |
| `app/orders/page.js`, `CheckoutForm.jsx` | "Track" / "Track order" links. |

New endpoints: `GET /api/orders/[id]` (200, 404) and `GET /api/dishes?q=&page=` (200, 400).

## Try it
1. Place an order at `/checkout`, press **Track order**: the page shows the order straight away (no spinner), then moves through the stages by itself.
2. Open `/menu` and type in the search box; clear it to get the full server-rendered menu back. Try `/menu?q=e&page=2` directly: it is a shareable link.

## What the network tab shows while typing
Open DevTools -> Network -> filter **Fetch/XHR**, then type "tibs" at normal speed in the search box.
- **Typing 5 characters fires one request**, not five, 300 ms after the last key: `/api/dishes?q=tibs&page=1`. Nothing is requested for an empty box.
- **No page navigation requests**: the URL changes with `history.replaceState`, so there is no `?_rsc=` request.
- **While it loads, the list stays on screen** (dimmed, "updating...") instead of going blank (`keepPreviousData`).
- **Typing the same term again, or going back to a page, does not repeat the request** (cached for 5 minutes).
- **Order page**: one `/api/orders/ord_...` request right after load, then one every 5 seconds, and none after "delivered". The order is on screen before the first one finishes.

---

## Day 39 (kept as is)

Next.js 15 App Router, JavaScript, Tailwind CSS v4, zod. Built on the Day 38 mini-project.

    npm install
    cp .env.example .env.local   # then set SESSION_SECRET (a .env.local is already included in the ZIP)
    npm run dev                  # http://localhost:3000
    npm run build && npm run start

## Endpoints

Every failure uses one shape: `{ "error": "...", "fieldErrors": { "field": ["message"] } }` (`fieldErrors` only on 422).

| Endpoint | Method | Status codes |
|---|---|---|
| `/api/dishes` | GET | 200 full menu as JSON |
| `/api/dishes/[id]` | GET | 200 the dish; 404 `{ "error": "No such dish" }` |
| `/api/orders` | POST | 201 created (`{ id, total, currency, status }`); 400 body is not JSON; 422 validation failed + `fieldErrors`; 500 server error (details only in the server log) |

Test with curl before touching the UI:

    curl -i localhost:3000/api/dishes
    curl -i localhost:3000/api/dishes/kitfo
    curl -i localhost:3000/api/dishes/pizza                      # 404
    curl -i -X POST localhost:3000/api/orders -H "Content-Type: application/json" \
      -d '{"name":"Abebe","phone":"123","area":"Bole","items":[{"id":"kitfo","qty":1}]}'   # 422, fieldErrors.phone
    curl -i -X POST localhost:3000/api/orders -H "Content-Type: application/json" \
      -d '{"name":"Abebe","phone":"0912345678","area":"Bole","items":[{"id":"kitfo","qty":1}]}'   # 201

## Server actions (`app/actions.js`)

| Action | What it does |
|---|---|
| `placeOrder(prev, formData)` | Replaces the fetch call. Validates with the shared schema, writes, `revalidatePath("/orders")`. Used with `useActionState` (pending flag, field errors). |
| `cancelOrder(orderId)` | Checks the session (401) and that the order belongs to the signed-in user (403) before writing. Returns `{ error, status }` instead of throwing so the UI can show it. |
| `signIn` / `signOut` | Demo sign-in: a signed, httpOnly `session` cookie. Stands in for real auth (Module 4). |

## What changed from Day 38
| File | Change |
|---|---|
| `lib/schema.js` | NEW. The one zod schema (name, TeleBirr phone, delivery area, items) used by the form, the handler and the action. |
| `lib/http.js` | NEW. `errorResponse()`: one error shape. |
| `lib/orders.js` | NEW. In-memory order store (server-only; resets on restart). Prices come from `lib/dishes`, never the request. |
| `lib/session.js` | NEW. Signed-cookie session using `SESSION_SECRET` (server-only). |
| `lib/dishes.js` | `DELIVERY_FEE` moved here so the server and `OrderSummary` share it. |
| `app/api/dishes/route.js`, `app/api/dishes/[id]/route.js`, `app/api/orders/route.js` | NEW route handlers. |
| `app/actions.js` | NEW. `placeOrder`, `cancelOrder`, `signIn`, `signOut`. |
| `app/checkout/CheckoutForm.jsx` | NEW. Form on the server action with `useActionState`; no fetch call. Courtesy check with the same schema. |
| `app/checkout/page.js` | Uses `getSession()`, sign-in box, mounts the form. Still `force-dynamic`. |
| `app/orders/page.js`, `app/orders/CancelButton.jsx` | NEW. Static (cached) orders list; refreshed by `revalidatePath`. |
| `app/providers.jsx` | Cart gets `clear()` (called after an order). |
| `components/NavLinks.jsx` | "Orders" link. |
| `package.json`, `package-lock.json` | Added `zod` 3.23.8. |
| `.env.example`, `.gitignore` | `.env.local` stays ignored; the template is committed. |

## Mini-project check
- [x] `.env.local` is git-ignored (`.env*`); `SESSION_SECRET` has no `NEXT_PUBLIC_` prefix and is read only in `lib/session.js`, which imports `server-only`.
- [x] The fetch call is deleted: the checkout talks to `placeOrder` only. `/api/orders` stays as the endpoint for outside callers (webhook, mobile app).
- [x] Try it: sign in as one name, place an order, open `/orders` (it appears at once), sign in as another name and press Cancel on it -> "That order is not yours."
