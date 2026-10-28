"use client";

import ErrorPanel from "@/components/ErrorPanel";

// The ERROR state: what failed, and a way to retry. error.js must be a client component.
// (/orders/[id] has its own error.js, so this one speaks only for the list.)
export default function OrdersError({ reset }) {
  return (
    <ErrorPanel title="Your orders could not load" reset={reset} backHref="/orders" backLabel="Back to your orders">
      Something went wrong on our side, not with your account. Try again, and if it keeps happening come back in a few minutes.
    </ErrorPanel>
  );
}
