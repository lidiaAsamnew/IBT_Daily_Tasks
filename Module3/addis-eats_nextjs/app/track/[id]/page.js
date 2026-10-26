import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import TrackingPanel from "./TrackingPanel";
import { requireUser } from "@/lib/guards";
import { getOrderFor } from "@/lib/orders";
import { toPublicOrder } from "@/lib/order-status";
import { trackingSnapshot, destinationFor, KITCHEN } from "@/lib/tracking";

export const metadata = { title: "Track your order", robots: { index: false, follow: false } };

export default async function TrackPage({ params }) {
  const { id } = await params;
  const session = await requireUser(`/track/${id}`);
  const result = await getOrderFor(session, id);
  if (!result.ok) {
    if (result.status === 401) redirect(`/signin?next=/track/${id}`);
    notFound();
  }
  const order = toPublicOrder(result.order);

  return (
    <div className="container section">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link href={`/orders/${order.id}`}>Order {order.id}</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">Track</span>
      </nav>
      <h1>Track your order</h1>
      {/* The first snapshot comes from the server, so the page is complete on arrival; the stream only updates it. */}
      <TrackingPanel
        order={order}
        initial={trackingSnapshot(result.order)}
        kitchen={{ position: KITCHEN.position, label: KITCHEN.label }}
        destination={{ position: destinationFor(order.area), label: `${order.area} — ${order.address}` }}
      />
    </div>
  );
}
