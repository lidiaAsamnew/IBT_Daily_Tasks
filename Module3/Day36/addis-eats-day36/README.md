# Addis Eats - Day 36 (Next.js intro and file-based routing)

Next.js App Router, JavaScript, Tailwind CSS, ESLint.

## Install and run
    npm install
    npm run dev        # http://localhost:3000

## Verify the routes
    npm run build      # lists every route it found
    npm run start      # serve the production build
    npm run lint

## Routes
| File | URL |
|---|---|
| app/page.js | / |
| app/menu/page.js | /menu |
| app/menu/[id]/page.js | /menu/kitfo |
| app/cart/page.js | /cart |
| app/checkout/page.js | /checkout |
| app/not-found.js | any unclaimed path, or notFound() |

## Forcing the special files
- loading.js: open /menu?slow=1 (page waits 2.5 s)
- error.js:   open /menu?error=1 (page throws)
- not-found:  open /menu/pizza or /anything-else

## Using your own Day 35 components
app/menu/DishList.jsx, CategoryBar.jsx and dishes.js are starter versions.
Replace them with yours; they stay beside the menu route and create no route.

## Git
    git init && git add . && git commit -m "Day 36: Next.js route tree"
