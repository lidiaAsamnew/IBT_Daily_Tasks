// Where to send someone after sign-in. The value comes from the URL, so anyone can craft it.
// Only same-site paths pass; everything else becomes the fallback (the open-redirect fix).
export function safeNext(value, fallback = "/") {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/")) return fallback; // https://evil.com, evil.com, javascript:...
  if (value.startsWith("//") || value.startsWith("/\\")) return fallback; // //evil.com is a full URL too
  if (/[\u0000-\u001f]/.test(value)) return fallback; // no control characters / header tricks
  if (value === "/signin" || value.startsWith("/signin?")) return fallback; // no sign-in loop
  return value;
}
