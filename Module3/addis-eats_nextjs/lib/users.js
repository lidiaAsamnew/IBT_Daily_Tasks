import { randomBytes, createHash, timingSafeEqual } from "node:crypto";
import { db } from "./db.js";
import { getEnv } from "./env.js";
import { hashPassword, verifyPassword } from "./password.js";
import { normalizePhone } from "./constants.js";

export const publicUser = (u) => ({ id: u.id, name: u.name, role: u.role });

const sha = (s) => createHash("sha256").update(String(s)).digest();
const staffConfig = () => getEnv().staff;
export const isStaffPhone = (phone) => staffConfig()?.phone === normalizePhone(phone);

export async function findUserById(id) {
  return db.get("users", String(id));
}

export async function findUserByPhone(phone) {
  const entry = await db.get("phones", normalizePhone(phone));
  return entry ? db.get("users", entry.userId) : null;
}

/** Customers only. The staff phone is reserved so nobody can sign up with it first. */
export async function createCustomer({ name, phone, password }) {
  const normalised = normalizePhone(phone);
  if (isStaffPhone(normalised)) return { ok: false, code: "phone_taken" };
  const id = `usr_${randomBytes(6).toString("hex")}`;
  const claimed = await db.setIfAbsent("phones", normalised, { userId: id }); // atomic: one account per phone
  if (!claimed) return { ok: false, code: "phone_taken" };
  const user = {
    id,
    name,
    phone: normalised,
    role: "customer",
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  await db.set("users", id, user);
  return { ok: true, user };
}

async function ensureStaffUser(staff) {
  const existing = await findUserByPhone(staff.phone);
  if (existing) return existing;
  const id = `usr_${randomBytes(6).toString("hex")}`;
  if (await db.setIfAbsent("phones", staff.phone, { userId: id })) {
    const user = {
      id,
      name: staff.name,
      phone: staff.phone,
      role: "staff",
      passwordHash: await hashPassword(staff.password),
      createdAt: new Date().toISOString(),
    };
    await db.set("users", id, user);
    return user;
  }
  return findUserByPhone(staff.phone);
}

let dummyHash;

/** Returns the user on success, otherwise null. Same work and same answer for "no such account" and
 *  "wrong password", so the response does not reveal which phone numbers have accounts. */
export async function verifyCredentials(phone, password) {
  const staff = staffConfig();
  const normalised = normalizePhone(phone);

  if (staff && staff.phone === normalised) {
    // The environment is the source of truth for the staff password (rotating it needs no migration).
    const ok = timingSafeEqual(sha(password), sha(staff.password));
    return ok ? ensureStaffUser(staff) : null;
  }

  const user = await findUserByPhone(normalised);
  dummyHash ??= await hashPassword("not-a-real-password");
  const ok = await verifyPassword(password, user?.passwordHash ?? dummyHash);
  return user && ok ? user : null;
}
