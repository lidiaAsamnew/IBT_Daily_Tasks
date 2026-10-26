// Dashboard aggregation (Day 46): shape the data on the server, send a handful of rows to the chart.
import { AREAS } from "./constants.js";
import { dayKey, shortDay } from "./format.js";
import { isTerminal } from "./order-status.js";

const counts = (o) => o.status !== "cancelled";

export function revenueByArea(orders, areas = AREAS) {
  return areas.map((area) => ({
    area,
    orders: orders.filter((o) => counts(o) && o.area === area).length,
    revenue: orders.filter((o) => counts(o) && o.area === area).reduce((sum, o) => sum + o.total, 0),
  }));
}

/** Orders per calendar day (Addis Ababa time) for the last `days` days, with zero-filled gaps. */
export function ordersPerDay(orders, days = 14, now = Date.now()) {
  const keys = [];
  for (let i = days - 1; i >= 0; i--) keys.push(dayKey(now - i * 86400000));
  const tally = new Map(keys.map((k) => [k, { orders: 0, revenue: 0 }]));
  for (const o of orders) {
    if (!counts(o)) continue;
    const bucket = tally.get(dayKey(o.placedAt));
    if (bucket) {
      bucket.orders += 1;
      bucket.revenue += o.total;
    }
  }
  return keys.map((key, i) => ({
    day: shortDay(now - (days - 1 - i) * 86400000),
    key,
    ...tally.get(key),
  }));
}

export function summarise(orders) {
  const real = orders.filter(counts);
  const revenue = real.reduce((sum, o) => sum + o.total, 0);
  return {
    orders: real.length,
    revenue,
    average: real.length ? Math.round(revenue / real.length) : 0,
    active: orders.filter((o) => !isTerminal(o.status)).length,
    cancelled: orders.length - real.length,
  };
}
