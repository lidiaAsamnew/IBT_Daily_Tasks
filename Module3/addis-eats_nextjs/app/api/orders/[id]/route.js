import { getSession } from "@/lib/session";
import { cancelOrderFor, getOrderFor } from "@/lib/orders";
import { toPublicOrder } from "@/lib/order-status";
import { failFrom, json, serverError } from "@/lib/http";

export const dynamic = "force-dynamic";

// GET /api/orders/ord_… — polled every 5 seconds by the order page.
export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const result = await getOrderFor(await getSession(), id); // 401 / 404 / 403 decided in one place
    if (!result.ok) return failFrom(result);
    return json(toPublicOrder(result.order));
  } catch (error) {
    return serverError(error);
  }
}

// DELETE /api/orders/ord_… — cancel. The same function the cancelOrder server action calls.
export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const result = await cancelOrderFor(await getSession(), id);
    if (!result.ok) return failFrom(result);
    return json(toPublicOrder(result.order));
  } catch (error) {
    return serverError(error);
  }
}
