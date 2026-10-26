import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdtempSync } from "node:fs";

process.env.STAFF_PHONE = "0911000000";
process.env.STAFF_PASSWORD = "staff-password-1";
process.env.STAFF_NAME = "Kitchen";

const { db } = await import("../lib/db.js");
const users = await import("../lib/users.js");
const orders = await import("../lib/orders.js");

const input = (over = {}) => ({
  name: "Almaz", phone: "0911223344", area: "Bole", address: "Bole Medhanialem", notes: "",
  items: [{ id: 1, quantity: 2 }], idempotencyKey: `key-${Math.random().toString(36).slice(2, 12)}`, ...over,
});

for (const driver of ["memory", "file"]) {
  test(`db (${driver}): get/set/list/delete and atomic setIfAbsent`, async () => {
    process.env.DB_DRIVER = driver;
    if (driver === "file") process.env.DB_FILE = path.join(mkdtempSync(path.join(os.tmpdir(), "addis-")), "db.json");
    const col = `t_${driver}`;
    assert.equal(await db.get(col, "a"), null);
    await db.set(col, "a", { n: 1 });
    assert.deepEqual(await db.get(col, "a"), { n: 1 });
    // mutating a returned value must not change the store
    const got = await db.get(col, "a"); got.n = 99;
    assert.deepEqual(await db.get(col, "a"), { n: 1 });
    // 20 concurrent claims of one key: exactly one wins
    const results = await Promise.all(Array.from({ length: 20 }, (_, i) => db.setIfAbsent(col, "claim", { i })));
    assert.equal(results.filter(Boolean).length, 1);
    assert.equal((await db.list(col)).length, 2);
    await db.delete(col, "a");
    assert.equal(await db.get(col, "a"), null);
  });
}

// Everything below runs on the in-memory driver.
process.env.DB_DRIVER = "memory";

test("accounts: one per phone number, however it is typed", async () => {
  const a = await users.createCustomer({ name: "Almaz", phone: "0911223344", password: "password-1" });
  assert.equal(a.ok, true);
  assert.equal(a.user.role, "customer");
  assert.ok(!JSON.stringify(users.publicUser(a.user)).includes("password"));
  assert.equal((await users.createCustomer({ name: "Dup", phone: "+251911223344", password: "password-2" })).code, "phone_taken");
  assert.equal((await users.createCustomer({ name: "Boss", phone: "0911000000", password: "password-3" })).code, "phone_taken", "staff phone is reserved");
});

test("sign-in: right password works, wrong/unknown fail the same way", async () => {
  await users.createCustomer({ name: "Bruk", phone: "0922334455", password: "password-1" });
  assert.equal((await users.verifyCredentials("0922334455", "password-1")).name, "Bruk");
  assert.equal((await users.verifyCredentials("+251922334455", "password-1")).name, "Bruk");
  assert.equal(await users.verifyCredentials("0922334455", "nope-nope"), null);
  assert.equal(await users.verifyCredentials("0999999999", "password-1"), null);
});

test("staff sign in with the environment credentials and get the staff role", async () => {
  const s = await users.verifyCredentials("0911000000", "staff-password-1");
  assert.equal(s.role, "staff");
  assert.equal(await users.verifyCredentials("0911000000", "wrong-password"), null);
  assert.equal((await users.verifyCredentials("0911000000", "staff-password-1")).id, s.id, "same record every time");
});

test("orders: the server prices them — a client cannot choose its own price", async () => {
  const u = { id: "usr_a", role: "customer" };
  const r = await orders.createOrder(u, input({ items: [{ id: 1, quantity: 2, price: 1 }, { id: 8, quantity: 1 }] }));
  assert.equal(r.ok, true);
  assert.equal(r.order.total, 240 * 2 + 50);
  assert.deepEqual(r.order.items.map((i) => i.price), [240, 50]);
});

test("orders: duplicate lines merge, unknown dishes and over-limit quantities are refused", async () => {
  const u = { id: "usr_a", role: "customer" };
  const merged = await orders.createOrder(u, input({ items: [{ id: 7, quantity: 2 }, { id: 7, quantity: 3 }] }));
  assert.equal(merged.order.items[0].quantity, 5);
  const unknown = await orders.createOrder(u, input({ items: [{ id: 999, quantity: 1 }] }));
  assert.equal(unknown.status, 422);
  assert.ok(unknown.fieldErrors.items);
  const big = await orders.createOrder(u, input({ items: [{ id: 7, quantity: 15 }, { id: 7, quantity: 15 }] }));
  assert.equal(big.status, 422);
  assert.equal((await orders.createOrder(null, input())).status, 401);
});

test("orders: a double submit places ONE order (idempotency)", async () => {
  const u = { id: "usr_idem", role: "customer" };
  const body = input();
  const [a, b, c] = await Promise.all([orders.createOrder(u, body), orders.createOrder(u, body), orders.createOrder(u, body)]);
  assert.equal(new Set([a.order.id, b.order.id, c.order.id]).size, 1);
  assert.equal((await orders.getOrdersFor("usr_idem")).total, 1);
  assert.equal((await orders.createOrder(u, body)).replay, true);
  // another person using the same key gets their own order
  const other = await orders.createOrder({ id: "usr_other", role: "customer" }, body);
  assert.notEqual(other.order.id, a.order.id);
});

test("ownership: 401 signed out, 404 missing, 403 someone else's, staff may read", async () => {
  const owner = { id: "usr_own", role: "customer" }, thief = { id: "usr_thief", role: "customer" }, staff = { id: "usr_s", role: "staff" };
  const { order } = await orders.createOrder(owner, input());
  assert.equal((await orders.getOrderFor(null, order.id)).status, 401);
  assert.equal((await orders.getOrderFor(owner, "ord_missing")).status, 404);
  assert.equal((await orders.getOrderFor(thief, order.id)).status, 403);
  assert.equal((await orders.getOrderFor(owner, order.id)).ok, true);
  assert.equal((await orders.getOrderFor(staff, order.id)).ok, true);
});

test("a person's order list contains only their own orders", async () => {
  const mine = await orders.getOrdersFor("usr_own");
  assert.ok(mine.rows.length >= 1);
  assert.ok(mine.rows.every((o) => !("userId" in o)));
  assert.equal((await orders.getOrdersFor("usr_nobody")).total, 0, "brand-new account: empty, not an error");
  assert.equal((await orders.getOrdersFor("usr_nobody")).pages, 1);
});

test("order list: sort whitelist, direction and paging", async () => {
  const u = { id: "usr_list", role: "customer" };
  for (const q of [1, 3, 2, 5, 4]) await orders.createOrder(u, input({ items: [{ id: 7, quantity: q }] })); // totals 60*q
  const byTotal = await orders.getOrdersFor("usr_list", { sort: "total", dir: "asc" });
  assert.deepEqual(byTotal.rows.map((o) => o.total), [60, 120, 180, 240, 300]);
  assert.equal(byTotal.dir, "asc");
  assert.equal((await orders.getOrdersFor("usr_list", { sort: "DROP TABLE" })).sort, "date", "unknown sort falls back");
  const p2 = await orders.getOrdersFor("usr_list", { pageSize: 2, page: 3 });
  assert.equal(p2.rows.length, 1);
  assert.equal(p2.pages, 3);
  assert.equal((await orders.getOrdersFor("usr_list", { pageSize: 2, page: 99 })).page, 3, "page clamped");
});

test("cancel: authentication, authorisation, then the business rule", async () => {
  const owner = { id: "usr_c1", role: "customer" }, thief = { id: "usr_c2", role: "customer" }, staff = { id: "usr_s", role: "staff" };
  const { order } = await orders.createOrder(owner, input());
  assert.equal((await orders.cancelOrderFor(null, order.id)).status, 401);
  assert.equal((await orders.cancelOrderFor(thief, order.id)).status, 403);
  assert.equal((await orders.cancelOrderFor(staff, order.id)).status, 403, "staff can read but not cancel others' orders");
  assert.equal((await orders.cancelOrderFor(owner, "ord_nope")).status, 404);
  assert.equal((await orders.cancelOrderFor(owner, order.id)).order.status, "cancelled");
  assert.equal((await orders.cancelOrderFor(owner, order.id)).status, 409, "already cancelled");
  // too late once it is on the way
  const late = (await orders.createOrder(owner, input())).order;
  await db.set("orders", late.id, { ...late, placedAt: new Date(Date.now() - 100_000).toISOString() });
  assert.equal((await orders.cancelOrderFor(owner, late.id)).status, 409);
});

test("advance: only staff, and only forward", async () => {
  const customer = { id: "usr_c3", role: "customer" }, staff = { id: "usr_s", role: "staff" };
  const { order } = await orders.createOrder(customer, input());
  assert.equal((await orders.advanceOrderFor(null, order.id)).status, 401);
  assert.equal((await orders.advanceOrderFor(customer, order.id)).status, 403);
  assert.equal((await orders.advanceOrderFor(staff, "ord_nope")).status, 404);
  assert.equal((await orders.advanceOrderFor(staff, order.id)).order.statusOverride, "preparing");
  assert.equal((await orders.advanceOrderFor(staff, order.id)).order.statusOverride, "on_the_way");
  assert.equal((await orders.advanceOrderFor(staff, order.id)).order.statusOverride, "delivered");
  assert.equal((await orders.advanceOrderFor(staff, order.id)).status, 409);
});
