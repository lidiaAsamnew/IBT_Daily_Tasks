import { getSession } from "@/lib/session";

// Lets the header ask "who is signed in?" without making every page dynamic.
// Never includes the id; the cookie itself stays httpOnly.
export async function GET() {
  const user = await getSession();
  return Response.json(
    { user: user ? { name: user.name, role: user.role } : null },
    { headers: { "Cache-Control": "no-store" } }
  );
}
