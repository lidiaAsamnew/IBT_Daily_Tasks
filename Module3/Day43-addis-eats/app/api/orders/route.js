import { revalidatePath } from "next/cache";
import { orderSchema } from "@/lib/schema";
import { createOrder } from "@/lib/orders";
import { getSession } from "@/lib/session";
import { errorResponse } from "@/lib/http";

// POST /api/orders - the server has the final word, whatever the form checked.
//   201 created | 400 body is not JSON | 401 not signed in | 422 values failed validation | 500 our fault
export async function POST(request) {
  const user = await getSession(); // same helper as pages and actions
  if (!user) return errorResponse("Sign in required", 401);

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Request body must be valid JSON", 400);
  }

  const result = orderSchema.safeParse(body);
  if (!result.success) {
    return errorResponse("Validation failed", 422, result.error.flatten().fieldErrors);
  }

  try {
    const order = createOrder(result.data, user);
    revalidatePath("/orders");
    return Response.json(order, { status: 201 });
  } catch (err) {
    console.error("POST /api/orders failed", err);
    return errorResponse("Something went wrong", 500);
  }
}
