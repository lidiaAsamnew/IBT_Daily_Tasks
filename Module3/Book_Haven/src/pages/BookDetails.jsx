import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import BookCard from '../components/BookCard.jsx';
import Cover from '../components/Cover.jsx';
import { EmptyState, ErrorBox } from '../components/States.jsx';
import { getBook, relatedBooks } from '../api/openLibrary.js';
import { useCart } from '../hooks/useCart.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useWishlist } from '../store/wishlistStore.js';
import { formatETB } from '../utils/pricing.js';

export default function BookDetails() {
  const { bookId } = useParams();
  const [state, setState] = useState({ status: 'loading', book: null });
  const [qty, setQty] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const { add, remove, qtyOf } = useCart();
  const wished = useWishlist((s) => s.items.some((b) => b.id === bookId));
  const toggle = useWishlist((s) => s.toggle);
  useDocumentTitle(state.book?.title);

  useEffect(() => {
    const ctrl = new AbortController();
    setState({ status: 'loading', book: null });
    setQty(1);
    getBook(bookId, ctrl.signal)
      .then((book) => { if (!ctrl.signal.aborted) setState(book ? { status: 'ready', book } : { status: 'missing', book: null }); })
      .catch(() => { if (!ctrl.signal.aborted) setState({ status: 'error', book: null }); });
    return () => ctrl.abort();
  }, [bookId, attempt]);

  if (state.status === 'loading') return <p className="state" role="status">Loading book...</p>;
  if (state.status === 'error') return <ErrorBox message="The book service did not respond." onRetry={() => setAttempt((n) => n + 1)} />;
  if (state.status === 'missing') {
    return <EmptyState title="Book not found" actionLabel="Back to the catalog" to="/books">We couldn&apos;t find a book with that ID.</EmptyState>;
  }

  const { book } = state;
  const inCart = qtyOf(book.id) > 0;
  const room = book.stock - qtyOf(book.id); // copies still addable
  const chosen = Math.max(1, Math.min(qty, room));
  const facts = [
    ['First published', book.publishedYear], ['Publisher', book.publisher], ['ISBN', book.isbn],
    ['Language', book.language], ['Pages', book.pageCount], ['Category', book.categories.join(', ')],
  ].filter(([, v]) => v);
  const related = relatedBooks(book);

  return (
    <>
      <p><Link to="/books">&larr; Continue shopping</Link></p>
      <div className="detail">
        <div className="detail__cover"><Cover book={book} large /></div>
        <div>
          <h1>{book.title}</h1>
          <p className="muted">by {book.authors.join(', ') || 'Unknown author'}</p>
          {book.averageRating != null && <p className="rating">{book.averageRating} / 5 <span className="muted">({book.ratingsCount} ratings on Open Library)</span></p>}
          <p>{book.description || 'No description is available for this book yet.'}</p>
          <dl className="facts">{facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          {book.source === 'fallback' && <p className="muted small">This record comes from BookHaven&apos;s built-in demo collection.</p>}
          {book.infoLink && <p><a href={book.infoLink} target="_blank" rel="noreferrer">View on Open Library</a></p>}

          <div className="buybox">
            <p className="price">{formatETB(book.price)} <small>Demo price</small></p>
            <p className={book.stock > 0 ? 'stock' : 'stock stock--out'}>{book.stock > 0 ? `${book.stock} in stock (demo inventory)` : 'Out of stock (demo inventory)'}</p>
            {!inCart && room > 0 && (
              <div className="field field--inline">
                <label htmlFor="qty">Quantity</label>
                <select id="qty" value={chosen} onChange={(e) => setQty(Number(e.target.value))}>
                  {Array.from({ length: Math.min(room, 10) }, (_, i) => <option key={i + 1}>{i + 1}</option>)}
                </select>
              </div>
            )}
            {inCart && <p className="small muted">In your cart ({qtyOf(book.id)}). Change quantity in the cart page.</p>}
            <div className="row">
              {inCart ? (
                <button className="btn btn--remove" onClick={() => remove(book.id)}>Remove from cart</button>
              ) : (
                <button className="btn" disabled={room <= 0} onClick={() => add(book, chosen)}>{book.stock <= 0 ? 'Unavailable' : 'Add to cart'}</button>
              )}
              <button className="btn btn--ghost" aria-pressed={wished} onClick={() => toggle(book)}>
                <Heart size={16} fill={wished ? 'currentColor' : 'none'} aria-hidden="true" /> {wished ? 'Saved to wishlist' : 'Add to wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section aria-labelledby="rel"><h2 id="rel">You might also like</h2>
          <div className="grid">{related.map((b) => <BookCard key={b.id} book={b} />)}</div>
        </section>
      )}
    </>
  );
}
