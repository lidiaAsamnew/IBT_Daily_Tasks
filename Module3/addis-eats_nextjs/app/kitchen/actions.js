"use server";

import { revalidatePath } from "next/cache";
import { getStaffSession } from "@/lib/session";
import { advanceOrderFor } from "@/lib/orders";

export async function advanceOrder(_prev, formData) {
  const staff = await getStaffSession(); // the role check is re-done HERE, where the write happens (Day 42)
  if (!staff) return { error: "Staff only." };
  const result = await advanceOrderFor(staff, String(formData.get("orderId") ?? ""));
  if (!result.ok) return { error: result.error };
  revalidatePath("/kitchen");
  revalidatePath("/dashboard");
  return { ok: true };
}
