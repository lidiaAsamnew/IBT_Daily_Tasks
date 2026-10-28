"use client"; // state needs a client component
import { useState } from "react";

// Proof that a layout keeps its state: press + a few times, open a dish,
// and the number is still there. (A template.js would reset it.)
export default function LayoutCounter() {
  const [count, setCount] = useState(0);
  const btn = "flex h-9 w-9 items-center justify-center rounded-full bg-forest text-lg font-semibold text-white hover:bg-forest-deep";

  return (
    <section aria-label="Layout state demo" className="mt-6 rounded-2xl border border-injera bg-white p-4">
      <h2 className="text-sm font-semibold">Layout state demo</h2>
      <p className="mt-1 text-xs text-muted">Press +, open a dish, and come back. The count stays.</p>
      <div className="mt-3 flex items-center gap-3">
        <button onClick={() => setCount((c) => Math.max(0, c - 1))} aria-label="Decrease count" className={btn}>-</button>
        <output aria-live="polite" className="min-w-8 text-center text-xl font-semibold">{count}</output>
        <button onClick={() => setCount((c) => c + 1)} aria-label="Increase count" className={btn}>+</button>
      </div>
    </section>
  );
}
