// Server-only session helpers (Day 42) — the same call in a page, an action and a route handler.
// NOTE: reading cookies makes any route that calls this DYNAMIC (Day 37). That is why the root layout
// and the public pages (/, /menu, /menu/[id]) never call it.
import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, signToken, verifyToken } from "./token.js";
import { getEnv } from "./env.js";
import { findUserById } from "./users.js";

const cookieFlags = () => ({
  httpOnly: true, // JavaScript cannot read it (blocks script theft of the session)
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "lax", // not sent on cross-site POSTs (blocks another site acting as the user)
  path: "/",
});

/** The signed-in person, or null. Verifies the signature and expiry. */
export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifyToken(token, getEnv().sessionSecret);
  if (!payload?.id) return null;
  return { id: payload.id, name: String(payload.name ?? ""), role: payload.role === "staff" ? "staff" : "customer" };
}

export async function createSession(user) {
  const token = await signToken({ id: user.id, name: user.name, role: user.role }, getEnv().sessionSecret);
  (await cookies()).set(SESSION_COOKIE, token, { ...cookieFlags(), maxAge: SESSION_TTL_SECONDS });
}

export async function destroySession() {
  (await cookies()).set(SESSION_COOKIE, "", { ...cookieFlags(), maxAge: 0 });
}

/** Staff only: the token says staff AND the stored record still does (handles a demoted account). */
export async function getStaffSession() {
  const session = await getSession();
  if (!session || session.role !== "staff") return null;
  const user = await findUserById(session.id);
  return user?.role === "staff" ? session : null;
}
