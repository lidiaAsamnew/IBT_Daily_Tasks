// Order lifecycle — pure functions, no database, so they run on the server, in tests and in the browser.
//
// There is no real kitchen or courier feeding this app, so progress is SIMULATED from the clock:
// placed -> preparing -> on the way -> delivered, at the offsets below. Staff can override it from
// /kitchen (the override then wins). Replace `statusAt` with a real data source when one exists.

export const STATUS_FLOW = ["placed", "preparing", "on_the_way", "delivered"];
export const SIM_SECONDS = { placed: 0, preparing: 30, on_the_way: 90, delivered: 210 };

export const STATUS_LABEL = {
  placed: "Order placed",
  preparing: "Preparing",
  on_the_way: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const isTerminal = (status) => status === "delivered" || status === "cancelled";
export const canCancel = (status) => status === "placed" || status === "preparing";

/** The status an order has at `now`, and when that stage began (ms since epoch). */
export function statusAt(order, now = Date.now()) {
  if (order.status === "cancelled") {
    return { status: "cancelled", since: Date.parse(order.cancelledAt ?? order.placedAt) };
  }
  if (order.statusOverride) {
    return { status: order.statusOverride, since: Date.parse(order.overrideAt ?? order.placedAt) };
  }
  const placed = Date.parse(order.placedAt);
  const elapsed = (now - placed) / 1000;
  let status = "placed";
  for (const s of STATUS_FLOW) if (elapsed >= SIM_SECONDS[s]) status = s;
  return { status, since: placed + SIM_SECONDS[status] * 1000 };
}

export const nextStatus = (status) => STATUS_FLOW[STATUS_FLOW.indexOf(status) + 1] ?? null;

/** What a client may see of an order: no owner id, no idempotency key. */
export function toPublicOrder(order, now = Date.now()) {
  const { status, since } = statusAt(order, now);
  return {
    id: order.id,
    name: order.name,
    phone: order.phone,
    area: order.area,
    address: order.address,
    notes: order.notes,
    items: order.items,
    total: order.total,
    currency: order.currency,
    placedAt: order.placedAt,
    status,
    statusLabel: STATUS_LABEL[status],
    statusSince: new Date(since).toISOString(),
    canCancel: canCancel(status),
  };
}
