# BOUNDARY.md — the server/client line (Day 38 mini-project)

Rule: **a component is a client component only if it needs state, effects, event handlers or a browser API.** Everything else stays on the server.

| Component | Side | Why (one line) |
|---|---|---|
| `app/layout.js` | Server | Markup only; wraps `children` in `Providers` without importing any page. |
| `app/providers.jsx` | Client | Cart context holds state; isolated so the root layout stays on the server. |
| `components/NavBar.jsx` | Server | Header markup; the interactive links are a child leaf. |
| `components/NavLinks.jsx` | Client | `usePathname` and cart count. |
| `components/Footer.jsx` | Server | Links and copy, no hooks. |
| `app/page.js` | Server | Static home content. |
| `app/menu/layout.js` | Server | Sidebar shell that stays mounted between `/menu` and `/menu/[id]`. |
| `app/menu/CategoryBar.jsx` | Server | Jump links; no state. |
| `app/menu/LayoutCounter.jsx` | Client | `useState` to prove the layout keeps its state. |
| `app/menu/page.js` | Server (async) | Awaits `getDishes()`; no fetching hooks. |
| `app/menu/FilterShell.jsx` | Client | Filter chips. Receives `DishList` as `children`, never imports it. |
| `app/menu/DishList.jsx` | Server | Pure markup from a `dishes` prop. |
| `app/menu/DishSkeleton.jsx` | Server | Loading placeholder. |
| `components/DishCard.jsx` | Server | Markup; imports the add-to-cart leaf. |
| `components/DishArt.jsx` | Server | SVG from data. |
| `app/menu/AddToCartButton.jsx` | Client | `onClick` writes to the cart. |
| `app/menu/ErrorDemo.jsx` | Client | Button that throws so `error.js` can be shown. |
| `app/menu/error.js` | Client | Error boundaries need a `reset` click handler. |
| `app/menu/loading.js` | Server | Segment fallback while the async page awaits. |
| `app/menu/[id]/page.js` | Server (async) | Loads one dish; `generateStaticParams`. |
| `app/cart/page.js` | Server | Page shell; summary is the client leaf. |
| `components/OrderSummary.jsx` | Client | Reads cart state. |
| `app/checkout/page.js` | Server (async) | `cookies()`; still a server component. |
| `app/not-found.js` | Server | Fixed missing-page screen. |
| `lib/dishes.js` | Server module | Data helpers; never marked `"use client"`. |

No callback props cross the boundary. Filter chips keep their handler inside `FilterShell`. Add-to-cart keeps its handler inside `AddToCartButton`. Serialisable props only: category strings and `{ id, name, price }`.

## Is DishList shipped to the browser?

No. `FilterShell` does not import it. The menu page renders `DishList` on the server and slots the finished HTML in as `children`. Filtering only toggles `display` on those sections. Proof: `DishList.jsx` has no `"use client"`, and it is imported only from `page.js` (a server component).

## Check yourself

- **How many `"use client"` files?** Eight: `providers.jsx`, `FilterShell.jsx`, `AddToCartButton.jsx`, `NavLinks.jsx`, `OrderSummary.jsx`, `error.js`, `LayoutCounter.jsx`, `ErrorDemo.jsx`. Each needs state or a handler.
- **Menu without fetching hooks?** Yes. The page awaits `getDishes()`. `loading.js` / `error.js` cover wait and throw.
- **Did First Load JS go down?** See README. The printed `/menu` total stayed 107 kB (kB rounding). This app was already mostly server; new leaves (`FilterShell`, cart) added a small route chunk. The architectural win is that the dish cards are HTML, not a client list.
- **Does `layout.js` import anything with `"use client"`?** It imports `Providers` (the wrapper) and `NavBar` (server, which then imports `NavLinks`). Pages still arrive as `children`, so they stay server-rendered.
- **Why does `error.js` need `"use client"`?** It renders a **Try again** button that calls `reset()`, and event handlers only work in a client component.

## Day 39 additions

| Component | Side | Why (one line) |
|---|---|---|
| `app/checkout/CheckoutForm.jsx` | Client | `useActionState`, cart context, form handlers. Calls the `placeOrder` action. |
| `app/checkout/page.js` | Server (dynamic) | Reads the session cookie; sign-in forms post straight to server actions. |
| `app/orders/page.js` | Server (static) | Lists orders; no hooks. |
| `app/orders/CancelButton.jsx` | Client | `useTransition` for the pending state; the real check is inside `cancelOrder`. |
| `app/actions.js` | Server (`"use server"`) | Public endpoints: each action checks session and input itself. |
| `lib/orders.js`, `lib/session.js` | Server only | Import `server-only`, so importing them from a client file fails the build. |
| `lib/schema.js` | Shared | Pure zod schema, no server code; used by form, handler and action. |
