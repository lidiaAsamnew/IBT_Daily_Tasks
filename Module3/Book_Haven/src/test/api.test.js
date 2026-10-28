import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildQuery, loadCatalog, normalizeDoc } from '../api/openLibrary.js';

afterEach(() => vi.unstubAllGlobals());

describe('normalizeDoc', () => {
  it('maps an Open Library record to the internal model', () => {
    const b = normalizeDoc({ key: '/works/OL1W', title: 'T', author_name: ['A'], cover_i: 7, first_publish_year: 1990, ratings_average: 4.256, ratings_count: 10, subject: ['x', 'y', 'z', 'w'] });
    expect(b.id).toBe('OL1W');
    expect(b.thumbnail).toBe('https://covers.openlibrary.org/b/id/7-M.jpg');
    expect(b.averageRating).toBe(4.3);
    expect(b.categories).toHaveLength(3);
    expect(b.source).toBe('live');
    expect(b.price).toBeGreaterThan(0);
  });
  it('handles missing fields without inventing data', () => {
    const b = normalizeDoc({ key: '/works/OL2W', title: 'Bare' });
    expect(b.authors).toEqual([]);
    expect(b.coverImage).toBeNull();
    expect(b.averageRating).toBeNull();
    expect(b.description).toBe('');
  });
  it('rejects unusable records', () => {
    expect(normalizeDoc(null)).toBeNull();
    expect(normalizeDoc({ title: 'no key' })).toBeNull();
  });
});

describe('buildQuery', () => {
  it('handles text, ISBN, category and default', () => {
    expect(buildQuery('dune', '')).toBe('dune');
    expect(buildQuery('978-0-441-17271-9', '')).toBe('isbn:9780441172719');
    expect(buildQuery('dune', 'Fiction')).toBe('dune subject:"Fiction"');
    expect(buildQuery('', '')).toBe('subject:"fiction"');
  });
});

describe('loadCatalog', () => {
  it('returns live data and removes duplicate records', async () => {
    const doc = { key: '/works/OL9W', title: 'Live Book' };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ numFound: 500, docs: [doc, doc, { nope: 1 }] }) }));
    const r = await loadCatalog({ q: 'x' });
    expect(r.source).toBe('live');
    expect(r.books).toHaveLength(1);
    expect(r.total).toBe(500);
  });
  it('falls back to local data on a network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const r = await loadCatalog({ q: 'dune' });
    expect(r.source).toBe('fallback');
    expect(r.error).toBe('offline');
    expect(r.books.map((b) => b.title)).toContain('Dune');
  });
  it('falls back on HTTP errors and malformed payloads', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({}) }));
    expect((await loadCatalog({})).source).toBe('fallback');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ unexpected: true }) }));
    expect((await loadCatalog({})).error).toBe('Malformed API response');
  });
  it('returns an empty live result as live (not fallback)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ numFound: 0, docs: [] }) }));
    const r = await loadCatalog({ q: 'qqqq' });
    expect(r.source).toBe('live');
    expect(r.books).toHaveLength(0);
  });
});
