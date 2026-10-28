import { z } from "zod";
import { getDish } from "@/lib/dishes";

// ONE schema, used in three places: the checkout form (a courtesy check before
// sending), the POST /api/orders handler and the placeOrder action (the real check).
// Never import server-only code here - the checkout form bundles this file.

export const areas = ["Bole", "Kazanchis", "Piassa", "Sarbet", "CMC", "Megenagna"];

export const PHONE_MESSAGE = "Use 09… or +2519…";

export const orderSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(60, "Name is too long"),
  phone: z.string().trim().regex(/^(09\d{8}|\+2519\d{8})$/, PHONE_MESSAGE),
  area: z.string().refine((a) => areas.includes(a), "Choose a delivery area"),
  items: z
    .array(
      z.object({
        // Only the id and quantity are accepted. The price is looked up on the
        // server, so a hand-made request cannot set its own price.
        id: z.string().refine((id) => Boolean(getDish(id)), "Unknown dish"),
        qty: z.number().int().min(1, "Quantity must be at least 1").max(20, "At most 20 of one dish"),
      })
    )
    .min(1, "Your cart is empty"),
});

// Turns the checkout form's FormData into the object the schema expects.
export function readOrderForm(formData) {
  let items;
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    items = null; // fails validation with an invalid_type error
  }
  return {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    area: String(formData.get("area") ?? ""),
    items,
  };
}
