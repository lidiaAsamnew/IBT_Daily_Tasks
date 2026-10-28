import { Suspense, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary.jsx';
import { useCart } from '../hooks/useCart.js';
import { useWishlist } from '../store/wishlistStore.js';
import { CATEGORIES } from '../utils/catalog.js';

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState('');
  const menuBtn = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { totals } = useCart();
  const wishCount = useWishlist((s) => s.items.length);

  useEffect(() => { setOpen(false); window.scrollTo?.(0, 0); }, [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); menuBtn.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const search = (e) => {
    e.preventDefault();
    navigate(`/books${term.trim() ? `?q=${encodeURIComponent(term.trim())}` : ''}`);
  };
  const navCls = ({ isActive }) => (isActive ? 'active' : undefined);

  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <header className="header">
        <div className="container header__row">
          <Link to="/" className="brand"><BookOpen aria-hidden="true" /> BookHaven</Link>
          <form className="search" role="search" onSubmit={search}>
            <label htmlFor="site-search" className="sr">Search books</label>
            <input id="site-search" type="search" placeholder="Title, author or ISBN" value={term} onChange={(e) => setTerm(e.target.value)} />
            <button type="submit" className="icon-btn" aria-label="Search"><Search size={18} aria-hidden="true" /></button>
          </form>
          <nav className="nav" aria-label="Main">
            <NavLink to="/" end className={navCls}>Home</NavLink>
            <NavLink to="/books" className={navCls}>Books</NavLink>
            <NavLink to="/lab/state-management" className={navCls}>State lab</NavLink>
          </nav>
          <div className="header__icons">
            <Link to="/wishlist" className="icon-btn" aria-label={`Wishlist, ${wishCount} items`}>
              <Heart size={20} aria-hidden="true" />{wishCount > 0 && <span className="badge">{wishCount}</span>}
            </Link>
            <Link to="/cart" className="icon-btn" aria-label={`Cart, ${totals.count} items`}>
              <ShoppingBag size={20} aria-hidden="true" />{totals.count > 0 && <span className="badge">{totals.count}</span>}
            </Link>
            <button ref={menuBtn} className="icon-btn menu-btn" aria-expanded={open} aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
              {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>
        {open && (
          <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/books">All books</NavLink>
            {CATEGORIES.slice(0, 5).map((c) => <Link key={c} to={`/books?category=${encodeURIComponent(c)}`}>{c}</Link>)}
            <NavLink to="/wishlist">Wishlist ({wishCount})</NavLink>
            <NavLink to="/cart">Cart ({totals.count})</NavLink>
            <NavLink to="/lab/state-management">State lab</NavLink>
          </nav>
        )}
      </header>
      <main id="main" className="container main">
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<p className="state" role="status">Loading page...</p>}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <footer className="footer">
        <div className="container footer__row">
          <p><strong>BookHaven</strong> - a React learning project. Book data from Open Library; prices, stock and checkout are demo/simulated.</p>
          <nav aria-label="Footer"><Link to="/books">Books</Link><Link to="/wishlist">Wishlist</Link><Link to="/cart">Cart</Link></nav>
        </div>
      </footer>
    </>
  );
}
