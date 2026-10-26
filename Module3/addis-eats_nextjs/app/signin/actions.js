"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/session";
import { createCustomer, verifyCredentials } from "@/lib/users";
import { signInSchema, signUpSchema, fieldErrorsOf } from "@/lib/schema";
import { safeNext } from "@/lib/safe-next";

const text = (formData, name) => String(formData.get(name) ?? "");

export async function signIn(_prev, formData) {
  const next = safeNext(text(formData, "next"));
  const values = { phone: text(formData, "phone") };

  const parsed = signInSchema.safeParse({ phone: values.phone, password: text(formData, "password") });
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error), values };

  const user = await verifyCredentials(parsed.data.phone, parsed.data.password);
  // One message for "no such account" and "wrong password": do not reveal which numbers have accounts.
  if (!user) return { error: "That phone number or password is not right.", values };

  await createSession(user);
  redirect(next); // outside any try/catch: redirect works by throwing
}

export async function signUp(_prev, formData) {
  const next = safeNext(text(formData, "next"));
  const values = { name: text(formData, "name"), phone: text(formData, "phone") };

  const parsed = signUpSchema.safeParse({ ...values, password: text(formData, "password") });
  if (!parsed.success) return { fieldErrors: fieldErrorsOf(parsed.error), values };

  const result = await createCustomer(parsed.data);
  if (!result.ok) {
    return { fieldErrors: { phone: ["An account with this phone number already exists. Try signing in."] }, values };
  }

  await createSession(result.user);
  redirect(next);
}

export async function signOut() {
  await destroySession();
  return { ok: true };
}
