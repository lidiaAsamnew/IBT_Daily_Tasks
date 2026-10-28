// Open Library (https://openlibrary.org/developers/api): free, no API key.
// Uses /search.json (pagination via page+limit) and /works/{id}.json (details).
// NOTE: endpoints/fields follow the public docs; they were NOT called from the
// build environment (no network), so run the app once online to confirm.
import { addDemoCommerce } from '../utils/pricing.js';
import { FALLBACK_BOOKS } from '../data/fallbackBooks.js';
import { filterBooks, paginate, uniqueById } from '../utils/catalog.js';

export const PAGE_SIZE = 12;
const BASE = 'https://openlibrary.org';
const FIELDS = 'key,title,author_name,cover_i,first_publish_year,subject,isbn,number_of_pages_median,ratings_average,ratings_count,language,publisher';
const cache = new Map(); // id -> book (session cache so details never re-guess data)

async function getJSON(url, { signal, timeout = 8000 } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  signal?.addEventListener('abort', () => ctrl.abort(), { once: true });
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { status: res.status });
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export function normalizeDoc(doc) {
  if (!doc || !doc.key || !doc.title) return null;
  const id = String(doc.key).replace('/works/', '');
  const cover = doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}` : null;
  return addDemoCommerce({
    id,
    title: String(doc.title),
    authors: Array.isArray(doc.author_name) ? doc.author_name : [],
    description: '',
    coverImage: cover && `${cover}-L.jpg`,
    thumbnail: cover && `${cover}-M.jpg`,
    categories: Array.isArray(doc.subject) ? doc.subject.slice(0, 3) : [],
    publisher: doc.publisher?.[0] || '',
    publishedYear: doc.first_publish_year || null,
    pageCount: doc.number_of_pages_median || null,
    isbn: doc.isbn?.[0] || '',
    language: doc.language?.[0] || '',
    averageRating: typeof doc.ratings_average === 'number' ? Math.round(doc.ratings_average * 10) / 10 : null,
    ratingsCount: doc.ratings_count || 0,
    previewLink: '',
    infoLink: `${BASE}/works/${id}`,
    source: 'live',
  });
}

export function buildQuery(q, category) {
  const term = (q || '').trim();
  const parts = [];
  if (term) parts.push(/^[\d-]{10,17}$/.test(term) ? `isbn:${term.replace(/-/g, '')}` : term);
  if (category) parts.push(`subject:"${category}"`);
  return parts.join(' ') || 'subject:"fiction"';
}

// Returns { books, total, source: 'live' | 'fallback', error }. Falls back to the
// local dataset when the live request fails (and says so via `source`/`error`).
export async function loadCatalog({ q = '', category = '', page = 1, signal } = {}) {
  try {
    const url = `${BASE}/search.json?q=${encodeURIComponent(buildQuery(q, category))}&page=${page}&limit=${PAGE_SIZE}&fields=${FIELDS}`;
    const data = await getJSON(url, { signal });
    if (!data || !Array.isArray(data.docs)) throw new Error('Malformed API response');
    const books = uniqueById(data.docs.map(normalizeDoc).filter(Boolean));
    books.forEach((b) => cache.set(b.id, b));
    return { books, total: Number(data.numFound) || books.length, source: 'live', error: null };
  } catch (err) {
    if (signal?.aborted) throw err;
    const matches = filterBooks(FALLBACK_BOOKS, { q, category });
    matches.forEach((b) => cache.set(b.id, b));
    return { books: paginate(matches, page, PAGE_SIZE), total: matches.length, source: 'fallback', error: err.message };
  }
}

// Book by id: cache -> local dataset -> live work record. Returns null if not found.
export async function getBook(id, signal) {
  let book = cache.get(id) || FALLBACK_BOOKS.find((b) => b.id === id) || null;
  if (book?.source === 'fallback') return book;
  if (!/^OL\d+W$/.test(id)) return null;
  try {
    const work = await getJSON(`${BASE}/works/${id}.json`, { signal });
    const d = work.description;
    const description = (typeof d === 'string' ? d : d?.value || '').slice(0, 1500);
    const cover = work.covers?.[0] ? `https://covers.openlibrary.org/b/id/${work.covers[0]}` : null;
    book = {
      ...(book || addDemoCommerce({
        id, title: work.title || 'Untitled', authors: [], categories: (work.subjects || []).slice(0, 3),
        publishedYear: null, pageCount: null, isbn: '', language: '', publisher: '',
        averageRating: null, ratingsCount: 0, previewLink: '', infoLink: `${BASE}/works/${id}`, source: 'live',
        coverImage: cover && `${cover}-L.jpg`, thumbnail: cover && `${cover}-M.jpg`,
      })),
      description,
    };
    cache.set(id, book);
    return book;
  } catch (err) {
    if (err.status === 404) return null;
    if (book) return book; // keep search-result data if only the enrichment call failed
    throw err;
  }
}

export function relatedBooks(book, limit = 4) {
  const pool = uniqueById([...cache.values(), ...FALLBACK_BOOKS]);
  const cats = book.categories.map((c) => c.toLowerCase());
  return pool
    .filter((b) => b.id !== book.id &&
      (b.authors.some((a) => book.authors.includes(a)) || b.categories.some((c) => cats.includes(c.toLowerCase()))))
    .slice(0, limit);
}
