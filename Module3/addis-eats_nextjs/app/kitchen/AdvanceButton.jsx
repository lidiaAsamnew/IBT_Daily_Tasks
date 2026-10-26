"use client";

import { useActionState } from "react";
import { advanceOrder } from "./actions";

export default function AdvanceButton({ id, label }) {
  const [state, formAction, pending] = useActionState(advanceOrder, null);
  return (
    <form action={formAction} className="inline-form">
      <input type="hidden" name="orderId" value={id} />
      <button type="submit" className="btn btn-primary" disabled={pending}>{pending ? "Updating…" : label}</button>
      {state?.error && <p className="field-error" role="alert">{state.error}</p>}
    </form>
  );
}
