import "server-only";
import { randomBytes } from "node:crypto";
import { getDish, DELIVERY_FEE } from "@/lib/dishes";
import { STAGES } from "@/lib/stages";

// In-memory store standing in for a database (Module 4 replaces it). It lives on
// globalThis so route handlers, server actions and pages share ONE list even though
// the bundler may give each of them its own copy of this module. It resets whenever
// the server restarts.
const store = (globalThis.__addisOrders ??= { orders: [] });

// Price comes from lib/dishes - never from the request.
export function createOrder(data, session) {
  const items = data.items.map(({ id, qty }) => {
    const dish = getDish(id);
    return { id, name: dish.name, price: dish.price, qty };
  });
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const order = {
    id: `ord_${randomBytes(3).toString("hex")}`,
    userId: session?.id ?? null, // null = guest order; nobody can cancel it
    customer: data.name,
    phone: data.phone,
    area: data.area,
    items,
    total: subtotal + DELIVERY_FEE,
    currency: "ETB",
    status: "placed",
    createdAt: Date.now(),
  };
  store.orders.unshift(order);
  return { id: order.id, total: order.total, currency: order.currency, status: order.status };
}

export const getOrder = (id) => store.orders.find((o) => o.id === id);

export function markCancelled(id) {
  const order = getOrder(id);
  if (order) order.status = "cancelled";
}

// Public view for the /orders page: no phone number, no owner id.
export function listOrders() {
  return store.orders.map(({ id, customer, area, items, total, currency, status }) => ({
    id, customer: customer.split(" ")[0], area, items, total, currency, status,
  }));
}

// Day 41: a stand-in for the kitchen. Progress is derived from the order's age, so
// there is something to poll: placed -> preparing (15 s) -> on the way (45 s) -> delivered (90 s).
function stageOf(order, now = Date.now()) {
  if (order.status === "cancelled") return "cancelled";
  const seconds = (now - order.createdAt) / 1000;
  const index = seconds >= 90 ? 3 : seconds >= 45 ? 2 : seconds >= 15 ? 1 : 0;
  return STAGES[index];
}

// Public view for the status screen and GET /api/orders/[id]: no phone, no owner id.
// (Day 42 will make this endpoint check who is asking.)
export function getOrderView(id) {
  const o = getOrder(id);
  if (!o) return null;
  return {
    id: o.id, customer: o.customer.split(" ")[0], area: o.area, items: o.items,
    total: o.total, currency: o.currency, status: o.status, stage: stageOf(o),
    checkedAt: new Date().toISOString(),
  };
}
