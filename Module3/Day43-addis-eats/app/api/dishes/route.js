import { dishes, searchDishes } from "@/lib/dishes";
import { errorResponse } from "@/lib/http";

// GET /api/dishes                      -> 200 the full menu, as in Day 39 (an array)
// GET /api/dishes?q=tib&page=2         -> 200 { q, page, pageSize, total, totalPages, items }
//                                         400 if page is not a positive whole number
// Reading request.url makes this handler dynamic (it depends on the request), so the
// Day 39 `revalidate = 3600` is gone - see STRATEGY.md.
export async function GET(request) {
  const params = new URL(request.url).searchParams;
  if (!params.has("q") && !params.has("page")) return Response.json(dishes);

  const page = Number(params.get("page") ?? "1");
  if (!Number.isInteger(page) || page < 1) {
    return errorResponse("page must be a positive whole number", 400);
  }
  const q = (params.get("q") ?? "").slice(0, 60);
  return Response.json(await searchDishes({ q, page }));
}
