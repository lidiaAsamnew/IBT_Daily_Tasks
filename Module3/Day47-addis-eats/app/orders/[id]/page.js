import { redirect } from "next/navigation";

// Day 47: the tracking page moved to /track/[id] (it now has a map and a live stream). The old address keeps working,
// so bookmarks and earlier links still land on the right page. /track/[id] does the sign-in and ownership checks.
export default async function OrderRedirect({ params }) {
  const { id } = await params;
  redirect(`/track/${encodeURIComponent(id)}`);
}
