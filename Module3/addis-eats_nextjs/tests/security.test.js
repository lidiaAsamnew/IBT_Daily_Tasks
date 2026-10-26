import test from "node:test";
import assert from "node:assert/strict";
import { signToken, verifyToken, looksLikeToken } from "../lib/token.js";
import { safeNext } from "../lib/safe-next.js";
import { hashPassword, verifyPassword } from "../lib/password.js";

const SECRET = "a-test-secret-that-is-long-enough-for-hmac-0123456789";

test("a signed token verifies and carries its payload", async () => {
  const t = await signToken({ id: "usr_1", role: "customer" }, SECRET);
  assert.equal(looksLikeToken(t), true);
  const p = await verifyToken(t, SECRET);
  assert.equal(p.id, "usr_1");
  assert.equal(p.role, "customer");
});

test("a token is rejected when forged, tampered, signed with another secret, or expired", async () => {
  const t = await signToken({ id: "usr_1", role: "customer" }, SECRET);
  const [body, sig] = t.split(".");
  const forgedBody = Buffer.from(JSON.stringify({ id: "usr_1", role: "staff", exp: 9999999999 })).toString("base64url");
  assert.equal(await verifyToken(`${forgedBody}.${sig}`, SECRET), null, "role changed, signature reused");
  assert.equal(await verifyToken(`${body}.${sig.slice(0, -2)}AA`, SECRET), null, "signature altered");
  assert.equal(await verifyToken(t, "another-secret-another-secret-another-secret"), null);
  const old = await signToken({ id: "x" }, SECRET, 60, Date.now() - 120_000);
  assert.equal(await verifyToken(old, SECRET), null, "expired");
  for (const junk of ["", "abc", "a.b", null, undefined, 42, "x".repeat(5000)]) assert.equal(await verifyToken(junk, SECRET), null);
});

test("safeNext allows same-site paths only (open-redirect defence)", () => {
  assert.equal(safeNext("/orders"), "/orders");
  assert.equal(safeNext("/orders?sort=total&dir=asc"), "/orders?sort=total&dir=asc");
  for (const bad of [
    "https://example.com", "//example.com", "/\\example.com", "/\t/example.com", "/\n/example.com",
    "javascript:alert(1)", "example.com", "", undefined, null, "/signin", "/signin?next=/orders", "/signup",
  ]) assert.equal(safeNext(bad), "/", `should reject ${JSON.stringify(bad)}`);
  assert.equal(safeNext("//evil.com", "/menu"), "/menu");
});

test("passwords are hashed with a salt and verified", async () => {
  const h1 = await hashPassword("correct horse");
  const h2 = await hashPassword("correct horse");
  assert.notEqual(h1, h2, "salted");
  assert.ok(!h1.includes("correct horse"));
  assert.equal(await verifyPassword("correct horse", h1), true);
  assert.equal(await verifyPassword("wrong", h1), false);
  assert.equal(await verifyPassword("x", "garbage"), false);
});
