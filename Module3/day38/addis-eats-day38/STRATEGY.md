# Rendering strategy per route (Day 37)

Two questions for every route: does it depend on who is asking, and how stale may it be?

| Route | Strategy | Controlled by | Why |
|---|---|---|---|
| `/` | Static | nothing (the default) | The story and the specials do not change between builds. |
| `/menu` | ISR, 1 hour | `export const revalidate = 3600` in `app/menu/page.js` | Dishes change occasionally; speed matters most. No `searchParams`, `cookies()` or `headers()`, so it stays static. |
| `/menu/[id]` | Static via params | `generateStaticParams` in `app/menu/[id]/page.js` | Every dish id is known at build time: one HTML file per dish. |
| `/cart` | Static page + client summary | `OrderSummary` is a client leaf | The page is still a server component. Cart lines come from client context. |
| `/checkout` | Dynamic | `cookies()` in `app/checkout/page.js` | Reads the session cookie, which only exists on a real request. |
| not-found | Static | nothing | Fixed screen. |

## Layouts
- `app/layout.js` - owns `<html>` and `<body>`, header, footer, `globals.css`. Wraps every page.
- `app/menu/layout.js` - adds the category sidebar and a counter. Wraps `/menu` and `/menu/[id]` only. It stays mounted when you go from the menu to a dish, so its state survives.
