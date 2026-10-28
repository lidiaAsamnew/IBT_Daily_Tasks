"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { placeOrder } from "@/app/actions";
import { useCart } from "@/app/providers";
import { areas, orderSchema, readOrderForm } from "@/lib/schema";

const input = "mt-1 w-full rounded-xl border border-injera bg-white px-4 py-2.5 outline-none focus:border-forest";

function FieldError({ messages }) {
  return messages?.length ? <p role="alert" className="mt-1 text-sm text-berbere">{messages[0]}</p> : null;
}

export default function CheckoutForm() {
  const { items, clear } = useCart();
  // The server action replaces the Day 33 fetch: no URL, no JSON.stringify, no status branching.
  const [state, formAction, pending] = useActionState(placeOrder, null);
  const [clientErrors, setClientErrors] = useState(null);

  // Empty the cart once, when the order goes through.
  useEffect(() => {
    if (state?.id) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.id]);

  if (state?.id) {
    return (
      <section role="status" className="rounded-2xl border border-forest/30 bg-forest/5 p-6">
        <h2 className="text-2xl font-semibold text-forest">Order placed</h2>
        <p className="mt-2">
          Your order <strong>{state.id}</strong> is confirmed. Total: {state.currency} {state.total}.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/orders" className="btn btn-green text-sm">View orders</Link>
          <Link href="/menu" className="btn btn-ghost text-sm text-forest">Order more</Link>
        </div>
      </section>
    );
  }

  // Courtesy check with the SAME schema, so people get instant feedback.
  // The server re-validates everything: this only saves a round trip.
  function onSubmit(e) {
    const result = orderSchema.safeParse(readOrderForm(new FormData(e.currentTarget)));
    if (result.success) {
      setClientErrors(null);
    } else {
      e.preventDefault();
      setClientErrors(result.error.flatten().fieldErrors);
    }
  }

  const errors = clientErrors ?? state?.fieldErrors ?? {};
  const values = state?.values ?? {};
  const lines = items.map(({ id, qty }) => ({ id, qty }));

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className="space-y-4 rounded-2xl border border-injera bg-white p-6">
      <h2 className="text-2xl font-semibold">Delivery details</h2>
      <input type="hidden" name="items" value={JSON.stringify(lines)} />

      <label className="block text-sm font-medium">
        Name
        <input name="name" autoComplete="name" defaultValue={values.name ?? ""} aria-invalid={Boolean(errors.name)} className={input} />
        <FieldError messages={errors.name} />
      </label>

      <label className="block text-sm font-medium">
        Phone (TeleBirr)
        <input name="phone" type="tel" autoComplete="tel" placeholder="0912345678" defaultValue={values.phone ?? ""} aria-invalid={Boolean(errors.phone)} className={input} />
        <FieldError messages={errors.phone} />
      </label>

      <label className="block text-sm font-medium">
        Delivery area
        <select name="area" defaultValue={values.area ?? ""} aria-invalid={Boolean(errors.area)} className={input}>
          <option value="" disabled>Choose an area</option>
          {areas.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <FieldError messages={errors.area} />
      </label>

      <FieldError messages={errors.items} />
      {state?.error && !state.fieldErrors && <p role="alert" className="text-sm text-berbere">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
        {pending ? "Sending..." : "Place order"}
      </button>
    </form>
  );
}
