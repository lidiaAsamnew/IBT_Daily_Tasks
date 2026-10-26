import test from "node:test";
import assert from "node:assert/strict";
import { etb, number, when, dayKey, relative } from "../lib/format.js";
import { toCsv } from "../lib/csv.js";

const norm = (s) => s.replace(/\u00a0/g, " ");

test("etb formats whole birr and never prints NaN", () => {
  assert.equal(norm(etb(240)), "ETB 240");
  assert.equal(norm(etb(14200)), "ETB 14,200");
  assert.equal(norm(etb("640")), "ETB 640");
  assert.equal(norm(etb("abc")), "ETB 0");
  assert.equal(norm(etb(undefined)), "ETB 0");
});

test("number groups thousands", () => assert.equal(number(48213), "48,213"));

test("when shows Addis Ababa time (UTC+3), not the server's zone", () => {
  // 15:40 UTC is 18:40 in Addis Ababa
  const s = norm(when("2026-07-14T15:40:00Z"));
  // The exact word order depends on the ICU data of the runtime; check the parts that matter.
  assert.match(s, /Jul/);
  assert.match(s, /14/);
  assert.match(s, /2026/);
  assert.match(s, /6:40/); // 18:40 in Addis Ababa, not 3:40 PM UTC
  assert.equal(when("not a date"), "—");
});

test("dayKey groups by Addis Ababa calendar day", () => {
  // 22:30 UTC on the 14th is 01:30 on the 15th in Addis Ababa
  assert.equal(dayKey("2026-07-14T22:30:00Z"), "2026-07-15");
  assert.equal(dayKey("2026-07-14T20:59:00Z"), "2026-07-14");
});

test("relative reads naturally", () => {
  const now = Date.parse("2026-07-14T12:00:00Z");
  assert.equal(relative("2026-07-14T11:48:00Z", now), "12 minutes ago");
  assert.equal(relative("2026-07-14T12:03:00Z", now), "in 3 minutes");
});

test("toCsv quotes commas, quotes and newlines", () => {
  const csv = toCsv([{ a: 'Bole, "Kitfo"', b: "line1\nline2", c: 5 }], [{ key: "a", label: "Place" }, { key: "b" }, { key: "c" }]);
  assert.equal(csv, 'Place,b,c\r\n"Bole, ""Kitfo""","line1\nline2",5');
});

test("toCsv exports headers for an empty list and neutralises formulas", () => {
  assert.equal(toCsv([], [{ key: "x", label: "X" }]), "X");
  assert.equal(toCsv([{ n: "=HYPERLINK(\"http://evil\")" }]).split("\r\n")[1].startsWith('"\'=HYPERLINK'), true);
  assert.equal(toCsv([{ n: -5 }]).split("\r\n")[1], "-5"); // real numbers are untouched
});
