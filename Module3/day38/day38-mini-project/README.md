# Addis Eats - Day 38 mini-project (sorting the boundary)

Next.js App Router, JavaScript, Tailwind CSS v4, ESLint.

    npm install
    npm run dev        # http://localhost:3000
    npm run build      # First Load JS for /menu is in the table below
    npm run start

## First Load JS for `/menu`

From `npm run build` (Next.js 15.5), copied from the terminal:

| | `/menu` size | First Load JS |
|---|---|---|
| **Before** (Day 37 copy: `"use client"` on whole `NavBar`) | 496 B | **107 kB** |
| **After** (async menu page, boundary on leaves) | 1.15 kB | **107 kB** |

Shared JS was **103 kB** in the before build (React + Next runtime). First Load JS is printed to the nearest kB.

The route chunk may grow slightly because this project was already mostly server (no `useFetch`, `page.js` was never a client component). Day 38 adds `FilterShell`, the cart provider and add-to-cart. `DishList` still ships as HTML.

## What changed from Day 37
| File | Change |
|---|---|
| `app/menu/page.js` | Async server component: `await getDishes()`. |
| `app/menu/DishList.jsx` | Receives `dishes`; no fetch of its own. |
| `app/menu/FilterShell.jsx` | Client shell; wraps `DishList` as `children`. |
| `app/providers.jsx` | Client cart provider; `layout.js` stays a server component. |
| `components/NavBar.jsx` | Server again; highlighting moved to `NavLinks.jsx`. |
| `app/menu/AddToCartButton.jsx` | Client leaf. |
| `app/cart/CheckoutButton.jsx` | Removed — a `<Link>` is enough. |
| `BOUNDARY.md` | Every component, which side, one-line reason. |

Day 37 behaviour kept: menu ISR (`revalidate = 3600`), `generateStaticParams`, checkout `force-dynamic` + `cookies()`, nested menu layout + counter.

## Mini-project checklist
- [x] Menu and dish routes are async server components with no fetching hooks.
- [x] `"use client"` only on the smallest component that needs it.
- [x] `Providers` wraps `children`; `layout.js` is still a server component.
- [x] `FilterShell` receives server-rendered `DishList` through `children`.
- [x] No callback props from server to client.
- [x] `BOUNDARY.md` lists every component.
- [x] Before/after First Load JS for `/menu` in this README.
