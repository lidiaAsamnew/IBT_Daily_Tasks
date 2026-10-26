import Link from "next/link";
import OrderTable from "@/components/OrderTable";
import RevenueChart from "./RevenueChart";
import OrdersChart from "./OrdersChart";
import { requireStaff } from "@/lib/guards";
import { listAllOrders } from "@/lib/orders";
import { ordersPerDay, revenueByArea, summarise } from "@/lib/stats";
import { first } from "@/lib/params";
import { etb, number } from "@/lib/format";

export const metadata = { title: "Dashboard", robots: { index: false, follow: false } };

export default async function DashboardPage({ searchParams }) {
  const sp = await searchParams;
  await requireStaff("/dashboard");

  // Development-only switches so each state (Day 46) can be seen on demand: ?force=error | ?force=slow
  if (process.env.NODE_ENV !== "production") {
    if (first(sp.force) === "error") throw new Error("Forced dashboard error (development only).");
    if (first(sp.force) === "slow") await new Promise((r) => setTimeout(r, 2500));
  }

  const orders = await listAllOrders();
  if (orders.length === 0) {
    return (
      <div className="container section">
        <h1>Dashboard</h1>
        <div className="state-box">
          <h2>No orders yet</h2>
          <p className="muted">Charts appear here as soon as the first order is placed.</p>
          <Link href="/menu" className="btn btn-primary">Place a test order</Link>
        </div>
      </div>
    );
  }

  // Aggregate BEFORE it crosses to the browser: a few summarised rows, not every order (Day 46).
  const summary = summarise(orders);
  const byArea = revenueByArea(orders);
  const perDay = ordersPerDay(orders, 14);

  return (
    <div className="container section">
      <h1>Dashboard</h1>
      <p className="lede">Orders and revenue, in Addis Ababa time. Cancelled orders are not counted as revenue.</p>

      <div className="kpi-grid">
        <div className="kpi"><p className="kpi-label">Orders</p><p className="kpi-value">{number(summary.orders)}</p></div>
        <div className="kpi"><p className="kpi-label">Revenue</p><p className="kpi-value">{etb(summary.revenue)}</p></div>
        <div className="kpi"><p className="kpi-label">Average order</p><p className="kpi-value">{etb(summary.average)}</p></div>
        <div className="kpi"><p className="kpi-label">In progress</p><p className="kpi-value">{number(summary.active)}</p></div>
      </div>

      <section className="card chart-card" aria-labelledby="rev-title">
        <h2 id="rev-title">Revenue by delivery area (ETB)</h2>
        <div role="img" aria-label={`Bar chart of revenue by area. ${byArea.map((r) => `${r.area}: ${etb(r.revenue)}`).join(". ")}.`}>
          <RevenueChart data={byArea} />
        </div>
        {/* Screen readers cannot read an SVG: the same numbers as a table (Day 46). */}
        <table className="table table--compact">
          <caption className="sr-only">Revenue and orders by delivery area</caption>
          <thead><tr><th scope="col">Area</th><th scope="col" className="num">Orders</th><th scope="col" className="num">Revenue</th></tr></thead>
          <tbody>
            {byArea.map((r) => (
              <tr key={r.area}><th scope="row">{r.area}</th><td className="num">{r.orders}</td><td className="num">{etb(r.revenue)}</td></tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card chart-card" aria-labelledby="day-title">
        <h2 id="day-title">Orders per day, last 14 days</h2>
        <div role="img" aria-label="Line chart of orders per day for the last 14 days. The same numbers are in the table below.">
          <OrdersChart data={perDay} />
        </div>
        <details className="data-details">
          <summary>Show the numbers as a table</summary>
          <table className="table table--compact">
            <caption className="sr-only">Orders and revenue per day</caption>
            <thead><tr><th scope="col">Day</th><th scope="col" className="num">Orders</th><th scope="col" className="num">Revenue</th></tr></thead>
            <tbody>
              {perDay.map((d) => (
                <tr key={d.key}><th scope="row">{d.day}</th><td className="num">{d.orders}</td><td className="num">{etb(d.revenue)}</td></tr>
              ))}
            </tbody>
          </table>
        </details>
      </section>

      <section aria-labelledby="recent-title">
        <h2 id="recent-title">Latest orders</h2>
        <OrderTable orders={orders.slice(0, 10)} caption="The ten most recent orders" sortable={false} showCustomer />
      </section>
    </div>
  );
}
