import "server-only";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";

// Demo session: a signed cookie holding a display name. It stands in for real
// authentication (Module 4). The signature stops anyone forging someone else's
// cookie; SESSION_SECRET comes from .env.local and is never sent to the browser.
export const SESSION_COOKIE = "session";

function secret() {
  const s = process.env.SESSION_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET is not set");
  return "dev-only-secret-change-me";
}

const sign = (value) => createHmac("sha256", secret()).update(value).digest("hex");

export function makeSessionValue(name) {
  return `${encodeURIComponent(name)}.${sign(name)}`;
}

// Returns { id, name } or null. Always re-derived from the cookie on the server.
export async function getSession() {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const dot = raw.lastIndexOf(".");
  if (dot < 1) return null;
  let name;
  try { name = decodeURIComponent(raw.slice(0, dot)); } catch { return null; }
  const given = Buffer.from(raw.slice(dot + 1));
  const expected = Buffer.from(sign(name));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  return { id: name.toLowerCase(), name };
}
