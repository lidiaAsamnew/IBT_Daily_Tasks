"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { orderSchema, readOrderForm } from "@/lib/schema";
import { createOrder, getOrder, markCancelled } from "@/lib/orders";
import { getSession, setSessionCookie, clearSessionCookie } from "@/lib/session";
import { findUserByPhone, verifyPassword } from "@/lib/users";
import { safeNext } from "@/lib/safe-next";

// LAYER 3 - every export here is a public HTTP endpoint. Anyone can call it with any argument,
// signed in or not, so each action re-checks the session (and ownership) itself.

export async function placeOrder(_prev, formData) {
  const user = await getSession();
  if (!user) return { error: "Sign in to place an order.", status: 401 };

  const input = readOrderForm(formData);
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: { name: input.name, phone: input.phone, area: input.area },
    };
  }

  try {
    const order = createOrder(parsed.data, user); // owner = the session, not the form
    revalidatePath("/orders");
    return { id: order.id, total: order.total, currency: order.currency };
  } catch (err) {
    console.error("placeOrder failed", err);
    return { error: "Something went wrong. Please try again.", values: { name: input.name, phone: input.phone, area: input.area } };
  }
}

// Authentication (who are you?) and authorisation (is it yours?) are separate checks.
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

// Steps 1-3 of the six: post credentials, check the hash, set the cookie.
export async function signIn(_prev, formData) {
  const phone = String(formData.get("phone") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next")); // open-redirect check: the line that stops attack 3

  const user = findUserByPhone(phone);
  const ok = verifyPassword(user, password); // hashes even when the phone is unknown
  if (!user || !ok) return { error: "Wrong phone number or password.", values: { phone } }; // same message for both

  await setSessionCookie(user.id);
  redirect(next); // redirect() throws, so it must stay outside any try/catch
}

// Step 6: clear the cookie. The client then refreshes.
export async function signOut() {
  await clearSessionCookie();
  return { ok: true };
}
