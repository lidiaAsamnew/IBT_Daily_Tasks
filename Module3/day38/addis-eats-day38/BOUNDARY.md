# BOUNDARY.md — the server/client line (Day 38)

Rule used: **a component is a client component only if it needs state, effects, event handlers or a browser API.** Everything else stays on the server and ships no JavaScript.

`"use client"` files after sorting (search of the project):

| File | Why it must be client |
|---|---|
| `app/providers.jsx` | Cart context holds state. Isolated so `layout.js` stays a server component. |
| `app/menu/FilterShell.jsx` | Selected-category state and click handlers. Receives `DishList` as `children`. |
| `app/menu/AddToCartButton.jsx` | `onClick` writes to the cart. |
| `components/NavLinks.jsx` | `usePathname` + cart count. Extracted so `NavBar` stays on the server. |
| `components/OrderSummary.jsx` | Reads cart state. |
| `app/menu/error.js` | Error boundaries need `reset` (an event handler). |
| `app/menu/LayoutCounter.jsx` | Day 37 demo: state that survives navigation. |
| `app/menu/ErrorDemo.jsx` | Day 37 demo: button that throws to show `error.js`. |

There is no `useFetch` on `/menu`. Loading and error for that route are `loading.js` and `error.js`, not component state.

| Component | Where | Why |
|---|---|---|
| `app/layout.js`, `Footer.jsx`, `NavBar.jsx` | **Server** | Markup only. `Providers` and `NavLinks` are imported as client leaves / wrappers. |
| `app/providers.jsx` | **Client** | Context requires state. `children` is passed in, so pages stay server-rendered. |
| `app/page.js` (home) | **Server** | Static content. |
| `menu/layout.js`, `menu/CategoryBar.jsx` | **Server** | Sidebar jump links; no hooks. |
| `menu/page.js` | **Server (async)** | Awaits `getDishes()`; no hooks. |
| `menu/DishList.jsx`, `DishSkeleton.jsx` | **Server** | Pure markup from data. |
| `menu/FilterShell.jsx` | **Client** | Filter chips. Does **not** import `DishList`. |
| `components/DishCard.jsx`, `DishArt.jsx` | **Server** | Markup. `DishCard` imports the `AddToCartButton` leaf. |
| `menu/AddToCartButton.jsx` | **Client leaf** | `onClick` + cart. |
| `menu/[id]/page.js` | **Server (async)** | Loads one dish; `generateStaticParams`. |
| `cart/page.js` | **Server** | Page shell; summary is the client leaf. |
| `checkout/page.js` | **Server (async)** | `cookies()`; still a server component. |

## Pass, do not import

`FilterShell` never imports `DishList`. The menu page renders the list on the server and slots it in as `children`. Filtering hides sections with CSS (`data-filter`), so the cards are not pulled into the client bundle.

## First Load JS for `/menu`

From `npm run build` (Next.js 15.5):

| | `/menu` size | First Load JS |
|---|---|---|
| **Before** (Day 37 copy: `"use client"` on whole `NavBar`) | 497 B | **107 kB** |
| **After** (async menu page, boundary on leaves) | 1.15 kB | **107 kB** |

Shared JS stayed **103 kB** (React + Next runtime). First Load JS is printed to the nearest kB, so it looks unchanged.

The `/menu` **route** chunk grew (497 B → 1.15 kB) because this project was already mostly server: there was no `useFetch` and `page.js` was never a client component. Day 38 added real client leaves (`FilterShell`, cart provider, add-to-cart). The dish cards still ship as HTML, not as a client list.

If we had started from `"use client"` on `page.js`, First Load JS would have dropped. Here the win is the boundary, not a smaller rounded total.
