import { getCategories, getDishes } from "@/lib/dishes";
import { queryDishes } from "@/lib/dish-query";
import { fail, json, serverError } from "@/lib/http";

// GET /api/dishes?q=tibs&category=Main&page=2
// Always answers { dishes, total, page, pages } — one shape, whether filtered or not.
// Reading request.url makes this dynamic (Day 39); the result is cheap, so that is fine.
export async function GET(request) {
  try {
    const sp = new URL(request.url).searchParams; // query strings are strings: parse and check them (Day 39)
    const fieldErrors = {};

    const q = (sp.get("q") ?? "").trim();
    if (q.length > 60) fieldErrors.q = ["Use at most 60 characters."];

    const category = sp.get("category") ?? "";
    if (category && !(await getCategories()).includes(category)) fieldErrors.category = ["Unknown category."];

    const rawPage = sp.get("page");
    const page = rawPage === null ? 1 : Number(rawPage);
    if (!Number.isInteger(page) || page < 1) fieldErrors.page = ["Page must be a whole number from 1."];

    if (Object.keys(fieldErrors).length) return fail(422, "Validation failed", { fieldErrors });

    return json(queryDishes(await getDishes(), { q, category, page }), 200, { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" });
  } catch (error) {
    return serverError(error);
  }
}
