import Link from "next/link";
import { redirect } from "next/navigation";
import { getOrdersFor } from "@/lib/orders";
import { getSession } from "@/lib/session";
import { parseTableParams, queryOrders } from "@/lib/order-query";
import { privateMetadata } from "@/lib/seo";
import EmptyState from "@/components/EmptyState";
import StateDemo from "@/components/StateDemo";
import OrderTable from "./OrderTable";
import Pager from "./Pager";

// Private: a clear tab title, noindex, and absent from the sitemap and disallowed in robots.js.
export const metadata = privateMetadata({ title: "Your orders", description: "Your Addis Eats orders: track a delivery or cancel an order that has not started cooking." });

const PAGE_SIZE = 5; // matches the five-row skeleton in loading.js, so nothing jumps when the data lands

// Private and per person, so it is rendered on every request (getSession reads cookies()).
// LAYER 2: middleware already sent signed-out visitors away; this check VERIFIES the session.
// The table state lives in the URL: /orders?sort=total&dir=desc&page=2 (see lib/order-query.js).
export default async function OrdersPage({ searchParams }) {
  const user = await getSession();
  if (!user) redirect("/signin?next=/orders");

  const sp = await searchParams;
  const demo = typeof sp.demo === "string" ? sp.demo : undefined;

  // Forced states for the demo (see StateDemo): slow -> loading.js, error -> error.js, empty -> the empty state.
  if (demo === "slow") await new Promise((resolve) => setTimeout(resolve, 3000));
  if (demo === "error") throw new Error("Demo: the orders query failed");

  // Scoped to the session id. There is no id from the URL or the request anywhere in this query.
  const orders = demo === "empty" ? [] : getOrdersFor(user.id);

  // Only one page of rows is handed to the table. (With a database this is skip/take, not a filter in memory.)
  const params = parseTableParams(sp);
  const data = queryOrders(orders, params, PAGE_SIZE);
  // Links keep the sort and any demo flag; paging links add ?page=, sorting links drop it.
  const keep = { sort: sp.sort ? params.sort : undefined, dir: sp.dir ? params.dir : undefined, demo };

  return (
    <div className="wrap pt-12">
      <h1 className="text-4xl font-semibold">Your orders</h1>
      <p className="mb-8 mt-2 text-muted">Signed in as {user.name}. Only your own orders appear here.</p>

      {data.total === 0 ? (
        // EMPTY: not "No data". Why it is empty, and what to do next.
        <EmptyState
          title="No orders yet"
          actions={<Link href="/menu" className="btn btn-green text-sm">Browse the menu</Link>}
        >
          You have not placed an order with this account. Pick something from the menu and your first order will appear here, where you can track it.
        </EmptyState>
      ) : (
        <>
          <OrderTable data={data} basePath="/orders" keep={keep} noun="Your orders" showActions />
          <Pager basePath="/orders" keep={keep} page={data.page} pages={data.pages} total={data.total} pageSize={PAGE_SIZE} />
        </>
      )}

      <StateDemo basePath="/orders" />
    </div>
  );
}
