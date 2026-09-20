import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/auth-context";
import "../css/style.css";

function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="logo" end>
          <span className="logo-mark">AE</span>
          <span className="logo-text">Addis Eats</span>
        </NavLink>
        <nav className="nav" aria-label="Main">
          <NavLink to="/" className="nav-link" end>
            Home
          </NavLink>
          <NavLink to="/menu" className="nav-link">
            Menu
          </NavLink>
          <NavLink to="/cart" className="nav-link">
            Cart
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
