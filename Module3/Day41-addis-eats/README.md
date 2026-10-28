# Addis Eats - Day 41 (live data: SWR)

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
