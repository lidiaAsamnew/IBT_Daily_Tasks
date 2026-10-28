import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// A signed, expiring token: "<userId>.<expiresAtSeconds>.<hmac>". The cookie holds only
// the id and the expiry; the role is looked up on the server, so it cannot be forged.
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

function secret() {
  const s = process.env.SESSION_SECRET; // server-only: no NEXT_PUBLIC_ prefix
  if (s) return s;
  if (process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET is not set");
  return "dev-only-secret-change-me";
}

const sign = (value) => createHmac("sha256", secret()).update(value).digest("hex");

export function makeToken(userId, now = Date.now()) {
  const payload = `${userId}.${Math.floor(now / 1000) + SESSION_MAX_AGE}`;
  return `${payload}.${sign(payload)}`;
}

// Returns the user id, or null for anything malformed, forged or expired.
export function readToken(raw, now = Date.now()) {
  if (typeof raw !== "string") return null;
  const parts = raw.split(".");
  if (parts.length !== 3) return null;
  const [id, exp, sig] = parts;
  if (!/^[\w-]+$/.test(id) || !/^\d+$/.test(exp)) return null;
  const expected = Buffer.from(sign(`${id}.${exp}`));
  const given = Buffer.from(sig);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null; // forged
  if (Number(exp) <= Math.floor(now / 1000)) return null; // expired, even if the browser kept it
  return id;
}
