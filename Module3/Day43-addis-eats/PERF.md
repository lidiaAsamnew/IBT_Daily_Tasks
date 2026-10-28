# PERF.md - Day 43: making Addis Eats fast

> **The Lighthouse numbers below are blank on purpose.** They must come from a real run on your
> machine; I could not run Chrome here, and invented numbers would defeat the exercise.
> Fill the tables in, then answer the two questions at the bottom.

## How to measure (same way every time)
1. `npm run build` then `npm run start` - never `npm run dev` (unminified, compiles on demand).
2. Chrome, **Incognito** (extensions skew results) -> DevTools -> **Lighthouse** -> Mobile, Performance only.
   Throttling: Slow 4G network, CPU 4x slowdown (Lighthouse "Mobile" applies this).
3. Page: `/` (it has the hero, which is the LCP element). Run 3 times and write the **median**.
4. **Before** = the Day 42 ZIP (inline SVG art, system fonts). **After** = this project.
   Quick way: keep the Day 42 folder, build it, run Lighthouse, then do the same here.
   Optional step-by-step table: revert one change at a time (see "What changed" below).
5. INP needs a real tap: Lighthouse reports TBT instead. Write TBT in the INP column and say so,
   or read INP from DevTools -> Performance -> Interactions after clicking "Add to cart".

## Results - `/` (median of 3, mobile, throttled, production build)
| | Before (Day 42) | After (Day 43) | Change |
|---|---|---|---|
| Performance score | | | |
| LCP | | | |
| CLS | | | |
| INP / TBT | | | |
| Page weight (Network tab, "transferred") | | | |

## What changed, and what it should do
| # | Change | File(s) | Expected effect | Measured effect |
|---|---|---|---|---|
| 1 | Dish pictures through `next/image` with real `width`/`height`, an honest `sizes` and meaningful `alt` | `components/DishCard.jsx`, `app/menu/[id]/page.js`, `lib/dishes.js` | Browser reserves the 4:3 box before the file arrives (**CLS**). Card images are requested at the card's width, as AVIF/WebP, not as an 800px JPEG (**bytes**). Below-the-fold cards lazy-load. | |
| 2 | `priority` on the hero, and on **nothing else** | `app/page.js` | The hero is the largest image above the fold, so it is the LCP element. `priority` disables lazy-loading and preloads it (**LCP**). | |
| 3 | `next/font` (Inter) instead of the system stack | `app/layout.js`, `app/globals.css` | Self-hosted, no request to Google, `display: swap` plus a size-matched fallback (**CLS**, small). The app never had a `<link>` font tag, so this is an addition, not a swap. | |
| 4 | `next/script` with `lazyOnload` | `components/Analytics.jsx` | The app had no third-party script. This is the pattern for one: nothing loads unless `NEXT_PUBLIC_ANALYTICS_SRC` is set, and then only when the browser is idle. | none while the variable is empty |
| 5 | `remotePatterns` for `cdn.addiseats.et`, AVIF/WebP formats | `next.config.mjs` | No effect today (all images are local). Required the day dish photos move to a CDN. | n/a |
| 6 | `.env.example` updated, `.gitignore` = `.env*.local` | `.env.example`, `.gitignore` | Housekeeping: secrets stay out of git, the next developer knows what to set. | n/a |

Honest caveat on the starting point: Day 42 drew dishes as inline SVG (a few hundred bytes each), so its
page is already light. This project now ships **real image files** (the exercise is about images), which
is why the images below are small to begin with: 6 dish JPEGs of ~14 kB and a 30 kB hero. Swap in real
photographs of the same name and size (800x600) and `next/image` will show its biggest effect: a 2 MB
camera JPEG becoming something under 100 kB per request.

## Environment checklist (slide 24)
- [x] No secret prefixed `NEXT_PUBLIC_`. The only public variable is the optional `NEXT_PUBLIC_ANALYTICS_SRC` (a script URL).
- [x] `.env*.local` is in `.gitignore`; `.env.example` is committed with dummy values only.
- [ ] Every variable set on the hosting platform (Day 48).

## Check yourself (answer after your own run)
1. **Did LCP improve, and what single change did most of it?** _Your answer, from the table above._
   Likely candidates: change 2 (hero `priority`) or change 1 (`next/image` sizing). Your numbers decide, not this guess.
2. **Does the page still jump as it loads? What is not reserving space?** _Your answer from the Lighthouse
   "Avoid large layout shifts" list._ Things to look at: the cart count in the nav (`AccountMenu` loads the
   session client-side), and `/menu` while `SearchBox` swaps lists.
