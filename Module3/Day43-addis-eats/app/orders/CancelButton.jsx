"use client";

import { useState, useTransition } from "react";
import { cancelOrder } from "@/app/actions";

// Showing this button is only interface. The real check is inside cancelOrder.
export default function CancelButton({ orderId }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  function onClick() {
    setError(null);
    startTransition(async () => {
      const result = await cancelOrder(orderId);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <span className="flex flex-col items-end gap-1">
      <button type="button" onClick={onClick} disabled={pending} className="btn btn-ghost px-4 py-1.5 text-sm text-berbere disabled:opacity-50">
        {pending ? "Cancelling..." : "Cancel order"}
      </button>
      {error && <span role="alert" className="text-xs text-berbere">{error}</span>}
    </span>
  );
}
