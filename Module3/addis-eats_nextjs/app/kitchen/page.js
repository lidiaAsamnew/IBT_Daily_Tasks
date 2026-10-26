import AdvanceButton from "./AdvanceButton";
import StatusBadge from "@/components/StatusBadge";
import { requireStaff } from "@/lib/guards";
import { listAllOrders } from "@/lib/orders";
import { STATUS_LABEL, isTerminal, nextStatus } from "@/lib/order-status";
import { etb, when } from "@/lib/format";

export const metadata = { title: "Kitchen", robots: { index: false, follow: false } };

export default async function KitchenPage() {
  await requireStaff("/kitchen"); // staff only, checked on the server
  const orders = await listAllOrders();
  const active = orders.filter((o) => !isTerminal(o.status)).reverse(); // oldest first: cook in the order received
  const recent = orders.filter((o) => isTerminal(o.status)).slice(0, 5);

  return (
    <div className="container section">
      <h1>Kitchen</h1>
      <p className="lede">Orders waiting to be prepared and delivered. Without staff input orders progress on a timer; advancing one here overrides it.</p>

      <h2>Active orders ({active.length})</h2>
      {active.length === 0 ? (
        <div className="state-box"><h3>Nothing to cook right now</h3><p className="muted">New orders appear here as soon as they are placed.</p></div>
      ) : (
        <ul className="kitchen-list">
          {active.map((o) => {
            const next = nextStatus(o.status);
            return (
              <li key={o.id} className="card kitchen-card">
                <div className="kitchen-head">
                  <div>
                    <h3>{o.id}</h3>
                    <p className="muted">{when(o.placedAt)} · {o.customer} · {o.phone}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <p>{o.items.map((i) => `${i.quantity} × ${i.name}`).join(", ")}</p>
                <p className="muted">{o.area} — {o.address}{o.notes ? ` · Note: ${o.notes}` : ""} · {etb(o.total)}</p>
                {next && <AdvanceButton id={o.id} label={`Mark as ${STATUS_LABEL[next].toLowerCase()}`} />}
              </li>
            );
          })}
        </ul>
      )}

      {recent.length > 0 && (
        <>
          <h2>Recently finished</h2>
          <ul className="recent-list">
            {recent.map((o) => (
              <li key={o.id}><span>{o.id} · {o.customer}</span><StatusBadge status={o.status} /></li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
