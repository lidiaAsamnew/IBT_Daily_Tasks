"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import MapPanel from "./MapPanel";
import StatusBadge from "@/components/StatusBadge";
import { fetcher } from "@/lib/fetcher";
import { isTerminal } from "@/lib/order-status";
import { relative, when } from "@/lib/format";

const CONNECTION_TEXT = {
  connecting: "Connecting…",
  live: "Live",
  reconnecting: "Reconnecting…",
  offline: "Live updates unavailable — refreshing every few seconds",
  closed: "Finished",
};

/**
 * Server-sent events (Day 47): the server pushes status and courier position down one open connection.
 * Seeded by the server render, cleaned up on unmount (an unclosed EventSource survives navigation),
 * and the connection state is shown — a screen that quietly stops updating looks identical to one where
 * nothing is happening.
 */
export default function TrackingPanel({ order, initial, kitchen, destination }) {
  const [snapshot, setSnapshot] = useState(initial);
  const [connection, setConnection] = useState(isTerminal(initial.status) ? "closed" : "connecting");

  useEffect(() => {
    if (isTerminal(initial.status)) return undefined; // nothing left to stream
    const source = new EventSource(`/api/orders/${order.id}/stream`);
    source.onopen = () => setConnection("live");
    source.onmessage = (event) => {
      const next = JSON.parse(event.data);
      setSnapshot(next);
      if (isTerminal(next.status)) {
        source.close(); // the order is finished: close the stream deliberately
        setConnection("closed");
      } else setConnection("live");
    };
    source.onerror = () => {
      // The browser reconnects by itself while readyState is CONNECTING. Only CLOSED means it gave up.
      setConnection(source.readyState === EventSource.CLOSED ? "offline" : "reconnecting");
    };
    return () => source.close();
  }, [order.id, initial.status]);

  // Fallback when streaming is unavailable: plain polling, the Day 41 way.
  const { data: polled } = useSWR(connection === "offline" ? `/api/orders/${order.id}` : null, fetcher, { refreshInterval: 5000 });
  const status = polled?.status ?? snapshot.status;

  return (
    <div className="track-layout">
      <div className="track-map">
        <MapPanel kitchen={kitchen} destination={destination} courier={snapshot.position} status={status} />
      </div>

      <section className="card track-info" aria-labelledby="track-info-title">
        <h2 id="track-info-title">Delivery details</h2>
        <p className="connection" role="status" aria-live="polite">
          <span className={`connection-dot connection-dot--${connection}`} aria-hidden="true" />
          {CONNECTION_TEXT[connection]}
        </p>
        {/* A map means nothing to a screen reader: the same information, in words (Day 47). */}
        <dl className="details">
          <div><dt>Status</dt><dd><StatusBadge status={status} /></dd></div>
          <div><dt>Delivering to</dt><dd>{order.address}, {order.area}</dd></div>
          <div>
            <dt>Estimated arrival</dt>
            <dd>
              {snapshot.eta == null ? (status === "delivered" ? "Delivered" : "—") : `about ${snapshot.eta} ${snapshot.eta === 1 ? "minute" : "minutes"}`}
            </dd>
          </div>
          <div><dt>Placed</dt><dd>{when(order.placedAt)}</dd></div>
          <div><dt>Last update</dt><dd><LastUpdate at={snapshot.at} /></dd></div>
        </dl>
        <p className="muted small">
          The courier position on this map is simulated for demonstration. Map data © OpenStreetMap contributors.
        </p>
      </section>
    </div>
  );
}

// "12 seconds ago" depends on the clock, so it is computed only in the browser, after mount (Day 38: hydration).
function LastUpdate({ at }) {
  const now = useNow(5000);
  return now ? relative(at, now) : when(at);
}

function useNow(intervalMs) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, intervalMs);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [intervalMs]);
  return now;
}
