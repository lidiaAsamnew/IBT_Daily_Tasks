import { z } from "zod";
import { PHONE_REGEX, normalizePhone, PASSWORD_MIN } from "./constants.js";

// Validated once, the first time a server feature needs it (Day 43: "a clear error on the first
// line beats a mysterious undefined three screens later"). Deliberately lazy, not at import time,
// so that `next build` does not need secrets just to compile.

const DEV_SECRET = "dev-only-secret-never-use-this-in-production-0123456789";

const schema = z.object({
  SESSION_SECRET: z.string().min(32, "must be at least 32 characters"),
  STAFF_PHONE: z.string().transform(normalizePhone).pipe(z.string().regex(PHONE_REGEX, "must look like 09xxxxxxxx")).optional(),
  STAFF_NAME: z.string().trim().min(1).max(80).optional(),
  STAFF_PASSWORD: z.string().min(PASSWORD_MIN, `must be at least ${PASSWORD_MIN} characters`).optional(),
});

let cached;

export function getEnv() {
  if (cached) return cached;
  const result = schema.safeParse({
    SESSION_SECRET: process.env.SESSION_SECRET || (process.env.NODE_ENV === "production" ? undefined : DEV_SECRET),
    STAFF_PHONE: process.env.STAFF_PHONE || undefined,
    STAFF_NAME: process.env.STAFF_NAME || undefined,
    STAFF_PASSWORD: process.env.STAFF_PASSWORD || undefined,
  });
  if (!result.success) {
    const detail = result.error.issues.map((i) => `${i.path.join(".") || "env"} ${i.message}`).join("; ");
    throw new Error(`Invalid environment: ${detail}. See .env.example.`);
  }
  const env = result.data;
  const staff =
    env.STAFF_PHONE && env.STAFF_PASSWORD
      ? { phone: env.STAFF_PHONE, name: env.STAFF_NAME ?? "Kitchen Staff", password: env.STAFF_PASSWORD }
      : null;
  cached = { sessionSecret: env.SESSION_SECRET, staff };
  return cached;
}

/** Test helper — forget the cached value after changing process.env. */
export function resetEnvForTests() {
  cached = undefined;
}
