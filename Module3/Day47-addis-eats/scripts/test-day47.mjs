// Day 47 checks that need no browser and no install:  npm run test:day47
// Covers the pure logic: CSV escaping, Intl formatters, courier geometry, and the order view the stream sends.
import { register } from "node:module";
import assert from "node:assert/strict";

register("./alias-loader.mjs", import.meta.url);

const { toCsv } = await import("../lib/csv.js");
const { etb, when, time, relative, distance, dayKeyOf } = await import("../lib/format.js");
const { courierPoint, deliveryPoint, distanceM, KITCHEN } = await import("../lib/geo.js");
const { createOrder, getOrderView } = await import("../lib/orders.js");

let passed = 0;
const test = (name, fn) => { fn(); passed += 1; console.log(`ok  ${name}`); };

// ---- CSV ----
test("csv: plain values are not quoted", () => {
  assert.equal(toCsv([{ a: "x", b: 2 }]), "a,b\r\nx,2");
});
test("csv: a comma is quoted (Bole, Kitfo)", () => {
  assert.equal(toCsv([{ name: "Bole, Kitfo", n: 1 }]), 'name,n\r\n"Bole, Kitfo",1');
});
test("csv: a quotation mark is wrapped and doubled", () => {
  assert.equal(toCsv([{ name: 'Edna "Mall"' }]), 'name\r\n"Edna ""Mall"""');
});
test("csv: a newline stays inside one quoted cell", () => {
  assert.equal(toCsv([{ a: "one\ntwo", b: "x" }]), 'a,b\r\n"one\ntwo",x');
});
test("csv: null and undefined become empty cells; numbers (even negative) are untouched", () => {
  assert.equal(toCsv([{ a: null, b: undefined, c: -5, d: 1200.5 }]), "a,b,c,d\r\n,,-5,1200.5");
});
test("csv: a text cell that starts like a formula is neutralised", () => {
  assert.equal(toCsv([{ a: "=SUM(A1)" }]), "a\r\n'=SUM(A1)");
});
test("csv: no rows, no columns -> empty string, not a crash", () => {
  assert.equal(toCsv([]), "");
});
test("csv: round trip - a hand-rolled RFC 4180 reader gets every awkward value back with 7 columns", () => {
  const rows = [
    { A: "x", B: "Bole, Kitfo", C: 'say "hi"', D: "line1\nline2", E: "", F: "plain", G: 1200.5 },
    { A: "y", B: "no", C: '"', D: ",", E: ",,", F: '""', G: 3 },
  ];
  const text = toCsv(rows);
  const parsed = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
    else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\r") { /* CR of CRLF */ }
    else if (ch === "\n") { row.push(cell); parsed.push(row); row = []; cell = ""; }
    else cell += ch;
  }
  row.push(cell); parsed.push(row);
  assert.equal(parsed.length, 3);
  assert.ok(parsed.every((r) => r.length === 7));
  assert.deepEqual(parsed[1], ["x", "Bole, Kitfo", 'say "hi"', "line1\nline2", "", "plain", "1200.5"]);
  assert.deepEqual(parsed[2], ["y", "no", '"', ",", ",,", '""', "3"]);
});

// ---- Intl ----
test("etb: integer birr, no decimals, thousands separator", () => {
  assert.match(etb(14200), /^ETB\s14,200$/);
  assert.match(etb(240), /^ETB\s240$/);
  assert.match(etb(1200.5), /^ETB\s1,20[01]$/); // rounded to whole birr, never "1200.5"
});
test("etb: a string or NaN gives a dash, never 'NaN'", () => {
  assert.equal(etb("240"), "-");
  assert.equal(etb(NaN), "-");
});
test("when/time: Addis Ababa is UTC+3 whatever the machine's zone is", () => {
  const instant = Date.parse("2026-07-14T15:40:00Z");
  assert.equal(time(instant), "18:40");
  assert.equal(when(instant), "14 Jul 2026, 18:40");
  assert.equal(dayKeyOf(Date.parse("2026-07-14T22:30:00Z")), "2026-07-15"); // 01:30 the next day in Addis
});
test("relative: past, future and 'now'", () => {
  const now = Date.parse("2026-07-14T15:40:00Z");
  assert.equal(relative(now - 12 * 60_000, now), "12 minutes ago");
  assert.equal(relative(now + 40_000, now), "in 40 seconds");
  assert.equal(relative(now, now), "now");
  assert.equal(relative(now - 3 * 3_600_000, now), "3 hours ago");
});
test("distance: metres under 1 km, kilometres above", () => {
  assert.match(distance(350), /^350\s?m$/);
  assert.match(distance(1420), /^1\.4\s?km$/);
});

// ---- geo ----
test("geo: Bole is in the right hemisphere and the right order ([lat, lng], not [lng, lat])", () => {
  const { lat, lng } = deliveryPoint("Bole");
  assert.ok(lat > 8 && lat < 10 && lng > 38 && lng < 39);
});
test("geo: every delivery area is within 15 km of the kitchen (nothing in the Indian Ocean)", () => {
  for (const area of ["Bole", "Kazanchis", "Piassa", "Sarbet", "CMC", "Megenagna"]) {
    const d = distanceM(KITCHEN, deliveryPoint(area));
    assert.ok(d < 15_000, `${area}: ${d}`);
  }
});

// ---- the order view (what the page is seeded with and what the stream sends) ----
const session = { id: "u1", name: "Almaz Tesfaye", role: "customer" };
const placed = createOrder({ name: "Almaz Tesfaye", phone: "0911000001", area: "Bole", items: [{ id: "kitfo", qty: 2 }, { id: "shiro", qty: 1 }] }, session);
const t0 = Date.now();
const at = (s) => getOrderView(placed.id, t0 + s * 1000);

test("view: stages follow the order's age (0 s, 15 s, 45 s, 90 s)", () => {
  assert.deepEqual([0, 14, 15, 44, 45, 89, 90].map((s) => at(s).stage),
    ["placed", "placed", "preparing", "preparing", "on the way", "on the way", "delivered"]);
});
test("view: the courier waits at the kitchen, rides to the door, and is at the door when delivered", () => {
  const kitchen = { lat: KITCHEN.lat, lng: KITCHEN.lng };
  const door = deliveryPoint("Bole");
  assert.deepEqual(at(0).courier, kitchen);
  assert.deepEqual(at(30).courier, kitchen);
  const early = distanceM(at(50).courier, door), late = distanceM(at(80).courier, door);
  assert.ok(early > late && late > 0, "the courier gets closer while on the way");
  assert.deepEqual(at(95).courier, door);
});
test("view: ETA is 90 s after placing, the money is integer birr, and no phone or owner id leaks", () => {
  const v = at(0);
  assert.equal(v.etaAt - v.createdAt, 90_000);
  assert.equal(v.total, 320 * 2 + 120 + 40);
  assert.ok(Number.isInteger(v.total));
  assert.equal("phone" in v, false);
  assert.equal("userId" in v, false);
  assert.ok(JSON.parse(JSON.stringify(v)).etaAt === v.etaAt, "survives JSON: no Date objects in the view");
});
test("view: a cancelled order has no courier", () => {
  const other = createOrder({ name: "Dawit", phone: "0911000002", area: "CMC", items: [{ id: "ful", qty: 1 }] }, { id: "u2", name: "Dawit", role: "customer" });
  assert.equal(courierPoint({ stage: "cancelled", createdAt: t0, area: "CMC" }), null);
  assert.ok(other.id);
});
test("SSE framing: 'data: ' + one JSON line + two newlines", () => {
  const msg = `data: ${JSON.stringify(at(0))}\n\n`;
  assert.match(msg, /^data: \{.*\}\n\n$/);
  assert.equal(msg.slice(0, -2).includes("\n"), false);
});

console.log(`\n${passed} checks passed`);
