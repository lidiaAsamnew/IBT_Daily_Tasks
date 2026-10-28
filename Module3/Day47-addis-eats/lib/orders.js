import "server-only";
import { randomBytes } from "node:crypto";
import { getDish, DELIVERY_FEE } from "@/lib/dishes";
import { STAGES, STAGE_STARTS_S, DELIVERED_AFTER_S } from "@/lib/stages";
import { deliveryPoint, courierPoint } from "@/lib/geo";

// In-memory store standing in for a database (Module 4 replaces it). It lives on
// globalThis so route handlers, server actions and pages share ONE list even though
// the bundler may give each of them its own copy of this module. It resets whenever
// the server restarts.
const store = (globalThis.__addisOrders ??= { orders: [] });

// Price comes from lib/dishes - never from the request. The owner comes from the verified
// session - never from the request either.
export function createOrder(data, session) {
  if (!session) throw new Error("createOrder needs a signed-in user");
  const items = data.items.map(({ id, qty }) => {
    const dish = getDish(id);
    return { id, name: dish.name, price: dish.price, qty };
  });
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const order = {
    id: `ord_${randomBytes(3).toString("hex")}`,
    userId: session.id,
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

// Authorisation, in one place: the owner or kitchen staff. Callers pass the verified session.
export const canAccess = (order, user) => Boolean(user) && (order.userId === user.id || user.role === "staff");

const card = (o) => ({
  id: o.id, customer: o.customer.split(" ")[0], area: o.area, items: o.items,
  total: o.total, currency: o.currency, status: o.status, stage: stageOf(o), createdAt: o.createdAt,
});

// The /orders page: ALWAYS scoped to the session id. There is deliberately no function that
// takes an owner id from a request - getOrdersFor(user.id) cannot return someone else's orders.
export const getOrdersFor = (userId) => store.orders.filter((o) => o.userId === userId).map(card);

// Staff only (the /kitchen page checks the role before calling this): everything, with contact details.
export const listAllOrders = () =>
  store.orders.map((o) => ({ ...card(o), customer: o.customer, phone: o.phone, createdAt: o.createdAt }));

// Day 41: a stand-in for the kitchen. Progress is derived from the order's age, so there is
// something to watch: placed -> preparing (15 s) -> on the way (45 s) -> delivered (90 s). See STAGE_STARTS_S.
function stageOf(order, now = Date.now()) {
  if (order.status === "cancelled") return "cancelled";
  const seconds = (now - order.createdAt) / 1000;
  const index = STAGE_STARTS_S.reduce((n, start, i) => (seconds >= start ? i : n), 0);
  return STAGES[index];
}

// Public view for the tracking page, GET /api/orders/[id] and the stream: no phone, no owner id.
// Day 47 adds where things are (delivery point, simulated courier) and when it should arrive.
// Callers must check canAccess() first.
export function getOrderView(id, now = Date.now()) {
  const o = getOrder(id);
  if (!o) return null;
  const stage = stageOf(o, now);
  return {
    id: o.id, customer: o.customer.split(" ")[0], area: o.area, items: o.items,
    total: o.total, currency: o.currency, status: o.status, stage,
    createdAt: o.createdAt,
    etaAt: o.createdAt + DELIVERED_AFTER_S * 1000, // an ISO string would also do; JSON has no Date, so a number
    delivery: deliveryPoint(o.area),
    courier: courierPoint({ stage, createdAt: o.createdAt, area: o.area }, now),
    checkedAt: new Date(now).toISOString(),
  };
}
