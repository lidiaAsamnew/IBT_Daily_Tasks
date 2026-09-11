import { Link } from "react-router-dom";

function Checkout() {
  return (
    <div>
      <h2>Checkout</h2>
      <p>Checkout will be added in a later step.</p>
      <p>
        <Link to="/cart">Back to cart</Link>
      </p>
    </div>
  );
}

export default Checkout;
