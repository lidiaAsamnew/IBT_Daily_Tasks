import "server-only";
import { randomBytes } from "node:crypto";
import { getDish, DELIVERY_FEE } from "@/lib/dishes";

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
