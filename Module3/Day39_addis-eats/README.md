# Addis Eats - Day 39 (API routes, route handlers, server actions)

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
