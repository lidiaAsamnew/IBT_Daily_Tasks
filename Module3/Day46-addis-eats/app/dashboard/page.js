import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { listAllOrders } from "@/lib/orders";
import { sampleOrders } from "@/lib/sample-orders";
import { inWindow, ordersPerDay, rangeLabel, revenueByArea } from "@/lib/stats";
import { parseTableParams, queryOrders } from "@/lib/order-query";
import { etb } from "@/lib/format";
import { privateMetadata } from "@/lib/seo";
import DataTable from "@/components/DataTable";
import EmptyState from "@/components/EmptyState";
import StateDemo from "@/components/StateDemo";
import OrderTable from "../orders/OrderTable";
import Pager from "../orders/Pager";
import RevenueChart from "./RevenueChart";
import OrdersChart from "./OrdersChart";

export const metadata = privateMetadata({ title: "Dashboard", description: "Addis Eats dashboard: revenue by neighbourhood, orders per day and every order. Staff only." });

const PAGE_SIZE = 10;

// Staff only, like /kitchen: it shows every customer's orders, so the role is checked HERE, on the server,
// before any order is read. (The nav link is cosmetic.)
//
// Shape it on the server, chart it on the client: this page reads the orders, aggregates them, and passes
// only the summaries to the two client chart components (6 + 14 rows). The table gets ONE page of orders.
export default async function DashboardPage({ searchParams }) {
  const user = await getSession();
  if (!user) redirect("/signin?next=/dashboard");

  if (user.role !== "staff") {
    return (
      <div className="wrap pt-16">
        <section role="alert" className="mx-auto max-w-lg rounded-2xl border border-berbere/30 bg-white p-8 text-center">
          <h1 className="text-3xl font-semibold text-berbere">Staff only</h1>
          <p className="mt-3 text-muted">Your account ({user.name}) is not allowed to open the dashboard.</p>
          <Link href="/" className="btn btn-green mt-6">Back to the home page</Link>
        </section>
      </div>
    );
  }

  const sp = await searchParams;
  const demo = typeof sp.demo === "string" ? sp.demo : undefined;
  const useSample = sp.data === "sample";

  // Forced states for the demo (see StateDemo): slow -> loading.js, error -> error.js, empty -> the empty state.
  if (demo === "slow") await new Promise((resolve) => setTimeout(resolve, 3000));
  if (demo === "error") throw new Error("Demo: the dashboard query failed");

  const now = Date.now();
  const source = demo === "empty" ? [] : useSample ? sampleOrders(now) : listAllOrders();
  const orders = inWindow(source, now); // one period for the charts AND the table
  const range = rangeLabel(now);

  const revenue = revenueByArea(orders);
  const perDay = ordersPerDay(orders, now);
  const params = parseTableParams(sp);
  const data = queryOrders(orders, params, PAGE_SIZE);
  const keep = { sort: sp.sort ? params.sort : undefined, dir: sp.dir ? params.dir : undefined, data: useSample ? "sample" : undefined, demo };

  return (
    <div className="wrap pt-12">
      <h1 className="text-4xl font-semibold">Dashboard</h1>
      <p className="mb-8 mt-2 text-muted">Revenue, orders and every order for {range}. Signed in as {user.name}.</p>

      {useSample && demo !== "empty" ? (
        <p role="note" className="mb-8 rounded-2xl border border-saffron/50 bg-saffron/10 px-5 py-3 text-sm">
          <strong>Showing sample data:</strong> {orders.length} made-up orders over the last 14 days, so the charts have something to show.
          Real orders are untouched. <Link href="/dashboard" className="font-semibold text-forest underline">Show real orders</Link>
        </p>
      ) : null}

      {orders.length === 0 ? (
        // EMPTY: explains why, and what to do next. No empty axes pretending to be a chart.
        <EmptyState
          title="No orders in this period yet"
          actions={
            <>
              <Link href="/dashboard?data=sample" className="btn btn-green text-sm">Preview with sample data</Link>
              <Link href="/menu" className="btn btn-ghost text-sm text-forest">Place an order</Link>
            </>
          }
        >
          Nothing has been ordered between {range}, so there is nothing to chart. Charts appear as soon as the first order is placed at checkout.
        </EmptyState>
      ) : (
        <div className="space-y-14">
          <section aria-labelledby="revenue-title">
            <h2 id="revenue-title" className="mb-3 text-2xl font-semibold">Revenue by neighbourhood, ETB, {range}</h2>
            <div className="rounded-2xl border border-injera bg-white p-4 sm:p-5">
              <RevenueChart data={revenue} />
            </div>
            <div className="mt-4">
              <DataTable
                caption="The same figures as the chart above. Cancelled orders are not counted."
                columns={[
                  { key: "area", label: "Neighbourhood" },
                  { key: "orders", label: "Orders", align: "right" },
                  { key: "revenue", label: "Revenue", align: "right", format: etb },
                ]}
                rows={revenue}
              />
            </div>
          </section>

          <section aria-labelledby="orders-title">
            <h2 id="orders-title" className="mb-3 text-2xl font-semibold">Orders per day, {range} (number of orders)</h2>
            <div className="rounded-2xl border border-injera bg-white p-4 sm:p-5">
              <OrdersChart data={perDay} />
            </div>
            <div className="mt-4">
              <DataTable
                caption="The same figures as the chart above. Days with no orders show 0."
                columns={[
                  { key: "day", label: "Day" },
                  { key: "orders", label: "Orders", align: "right" },
                ]}
                rows={perDay}
              />
            </div>
          </section>

          <section aria-labelledby="table-title">
            <h2 id="table-title" className="mb-3 text-2xl font-semibold">Orders, {range}</h2>
            <OrderTable data={data} basePath="/dashboard" keep={keep} noun="All orders" />
            <Pager basePath="/dashboard" keep={keep} page={data.page} pages={data.pages} total={data.total} pageSize={PAGE_SIZE} />
          </section>

          <p className="text-sm text-muted">
            Sent to the browser for this page: {revenue.length + perDay.length} chart rows and {data.rows.length} table rows, out of {orders.length} orders.
          </p>
        </div>
      )}

      <StateDemo basePath="/dashboard" extra={[{ label: "Sample data", params: { data: "sample" } }]} />
    </div>
  );
}
