# Project brief

**BookHaven** is a small, data-driven online bookstore built to learn React and to show a complete customer shopping journey.

- **Goal:** discover books (live Open Library data), save favourites, fill a cart, and finish a *simulated* checkout.
- **Users:** a shopper on phone or desktop. No real accounts, payments or backend.
- **In scope:** home, catalog (search, category, price/rating/stock filters, sorting, pagination), book details, wishlist, cart, checkout, order confirmation, 404, and a Redux Toolkit learning page.
- **Out of scope (on purpose):** admin dashboard, real authentication, payment gateway, newsletter backend, account area.
- **Data honesty:** titles, authors, covers, subjects, years and ratings come from Open Library. **Prices (ETB), stock and the BOOK10 promo are demo values** and are labelled so in the UI.
- **Failure plan:** if Open Library is unreachable the app switches to a built-in 26-book dataset and says so.
