import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard.jsx';
import { SkeletonGrid } from '../components/States.jsx';
import { useBooks } from '../hooks/useBooks.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { CATEGORIES } from '../utils/catalog.js';

export default function Home() {
  useDocumentTitle('');
  const { books, status, source } = useBooks({});
  const rated = books.filter((b) => b.averageRating >= 4).slice(0, 4);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Your next favourite book</p>
        <h1>Find a story worth staying up for.</h1>
        <p>Browse real book records from Open Library, save favourites and check out in a few taps.</p>
        <Link className="btn btn--accent" to="/books">Browse the catalog</Link>
      </section>

      <section aria-labelledby="cats">
        <h2 id="cats">Explore by category</h2>
        <ul className="chips">
          {CATEGORIES.map((c) => <li key={c}><Link to={`/books?category=${encodeURIComponent(c)}`}>{c}</Link></li>)}
        </ul>
      </section>

      <section aria-labelledby="featured">
        <h2 id="featured">Featured books</h2>
        {source === 'fallback' && status === 'ready' && <p className="notice" role="status">Showing the built-in demo collection (live data unavailable).</p>}
        {status === 'loading' ? <SkeletonGrid count={4} /> : (
          <div className="grid">{books.slice(0, 4).map((b) => <BookCard key={b.id} book={b} />)}</div>
        )}
      </section>

      {rated.length > 0 && (
        <section aria-labelledby="rated">
          <h2 id="rated">Highly rated</h2>
          <p className="muted">Ratings come from Open Library readers.</p>
          <div className="grid">{rated.map((b) => <BookCard key={b.id} book={b} />)}</div>
        </section>
      )}
    </>
  );
}
