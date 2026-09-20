import { Link } from "react-router-dom";
import { useCart } from "./cart-context";

function Cart() {
  const { items, total, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="page status">
        <h2>Your cart</h2>
        <p role="status">Your cart is empty for now.</p>
        <p>Add dishes from the menu before checking out.</p>
        <p className="page-links">
          <Link className="btn" to="/menu">
            Browse the menu
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Your cart</h2>
      <ul className="cart-list">
        {items.map((item) => (
          <li className="cart-line" key={item.id}>
            <span>
              {item.name} x {item.quantity} — {item.price * item.quantity} ETB
            </span>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              aria-label={`Remove ${item.name} from cart`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <h3>Total : {total} ETB</h3>
      <p className="cart-actions">
        <button type="button" onClick={clearCart}>
          Clear cart
        </button>
        <Link className="btn btn-secondary" to="/menu">
          Browse the menu
        </Link>
      </p>
    </div>
  );
}

export default Cart;
