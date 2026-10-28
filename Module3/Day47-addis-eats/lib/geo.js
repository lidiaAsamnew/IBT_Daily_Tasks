// Day 47: where things are. Pure data and arithmetic: no Leaflet, no window, so the server (which builds the
// order view and the stream) and the client (map and text) share one copy.
//
// ALL COORDINATES ARE [lat, lng] (Leaflet order). GeoJSON is [lng, lat]: do not mix them.
// The points are APPROXIMATE neighbourhood centres, not street addresses: checkout collects an area, not an address.
// The kitchen is a made-up demo location. Replace both when real addresses and a real kitchen exist.
import { STAGE_STARTS_S } from "./stages";

export const MAP_HEIGHT_PX = 320; // the map AND its loading placeholder, so the page never jumps when the map arrives
export const ZONE_RADIUS_M = 1200; // the delivery zone drawn around a neighbourhood centre

export const KITCHEN = { name: "Addis Eats kitchen (demo location)", lat: 9.0107, lng: 38.7612 };

const AREA_POINTS = {
  Bole: [8.995, 38.7896],
  Kazanchis: [9.0153, 38.7633],
  Piassa: [9.0335, 38.7468],
  Sarbet: [8.993, 38.727],
  CMC: [9.0197, 38.8265],
  Megenagna: [9.0205, 38.8004],
};

/** The delivery point for a neighbourhood: { lat, lng }. Unknown areas fall back to the kitchen. */
export function deliveryPoint(area) {
  const p = AREA_POINTS[area];
  return p ? { lat: p[0], lng: p[1] } : { lat: KITCHEN.lat, lng: KITCHEN.lng };
}

const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Where the courier is. SIMULATED: there is no GPS feed, so the position is derived from the order's age.
 * Waiting/cooking: at the kitchen. On the way: a straight line from the kitchen to the door over the
 * "on the way" stage. Delivered: at the door. Cancelled: no courier (null).
 */
export function courierPoint({ stage, createdAt, area }, now = Date.now()) {
  if (stage === "cancelled") return null;
  const to = deliveryPoint(area);
  if (stage === "placed" || stage === "preparing") return { lat: KITCHEN.lat, lng: KITCHEN.lng };
  if (stage === "delivered") return to;
  const [, , start, end] = STAGE_STARTS_S;
  const t = Math.min(1, Math.max(0, ((now - createdAt) / 1000 - start) / (end - start)));
  return { lat: lerp(KITCHEN.lat, to.lat, t), lng: lerp(KITCHEN.lng, to.lng, t) };
}

/** Straight-line distance in metres between two { lat, lng } points (haversine). */
export function distanceM(a, b) {
  const R = 6_371_000;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
