"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useCart } from "../cart-context";
import { placeOrder } from "../actions";
import { etb } from "@/lib/format";
import { AREAS, ADDRESS_MAX, NAME_MAX, NOTES_MAX, PHONE_HINT, PHONE_PATTERN } from "@/lib/constants";

export default function CheckoutForm({ defaults, idempotencyKey }) {
  const { items, ready, total, count } = useCart();
  const [state, formAction, pending] = useActionState(placeOrder, null);
  const err = (name) => state?.fieldErrors?.[name]?.[0];
  const value = (name) => state?.values?.[name] ?? defaults[name] ?? "";

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
        <p className="muted">Add something from the menu before checking out.</p>
        <Link href="/menu" className="btn btn-primary">Browse the menu</Link>
      </div>
    );
  }

  const field = (id, label, control, hint) => (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {control}
      {hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
      {err(id) && <p id={`${id}-error`} className="field-error" role="alert">{err(id)}</p>}
    </div>
  );
  const aria = (id, hint) => ({
    "aria-invalid": Boolean(err(id)),
    "aria-describedby": [hint && `${id}-hint`, err(id) && `${id}-error`].filter(Boolean).join(" ") || undefined,
  });

  return (
    <div className="checkout-layout">
      {/* onSubmit is the form's job, not the button's click: Enter works, and so does the pending state (Day 48). */}
      <form action={formAction} className="card form" aria-busy={pending}>
        {state?.error && (
          <p className="form-error" role="alert">
            {state.error}{" "}
            {state.signInHref && <Link href={state.signInHref}>Sign in</Link>}
          </p>
        )}
        {err("items") && <p className="form-error" role="alert">{err("items")}</p>}

        <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
        {/* Only ids and quantities are sent. The server looks the prices up itself. */}
        <input type="hidden" name="items" value={JSON.stringify(items.map((i) => ({ id: i.id, quantity: i.quantity })))} />

        {field("name", "Full name",
          <input id="name" name="name" className="input" autoComplete="name" required minLength={2} maxLength={NAME_MAX}
            defaultValue={value("name")} {...aria("name")} />)}

        {field("phone", "Phone number",
          <input id="phone" name="phone" type="tel" inputMode="numeric" className="input" autoComplete="tel" required
            pattern={PHONE_PATTERN} title={PHONE_HINT} defaultValue={value("phone")} {...aria("phone", true)} />, PHONE_HINT)}

        {field("area", "Delivery area",
          <select id="area" name="area" className="input" required defaultValue={value("area")} {...aria("area")}>
            <option value="" disabled>Select your area</option>
            {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>)}

        {field("address", "Delivery address",
          <input id="address" name="address" className="input" autoComplete="street-address" required minLength={3}
            maxLength={ADDRESS_MAX} defaultValue={value("address")} {...aria("address")} />)}

        {field("notes", "Notes for the kitchen (optional)",
          <textarea id="notes" name="notes" className="input" rows={3} maxLength={NOTES_MAX}
            defaultValue={value("notes")} {...aria("notes")} />)}

        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={pending}>
          {pending ? "Placing your order…" : `Place order · ${etb(total)}`}
        </button>
        <p className="muted small">This site does not take payment online.</p>
      </form>

      <aside className="summary" aria-labelledby="checkout-summary">
        <h2 id="checkout-summary">Your order</h2>
        <ul className="summary-lines">
          {items.map((i) => (
            <li key={i.id}>
              <span>{i.quantity} × {i.name}</span>
              <span>{etb(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="order-total">
          <span>Total ({count} {count === 1 ? "item" : "items"})</span>
          <strong>{etb(total)}</strong>
        </p>
        <Link href="/cart" className="text-link">Change your cart</Link>
      </aside>
    </div>
  );
}
