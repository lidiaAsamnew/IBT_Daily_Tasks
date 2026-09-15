import { Link } from "react-router-dom";
import { useCart } from "./cart-context";

function Cart() {
  const { items, total, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div>
        <h2>Your cart</h2>
        <p>Your cart is empty for now.</p>
        <p>
          <Link to="/menu">Browse the menu</Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2>Your cart</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} x {item.quantity} — {item.price * item.quantity} ETB
            {" "}
            <button type="button" onClick={() => removeItem(item.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <h3>Total : {total} ETB</h3>
      <p>
        <button type="button" onClick={clearCart}>
          Clear cart
        </button>
      </p>
      <p>
        <Link to="/menu">Browse the menu</Link>
      </p>
    </div>
  );
}

export default Cart;
