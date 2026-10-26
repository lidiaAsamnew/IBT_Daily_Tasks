"use client";

import Image from "next/image";
import Link from "next/link";
import Stepper from "@/components/Stepper";
import { useCart } from "../cart-context";
import { etb } from "@/lib/format";

export default function CartView() {
  const { items, ready, total, count, setQuantity, remove, clear } = useCart();

  if (!ready) {
    return (
      <div aria-busy="true">
        <div className="skeleton skeleton-block" />
        <p className="sr-only">Loading your cart…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="state-box">
        <h2>Your cart is empty</h2>
        <p className="muted">Pick something from the menu and it will show up here.</p>
        <Link href="/menu" className="btn btn-primary">Browse the menu</Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <ul className="cart-lines">
        {items.map((item) => (
          <li key={item.id} className="cart-line">
            {item.image && (
              <Image src={item.image} alt="" width={80} height={80} className="cart-thumb" sizes="80px" />
            )}
            <div className="cart-line-main">
              <Link href={`/menu/${item.id}`} className="cart-line-name">{item.name}</Link>
              <p className="muted">{etb(item.price)} each</p>
              <Stepper name={item.name} quantity={item.quantity} onChange={(q) => setQuantity(item.id, q)} />
            </div>
            <div className="cart-line-side">
              <p className="price">{etb(item.price * item.quantity)}</p>
              <button type="button" className="btn btn-link" onClick={() => remove(item.id)} aria-label={`Remove ${item.name} from cart`}>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <aside className="summary" aria-labelledby="summary-title">
        <h2 id="summary-title">Summary</h2>
        <p className="order-total">
          <span>{count} {count === 1 ? "item" : "items"}</span>
          <strong>{etb(total)}</strong>
        </p>
        <Link href="/checkout" className="btn btn-primary btn-block btn-lg">Go to checkout</Link>
        <button type="button" className="btn btn-ghost btn-block" onClick={clear}>Clear cart</button>
        <p className="muted small">Final prices are confirmed by the restaurant when you place the order.</p>
      </aside>
    </div>
  );
}
