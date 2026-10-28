"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { STAGES, FINAL_STAGES } from "@/lib/stages";

export default function OrderStatus({ id, initial }) {
  const { data, error, isValidating } = useSWR(`/api/orders/${id}`, fetcher, {
    // The server already rendered this order: show it at once, no spinner on first paint.
    // (Do not branch on isLoading here - SWR counts fallbackData as "not loaded yet".)
    fallbackData: initial,
    // Poll every 5 s until the order is delivered or cancelled, then stop for good.
    refreshInterval: (latest) => (latest && FINAL_STAGES.includes(latest.stage) ? 0 : 5000),
  });

  const cancelled = data.stage === "cancelled";
  const current = STAGES.indexOf(data.stage);
  const finished = FINAL_STAGES.includes(data.stage);

  return (
    <section aria-label="Order status" className="max-w-2xl rounded-2xl border border-injera bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold capitalize">{cancelled ? "Cancelled" : data.stage}</h2>
        <span className="flex items-center gap-2 text-xs font-medium text-muted" aria-live="polite">
          <span className={`h-2 w-2 rounded-full ${finished ? "bg-muted" : "bg-forest"} ${isValidating && !finished ? "animate-pulse" : ""}`} />
          {finished ? "Final status" : "Updates every 5 seconds"}
        </span>
      </div>

      {cancelled ? (
        <p className="mt-4 rounded-xl bg-berbere/10 px-4 py-3 text-sm text-berbere">This order was cancelled.</p>
      ) : (
        <ol className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STAGES.map((s, i) => (
            <li key={s} className={`rounded-xl border px-3 py-3 text-center text-sm font-medium capitalize ${i <= current ? "border-forest bg-forest text-white" : "border-injera text-muted"}`}>
              {s}
            </li>
          ))}
        </ol>
      )}

      {error && (
        <p role="status" className="mt-4 text-sm text-berbere">
          Connection problem - showing the last known status and retrying.
        </p>
      )}

      <ul className="mt-6 divide-y divide-injera border-t border-injera">
        {data.items.map((i) => (
          <li key={i.id} className="flex justify-between py-2 text-sm">
            <span>{i.name} <span className="text-muted">x {i.qty}</span></span>
            <span>{data.currency} {i.price * i.qty}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 flex justify-between border-t border-injera pt-3 font-semibold text-forest">
        <span>Total (incl. delivery)</span><span>{data.currency} {data.total}</span>
      </p>
      <p className="mt-2 text-xs text-muted">{data.customer} - {data.area}</p>
    </section>
  );
}
