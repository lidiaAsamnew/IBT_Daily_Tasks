import { getSession } from "@/lib/session";
import { json, serverError } from "@/lib/http";

// Who is asking? Used by the header. Reads cookies, so it is dynamic and never cached.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    return json({ user: session ? { id: session.id, name: session.name, role: session.role } : null });
  } catch (error) {
    return serverError(error);
  }
}
