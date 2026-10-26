import { getSession } from "@/lib/session";
import { orderSchema, fieldErrorsOf } from "@/lib/schema";
import { createOrder, getOrdersFor } from "@/lib/orders";
import { toPublicOrder } from "@/lib/order-status";
import { fail, failFrom, json, serverError } from "@/lib/http";

export const dynamic = "force-dynamic";

// GET /api/orders — the signed-in person's own orders (scoped by the session, never by a query parameter).
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return fail(401, "Not signed in");
    const { rows } = await getOrdersFor(session.id, { pageSize: 100 });
    return json({ orders: rows });
  } catch (error) {
    return serverError(error);
  }
}

// POST /api/orders — for callers that are not our own pages. Our checkout uses the placeOrder server action,
// which shares every rule below through lib/orders.js and lib/schema.js.
export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) return fail(401, "Not signed in"); // 401: signing in would fix it

    let body;
    try {
      body = await request.json();
    } catch {
      return fail(400, "The request body must be valid JSON."); // 400: the request itself is malformed
    }

    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) return fail(422, "Validation failed", { fieldErrors: fieldErrorsOf(parsed.error) }); // 422: well-formed, wrong values

    const result = await createOrder(session, parsed.data);
    if (!result.ok) return failFrom(result);
    return json(toPublicOrder(result.order), result.replay ? 200 : 201); // 201 Created; 200 for an idempotent replay
  } catch (error) {
    return serverError(error);
  }
}
