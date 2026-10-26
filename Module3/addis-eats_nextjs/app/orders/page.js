import Link from "next/link";
import OrderTable from "@/components/OrderTable";
import Pager from "@/components/Pager";
import ExportCsvButton from "./ExportCsvButton";
import { requireUser } from "@/lib/guards";
import { getOrdersFor } from "@/lib/orders";
import { first, positiveInt } from "@/lib/params";

export const metadata = { title: "Your orders", robots: { index: false, follow: false } };

// Sorted and paged on the SERVER from the URL (Day 46): /orders?sort=total&dir=desc&page=2
export default async function OrdersPage({ searchParams }) {
  const sp = await searchParams;
  const session = await requireUser("/orders");

  // Scoped by the session's own id — there is no way to ask for someone else's list (Day 42).
  const { rows, total, page, pages, sort, dir } = await getOrdersFor(session.id, {
    sort: first(sp.sort),
    dir: first(sp.dir),
    page: positiveInt(sp.page),
  });
  const everything = total > rows.length ? (await getOrdersFor(session.id, { sort, dir, pageSize: 1000 })).rows : rows;

  return (
    <div className="container section">
      <div className="section-head">
        <h1>Your orders</h1>
        {total > 0 && <ExportCsvButton orders={everything} />}
      </div>

      {total === 0 ? (
        // An empty state says why it is empty and what to do next (Day 46) — it is not an error.
        <div className="state-box">
          <h2>No orders yet</h2>
          <p className="muted">When you place your first order it will appear here, and you can follow it live.</p>
          <Link href="/menu" className="btn btn-primary">Browse the menu to place your first</Link>
        </div>
      ) : (
        <>
          <OrderTable orders={rows} caption="Your orders" sort={sort} dir={dir} />
          <Pager page={page} pages={pages} hrefFor={(n) => `/orders?sort=${sort}&dir=${dir}&page=${n}`} label="Order pages" />
        </>
      )}
    </div>
  );
}
