import test from "node:test";
import assert from "node:assert/strict";

// A minimal browser: localStorage + window events, enough to exercise the store.
function installBrowser(initial) {
  const data = new Map(initial ? [["addis-eats-cart-v1", initial]] : []);
  const handlers = new Set();
  globalThis.window = {
    localStorage: { getItem: (k) => (data.has(k) ? data.get(k) : null), setItem: (k, v) => data.set(k, v), removeItem: (k) => data.delete(k) },
    addEventListener: (_t, fn) => handlers.add(fn),
    removeEventListener: (_t, fn) => handlers.delete(fn),
  };
  return { data, fire: (e) => handlers.forEach((h) => h(e)) };
}
const fresh = async () => { const m = await import("../lib/cart-store.js"); m.resetCartForTests(); return m; };
const doro = { id: 1, name: "Doro Wat", price: 240, image: "/assets/doro-wat.jpg" };

test("server snapshot is always an empty cart (so hydration matches)", async () => {
  delete globalThis.window;
  const m = await fresh();
  assert.deepEqual(m.getServerSnapshot().items, []);
  assert.equal(m.getServerSnapshot(), m.getServerSnapshot(), "a stable reference");
});

test("add, increase, set, remove, clear — and the snapshot only changes when the cart does", async () => {
  const b = installBrowser(); const m = await fresh();
  const s0 = m.getSnapshot(); assert.equal(m.getSnapshot(), s0, "no change, same reference");
  m.cartActions.add(doro); m.cartActions.add(doro); m.cartActions.add({ id: 8, name: "Fresh Juice", price: 50 });
  assert.deepEqual(m.getSnapshot().items.map((i) => [i.id, i.quantity]), [[1, 2], [8, 1]]);
  assert.deepEqual(m.cartTotals(m.getSnapshot().items), { count: 3, total: 530 });
  m.cartActions.setQuantity(1, 5); assert.equal(m.getSnapshot().items[0].quantity, 5, "set does not reorder lines");
  m.cartActions.setQuantity(1, 0); assert.deepEqual(m.getSnapshot().items.map((i) => i.id), [8], "quantity 0 removes");
  m.cartActions.setQuantity(8, 999); assert.equal(m.getSnapshot().items[0].quantity, 20, "capped at 20");
  m.cartActions.remove(8); assert.equal(m.getSnapshot().items.length, 0);
  m.cartActions.add(doro); m.cartActions.clear(); assert.equal(m.getSnapshot().items.length, 0);
  assert.equal(JSON.parse(b.data.get("addis-eats-cart-v1")).length, 0, "persisted");
});

test("the cart survives a reload, and corrupt or hostile storage is ignored", async () => {
  installBrowser(JSON.stringify([{ id: 1, name: "Doro Wat", price: 240, quantity: 3 }]));
  assert.equal((await fresh()).getSnapshot().items[0].quantity, 3);
  for (const junk of ["not json", "{}", "null", JSON.stringify([{ id: "x", name: 1 }]), JSON.stringify([{ id: 1, name: "A", price: 1, quantity: -9 }])]) {
    installBrowser(junk);
    const items = (await fresh()).getSnapshot().items;
    assert.ok(items.every((i) => i.quantity >= 1 && i.quantity <= 20), junk);
  }
});

test("subscribers are notified, and another tab's change is picked up", async () => {
  const b = installBrowser(); const m = await fresh();
  let calls = 0; const unsubscribe = m.subscribe(() => calls++);
  m.cartActions.add(doro); assert.equal(calls, 1);
  b.data.set("addis-eats-cart-v1", JSON.stringify([{ id: 8, name: "Fresh Juice", price: 50, quantity: 2 }]));
  b.fire({ key: "addis-eats-cart-v1" });
  assert.equal(calls, 2); assert.equal(m.getSnapshot().items[0].id, 8);
  unsubscribe(); m.cartActions.clear(); assert.equal(calls, 2, "no calls after unsubscribe");
});
