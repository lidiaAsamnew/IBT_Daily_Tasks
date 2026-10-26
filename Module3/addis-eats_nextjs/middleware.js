import { NextResponse } from "next/server";
import { SESSION_COOKIE, looksLikeToken } from "./lib/token.js";

// Layer one of three (Day 42): a fast, cheap redirect BEFORE anything renders. It only proves that a
// well-formed cookie exists — it cannot verify who the person is (the edge runtime is deliberately
// limited), so it is not security. The page re-verifies the session and every action checks it again.
export function middleware(request) {
  if (!looksLikeToken(request.cookies.get(SESSION_COOKIE)?.value)) {
    const url = new URL("/signin", request.url);
    // Remember where they were going. The sign-in page validates this value before using it.
    url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// Keep it narrow: without a matcher it would run on every request, images included.
export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/track/:path*", "/kitchen/:path*", "/dashboard/:path*"],
};
