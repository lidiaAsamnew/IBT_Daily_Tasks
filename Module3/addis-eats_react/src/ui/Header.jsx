import { Link } from "react-router-dom";
import { useAuth } from "../auth/auth-context";
import "../css/style.css";

function Header() {
  const { user, signOut } = useAuth();

  return (
    <div>
      <h1>Addis Eats</h1>
      <nav aria-label="Main">
        <Link to="/">Home</Link>
        {" | "}
        <Link to="/menu">Menu</Link>
        {" | "}
        <Link to="/cart">Cart</Link>
        {" | "}
        <Link to="/checkout">Checkout</Link>
        {" | "}
        {user ? (
          <>
            <span>Signed in as {user.name}</span>
            {" "}
            <button type="button" onClick={signOut}>
              Sign out
            </button>
          </>
        ) : (
          <Link to="/signin">Sign in</Link>
        )}
      </nav>
    </div>
  );
}

export default Header;
