"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { orderSchema, readOrderForm } from "@/lib/schema";
import { createOrder, getOrder, markCancelled } from "@/lib/orders";
import { getSession, makeSessionValue, SESSION_COOKIE } from "@/lib/session";

// Every export here is a public HTTP endpoint. Anyone can call it with any
// argument, so each action checks the session and its input itself.

// Used with useActionState, so the first argument is the previous state.
export async function placeOrder(_prev, formData) {
  const input = readOrderForm(formData);
  const parsed = orderSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: { name: input.name, phone: input.phone, area: input.area }, // refill the form
    };
  }

  try {
    const order = createOrder(parsed.data, await getSession());
    revalidatePath("/orders"); // only after a successful write
    return { id: order.id, total: order.total, currency: order.currency };
  } catch (err) {
    console.error("placeOrder failed", err);
    return { error: "Something went wrong. Please try again.", values: { name: input.name, phone: input.phone, area: input.area } };
  }
}

// Session AND ownership are checked here, not in the component that shows the button.
export async function cancelOrder(orderId) {
  const user = await getSession();
  if (!user) return { error: "Sign in to cancel an order.", status: 401 };

  if (typeof orderId !== "string") return { error: "Invalid order id.", status: 400 };
  const order = getOrder(orderId);
  if (!order) return { error: "No such order.", status: 404 };
  if (order.userId !== user.id) return { error: "That order is not yours.", status: 403 };
  if (order.status !== "placed") return { error: "That order is already cancelled.", status: 409 };

  markCancelled(orderId);
  revalidatePath("/orders");
  return { ok: true };
}

// Demo sign-in (stands in for real auth): sets a signed, httpOnly cookie.
export async function signIn(formData) {
  const name = String(formData.get("name") ?? "").trim().slice(0, 30);
  if (name.length < 2) return;
  (await cookies()).set(SESSION_COOKIE, makeSessionValue(name), {
    httpOnly: true, // not readable from browser JavaScript
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    // Add `secure: true` when deploying behind HTTPS.
  });
  revalidatePath("/checkout");
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  revalidatePath("/checkout");
}
