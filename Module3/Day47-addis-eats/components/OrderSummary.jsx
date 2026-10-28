"use client";

import { useCart } from "@/app/providers";
import { DELIVERY_FEE } from "@/lib/dishes";
import { etb } from "@/lib/format";

export default function OrderSummary() {
  const { items, subtotal, setQty } = useCart();

  if (items.length === 0) {
    return (
      <section aria-label="Order summary" className="rounded-2xl border border-injera bg-white p-6">
        <h2 className="text-lg font-semibold">Your cart is empty</h2>
        <p className="mt-1 text-sm text-muted">Add a dish from the menu and it will show up here.</p>
      </section>
    );
  }

  return (
    <section aria-label="Order summary" className="rounded-2xl border border-injera bg-white p-6">
      <ul className="divide-y divide-injera">
        {items.map((l) => (
          <li key={l.id} className="flex items-center justify-between gap-3 py-3">
            <span>
              {l.name} <span className="text-muted">x {l.qty}</span>
            </span>
            <span className="flex items-center gap-3">
              <span className="font-medium">{etb(l.price * l.qty)}</span>
              <button type="button" onClick={() => setQty(l.id, l.qty - 1)} className="text-sm text-berbere underline">
                Remove
              </button>
            </span>
          </li>
        ))}
      </ul>
      <dl className="mt-3 space-y-1 border-t border-injera pt-3 text-sm">
        <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{etb(subtotal)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{etb(DELIVERY_FEE)}</dd></div>
        <div className="flex justify-between pt-2 text-lg font-semibold text-forest"><dt>Total</dt><dd>{etb(subtotal + DELIVERY_FEE)}</dd></div>
      </dl>
    </section>
  );
}
