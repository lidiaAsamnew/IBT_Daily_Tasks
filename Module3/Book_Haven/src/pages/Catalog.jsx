import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import BookCard from '../components/BookCard.jsx';
import { EmptyState, ErrorBox, SkeletonGrid } from '../components/States.jsx';
import { useBooks } from '../hooks/useBooks.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { PAGE_SIZE } from '../api/openLibrary.js';
import { CATEGORIES, SORTS, filterBooks, sortBooks } from '../utils/catalog.js';

const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : null; };

export default function Catalog() {
  useDocumentTitle('Books');
  const [params, setParams] = useSearchParams();

  // URL is the source of truth; invalid values fall back to safe defaults.
  const q = params.get('q') || '';
  const category = CATEGORIES.includes(params.get('category')) ? params.get('category') : '';
  const page = Math.max(1, parseInt(params.get('page'), 10) || 1);
  const sort = SORTS.some((s) => s.value === params.get('sort')) ? params.get('sort') : 'relevance';
  const minPrice = num(params.get('minPrice'));
  const maxPrice = num(params.get('maxPrice'));
  const minRating = num(params.get('minRating')) || 0;
  const inStock = params.get('inStock') === '1';

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v === '' || v == null || v === false ? next.delete(k) : next.set(k, String(v))));
    if (!('page' in changes)) next.delete('page'); // any filter change returns to page 1
    setParams(next);
  };

  const [text, setText] = useState(q);
  const debounced = useDebounce(text);
  useEffect(() => { if (debounced !== q) update({ q: debounced }); }, [debounced]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => setText(q), [q]);

  const { books, total, status, source, error, retry } = useBooks({ q, category, page });
  const visible = sortBooks(filterBooks(books, { minPrice, maxPrice, minRating, inStock }), sort);
  const hasRatings = books.some((b) => b.averageRating != null);
  const totalPages = Math.min(Math.ceil(total / PAGE_SIZE) || 1, 100);
  const filtered = q || category || minPrice != null || maxPrice != null || minRating || inStock || sort !== 'relevance';

  return (
    <>
      <h1>Books</h1>
      <div className="toolbar">
        <div className="field">
          <label htmlFor="q">Search title, author or ISBN</label>
          <div className="with-btn">
            <input id="q" type="search" value={text} onChange={(e) => setText(e.target.value)} />
            {text && <button className="icon-btn" aria-label="Clear search" onClick={() => { setText(''); update({ q: '' }); }}><X size={16} aria-hidden="true" /></button>}
          </div>
        </div>
        <div className="field">
          <label htmlFor="cat">Category</label>
          <select id="cat" value={category} onChange={(e) => update({ category: e.target.value })}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="sort">Sort by</label>
          <select id="sort" value={sort} onChange={(e) => update({ sort: e.target.value })}>
            {SORTS.map((s) => {
              const missing = s.needs && !books.some((b) => b[s.needs] != null);
              return <option key={s.value} value={s.value} disabled={missing}>{s.label}{missing ? ' (no data on this page)' : ''}</option>;
            })}
          </select>
        </div>
        <div className="field">
          <label htmlFor="minPrice">Min price (ETB)</label>
          <input id="minPrice" type="number" min="0" value={minPrice ?? ''} onChange={(e) => update({ minPrice: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="maxPrice">Max price (ETB)</label>
          <input id="maxPrice" type="number" min="0" value={maxPrice ?? ''} onChange={(e) => update({ maxPrice: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="rating">Minimum rating</label>
          <select id="rating" value={minRating} onChange={(e) => update({ minRating: e.target.value })} disabled={!hasRatings}>
            <option value="0">{hasRatings ? 'Any' : 'No rating data on this page'}</option>
            <option value="3">3 stars and up</option>
            <option value="4">4 stars and up</option>
          </select>
        </div>
        <label className="check"><input type="checkbox" checked={inStock} onChange={(e) => update({ inStock: e.target.checked })} /> In stock only (demo)</label>
        <button className="btn btn--ghost" onClick={() => setParams({})} disabled={!filtered}>Clear all filters</button>
      </div>

      {status === 'ready' && source === 'fallback' && (
        <p className="notice" role="status">
          Live Open Library data couldn&apos;t be loaded{error ? ` (${error})` : ''}, so you&apos;re browsing the built-in demo collection.{' '}
          <button className="link-btn" onClick={retry}>Retry live data</button>
        </p>
      )}
      {status === 'ready' && source === 'live' && <p className="muted small">Live results from Open Library. Prices and stock are demo values. Price, rating and stock filters apply to the books on this page.</p>}

      {status === 'loading' && <SkeletonGrid count={PAGE_SIZE} />}
      {status === 'error' && <ErrorBox message={error || 'Unknown error'} onRetry={retry} />}
      {status === 'ready' && (
        visible.length === 0 ? (
          <EmptyState title="No books match" actionLabel="Clear all filters" onAction={() => setParams({})}>
            Try a different search or remove some filters.
          </EmptyState>
        ) : (
          <>
            <p aria-live="polite"><strong>{visible.length}</strong> shown on this page - {total.toLocaleString()} total matches</p>
            <div className="grid">{visible.map((b) => <BookCard key={b.id} book={b} />)}</div>
            <nav className="pager" aria-label="Pagination">
              <button className="btn btn--ghost" disabled={page <= 1} onClick={() => update({ page: page - 1 })}>Previous</button>
              <span>Page {Math.min(page, totalPages)} of {totalPages}</span>
              <button className="btn btn--ghost" disabled={page >= totalPages} onClick={() => update({ page: page + 1 })}>Next</button>
            </nav>
          </>
        )
      )}
    </>
  );
}
