// Order progress, in order. Shared by the server (lib/orders.js, the stream) and the tracking page.
export const STAGES = ["placed", "preparing", "on the way", "delivered"];
export const FINAL_STAGES = ["delivered", "cancelled"]; // no more updates after these

// Day 41 stand-in for a kitchen: progress is derived from the order's age, so there is something to watch.
// Seconds after the order was placed at which each stage begins. Day 47: shared, because the courier's
// position on the map and the estimated delivery time are derived from the same clock.
export const STAGE_STARTS_S = [0, 15, 45, 90];
export const DELIVERED_AFTER_S = STAGE_STARTS_S[3];
