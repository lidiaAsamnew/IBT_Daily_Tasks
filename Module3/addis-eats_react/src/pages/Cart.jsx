import { Link } from "react-router-dom";

function Cart() {
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

export default Cart;
