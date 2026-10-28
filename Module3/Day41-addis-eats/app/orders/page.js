import Link from "next/link";
import { listOrders } from "@/lib/orders";
import CancelButton from "./CancelButton";

// No cookies(), headers() or searchParams here, so this page is STATIC (cached).
// A new order only appears because placeOrder / POST /api/orders call
// revalidatePath("/orders"). Remove that call and the list goes stale.
export default function OrdersPage() {
  const orders = listOrders();

  return (
    <div className="wrap pt-12">
      <h1 className="text-4xl font-semibold">Orders</h1>
      <p className="mb-8 mt-2 text-muted">
        Everyone&apos;s recent orders (demo, first names only). You can cancel only the ones you placed while signed in - the server checks, not this page.
      </p>

      {orders.length === 0 ? (
        <section className="max-w-xl rounded-2xl border border-injera bg-white p-6">
          <h2 className="text-lg font-semibold">No orders yet</h2>
          <p className="mt-1 text-sm text-muted">Place one from the checkout and it will appear here.</p>
          <Link href="/menu" className="btn btn-green mt-4 text-sm">Browse the menu</Link>
        </section>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {orders.map((o) => (
            <li key={o.id} className="flex flex-col gap-3 rounded-2xl border border-injera bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-display text-lg font-semibold">{o.id}</span>
                <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${o.status === "placed" ? "bg-forest/10 text-forest" : "bg-berbere/10 text-berbere"}`}>
                  {o.status}
                </span>
              </div>
              <p className="text-sm text-muted">{o.customer} - {o.area}</p>
              <p className="flex-1">{o.items.map((i) => `${i.name} x ${i.qty}`).join(", ")}</p>
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-forest">{o.currency} {o.total}</span>
                <span className="flex items-center gap-3">
                  <Link href={`/orders/${o.id}`} className="text-sm font-semibold text-forest underline">Track</Link>
                  {o.status === "placed" && <CancelButton orderId={o.id} />}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
