// Day 46: the one place numbers and dates become text. No "server-only": the charts (client) and the
// tables (server) both import it, so an axis tick, a tooltip and a table cell can never disagree.
export const TIME_ZONE = "Africa/Addis_Ababa";

const etbFormat = new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB", maximumFractionDigits: 0 });
/** 14200 -> "ETB 14,200" (no library; Intl does it). */
export const etb = (value) => etbFormat.format(value);

const dateTime = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: TIME_ZONE });
/** A timestamp -> "27 Oct 2026, 06:14", in Addis Ababa time. */
export const formatDateTime = (ms) => dateTime.format(new Date(ms));

const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }); // en-CA = YYYY-MM-DD
/** The calendar day (in Addis Ababa) a timestamp falls on: "2026-10-27". */
export const dayKeyOf = (ms) => dayKey.format(new Date(ms));

const dayLabel = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: TIME_ZONE });
const dayLabelYear = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: TIME_ZONE });
export const formatDay = (ms) => dayLabel.format(new Date(ms)); // "27 Oct"
export const formatDayYear = (ms) => dayLabelYear.format(new Date(ms)); // "27 Oct 2026"
