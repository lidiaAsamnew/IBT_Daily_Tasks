import "server-only";
import { scryptSync, timingSafeEqual } from "node:crypto";

// Demo accounts standing in for a users table (Module 4 replaces it). Only salted scrypt
// hashes are stored - never the passwords. Roles: "customer" or "staff" (kept coarse).
const users = [
  { id: "usr_almaz", name: "Almaz Tesfaye", phone: "0911000001", role: "customer", passwordHash: "a1b2c3d4e5f60718:ab486904efcace4492d7513eed16c001b7e139c653bc2e26cb6a3ad4a2018ddc" },
  { id: "usr_dawit", name: "Dawit Mekonnen", phone: "0911000002", role: "customer", passwordHash: "0f1e2d3c4b5a6978:3a8d8518de29060c92dfdb34203b728a92dc7d980bd3e66c615cd33f18aac73b" },
  { id: "usr_selam", name: "Selam Kebede", phone: "0911000003", role: "staff", passwordHash: "9a8b7c6d5e4f3021:ba84266ea34c3b9b0033762bc5f2e3f27f5c1460877f7a93fa783c781e0fab2b" },
];

const hash = (password, salt) => scryptSync(password, salt, 32);

// 09... and +2519... are the same number.
export function normalizePhone(raw) {
  const p = String(raw ?? "").replace(/[\s-]/g, "");
  return p.startsWith("+251") ? "0" + p.slice(4) : p;
}

export const findUserByPhone = (phone) => users.find((u) => u.phone === normalizePhone(phone)) ?? null;
export const getUserById = (id) => users.find((u) => u.id === id) ?? null;

// Takes the same time whether or not the phone number exists (it hashes against a dummy
// salt), so response time does not reveal which numbers are registered.
export function verifyPassword(user, password) {
  const [salt, stored] = (user?.passwordHash ?? "00:" + "0".repeat(64)).split(":");
  const given = hash(String(password).slice(0, 200), salt);
  const expected = Buffer.from(stored, "hex");
  return Boolean(user) && given.length === expected.length && timingSafeEqual(given, expected);
}
