"use client";

import ErrorPanel from "@/components/ErrorPanel";

export default function OrderError({ reset }) {
  return (
    <ErrorPanel title="This order could not load" reset={reset} backHref="/orders" backLabel="All orders">
      We could not read the order just now. Try again, or go back to your list.
    </ErrorPanel>
  );
}
