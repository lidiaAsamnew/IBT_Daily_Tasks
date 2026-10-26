// Signed session tokens, built on Web Crypto so the SAME code runs in Node and in the edge runtime
// that middleware uses. Format: base64url(payload) + "." + base64url(HMAC-SHA256).
// Day 42: "a signed token cannot be withdrawn before it expires" -> keep the lifetime short (24 h).

export const SESSION_COOKIE = "session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes) {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text) {
  const padded = text.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (text.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

function hmacKey(secret, usages) {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, usages);
}

/** Cheap shape check — all that middleware may do (Day 42: it only proves a cookie exists). */
export function looksLikeToken(token) {
  return typeof token === "string" && token.length <= 2048 && /^[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{20,}$/.test(token);
}

export async function signToken(payload, secret, ttlSeconds = SESSION_TTL_SECONDS, now = Date.now()) {
  const issued = Math.floor(now / 1000);
  const body = toBase64Url(encoder.encode(JSON.stringify({ ...payload, iat: issued, exp: issued + ttlSeconds })));
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(secret, ["sign"]), encoder.encode(body));
  return `${body}.${toBase64Url(new Uint8Array(signature))}`;
}

/** Returns the payload, or null for anything malformed, forged or expired. Never throws. */
export async function verifyToken(token, secret, now = Date.now()) {
  if (!looksLikeToken(token)) return null;
  const [body, signature] = token.split(".");
  try {
    // crypto.subtle.verify compares in constant time.
    const valid = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(secret, ["verify"]),
      fromBase64Url(signature),
      encoder.encode(body),
    );
    if (!valid) return null;
    const payload = JSON.parse(decoder.decode(fromBase64Url(body)));
    if (!payload || typeof payload.exp !== "number" || payload.exp * 1000 <= now) return null;
    return payload;
  } catch {
    return null;
  }
}
