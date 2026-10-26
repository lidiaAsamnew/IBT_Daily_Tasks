# Addis Eats - Day 36 mini-project (Next.js App Router)

Move Addis Eats onto Next.js: the whole route tree is built from folders.
Stack: Next.js (App Router), JavaScript, Tailwind CSS v4, ESLint.

## Install and run
    npm install
    npm run dev        # http://localhost:3000
    npm run build      # prints every route it found
    npm run start      # serve the production build
    npm run lint

## Routes and the file that produces each
| URL | File |
|---|---|
| `/` | `app/page.js` |
| `/menu` | `app/menu/page.js` |
| `/menu/kitfo` (any dish id) | `app/menu/[id]/page.js` |
| `/cart` | `app/cart/page.js` |
| `/checkout` | `app/checkout/page.js` |
| any unclaimed URL, or `notFound()` | `app/not-found.js` |

Special files for the menu segment: `app/menu/loading.js`, `app/menu/error.js`.
Root shell: `app/layout.js` (minimal until Day 37).

## Not routes (no page.js beside them)
`app/menu/DishList.jsx` and `app/menu/CategoryBar.jsx` live inside `app/` but
are only components. `/menu/DishList` returns the not-found screen.
Code used by several routes lives outside `app/`: `components/` and `lib/dishes.js`.

## Proving each requirement
| Check | How |
|---|---|
| loading.js renders | open `/menu?slow=1` (waits 2.5 s) |
| error.js renders | open `/menu?error=1`, then press "Try again" |
| not-found by bad URL | open `/no-such-page` |
| not-found by `notFound()` | open `/menu/pizza` |
| dish page by direct URL | type `/menu/kitfo` in the address bar |
| params from props, not a hook | `app/menu/[id]/page.js` |
| `useRouter` | "Continue to checkout" on `/cart` (`app/cart/CheckoutButton.jsx`) |
| only next/link between routes | every internal navigation uses `<Link>`; there are no `<a>` tags |

## Notes
- Dishes are drawn as SVG plates (`components/DishArt.jsx`), so there are no image files.
- The cart/checkout order is a fixed preview; a working cart comes in a later lesson.
