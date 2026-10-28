// Day 46 + 47: the one place numbers, money, dates and distances become text (etb, when, relative, ...).
// Every formatter is built ONCE, here, with an explicit locale and an explicit time zone, and imported
// everywhere: the charts (client), the tables (server), the tracking page and the CSV export can never disagree.
// No "server-only" on purpose: both sides import it. No library: Intl is built into the browser and Node.
export const TIME_ZONE = "Africa/Addis_Ababa"; // EAT, UTC+3, no daylight saving. Named anyway: never trust the server's.

const etbFormat = new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB", maximumFractionDigits: 0 });
/** 14200 -> "ETB 14,200". Money is stored as integer birr; a string or NaN becomes "-" instead of "NaN". */
export const etb = (value) => (Number.isFinite(value) ? etbFormat.format(value) : "-");

const whenFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: TIME_ZONE });
/** A timestamp (ms, or an ISO string) -> "27 Oct 2026, 06:14", in Addis Ababa time. */
export const when = (value) => whenFormat.format(new Date(value));

const timeFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: TIME_ZONE });
/** A timestamp -> "18:40", in Addis Ababa time. */
export const time = (value) => timeFormat.format(new Date(value));

const relativeFormat = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const UNITS = [["day", 86_400], ["hour", 3_600], ["minute", 60], ["second", 1]];
/** "12 minutes ago", "in 40 seconds". Pass `now` explicitly so a caller can keep it in state (see useNow). */
export function relative(value, now = Date.now()) {
  const seconds = Math.round((new Date(value).getTime() - now) / 1000);
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size || unit === "second") return relativeFormat.format(Math.trunc(seconds / size), unit);
  }
}

const meters = new Intl.NumberFormat("en-ET", { style: "unit", unit: "meter", maximumFractionDigits: 0 });
const kilometers = new Intl.NumberFormat("en-ET", { style: "unit", unit: "kilometer", maximumFractionDigits: 1 });
/** 350 -> "350 m", 1420 -> "1.4 km". */
export const distance = (m) => (m < 1000 ? meters.format(Math.round(m / 10) * 10) : kilometers.format(m / 1000));

// ---- Day 46: calendar-day helpers for the dashboard (stats, sample data) ----
export const formatDateTime = when; // Day 46 name, kept so nothing that imported it breaks

const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }); // en-CA = YYYY-MM-DD
/** The calendar day (in Addis Ababa) a timestamp falls on: "2026-10-27". */
export const dayKeyOf = (ms) => dayKey.format(new Date(ms));

const dayLabel = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: TIME_ZONE });
const dayLabelYear = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: TIME_ZONE });
export const formatDay = (ms) => dayLabel.format(new Date(ms)); // "27 Oct"
export const formatDayYear = (ms) => dayLabelYear.format(new Date(ms)); // "27 Oct 2026"
