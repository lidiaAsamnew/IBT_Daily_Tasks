import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderView } from "@/lib/orders";
import OrderStatus from "../OrderStatus";

// The order lives in server memory and its stage changes with time, so this page is
// rendered on every request. (Day 42: this is where "whose order is it?" gets checked.)
export const dynamic = "force-dynamic";

export default async function OrderPage({ params }) {
  const { id } = await params;
  const order = getOrderView(id); // the server reads the data...
  if (!order) notFound();

  return (
    <div className="wrap pt-12">
      <Link href="/orders" className="text-sm font-semibold text-forest underline">All orders</Link>
      <h1 className="mt-4 text-4xl font-semibold">Order {order.id}</h1>
      <p className="mb-8 mt-2 text-muted">Follow your order. This page updates by itself.</p>
      {/* ...and hands it to the client as the first paint; polling takes over after hydration */}
      <OrderStatus id={order.id} initial={order} />
    </div>
  );
}
