import { dishes } from "@/lib/dishes";

// GET /api/dishes - the full menu as JSON.
// Same one-hour window as the menu page (see STRATEGY.md).
export const revalidate = 3600;

export async function GET() {
  return Response.json(dishes);
}
