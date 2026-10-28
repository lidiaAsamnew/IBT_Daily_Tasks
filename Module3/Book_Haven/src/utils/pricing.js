// Open Library has no prices or stock. BookHaven generates DEMO values that are
// stable per book id (same id -> same price/stock on every refresh).
export function hashId(id) {
  let h = 2166136261;
  for (const ch of String(id)) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const demoPrice = (id) => 300 + (hashId(id) % 131) * 10; // ETB 300-1,600

// 0 = out of stock, otherwise 1-12 copies
export const demoStock = (id) => hashId(`${id}:stock`) % 13;

export const addDemoCommerce = (book) => ({
  ...book,
  price: demoPrice(book.id),
  stock: demoStock(book.id),
});

export const formatETB = (n) => `ETB ${Number(n).toLocaleString('en-US')}`;
