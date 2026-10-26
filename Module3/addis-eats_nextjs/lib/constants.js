// Rules shared by the form (HTML attributes), the zod schema and the server.
// No imports here on purpose, so a client component can use it without pulling in zod.

export const AREAS = ["Summit", "Akaki", "Bole", "Gullele"];

// Ethiopian mobile numbers: 09xxxxxxxx or +2519xxxxxxxx.
export const PHONE_PATTERN = "^(09\\d{8}|\\+2519\\d{8})$";
export const PHONE_REGEX = new RegExp(PHONE_PATTERN);
export const PHONE_HINT = "Use 09… or +2519… (for example 0911223344).";

export const MAX_QUANTITY = 20;
export const MAX_LINES = 30;

export const NAME_MAX = 80;
export const ADDRESS_MAX = 200;
export const NOTES_MAX = 300;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;

/** "+251911223344" -> "0911223344", so one person is one account however they type it. */
export function normalizePhone(value) {
  const v = String(value ?? "").trim().replace(/[\s-]/g, "");
  return v.startsWith("+2519") ? `0${v.slice(4)}` : v;
}
