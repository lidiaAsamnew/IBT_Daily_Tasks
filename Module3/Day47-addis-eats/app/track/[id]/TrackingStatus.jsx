"use client";

import { useEffect, useState } from "react";
import { STAGES } from "@/lib/stages";
import { KITCHEN, ZONE_RADIUS_M, distanceM } from "@/lib/geo";
import { etb, when, time, relative, distance } from "@/lib/format";
import { useOrderStream } from "./useOrderStream";
import MapPanel from "./MapPanel";

// The connection indicator: a screen that quietly stops updating looks identical to one where nothing has happened.
const CONNECTION = {
  connecting: { text: "Connecting...", dot: "bg-saffron animate-pulse" },
  live: { text: "Live", dot: "bg-forest" },
  reconnecting: { text: "Reconnecting...", dot: "bg-saffron animate-pulse" },
  paused: { text: "Paused while this tab is hidden", dot: "bg-muted" },
  polling: { text: "Live connection unavailable: checking every 5 seconds", dot: "bg-saffron" },
  closed: { text: "Final status: connection closed", dot: "bg-muted" },
};

// `now` is null on the server and on the first client render (so the server and the browser print the same text,
// no hydration mismatch), then a real time. Relative times ("in 40 seconds") are only printed once it is set.
function useNow(running) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    if (!running) return undefined;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [running]);
  return now;
}

// The same information as the map, in words: for a screen reader and for anyone who cannot or will not use a map.
function courierText(order) {
  switch (order.stage) {
    case "placed": return "Order received. A courier will collect it from the kitchen.";
    case "preparing": return "The kitchen is preparing your order. The courier is waiting there.";
    case "on the way": {
      const away = order.courier ? distance(distanceM(order.courier, order.delivery)) : null;
      return away ? `On the way, about ${away} from you.` : "On the way.";
    }
    case "delivered": return "Delivered. The courier has arrived.";
    default: return "No courier: this order was cancelled.";
  }
}

export default function TrackingStatus({ id, initial }) {
  const { order, connection, error } = useOrderStream(id, initial);
  const now = useNow(connection !== "closed");

  const cancelled = order.stage === "cancelled";
  const current = STAGES.indexOf(order.stage);
  const indicator = CONNECTION[connection];
  const eta = order.stage === "delivered" ? "Delivered" : cancelled ? "None" : time(order.etaAt);

  return (
    <div className="space-y-6">
      <section aria-label="Order status" className="max-w-3xl rounded-2xl border border-injera bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold capitalize">{cancelled ? "Cancelled" : order.stage}</h2>
          <span role="status" aria-live="polite" className="flex items-center gap-2 text-xs font-medium text-muted">
            <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${indicator.dot}`} />
            {indicator.text}
          </span>
        </div>

        {cancelled ? (
          <p className="mt-4 rounded-xl bg-berbere/10 px-4 py-3 text-sm text-berbere">This order was cancelled.</p>
        ) : (
          <ol className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STAGES.map((s, i) => (
              <li key={s} aria-current={i === current ? "step" : undefined} className={`rounded-xl border px-3 py-3 text-center text-sm font-medium capitalize ${i <= current ? "border-forest bg-forest text-white" : "border-injera text-muted"}`}>
                {s}
              </li>
            ))}
          </ol>
        )}

        {error && (
          <p role="status" className="mt-4 text-sm text-berbere">
            {error.status === 401 || error.status === 403
              ? "You are signed out or this is not your order - sign in again to keep following it."
              : "Connection problem - showing the last known status and retrying."}
          </p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div role="region" aria-label="Map of the courier and the delivery address. The same details are written beside it.">
          <MapPanel delivery={order.delivery} courier={order.courier} customer={order.customer} area={order.area} stage={order.stage} etaAt={order.etaAt} />
          <p className="mt-2 text-xs text-muted">Courier position is simulated for this course project; there is no GPS feed yet. Pins mark the middle of the neighbourhood, not a street address.</p>
        </div>

        <section aria-label="Delivery details" className="rounded-2xl border border-injera bg-white p-6">
          <h2 className="text-xl font-semibold">Delivery details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="font-semibold">Courier</dt>
              <dd className="text-muted">{courierText(order)}</dd>
            </div>
            <div>
              <dt className="font-semibold">Delivering to</dt>
              <dd className="text-muted">{order.customer}, {order.area} (centre of the neighbourhood, within about {distance(ZONE_RADIUS_M)} for the delivery zone)</dd>
            </div>
            <div>
              <dt className="font-semibold">Collected from</dt>
              <dd className="text-muted">{KITCHEN.name}</dd>
            </div>
            <div>
              <dt className="font-semibold">Placed</dt>
              <dd className="text-muted">{when(order.createdAt)}{now ? ` (${relative(order.createdAt, now)})` : ""}</dd>
            </div>
            <div>
              <dt className="font-semibold">Estimated delivery</dt>
              <dd className="text-muted">{eta}{now && !cancelled && order.stage !== "delivered" ? ` (${relative(order.etaAt, now)})` : ""}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section aria-label="Order items" className="max-w-3xl rounded-2xl border border-injera bg-white p-6">
        <ul className="divide-y divide-injera">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between py-2 text-sm">
              <span>{i.name} <span className="text-muted">x {i.qty}</span></span>
              <span>{etb(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex justify-between border-t border-injera pt-3 font-semibold text-forest">
          <span>Total (incl. delivery)</span><span>{etb(order.total)}</span>
        </p>
      </section>
    </div>
  );
}
