import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import Cover from './Cover.jsx';
import { useCart } from '../hooks/useCart.js';
import { useWishlist } from '../store/wishlistStore.js';
import { formatETB } from '../utils/pricing.js';

export default function BookCard({ book }) {
  const { add, remove, qtyOf } = useCart();
  const wished = useWishlist((s) => s.items.some((b) => b.id === book.id));
  const toggle = useWishlist((s) => s.toggle);
  const out = book.stock <= 0;
  const inCart = qtyOf(book.id) > 0;

  return (
    <article className="card">
      <Link to={`/books/${book.id}`} className="card__cover" aria-label={`View details for ${book.title}`}>
        <Cover book={book} />
      </Link>
      <div className="card__body">
        {book.categories[0] && <span className="tag">{book.categories[0]}</span>}
        <h3 className="card__title"><Link to={`/books/${book.id}`}>{book.title}</Link></h3>
        <p className="muted clamp">{book.authors.join(', ') || 'Unknown author'}</p>
        {book.averageRating != null && (
          <p className="rating" aria-label={`Rated ${book.averageRating} out of 5 from ${book.ratingsCount} ratings`}>
            <Star size={14} aria-hidden="true" /> {book.averageRating} <span className="muted">({book.ratingsCount})</span>
          </p>
        )}
        <p className="price">{formatETB(book.price)} <small>Demo price</small></p>
        <p className={out ? 'stock stock--out' : 'stock'}>{out ? 'Out of stock (demo)' : `${book.stock} in stock (demo)`}</p>
      </div>
      <div className="card__actions">
        {inCart ? (
          <button className="btn btn--sm btn--remove" onClick={() => remove(book.id)}>Remove from cart</button>
        ) : (
          <button className="btn btn--sm" onClick={() => add(book)} disabled={out}>{out ? 'Unavailable' : 'Add to cart'}</button>
        )}
        <button
          className={`icon-btn${wished ? ' is-on' : ''}`}
          onClick={() => toggle(book)}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${book.title} from wishlist` : `Add ${book.title} to wishlist`}
        >
          <Heart size={18} fill={wished ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
BookCard.propTypes = { book: PropTypes.shape({
  id: PropTypes.string.isRequired, title: PropTypes.string.isRequired, authors: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired, price: PropTypes.number.isRequired, stock: PropTypes.number.isRequired,
  averageRating: PropTypes.number, ratingsCount: PropTypes.number,
}).isRequired };
