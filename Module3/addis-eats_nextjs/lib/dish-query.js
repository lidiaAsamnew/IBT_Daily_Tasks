// Pure helpers for filtering, searching and paging dishes. Used by the menu page and /api/dishes.
export const PAGE_SIZE = 6;

export function categoriesOf(dishes, order = []) {
  const found = [...new Set(dishes.map((d) => d.category))];
  const known = order.filter((c) => found.includes(c));
  return [...known, ...found.filter((c) => !known.includes(c))];
}

/**
 * @param {Array} dishes
 * @param {{ q?: string, category?: string, page?: number, pageSize?: number }} opts
 * @returns {{ dishes: Array, total: number, page: number, pages: number }}
 */
export function queryDishes(dishes, { q = "", category = "", page = 1, pageSize = PAGE_SIZE } = {}) {
  const term = String(q).trim().toLowerCase();
  const filtered = dishes.filter((d) => {
    if (category && d.category !== category) return false;
    if (!term) return true;
    return `${d.name} ${d.description ?? ""} ${d.category}`.toLowerCase().includes(term);
  });
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, Number(page) || 1), pages);
  const start = (safePage - 1) * pageSize;
  return { dishes: filtered.slice(start, start + pageSize), total, page: safePage, pages };
}

/** Build a /menu URL from the current filter state; empty values are left out. */
export function menuHref({ category = "", q = "", page = 1 } = {}) {
  const sp = new URLSearchParams();
  if (category) sp.set("category", category);
  if (q) sp.set("q", q);
  if (page > 1) sp.set("page", String(page));
  const s = sp.toString();
  return s ? `/menu?${s}` : "/menu";
}
