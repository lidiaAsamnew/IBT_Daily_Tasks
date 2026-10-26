/**
 * Where to send someone after sign-in (Day 42). Only same-site paths are allowed.
 * "starts with a slash" alone is NOT enough: "//evil.com" and "/\evil.com" also start with one and
 * browsers treat them as another site. Control characters are rejected because browsers strip
 * tabs and newlines from URLs ("/\t/evil.com" becomes "//evil.com").
 */
export function safeNext(value, fallback = "/") {
  if (typeof value !== "string" || value.length > 512) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  // eslint-disable-next-line no-control-regex -- matching control characters is the whole point here
  if (/[\u0000-\u001f\u007f\\]/.test(value)) return fallback;
  try {
    const url = new URL(value, "http://localhost");
    if (url.origin !== "http://localhost") return fallback;
    if (url.pathname === "/signin" || url.pathname === "/signup") return fallback; // no sign-in loops
  } catch {
    return fallback;
  }
  return value;
}
