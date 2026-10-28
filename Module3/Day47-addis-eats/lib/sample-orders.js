import { dishes, DELIVERY_FEE } from "./dishes";
import { areas } from "./schema";
import { dayKeyOf } from "./format";

// Day 46: a labelled SAMPLE dataset (/dashboard?data=sample). Orders live in memory and start empty, so
// a dashboard built on them alone could never show a chart. This generates ~150 orders over the last
// 14 days, the same every time (seeded), shaped exactly like real order rows. It is never stored and
// never mixed with real orders; the page says "Showing sample data" whenever it is on.
const DAY_MS = 86_400_000;
const FIRST_NAMES = ["Almaz", "Dawit", "Selam", "Hana", "Yonas", "Meron", "Abel", "Tigist", "Bereket", "Liya"];
// Some neighbourhoods order more than others, so the bar chart has a shape worth reading.
const AREA_WEIGHT = { Bole: 30, Kazanchis: 22, Piassa: 10, Sarbet: 14, CMC: 8, Megenagna: 16 };

function seeded(seed) { // mulberry32: tiny, deterministic
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rand, weighted) {
  const entries = Object.entries(weighted);
  let r = rand() * entries.reduce((n, [, w]) => n + w, 0);
  for (const [k, w] of entries) if ((r -= w) < 0) return k;
  return entries[0][0];
}

export function sampleOrders(now = Date.now(), days = 14) {
  const rand = seeded(46);
  const weights = Object.fromEntries(areas.map((a) => [a, AREA_WEIGHT[a] ?? 10]));
  const rows = [];
  for (let d = days - 1; d >= 0; d--) {
    // Midnight (Addis Ababa is UTC+3, no daylight saving) of the day that is d days ago. Every order is placed
    // INSIDE that day, so the per-day counts and the 14-day window always agree.
    const midnight = Date.parse(`${dayKeyOf(now - d * DAY_MS)}T00:00:00+03:00`);
    const perDay = 6 + Math.floor(rand() * 9) + (d % 7 === 0 ? 4 : 0); // 6-14, a busier day each week
    for (let i = 0; i < perDay; i++) {
      const latest = d === 0 ? now - 60_000 : midnight + DAY_MS - 1; // today: nothing in the future
      const createdAt = Math.floor(midnight + rand() * (latest - midnight));
      const lines = 1 + Math.floor(rand() * 3);
      const items = Array.from({ length: lines }, () => {
        const dish = dishes[Math.floor(rand() * dishes.length)];
        return { id: dish.id, name: dish.name, price: dish.price, qty: 1 + Math.floor(rand() * 2) };
      });
      const total = items.reduce((n, i2) => n + i2.price * i2.qty, 0) + DELIVERY_FEE;
      const cancelled = rand() < 0.06;
      rows.push({
        id: `smp_${(rows.length + 1).toString(16).padStart(4, "0")}`,
        customer: FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)],
        area: pick(rand, weights),
        items, total, currency: "ETB",
        status: cancelled ? "cancelled" : "placed",
        stage: cancelled ? "cancelled" : "delivered",
        createdAt,
      });
    }
  }
  return rows;
}
