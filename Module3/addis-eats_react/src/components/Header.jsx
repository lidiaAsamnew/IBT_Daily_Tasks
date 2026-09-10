import { Link } from "react-router-dom";
import "../css/style.css";

function Header() {
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
      </nav>
    </div>
  );
}

export default Header;
