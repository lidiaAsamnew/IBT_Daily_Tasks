import "server-only";
import { cookies } from "next/headers";
import { makeToken, readToken, SESSION_MAX_AGE } from "@/lib/token";
import { getUserById } from "@/lib/users";

export const SESSION_COOKIE = "session"; // middleware.js uses the same name

// The three flags that matter (Day 42, slide 12).
const cookieOptions = {
  httpOnly: true, // JavaScript cannot read it, so an injected script cannot steal it
  // HTTPS only. Browsers still accept it on http://localhost (Chrome, Edge, Firefox). If yours
  // does not (Safari, or a phone on your LAN), set INSECURE_DEV_COOKIES=1 in .env.local.
  secure: process.env.INSECURE_DEV_COOKIES !== "1",
  sameSite: "lax", // not sent on cross-site POSTs, so another site cannot act as the user
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

// THE session helper: pages, server actions and route handlers all call this and nothing
// else. Returns { id, name, role } or null. Always re-derived from the cookie on the server.
export async function getSession() {
  const id = readToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!id) return null;
  const user = getUserById(id); // an unknown or removed account has no session
  return user ? { id: user.id, name: user.name, role: user.role } : null;
}

export async function setSessionCookie(userId) {
  (await cookies()).set(SESSION_COOKIE, makeToken(userId), cookieOptions);
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}
