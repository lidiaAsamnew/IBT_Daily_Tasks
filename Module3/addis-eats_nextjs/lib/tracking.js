// Simulated courier position for the live map (Day 47). Coordinates are [lat, lng] — Leaflet order.
// Neighbourhood centres are APPROXIMATE; there is no real GPS feed behind this.
import { SIM_SECONDS, statusAt } from "./order-status.js";

export const KITCHEN = { position: [8.995, 38.7896], label: "Addis Eats kitchen, Bole" };

export const AREA_CENTERS = {
  Summit: [9.0, 38.84],
  Akaki: [8.882, 38.783],
  Bole: [8.9995, 38.795],
  Gullele: [9.06, 38.73],
};

export const destinationFor = (area) => AREA_CENTERS[area] ?? KITCHEN.position;

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (n) => Math.min(1, Math.max(0, n));
const DRIVE_MS = (SIM_SECONDS.delivered - SIM_SECONDS.on_the_way) * 1000;

export function courierPosition(order, now = Date.now()) {
  const { status, since } = statusAt(order, now);
  const dest = destinationFor(order.area);
  if (status === "delivered") return dest;
  if (status !== "on_the_way") return KITCHEN.position;
  const t = clamp01((now - since) / DRIVE_MS);
  return [lerp(KITCHEN.position[0], dest[0], t), lerp(KITCHEN.position[1], dest[1], t)];
}

/** Whole minutes until arrival, or null once the order is finished. */
export function etaMinutes(order, now = Date.now()) {
  const { status, since } = statusAt(order, now);
  if (status === "delivered" || status === "cancelled") return null;
  let remainingMs;
  if (status === "on_the_way") remainingMs = DRIVE_MS - (now - since);
  else if (status === "preparing") remainingMs = SIM_SECONDS.delivered * 1000 - (now - since) - SIM_SECONDS.preparing * 1000;
  else remainingMs = SIM_SECONDS.delivered * 1000 - (now - since);
  return Math.max(1, Math.ceil(remainingMs / 60000));
}

/** One snapshot for the SSE stream and the page's first paint. */
export function trackingSnapshot(order, now = Date.now()) {
  const { status, since } = statusAt(order, now);
  return {
    id: order.id,
    status,
    statusSince: new Date(since).toISOString(),
    position: courierPosition(order, now),
    eta: etaMinutes(order, now),
    at: new Date(now).toISOString(),
  };
}
