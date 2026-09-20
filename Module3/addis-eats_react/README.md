# Addis Eats

Addis Eats is a React restaurant ordering mini-project for IBT College Canada CodeOps Module 3 Day 35.

## Setup

1. Install [Node.js](https://nodejs.org/) (includes npm).
2. Open a terminal in this folder: `Module3/addis-eats_react`.
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the local URL printed in the terminal (usually `http://localhost:5173`).

## Scripts

- `npm run dev` — start the Vite development server
- `npm run build` — create a production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

## Routes

- `/` — Home
- `/menu` — Menu (optional `?category=` filter)
- `/menu/:id` — Dish details
- `/cart` — Cart
- `/signin` — Sign in
- `/checkout` — Checkout (requires sign in)
- unknown paths — Not Found
