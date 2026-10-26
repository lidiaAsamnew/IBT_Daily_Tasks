# Addis Eats - Day 38 (server and client components)

Next.js App Router, JavaScript, Tailwind CSS v4, ESLint.

    npm install
    npm run dev        # http://localhost:3000
    npm run build      # check First Load JS for /menu
    npm run start

## What changed from Day 37
| File | Change |
|---|---|
| `app/menu/page.js` | Async server component: `await getDishes()`, no hooks. |
| `app/menu/DishList.jsx` | Receives `dishes` as a prop; no fetch of its own. |
| `app/menu/FilterShell.jsx` | NEW client shell; wraps `DishList` as `children`. |
| `app/providers.jsx` | NEW client wrapper around the cart provider. |
| `app/layout.js` | Stays a server component; wraps the tree in `Providers`. |
| `components/NavBar.jsx` | Server again; highlighting moved into `NavLinks.jsx`. |
| `app/menu/AddToCartButton.jsx` | NEW client leaf. |
| `app/cart/CheckoutButton.jsx` | Removed — a `<Link>` is enough (no `useRouter`). |
| `BOUNDARY.md` | NEW — every component, which side, and First Load JS. |

There was no `useFetch` left on `/menu` from Day 37. Loading still uses `loading.js`; errors still use `error.js`.

See `BOUNDARY.md` for the before/after First Load JS numbers.

## Exercise checklist
1. `/menu` is an async server page that awaits dishes.
2. Filter chips change which sections are visible without reloading.
3. Add a dish — the nav cart count updates; `/cart` and `/checkout` show the same items.
4. Sidebar (Day 37) still stays mounted when you open a dish.
5. `npm run build` — `/menu` stays static (ISR, 1h).
