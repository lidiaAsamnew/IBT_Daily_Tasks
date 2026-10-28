import BookCard from '../components/BookCard.jsx';
import { EmptyState } from '../components/States.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { useWishlist } from '../store/wishlistStore.js';

export default function Wishlist() {
  useDocumentTitle('Wishlist');
  const items = useWishlist((s) => s.items);
  return (
    <>
      <h1>Your wishlist</h1>
      {items.length === 0 ? (
        <EmptyState title="Nothing saved yet" actionLabel="Browse books" to="/books">Tap the heart on any book to save it here.</EmptyState>
      ) : (
        <div className="grid">{items.map((b) => <BookCard key={b.id} book={b} />)}</div>
      )}
    </>
  );
}
