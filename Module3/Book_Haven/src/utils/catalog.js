export const CATEGORIES = [
  'Fiction', 'Fantasy', 'Science Fiction', 'Mystery', 'Romance',
  'History', 'Biography', 'Science', 'Poetry', 'Children',
];

export const SORTS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'title-asc', label: 'Title A-Z' },
  { value: 'title-desc', label: 'Title Z-A' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Highest rated', needs: 'averageRating' },
  { value: 'newest', label: 'Newest published', needs: 'publishedYear' },
];

export function uniqueById(books) {
  const seen = new Set();
  return books.filter((b) => (seen.has(b.id) ? false : seen.add(b.id)));
}

// Filters combine (AND). `q` and `category` are used for local/fallback data;
// live API results are searched server-side instead.
export function filterBooks(books, f = {}) {
  const q = (f.q || '').trim().toLowerCase();
  return books.filter((b) => {
    if (q) {
      const hay = [b.title, ...b.authors, b.isbn, ...b.categories].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.category && !b.categories.some((c) => c.toLowerCase() === f.category.toLowerCase())) return false;
    if (f.minPrice != null && b.price < f.minPrice) return false;
    if (f.maxPrice != null && b.price > f.maxPrice) return false;
    if (f.minRating && !(b.averageRating >= f.minRating)) return false;
    if (f.inStock && b.stock <= 0) return false;
    return true;
  });
}

const nullsLast = (get) => (a, b) => {
  const x = get(a), y = get(b);
  if (x == null && y == null) return 0;
  if (x == null) return 1;
  if (y == null) return -1;
  return y - x; // descending
};

export function sortBooks(books, key) {
  const list = [...books];
  switch (key) {
    case 'title-asc': return list.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc': return list.sort((a, b) => b.title.localeCompare(a.title));
    case 'price-asc': return list.sort((a, b) => a.price - b.price);
    case 'price-desc': return list.sort((a, b) => b.price - a.price);
    case 'rating': return list.sort(nullsLast((b) => b.averageRating));
    case 'newest': return list.sort(nullsLast((b) => b.publishedYear));
    default: return list; // relevance = original API order
  }
}

export function paginate(items, page, size) {
  const start = (Math.max(1, page) - 1) * size;
  return items.slice(start, start + size);
}
