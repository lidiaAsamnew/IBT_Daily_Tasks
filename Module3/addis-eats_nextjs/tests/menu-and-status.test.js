import test from "node:test";
import assert from "node:assert/strict";
import { MENU, CATEGORY_ORDER } from "../data/menu.js";
import { queryDishes, categoriesOf, menuHref, PAGE_SIZE } from "../lib/dish-query.js";
import { statusAt, toPublicOrder, SIM_SECONDS, canCancel, nextStatus } from "../lib/order-status.js";
import { courierPosition, etaMinutes, KITCHEN, destinationFor } from "../lib/tracking.js";
import { revenueByArea, ordersPerDay, summarise } from "../lib/stats.js";

test("every category in the data has a filter (Chips/Snack bug from the old app)", () => {
  const cats = categoriesOf(MENU, CATEGORY_ORDER);
  assert.deepEqual(cats, ["Main", "Vegetarian", "Breakfast", "Snack", "Drinks"]);
  assert.equal(queryDishes(MENU, { category: "Snack" }).dishes[0].name, "Chips");
});

test("search, category and paging", () => {
  assert.equal(queryDishes(MENU, { q: "tibs" }).total, 1);
  assert.equal(queryDishes(MENU, { q: "  SHIRO " }).dishes[0].name, "Shiro");
  assert.equal(queryDishes(MENU, { q: "zzz" }).total, 0);
  const p1 = queryDishes(MENU, {});
  assert.equal(p1.dishes.length, PAGE_SIZE);
  assert.equal(p1.pages, 2);
  assert.equal(queryDishes(MENU, { page: 2 }).dishes.length, MENU.length - PAGE_SIZE);
  assert.equal(queryDishes(MENU, { page: 99 }).page, 2, "page is clamped");
  assert.equal(menuHref({ category: "Main", page: 2 }), "/menu?category=Main&page=2");
  assert.equal(menuHref({}), "/menu");
});

const order = (placedAt, extra = {}) => ({ id: "o1", area: "Bole", total: 300, status: "placed", placedAt, ...extra });
const T0 = Date.parse("2026-07-14T12:00:00Z");

test("order progress is simulated from the clock", () => {
  const o = order("2026-07-14T12:00:00Z");
  const at = (s) => statusAt(o, T0 + s * 1000).status;
  assert.deepEqual([at(0), at(31), at(95), at(215)], ["placed", "preparing", "on_the_way", "delivered"]);
  assert.equal(canCancel("placed"), true);
  assert.equal(canCancel("on_the_way"), false);
});

test("cancelled and staff-overridden orders ignore the clock", () => {
  assert.equal(statusAt(order("2026-07-14T12:00:00Z", { status: "cancelled", cancelledAt: "2026-07-14T12:00:10Z" }), T0 + 999e3).status, "cancelled");
  assert.equal(statusAt(order("2026-07-14T12:00:00Z", { statusOverride: "preparing", overrideAt: "2026-07-14T12:00:05Z" }), T0 + 999e3).status, "preparing");
  assert.equal(nextStatus("preparing"), "on_the_way");
  assert.equal(nextStatus("delivered"), null);
});

test("public orders never leak the owner or idempotency key", () => {
  const pub = toPublicOrder({ ...order("2026-07-14T12:00:00Z"), userId: "usr_1", idempotencyKey: "secret", items: [], name: "A", phone: "0911", address: "x", notes: "" }, T0);
  assert.equal("userId" in pub, false);
  assert.equal("idempotencyKey" in pub, false);
  assert.equal(pub.status, "placed");
});

test("courier stays at the kitchen, drives to the area, then sits at the destination", () => {
  const o = order("2026-07-14T12:00:00Z");
  assert.deepEqual(courierPosition(o, T0 + 10e3), KITCHEN.position);
  const mid = courierPosition(o, T0 + (SIM_SECONDS.on_the_way + 60) * 1000);
  const dest = destinationFor("Bole");
  assert.ok(mid[0] > KITCHEN.position[0] && mid[0] < dest[0], "between kitchen and destination (lat)");
  assert.deepEqual(courierPosition(o, T0 + 999e3), dest);
  assert.equal(etaMinutes(o, T0 + 999e3), null);
  assert.ok(etaMinutes(o, T0 + 5e3) >= 1);
  // lat first: all Addis points sit near 9N, 38.7E — reversing them would land in the Indian Ocean
  for (const [lat, lng] of [KITCHEN.position, ...["Summit", "Akaki", "Bole", "Gullele"].map(destinationFor)]) {
    assert.ok(lat > 8.8 && lat < 9.2 && lng > 38.6 && lng < 39);
  }
});

test("dashboard aggregation excludes cancelled orders and fills empty days", () => {
  const now = Date.parse("2026-07-14T12:00:00Z");
  const orders = [
    { area: "Bole", total: 300, status: "delivered", placedAt: "2026-07-14T08:00:00Z" },
    { area: "Bole", total: 100, status: "placed", placedAt: "2026-07-13T08:00:00Z" },
    { area: "Akaki", total: 500, status: "cancelled", placedAt: "2026-07-14T09:00:00Z" },
  ];
  const byArea = revenueByArea(orders);
  assert.equal(byArea.find((r) => r.area === "Bole").revenue, 400);
  assert.equal(byArea.find((r) => r.area === "Akaki").revenue, 0);
  const days = ordersPerDay(orders, 3, now);
  assert.equal(days.length, 3);
  assert.deepEqual(days.map((d) => d.orders), [0, 1, 1]);
  assert.deepEqual(summarise(orders), { orders: 2, revenue: 400, average: 200, active: 1, cancelled: 1 });
  assert.deepEqual(summarise([]), { orders: 0, revenue: 0, average: 0, active: 0, cancelled: 0 });
});
