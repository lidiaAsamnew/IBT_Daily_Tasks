import { STAGES } from "./stages";

// Day 46: sorting and paging for the order table, driven by the URL (?sort=total&dir=desc&page=3).
// Everything that arrives from the URL is untrusted: an unknown column, direction or page falls back
// to the default instead of throwing, so a hand-edited link can never break the page.
// Stands in for the database: with Prisma this becomes orderBy / skip / take, and only one page of
// rows ever leaves the database.

const STATUS_RANK = Object.fromEntries([...STAGES, "cancelled"].map((s, i) => [s, i]));

export const SORTS = {
  date: { label: "Placed", value: (o) => o.createdAt, defaultDir: "desc" },
  area: { label: "Area", value: (o) => o.area, defaultDir: "asc" },
  stage: { label: "Status", value: (o) => STATUS_RANK[o.stage] ?? 99, defaultDir: "asc" },
  total: { label: "Total", value: (o) => o.total, defaultDir: "desc" },
};
export const DEFAULT_SORT = "date";

const first = (v) => (Array.isArray(v) ? v[0] : v);

/** Raw searchParams -> { sort, dir, page } that are always valid. */
export function parseTableParams(searchParams = {}) {
  const sortParam = first(searchParams.sort);
  const sort = Object.hasOwn(SORTS, sortParam) ? sortParam : DEFAULT_SORT;
  const dirParam = first(searchParams.dir);
  const dir = dirParam === "asc" || dirParam === "desc" ? dirParam : SORTS[sort].defaultDir;
  const n = Number.parseInt(first(searchParams.page) ?? "1", 10);
  const page = Number.isFinite(n) && n >= 1 ? n : 1;
  return { sort, dir, page };
}

/** Sort, then cut one page. Returns the page plus the numbers the pager needs. */
export function queryOrders(rows, { sort, dir, page }, pageSize) {
  const get = SORTS[sort].value;
  const sign = dir === "asc" ? 1 : -1;
  const sorted = [...rows].sort((a, b) => {
    const x = get(a), y = get(b);
    const by = typeof x === "string" ? x.localeCompare(y) : x - y;
    // Ties always fall back to newest first, then id, so the order is stable between requests.
    return by * sign || b.createdAt - a.createdAt || a.id.localeCompare(b.id);
  });
  const total = sorted.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, pages); // ?page=999 shows the last page rather than an empty one
  const start = (current - 1) * pageSize;
  return { rows: sorted.slice(start, start + pageSize), total, page: current, pages, pageSize, sort, dir };
}

/** Builds a link that keeps the other query parameters (e.g. ?data=sample) and changes some. */
export function hrefFor(basePath, keep, changes = {}) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...keep, ...changes })) {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
