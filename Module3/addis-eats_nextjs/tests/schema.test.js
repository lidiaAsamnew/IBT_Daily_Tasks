import test from "node:test";
import assert from "node:assert/strict";
import { orderSchema, signUpSchema, signInSchema, fieldErrorsOf } from "../lib/schema.js";
import { normalizePhone } from "../lib/constants.js";

const valid = {
  name: "Almaz", phone: "0911223344", area: "Bole", address: "Bole Medhanialem",
  notes: "", items: [{ id: 1, quantity: 2 }], idempotencyKey: "abcdefgh12345678",
};

test("a valid order passes and coerces numbers", () => {
  const r = orderSchema.safeParse({ ...valid, items: [{ id: "1", quantity: "2" }] });
  assert.equal(r.success, true);
  assert.deepEqual(r.data.items, [{ id: 1, quantity: 2 }]);
});

test("phone accepts 09… and +2519… only", () => {
  for (const ok of ["0911223344", "+251911223344"]) assert.equal(orderSchema.safeParse({ ...valid, phone: ok }).success, true);
  for (const bad of ["0211223344", "091122334", "09112233445", "abc", "", "+2511122334455"]) {
    assert.equal(orderSchema.safeParse({ ...valid, phone: bad }).success, false, bad);
  }
  assert.equal(normalizePhone("+251 911 223 344"), "0911223344");
});

test("every failure is reported per field", () => {
  const r = orderSchema.safeParse({ name: "A", phone: "1", area: "Mars", address: "", items: [], idempotencyKey: "x" });
  assert.equal(r.success, false);
  const f = fieldErrorsOf(r.error);
  for (const key of ["name", "phone", "area", "address", "items", "idempotencyKey"]) assert.ok(f[key]?.length, `${key} missing`);
});

test("quantity is bounded", () => {
  for (const q of [0, -1, 21, 1.5]) assert.equal(orderSchema.safeParse({ ...valid, items: [{ id: 1, quantity: q }] }).success, false, String(q));
});

test("sign-up needs an 8+ character password", () => {
  assert.equal(signUpSchema.safeParse({ name: "Almaz", phone: "0911223344", password: "short" }).success, false);
  assert.equal(signUpSchema.safeParse({ name: "Almaz", phone: "0911223344", password: "long-enough-1" }).success, true);
  assert.equal(signInSchema.safeParse({ phone: "0911223344", password: "" }).success, false);
});
