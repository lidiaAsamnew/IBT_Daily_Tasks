import { getOrderView } from "@/lib/orders";
import { errorResponse } from "@/lib/http";

// GET /api/orders/ord_ab12cd -> 200 the order with its current stage, 404 if unknown.
// This is what the status screen polls every five seconds.
export async function GET(_request, { params }) {
  const { id } = await params; // Next.js 15+: params is a Promise
  const order = getOrderView(id);
  if (!order) return errorResponse("No such order", 404);

  // Polled data must never be served from a cache.
  return Response.json(order, { headers: { "Cache-Control": "no-store" } });
}
