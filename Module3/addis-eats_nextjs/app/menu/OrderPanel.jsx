"use client";

import Link from "next/link";
import Stepper from "@/components/Stepper";
import { useCart } from "../cart-context";
import { etb } from "@/lib/format";

// "Your order" side panel on wide screens (carried over from the original app).
export default function OrderPanel() {
  const { items, ready, total, count, setQuantity } = useCart();
  return (
    <aside className="order-panel" aria-labelledby="order-panel-title">
      <h2 id="order-panel-title" className="order-panel-title">Your order</h2>
      {!ready ? (
        <div className="skeleton skeleton-line" aria-hidden="true" />
      ) : items.length === 0 ? (
        <p className="muted">Your cart is empty. Add a dish to start an order.</p>
      ) : (
        <>
          <ul className="order-lines">
            {items.map((item) => (
              <li key={item.id} className="order-line">
                <div className="order-line-top">
                  <span className="order-line-name">{item.name}</span>
                  <span className="order-line-price">{etb(item.price * item.quantity)}</span>
                </div>
                <Stepper name={item.name} quantity={item.quantity} onChange={(q) => setQuantity(item.id, q)} />
              </li>
            ))}
          </ul>
          <p className="order-total">
            <span>Total ({count} {count === 1 ? "item" : "items"})</span>
            <strong>{etb(total)}</strong>
          </p>
          <Link href="/checkout" className="btn btn-primary btn-block">Go to checkout</Link>
        </>
      )}
    </aside>
  );
}
