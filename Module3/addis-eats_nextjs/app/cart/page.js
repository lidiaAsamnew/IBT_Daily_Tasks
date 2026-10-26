import CartView from "./CartView";

export const metadata = { title: "Your cart", robots: { index: false, follow: false } };

// Client-rendered on purpose: the cart is this person's own state and lives in their browser (Day 37).
export default function CartPage() {
  return (
    <div className="container narrow section">
      <h1>Your cart</h1>
      <CartView />
    </div>
  );
}
