import { Link } from "react-router-dom";
import { useCart } from "./cart-context";

function Cart() {
  const { items, total, removeItem, clearCart, addItem } = useCart();

  function setQuantity(item, quantity) {
    removeItem(item.id);
    for (let i = 0; i < quantity; i++) {
      addItem(item);
    }
  }

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
      <div className="cart-layout">
        <ul className="cart-list">
          {items.map((item) => (
            <li className="cart-line" key={item.id}>
              {item.image ? (
                <img className="thumb" src={item.image} alt="" />
              ) : (
                <div className="thumb thumb-fallback" aria-hidden="true">
                  ○
                </div>
              )}
              <div className="cart-info">
                <h3>{item.name}</h3>
                <p>
                  {item.price} ETB
                </p>
              </div>
              <div className="stepper">
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => setQuantity(item, item.quantity - 1)}
                  aria-label={`Decrease ${item.name}`}
                >
                  −
                </button>
                <span className="stepper-count">{item.quantity}</span>
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => addItem(item)}
                  aria-label={`Increase ${item.name}`}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className="remove-link"
                onClick={() => removeItem(item.id)}
                aria-label={`Remove ${item.name} from cart`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <aside className="panel">
          <h3>Order summary</h3>
          <div className="summary-total">
            <span>Total</span>
            <strong>{total} ETB</strong>
          </div>
          <Link className="btn order-checkout" to="/checkout">
            Go to checkout
          </Link>
          <p className="cart-actions">
            <button type="button" className="remove-link" onClick={clearCart}>
              Clear cart
            </button>
            <Link className="btn-secondary" to="/menu">
              Browse the menu
            </Link>
          </p>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
