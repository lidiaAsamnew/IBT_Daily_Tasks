# BookHaven

A data-driven online bookstore built with React + Vite as a React learning and portfolio project. Book records come from the public [Open Library API](https://openlibrary.org/developers/api) (no API key). Prices, stock, delivery fees and the promo code are **demo values**; checkout is **simulated**.

## Features
Home, catalog with search / category / price / rating / in-stock filters / sorting / server-side pagination, book details with related books, wishlist, cart with promo code and stock limits, validated checkout, order confirmation, 404, loading skeletons, error + retry states, a local fallback dataset, mobile menu, and a Redux Toolkit lab page. Cart, wishlist and orders persist in `localStorage`.

## Requirements and commands
Node.js 18+ (20+ recommended).
```bash
npm install        # install dependencies
npm run dev        # start the dev server (http://localhost:5173)
npm test           # run the tests
npm run build      # production build into dist/
npm run preview    # serve the production build
```

## How things work
- **Live vs fallback data:** `src/api/openLibrary.js` calls `search.json` (and `works/{id}.json` for details). If the request fails, times out (8 s) or returns a malformed payload, the app uses the 26-book dataset in `src/data/fallbackBooks.js` and shows a banner with a *Retry live data* button. An empty live result is shown as empty, not replaced by fallback data.
- **Honest data:** ratings appear only when Open Library supplies them; the fallback set has no ratings. Sorting/filter options that need missing data are disabled and labelled.
- **Demo prices/stock:** generated from a hash of the book id (stable across refreshes), ETB 300-1,600, 0-12 copies. Delivery: ETB 100, free when the discounted subtotal is at least ETB 2,000. Promo code `BOOK10` = 10% off.
- **Pagination:** live results use the API's `page`/`limit` (12 per page, capped at 100 pages in the UI). Price, rating and stock filters and sorting apply only to the books on the current page.
- **Checkout:** React Hook Form validates name, email, Ethiopian phone, address and city. A valid submit saves an order in `localStorage`, clears the cart afterwards and opens `/checkout/success/:orderId`. No payment data is collected; nothing is sent anywhere.

## Project layout
`src/api` (API + normalization), `src/data` (fallback), `src/store` (cart reducer/context, Zustand wishlist, orders, Redux demo), `src/hooks`, `src/components`, `src/pages`, `src/utils`, `src/test`, `docs/` (brief, architecture, React concept map, testing).

## Verification status (be aware)
Created in an environment **without internet**, so `npm install`, `npm run dev`, `vitest` and `npm run build` were **not run**, and the Open Library endpoints were not called. `package-lock.json` is not included (run `npm install` to generate it). What *was* checked is listed in `docs/TESTING.md`. Expect to fix small issues on first run, and please confirm the live API works in your browser.

## Known limitations
Open Library `subject` values are free-form, so category searches return subject matches rather than a strict taxonomy; book details for live books show an author only when it came from a search result; no real authentication, payments or admin area.
