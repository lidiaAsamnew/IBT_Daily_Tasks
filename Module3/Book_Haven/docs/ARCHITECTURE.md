# Architecture: component tree, state placement, routes, build plan

## Component tree
```
main.jsx  BrowserRouter > CartProvider
  App (Routes, lazy pages)
    Layout (header, mobile menu, footer, ErrorBoundary, Suspense, Outlet)
      Home        -> BookCard, SkeletonGrid
      Catalog     -> BookCard, SkeletonGrid, EmptyState, ErrorBox
      BookDetails -> Cover, BookCard (related), EmptyState, ErrorBox
      Wishlist    -> BookCard, EmptyState
      Cart        -> Cover, Totals, EmptyState
      Checkout    -> Field, Totals, EmptyState
      OrderSuccess-> Totals, EmptyState
      StateLab    -> Redux Provider > GoalDemo
      NotFound    -> EmptyState
BookCard -> Cover
```

## State placement
| State | Where | Why |
|---|---|---|
| Cart items, promo | Context + `useReducer` (`store/CartContext.jsx`, `cartReducer.js`) | Many distant components read/change it; several related actions |
| Cart persistence | `localStorage` key `bookhaven-cart`, sanitized on load | Survives refresh; bad data is dropped |
| Wishlist | Zustand + `persist` (`store/wishlistStore.js`) | Simple toggle, no Provider; shows the Context alternative |
| Orders | `localStorage` key `bookhaven-orders` (`store/orders.js`) | Confirmation page survives refresh |
| Search text, filters, sort, page | **URL query string** (`useSearchParams`) | Shareable, back-button friendly |
| Search input while typing | `useState` + `useDebounce` | Avoids a request per keystroke |
| Catalog request status | `useBooks` hook (`useState` + `useEffect` + `AbortController`) | Cancels outdated requests |
| Book details, quantity picker | Local `useState` in `BookDetails` | Only that page needs it |
| Mobile menu open | Local `useState` in `Layout` | Only the header needs it |
| Toast message | `useState` in `CartProvider` | Tied to cart actions |
| Reading-goal demo | Redux Toolkit store (lab only) | Learning example, isolated |

## Routes
| Path | Page |
|---|---|
| `/` | Home |
| `/books` | Catalog (`?q&category&page&sort&minPrice&maxPrice&minRating&inStock`) |
| `/books/:bookId` | Book details |
| `/wishlist`, `/cart`, `/checkout` | Wishlist, cart, checkout |
| `/checkout/success/:orderId` | Order confirmation |
| `/lab/state-management` | State-management lab |
| `*` | 404 |

Categories are a catalog filter (`/books?category=Fantasy`) rather than a separate route.

## Build plan (vertical slices)
1. Foundation: Vite, routing, design tokens, layout. 2. API layer + normalization + fallback data. 3. Catalog slice. 4. Details, cart, wishlist. 5. Checkout and orders. 6. State lab. 7. Tests and docs.
