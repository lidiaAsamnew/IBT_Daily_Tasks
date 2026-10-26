import { z } from "zod";
import {
  AREAS, PHONE_REGEX, PHONE_HINT, MAX_QUANTITY, MAX_LINES,
  NAME_MAX, ADDRESS_MAX, NOTES_MAX, PASSWORD_MIN, PASSWORD_MAX,
} from "./constants.js";

// The one set of rules, enforced on the server (Day 39: "the server has the final word").
// The forms mirror them with HTML attributes built from the same constants.

const phone = z.string().trim().regex(PHONE_REGEX, PHONE_HINT);

export const orderSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(NAME_MAX, `Use at most ${NAME_MAX} characters.`),
  phone,
  area: z.enum(AREAS, { message: "Please choose a delivery area." }),
  address: z.string().trim().min(3, "Please enter a delivery address.").max(ADDRESS_MAX, `Use at most ${ADDRESS_MAX} characters.`),
  notes: z.string().trim().max(NOTES_MAX, `Use at most ${NOTES_MAX} characters.`).default(""),
  items: z
    .array(
      z.object({
        id: z.coerce.number().int().positive(),
        quantity: z.coerce.number().int().min(1, "Quantity must be at least 1.").max(MAX_QUANTITY, `At most ${MAX_QUANTITY} of one dish.`),
      }),
    )
    .min(1, "Your cart is empty.")
    .max(MAX_LINES, "Too many different dishes in one order."),
  idempotencyKey: z.string().regex(/^[A-Za-z0-9_-]{8,64}$/, "Missing request key — reload the page and try again."),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(NAME_MAX),
  phone,
  password: z
    .string()
    .min(PASSWORD_MIN, `Use at least ${PASSWORD_MIN} characters.`)
    .max(PASSWORD_MAX, `Use at most ${PASSWORD_MAX} characters.`),
});

export const signInSchema = z.object({
  phone,
  password: z.string().min(1, "Enter your password.").max(PASSWORD_MAX),
});

/** zod error -> { field: [messages] } — the shape every endpoint returns in `fieldErrors`. */
export function fieldErrorsOf(error) {
  const out = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    (out[key] ??= []).push(issue.message);
  }
  return out;
}
