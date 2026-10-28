import { describe, expect, it } from 'vitest';
import { FALLBACK_BOOKS } from '../data/fallbackBooks.js';
import { filterBooks, paginate, sortBooks, uniqueById } from '../utils/catalog.js';
import { demoPrice, demoStock } from '../utils/pricing.js';

describe('fallback data', () => {
  it('has at least 20 books with demo price and stock', () => {
    expect(FALLBACK_BOOKS.length).toBeGreaterThanOrEqual(20);
    expect(FALLBACK_BOOKS.every((b) => b.price >= 300 && b.stock >= 0 && b.averageRating === null)).toBe(true);
  });
  it('demo price and stock are stable per id', () => {
    expect(demoPrice('OL1W')).toBe(demoPrice('OL1W'));
    expect(demoStock('OL1W')).toBe(demoStock('OL1W'));
  });
});

describe('search and filters', () => {
  it('searches title and author case-insensitively', () => {
    expect(filterBooks(FALLBACK_BOOKS, { q: 'DUNE' }).map((b) => b.title)).toContain('Dune');
    expect(filterBooks(FALLBACK_BOOKS, { q: 'le guin' })).toHaveLength(2);
  });
  it('combines filters instead of overwriting', () => {
    const r = filterBooks(FALLBACK_BOOKS, { q: 'christie', category: 'Mystery', inStock: true });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((b) => b.authors[0] === 'Agatha Christie' && b.stock > 0)).toBe(true);
    expect(filterBooks(FALLBACK_BOOKS, { q: 'christie', category: 'Poetry' })).toHaveLength(0);
  });
  it('filters by price range and rating', () => {
    expect(filterBooks(FALLBACK_BOOKS, { minPrice: 1000, maxPrice: 1200 }).every((b) => b.price >= 1000 && b.price <= 1200)).toBe(true);
    expect(filterBooks(FALLBACK_BOOKS, { minRating: 4 })).toHaveLength(0);
  });
  it('returns an empty list for no matches', () => {
    expect(filterBooks(FALLBACK_BOOKS, { q: 'zzzzqqq' })).toHaveLength(0);
  });
});

describe('sorting and pagination', () => {
  const base = FALLBACK_BOOKS.slice(0, 6);
  it('sorts by title both ways', () => {
    const asc = sortBooks(base, 'title-asc').map((b) => b.title);
    expect(asc).toEqual([...asc].sort((a, b) => a.localeCompare(b)));
    expect(sortBooks(base, 'title-desc')[0].title).toBe(asc[asc.length - 1]);
  });
  it('sorts by price', () => {
    const p = sortBooks(base, 'price-asc').map((b) => b.price);
    expect(p).toEqual([...p].sort((a, b) => a - b));
  });
  it('puts missing ratings last and newest first', () => {
    const list = [{ ...base[0], averageRating: null }, { ...base[1], averageRating: 4.5 }];
    expect(sortBooks(list, 'rating')[0].averageRating).toBe(4.5);
    expect(sortBooks(base, 'newest')[0].publishedYear).toBe(Math.max(...base.map((b) => b.publishedYear)));
  });
  it('paginates and de-duplicates', () => {
    expect(paginate(FALLBACK_BOOKS, 1, 12)).toHaveLength(12);
    expect(paginate(FALLBACK_BOOKS, 3, 12)).toHaveLength(FALLBACK_BOOKS.length - 24);
    expect(uniqueById([...base, ...base])).toHaveLength(6);
  });
});
