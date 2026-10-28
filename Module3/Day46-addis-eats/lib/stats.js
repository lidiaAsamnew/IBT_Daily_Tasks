import { areas } from "./schema";
import { dayKeyOf, formatDay, formatDayYear } from "./format";

// Day 46: aggregation. Runs on the SERVER and returns a few small plain rows - the only data that
// crosses into the chart components. 4,000 orders in, 6 + 14 rows out.
export const DAYS = 14;
const DAY_MS = 86_400_000;

const counted = (orders) => orders.filter((o) => o.stage !== "cancelled"); // a cancelled order earned nothing

/** The last `days` calendar days (Addis time), oldest first: [{ key: "2026-10-14", label: "14 Oct" }, ...] */
export function lastDays(now = Date.now(), days = DAYS) {
  return Array.from({ length: days }, (_, i) => {
    const ms = now - (days - 1 - i) * DAY_MS;
    return { key: dayKeyOf(ms), label: formatDay(ms) };
  });
}

/** "14 Oct - 27 Oct 2026": printed in the chart headings so the range is never a guess. */
export function rangeLabel(now = Date.now(), days = DAYS) {
  return `${formatDay(now - (days - 1) * DAY_MS)} \u2013 ${formatDayYear(now)}`;
}

/** Orders inside the window only, so both charts and the table talk about the same period. */
export function inWindow(orders, now = Date.now(), days = DAYS) {
  const keys = new Set(lastDays(now, days).map((d) => d.key));
  return orders.filter((o) => keys.has(dayKeyOf(o.createdAt)));
}

/** Revenue per neighbourhood, largest first. Every delivery area appears, even at 0. */
export function revenueByArea(orders) {
  return areas
    .map((area) => {
      const mine = counted(orders).filter((o) => o.area === area);
      return { area, revenue: mine.reduce((sum, o) => sum + o.total, 0), orders: mine.length };
    })
    .sort((a, b) => b.revenue - a.revenue || a.area.localeCompare(b.area));
}

/** Orders per day, oldest first, with a 0 for quiet days (a gap would draw a misleading line). */
export function ordersPerDay(orders, now = Date.now(), days = DAYS) {
  const byDay = new Map();
  for (const o of counted(orders)) byDay.set(dayKeyOf(o.createdAt), (byDay.get(dayKeyOf(o.createdAt)) ?? 0) + 1);
  return lastDays(now, days).map(({ key, label }) => ({ day: label, date: key, orders: byDay.get(key) ?? 0 }));
}
