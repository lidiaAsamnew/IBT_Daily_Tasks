// Order service: the only code that reads or writes orders. Route handlers, server actions and pages
// all call these functions, so the rules (pricing, ownership, idempotency) exist in exactly one place.
import { randomBytes } from "node:crypto";
import { db } from "./db.js";
import { getDishes } from "./dishes.js";
import { MAX_QUANTITY } from "./constants.js";
import { STATUS_FLOW, canCancel, nextStatus, statusAt, toPublicOrder } from "./order-status.js";

const COL = "orders";

export const SORT_KEYS = ["date", "total", "area", "status"];
export const PAGE_SIZE_ORDERS = 10;

/**
 * Create an order for a signed-in user from validated input.
 * The client sends dish ids and quantities only — prices come from the server's menu (Day 37: "live pricing").
 * Replaying the same idempotencyKey returns the original order instead of creating a second one (Day 48).
 */
export async function createOrder(user, input) {
  if (!user) return { ok: false, status: 401, error: "Please sign in to place an order." };

  const menu = new Map((await getDishes()).map((d) => [d.id, d]));
  const merged = new Map();
  for (const line of input.items) merged.set(line.id, (merged.get(line.id) ?? 0) + line.quantity);

  const items = [];
  for (const [id, quantity] of merged) {
    const dish = menu.get(id);
    if (!dish) return { ok: false, status: 422, error: "Validation failed", fieldErrors: { items: [`Dish ${id} is not on the menu.`] } };
    if (quantity > MAX_QUANTITY) {
      return { ok: false, status: 422, error: "Validation failed", fieldErrors: { items: [`At most ${MAX_QUANTITY} of ${dish.name}.`] } };
    }
    items.push({ id, name: dish.name, price: dish.price, quantity });
  }

  const idemKey = `${user.id}:${input.idempotencyKey}`;
  const prior = await db.get("idempotency", idemKey);
  if (prior) {
    const existing = await db.get(COL, prior.orderId);
    if (existing) return { ok: true, order: existing, replay: true };
  }

  const now = new Date().toISOString();
  const order = {
    id: `ord_${randomBytes(5).toString("hex")}`,
    userId: user.id,
    name: input.name,
    phone: input.phone,
    area: input.area,
    address: input.address,
    notes: input.notes ?? "",
    items,
    total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    currency: "ETB",
    status: "placed",
    statusOverride: null,
    overrideAt: null,
    placedAt: now,
    idempotencyKey: input.idempotencyKey,
  };

  await db.set(COL, order.id, order);
  const claimed = await db.setIfAbsent("idempotency", idemKey, { orderId: order.id });
  if (!claimed) {
    // A concurrent double-submit won the race: discard ours, return theirs.
    await db.delete(COL, order.id);
    const winner = await db.get("idempotency", idemKey);
    const existing = winner && (await db.get(COL, winner.orderId));
    if (existing) return { ok: true, order: existing, replay: true };
  }
  return { ok: true, order, replay: false };
}

/** Read one order the caller may see: its owner, or staff. 401 / 404 / 403 as Day 39 defines them. */
export async function getOrderFor(user, id) {
  if (!user) return { ok: false, status: 401, error: "Not signed in" };
  const order = await db.get(COL, String(id));
  if (!order) return { ok: false, status: 404, error: "No such order" };
  if (order.userId !== user.id && user.role !== "staff") return { ok: false, status: 403, error: "Not yours" };
  return { ok: true, order };
}

const statusRank = (o, now) => STATUS_FLOW.indexOf(statusAt(o, now).status);

/** The signed-in person's orders ONLY — scoped by the session id, never by an id from the request. */
export async function getOrdersFor(userId, { sort = "date", dir = "desc", page = 1, pageSize = PAGE_SIZE_ORDERS, now = Date.now() } = {}) {
  const mine = (await db.list(COL)).filter((o) => o.userId === userId);
  const key = SORT_KEYS.includes(sort) ? sort : "date";
  const sign = dir === "asc" ? 1 : -1;
  const value = {
    date: (o) => Date.parse(o.placedAt),
    total: (o) => o.total,
    area: (o) => o.area,
    status: (o) => (o.status === "cancelled" ? -1 : statusRank(o, now)),
  }[key];
  mine.sort((a, b) => {
    const [x, y] = [value(a), value(b)];
    const c = x < y ? -1 : x > y ? 1 : 0;
    return c * sign || Date.parse(b.placedAt) - Date.parse(a.placedAt);
  });
  const total = mine.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, Math.trunc(Number(page)) || 1), pages);
  const rows = mine.slice((safePage - 1) * pageSize, safePage * pageSize).map((o) => toPublicOrder(o, now));
  return { rows, total, page: safePage, pages, sort: key, dir: sign === 1 ? "asc" : "desc" };
}

/** Everything, newest first — for staff screens only. Callers must have checked getStaffSession(). */
export async function listAllOrders(now = Date.now()) {
  return (await db.list(COL))
    .sort((a, b) => Date.parse(b.placedAt) - Date.parse(a.placedAt))
    .map((o) => ({ ...toPublicOrder(o, now), customer: o.name }));
}

/** Cancel: authentication (401), existence (404), authorisation (403), then the business rule (409). */
export async function cancelOrderFor(user, id) {
  const found = await getOrderFor(user, id);
  if (!found.ok) return found;
  const { order } = found;
  if (order.userId !== user.id) return { ok: false, status: 403, error: "Not yours" }; // staff may read, not cancel
  const { status } = statusAt(order);
  if (!canCancel(status)) return { ok: false, status: 409, error: "This order can no longer be cancelled." };
  const updated = { ...order, status: "cancelled", cancelledAt: new Date().toISOString() };
  await db.set(COL, order.id, updated);
  return { ok: true, order: updated };
}

/** Staff: move an order to its next stage. The role check lives HERE, where the write happens. */
export async function advanceOrderFor(user, id) {
  if (!user) return { ok: false, status: 401, error: "Not signed in" };
  if (user.role !== "staff") return { ok: false, status: 403, error: "Staff only" };
  const order = await db.get(COL, String(id));
  if (!order) return { ok: false, status: 404, error: "No such order" };
  const { status } = statusAt(order);
  const next = nextStatus(status);
  if (!next) return { ok: false, status: 409, error: "This order is already finished." };
  const updated = { ...order, statusOverride: next, overrideAt: new Date().toISOString() };
  await db.set(COL, order.id, updated);
  return { ok: true, order: updated };
}
