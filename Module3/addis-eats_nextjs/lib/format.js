// One module for every number, price and date the app shows (Day 47).
// Always name the locale AND the time zone, so the server and the phone agree (no hydration mismatch).

const LOCALE = "en-ET";
const TIME_ZONE = "Africa/Addis_Ababa"; // EAT, UTC+3 all year

const etbFormat = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 0,
});
const numberFormat = new Intl.NumberFormat(LOCALE);
const whenFormat = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: TIME_ZONE,
});
const dayFormat = new Intl.DateTimeFormat(LOCALE, { day: "numeric", month: "short", timeZone: TIME_ZONE });
const isoDayFormat = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: TIME_ZONE,
});
const relativeFormat = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** 240 -> "ETB 240". Anything that is not a finite number is shown as ETB 0, never "NaN". */
export function etb(value) {
  const n = Number(value);
  return etbFormat.format(Number.isFinite(n) ? n : 0);
}

export function number(value) {
  const n = Number(value);
  return numberFormat.format(Number.isFinite(n) ? n : 0);
}

/** An ISO timestamp -> "14 Jul 2026, 6:40 PM" in Addis Ababa time. */
export function when(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : whenFormat.format(d);
}

/** "14 Jul" — for chart axes. */
export function shortDay(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : dayFormat.format(d);
}

/** The calendar day in Addis Ababa as YYYY-MM-DD (the grouping key for orders per day). */
export function dayKey(value) {
  return isoDayFormat.format(new Date(value));
}

/** "12 minutes ago" / "in 3 minutes". Call from client code after mount — it depends on the clock. */
export function relative(value, now = Date.now()) {
  const diff = (new Date(value).getTime() - now) / 1000;
  if (!Number.isFinite(diff)) return "—";
  const abs = Math.abs(diff);
  if (abs < 45) return relativeFormat.format(Math.round(diff), "second");
  if (abs < 45 * 60) return relativeFormat.format(Math.round(diff / 60), "minute");
  if (abs < 22 * 3600) return relativeFormat.format(Math.round(diff / 3600), "hour");
  return relativeFormat.format(Math.round(diff / 86400), "day");
}
