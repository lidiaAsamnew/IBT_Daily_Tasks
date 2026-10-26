"use client";

import Link from "next/link";
import useSWR from "swr";
import CancelOrderButton from "./CancelOrderButton";
import { fetcher } from "@/lib/fetcher";
import { STATUS_FLOW, STATUS_LABEL, isTerminal } from "@/lib/order-status";
import { when } from "@/lib/format";

/**
 * Server-rendered first, then live (Day 41): `initial` came from the server so there is no spinner,
 * and SWR polls every 5 seconds until the order is finished.
 */
export default function OrderStatus({ id, initial }) {
  const { data: order, error } = useSWR(`/api/orders/${id}`, fetcher, {
    fallbackData: initial,
    refreshInterval: (latest) => (latest && isTerminal(latest.status) ? 0 : 5000),
  });

  const status = order.status;
  const cancelled = status === "cancelled";
  const reached = STATUS_FLOW.indexOf(status);

  return (
    <section className="card status-card" aria-labelledby="status-title">
      <h2 id="status-title">Delivery status</h2>
      <p className="status-now" role="status" aria-live="polite">
        <strong>{STATUS_LABEL[status]}</strong> <span className="muted">since {when(order.statusSince)}</span>
      </p>

      {cancelled ? (
        <p className="muted">This order was cancelled. Nothing further will happen.</p>
      ) : (
        <ol className="progress" aria-label="Order progress">
          {STATUS_FLOW.map((s, i) => (
            <li key={s} className={`progress-step ${i < reached ? "is-done" : ""} ${i === reached ? "is-current" : ""}`} aria-current={i === reached ? "step" : undefined}>
              <span className="progress-dot" aria-hidden="true" />
              <span>{STATUS_LABEL[s]}</span>
            </li>
          ))}
        </ol>
      )}

      {error && <p className="muted small" role="status">Could not refresh just now — showing the last known status.</p>}

      <div className="actions">
        {!isTerminal(status) && <Link href={`/track/${id}`} className="btn btn-primary">Track on the map</Link>}
        {order.canCancel && <CancelOrderButton id={id} />}
      </div>
    </section>
  );
}
