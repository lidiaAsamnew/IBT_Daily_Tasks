// Order progress, in order. Shared by the server (lib/orders.js) and the status screen.
export const STAGES = ["placed", "preparing", "on the way", "delivered"];
export const FINAL_STAGES = ["delivered", "cancelled"]; // no more polling after these
