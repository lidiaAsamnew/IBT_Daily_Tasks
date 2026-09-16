import { Link } from "react-router-dom";
import { useAuth } from "../auth/auth-context";
import "../css/style.css";

function Header() {
  const { user, signOut } = useAuth();

  return (
    <div>
      <h1>Addis Eats</h1>
      <nav>
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
            Signed in as {user.name}
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
