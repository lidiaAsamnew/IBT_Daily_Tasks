import { getDish } from "@/lib/dishes";

// Fixed preview lines. A real, working cart comes in a later lesson.
const preview = [{ id: "kitfo", qty: 1 }, { id: "shiro", qty: 2 }];
const DELIVERY_FEE = 40;

export default function OrderSummary() {
  const lines = preview.map((l) => ({ ...l, dish: getDish(l.id) }));
  const subtotal = lines.reduce((sum, l) => sum + l.dish.price * l.qty, 0);

  return (
    <section aria-label="Order summary" className="rounded-2xl border border-injera bg-white p-6">
      <p className="mb-4 rounded-lg bg-saffron/20 px-3 py-2 text-sm">
        Preview order. The working cart arrives in a later lesson.
      </p>
      <ul className="divide-y divide-injera">
        {lines.map((l) => (
          <li key={l.id} className="flex justify-between py-3">
            <span>{l.dish.name} <span className="text-muted">x {l.qty}</span></span>
            <span className="font-medium">ETB {l.dish.price * l.qty}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-3 space-y-1 border-t border-injera pt-3 text-sm">
        <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>ETB {subtotal}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>ETB {DELIVERY_FEE}</dd></div>
        <div className="flex justify-between pt-2 text-lg font-semibold text-forest"><dt>Total</dt><dd>ETB {subtotal + DELIVERY_FEE}</dd></div>
      </dl>
    </section>
  );
}
