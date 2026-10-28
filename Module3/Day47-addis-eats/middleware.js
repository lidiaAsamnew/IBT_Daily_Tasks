import { NextResponse } from "next/server";

// LAYER 1 - cheap and early. It only checks that a session cookie exists and is shaped like
// ours ("<id>.<expiry>.<64 hex>"). It does NOT prove who the person is: a forged cookie of
// the right shape passes here and is rejected by getSession() inside the page or action.
// (It runs on the edge runtime, so it cannot import lib/session.js or touch a database.)
const SHAPE = /^[\w-]+\.\d+\.[a-f0-9]{64}$/;

export function middleware(request) {
  const cookie = request.cookies.get("session")?.value; // same name as SESSION_COOKIE
  if (cookie && SHAPE.test(cookie)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/signin";
  url.search = "";
  // Remember where they were going. /signin checks this value again (lib/safe-next.js).
  url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(url);
}

// Narrow on purpose: only the private routes. Images, /_next, /menu and the API never run it.
export const config = { matcher: ["/checkout/:path*", "/orders/:path*", "/track/:path*"] };
