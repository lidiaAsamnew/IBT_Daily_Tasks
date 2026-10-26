# Addis Eats - Day 37 (layouts and rendering strategies)

Next.js App Router, JavaScript, Tailwind CSS v4, ESLint.

    npm install
    npm run dev        # http://localhost:3000
    npm run build      # read the route table: circle = static, lambda/f = dynamic
    npm run start

## What changed from Day 36
| File | Change |
|---|---|
| `app/menu/layout.js` | NEW - category sidebar + counter, wraps `/menu` and `/menu/[id]` |
| `app/menu/LayoutCounter.jsx` | NEW - client counter that proves layout state survives |
| `app/menu/CategoryBar.jsx` | Rewritten as the sidebar (jump links to `/menu#meat` etc.) |
| `app/menu/page.js` | Now `revalidate = 3600`, no `searchParams`; dish list wrapped in `<Suspense>` |
| `app/menu/DishList.jsx` | Now an async server component that fetches its own data |
| `app/menu/DishSkeleton.jsx` | NEW - shared by the Suspense fallback and `loading.js` |
| `app/menu/ErrorDemo.jsx` | NEW - button that triggers `error.js` (replaces `?error=1`) |
| `app/menu/[id]/page.js` | Added `generateStaticParams` |
| `app/checkout/page.js` | Added a `cookies()` read |
| `lib/dishes.js` | Added `getDishes()` with a simulated delay |
| `STRATEGY.md` | NEW - every route, strategy and reason |

## Exercise checklist (run `npm run build` after each)
1. **Root layout** - `app/layout.js` has `<html>`, `<body>`, header, footer, `globals.css`. It is the only file with those tags.
2. **Menu layout** - open `/menu`, click a dish: the sidebar does not disappear.
3. **Counter** - press + a few times in the sidebar, open a dish, the count stays.
4. **revalidate** - `/menu` should still show the static (circle) marker, with a 1h revalidate.
5. **generateStaticParams** - `/menu/[id]` should list `/menu/kitfo`, `/menu/tibs`, `/menu/shiro` and `[+3 more paths]`: 6 pages, one per dish.
6. **cookies()** - `/checkout` should change from circle to lambda/f (dynamic). To see the cookie used, run `document.cookie = "session=Lidia; path=/"` in the browser console and reload `/checkout`.
7. **Suspense** - see "Seeing the streaming" below.

## Seeing the streaming (exercise 7)
`getDishes()` waits 1.2 s. In `npm run dev` every page is rendered on request, so
reload `/menu`: header, sidebar and title appear first, then a skeleton, then the dishes.
In a production build `/menu` is prebuilt, so the dishes are already in the HTML and the
delay is only paid at build time (and on hourly regeneration). That is the point of ISR.

## Other checks
- `error.js`: open `/menu`, press "Trigger error.js" at the bottom. The sidebar stays; press "Try again".
- not-found: `/menu/pizza` and `/no-such-page`.
- The Day 36 `?slow=1` and `?error=1` helpers were removed: reading `searchParams` makes `/menu` dynamic.
