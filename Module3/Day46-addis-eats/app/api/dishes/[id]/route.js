import { getDish } from "@/lib/dishes";
import { errorResponse } from "@/lib/http";

// GET /api/dishes/kitfo -> 200 with the dish, GET /api/dishes/pizza -> 404.
export async function GET(_request, { params }) {
  const { id } = await params; // Next.js 15+: params is a Promise
  const dish = getDish(id);

  if (!dish) return errorResponse("No such dish", 404);
  return Response.json(dish);
}
