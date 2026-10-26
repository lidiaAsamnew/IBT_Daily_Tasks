import { getDish } from "@/lib/dishes";
import { fail, json, serverError } from "@/lib/http";

export async function GET(_request, { params }) {
  try {
    const { id } = await params; // a path parameter is user input too
    const dish = await getDish(id);
    if (!dish) return fail(404, "No such dish");
    return json(dish, 200, { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" });
  } catch (error) {
    return serverError(error);
  }
}
