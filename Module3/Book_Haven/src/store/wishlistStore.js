// Zustand: a small store with no Provider, used for the wishlist. Context is used
// for the cart (needs reducer + toast); Zustand shows the lighter alternative.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const snapshot = (b) => ({
  id: b.id, title: b.title, authors: b.authors, thumbnail: b.thumbnail, coverImage: b.coverImage,
  categories: b.categories, publishedYear: b.publishedYear, averageRating: b.averageRating,
  ratingsCount: b.ratingsCount, price: b.price, stock: b.stock, source: b.source,
});

export const useWishlist = create(
  persist(
    (set) => ({
      items: [],
      toggle: (book) => set((s) => (s.items.some((b) => b.id === book.id)
        ? { items: s.items.filter((b) => b.id !== book.id) }
        : { items: [...s.items, snapshot(book)] })),
    }),
    { name: 'bookhaven-wishlist', partialize: (s) => ({ items: s.items }) },
  ),
);
