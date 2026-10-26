import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/auth-context";
import { useCart } from "../cart/cart-context";
import "../css/style.css";

function Header() {
  const { user, signOut } = useAuth();
  const { items } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="logo" end>
          <img className="logo-img" src="/assets/logo.png" alt="" />
          <span>
            <span className="logo-text">Addis Eats</span>
            <span className="logo-tag">Ethiopian food delivery</span>
          </span>
        </NavLink>
        <nav className="nav" aria-label="Main">
          <NavLink to="/" className="nav-link" end>
            Home
          </NavLink>
          <NavLink to="/menu" className="nav-link">
            Menu
          </NavLink>
          <NavLink to="/cart" className="nav-link nav-cart">
            Cart
            <span className="cart-count">{count}</span>
          </NavLink>
          <NavLink to="/checkout" className="nav-link">
            Checkout
          </NavLink>
          {user ? (
            <span className="nav-user">
              Signed in as {user.name}
              <button type="button" onClick={signOut}>
                Sign out
              </button>
            </span>
          ) : (
            <NavLink to="/signin" className="nav-link">
              Sign in
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
