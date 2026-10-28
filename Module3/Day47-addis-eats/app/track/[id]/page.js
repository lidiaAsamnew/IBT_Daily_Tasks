import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getOrder, getOrderView, canAccess } from "@/lib/orders";
import { getSession } from "@/lib/session";
import { privateMetadata } from "@/lib/seo";
import TrackingStatus from "./TrackingStatus";

// Private: a clear tab title, noindex, and absent from the sitemap and disallowed in robots.js.
export const metadata = privateMetadata({ title: "Track your order", description: "Follow your Addis Eats order from the kitchen to your door." });

// The order lives in server memory, its stage changes with time and it belongs to one person,
// so this page is rendered on every request and checks who is asking.
export const dynamic = "force-dynamic";

export default async function TrackPage({ params }) {
  const { id } = await params;
  const user = await getSession();
  if (!user) redirect(`/signin?next=${encodeURIComponent(`/track/${id}`)}`);

  const found = getOrder(id);
  // Someone else's order looks exactly like a missing one: the page leaks nothing about it.
  if (!found || !canAccess(found, user)) notFound();
  const order = getOrderView(id); // the server reads the data...

  return (
    <div className="wrap pb-12 pt-12">
      <Link href="/orders" className="text-sm font-semibold text-forest underline">All orders</Link>
      <h1 className="mt-4 text-4xl font-semibold">Order {order.id}</h1>
      <p className="mb-8 mt-2 text-muted">Follow your order. This page updates by itself.</p>
      {/* ...and hands it to the client as the first paint; the live stream takes over after hydration */}
      <TrackingStatus id={order.id} initial={order} />
    </div>
  );
}
