"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { orderSchema, fieldErrorsOf } from "@/lib/schema";
import { cancelOrderFor, createOrder } from "@/lib/orders";

// Every server action is a public HTTP endpoint (Day 39). The checks below are the real security:
// who is asking (session), what they sent (schema), and whether the record is theirs (service layer).

const text = (formData, name) => String(formData.get(name) ?? "");

function parseItems(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function placeOrder(_prev, formData) {
  const session = await getSession();
  if (!session) {
    return { error: "Your session has ended. Please sign in again to place your order.", signInHref: "/signin?next=/checkout" };
  }

  const values = {
    name: text(formData, "name"),
    phone: text(formData, "phone"),
    area: text(formData, "area"),
    address: text(formData, "address"),
    notes: text(formData, "notes"),
  };

  const parsed = orderSchema.safeParse({
    ...values,
    items: parseItems(text(formData, "items")),
    idempotencyKey: text(formData, "idempotencyKey"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error), values };

  const result = await createOrder(session, parsed.data);
  if (!result.ok) return { error: result.error, fieldErrors: result.fieldErrors, values };

  revalidatePath("/orders");
  revalidatePath("/kitchen");
  revalidatePath("/dashboard");
  redirect(`/orders/${result.order.id}?placed=1`); // the receipt page clears the cart on arrival
}

export async function cancelOrder(_prev, formData) {
  const session = await getSession();
  if (!session) return { error: "Please sign in again." }; // 401
  const id = text(formData, "orderId");

  const result = await cancelOrderFor(session, id); // 404 / 403 / 409 are decided there, from the session — not from the form
  if (!result.ok) return { error: result.error };

  revalidatePath("/orders");
  revalidatePath(`/orders/${id}`);
  revalidatePath("/kitchen");
  revalidatePath("/dashboard");
  return { ok: true };
}
