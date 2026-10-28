# Testing

Run `npm test` (Vitest + React Testing Library + jsdom). Tests never call the real API: `src/test/setup.js` makes `fetch` fail by default and `api.test.js` stubs responses.

| File | Covers |
|---|---|
| `cart.test.js` | add, merge, remove, quantity bounds, stock limit, subtotal/discount/delivery/total, corrupted storage |
| `catalog.test.js` | fallback data, stable demo prices, search, combined filters, sorting, pagination, de-duplication |
| `api.test.js` | normalization, missing fields, query building, live data, HTTP/network/malformed failures -> fallback |
| `orders.test.js` | order creation, empty cart refusal, lookup, corrupted storage |
| `ui.test.jsx` | book card, wishlist toggle, stock limit button, checkout validation, 404, invalid book id, missing order, mobile menu |

