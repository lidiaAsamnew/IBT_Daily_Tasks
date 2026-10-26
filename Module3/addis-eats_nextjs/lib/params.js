/** searchParams values can be a string, an array (?a=1&a=2) or undefined. Take the first string. */
export const first = (value) => (Array.isArray(value) ? value[0] : value);

/** A positive integer from a query-string value, or the fallback. */
export function positiveInt(value, fallback = 1) {
  const n = Number.parseInt(first(value) ?? "", 10);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}
