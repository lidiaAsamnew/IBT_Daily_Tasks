import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import OrderStatus from "./OrderStatus";
import ClearCartOnPlaced from "./ClearCartOnPlaced";
import { requireUser } from "@/lib/guards";
import { getOrderFor } from "@/lib/orders";
import { toPublicOrder } from "@/lib/order-status";
import { first } from "@/lib/params";
import { etb, when } from "@/lib/format";

export const metadata = { title: "Order details", robots: { index: false, follow: false } };

export default async function OrderPage({ params, searchParams }) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const session = await requireUser(`/orders/${id}`);

  const result = await getOrderFor(session, id); // 404 if missing, 403 if it is someone else's
  if (!result.ok) {
    if (result.status === 401) redirect(`/signin?next=/orders/${id}`);
    notFound(); // someone else's order looks exactly like a missing one — we do not confirm it exists
  }
  const order = toPublicOrder(result.order);

  return (
    <div className="container narrow section">
      {first(sp.placed) === "1" && (
        <>
          <ClearCartOnPlaced />
          <p className="banner banner--success" role="status">
            Thank you — your order has been placed. We will start preparing it right away.
          </p>
        </>
      )}

      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link href="/orders">Your orders</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{order.id}</span>
      </nav>
      <h1>Order {order.id}</h1>
      <p className="muted">Placed {when(order.placedAt)}</p>

      <OrderStatus id={order.id} initial={order} />

      <section className="card" aria-labelledby="receipt-title">
        <h2 id="receipt-title">Receipt</h2>
        <ul className="summary-lines">
          {order.items.map((i) => (
            <li key={i.id}>
              <span>{i.quantity} × {i.name}</span>
              <span>{etb(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="order-total"><span>Total</span><strong>{etb(order.total)}</strong></p>
        <dl className="details">
          <div><dt>Name</dt><dd>{order.name}</dd></div>
          <div><dt>Phone</dt><dd>{order.phone}</dd></div>
          <div><dt>Area</dt><dd>{order.area}</dd></div>
          <div><dt>Address</dt><dd>{order.address}</dd></div>
          {order.notes && <div><dt>Notes</dt><dd>{order.notes}</dd></div>}
        </dl>
      </section>
    </div>
  );
}
