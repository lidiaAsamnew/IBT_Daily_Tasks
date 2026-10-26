"use client";

import { useActionState, useEffect } from "react";
import { useSWRConfig } from "swr";
import { cancelOrder } from "../../actions";

export default function CancelOrderButton({ id }) {
  const [state, formAction, pending] = useActionState(cancelOrder, null);
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (state?.ok) mutate(`/api/orders/${id}`); // pull the new "cancelled" status straight in
  }, [state, id, mutate]);

  return (
    <form action={formAction} className="inline-form">
      <input type="hidden" name="orderId" value={id} />
      <button type="submit" className="btn btn-danger" disabled={pending}>
        {pending ? "Cancelling…" : "Cancel order"}
      </button>
      {state?.error && <p className="field-error" role="alert">{state.error}</p>}
    </form>
  );
}
