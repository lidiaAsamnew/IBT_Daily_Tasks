"use client";

import Stepper from "@/components/Stepper";
import { useCart } from "../cart-context";

// The smallest client leaf in the menu: it needs onClick and the cart (Day 38).
export default function AddToCartButton({ dish, large = false }) {
  const { items, add, setQuantity } = useCart();
  const line = items.find((i) => i.id === dish.id);

  if (!line) {
    return (
      <button
        type="button"
        className={`btn btn-primary ${large ? "btn-lg" : ""}`}
        onClick={() => add(dish)}
        aria-label={`Add ${dish.name} to cart`}
      >
        Add to cart
      </button>
    );
  }
  return <Stepper name={dish.name} quantity={line.quantity} onChange={(q) => setQuantity(dish.id, q)} />;
}
