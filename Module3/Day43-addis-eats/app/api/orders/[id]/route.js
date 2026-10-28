import { getOrder, getOrderView, canAccess } from "@/lib/orders";
import { getSession } from "@/lib/session";
import { errorResponse } from "@/lib/http";

// GET /api/orders/ord_ab12cd -> 200 the order, 401 not signed in, 403 not yours, 404 unknown.
// This is what the status screen polls every five seconds (the browser sends the cookie).
export async function GET(_request, { params }) {
  const user = await getSession();
  if (!user) return errorResponse("Sign in required", 401);

  const { id } = await params;
  const order = getOrder(id);
  if (!order) return errorResponse("No such order", 404);
  if (!canAccess(order, user)) return errorResponse("That order is not yours", 403);

  return Response.json(getOrderView(id), { headers: { "Cache-Control": "no-store" } });
}
