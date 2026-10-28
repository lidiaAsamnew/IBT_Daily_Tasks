import Link from "next/link";
import { SORTS, hrefFor } from "@/lib/order-query";
import { etb, when } from "@/lib/format";
import CancelButton from "./CancelButton";

// Real table markup - table, caption, thead, th scope - so a screen reader announces "Total, column 5",
// the browser can copy it into a spreadsheet and it prints. A server component: no JavaScript shipped
// for the table itself. Sorting is a link to ?sort=...&dir=..., so it is shareable and survives a refresh.
//
// `data` is one page from queryOrders(). `keep` = the other query parameters to carry along.
// `showActions` adds Track / Cancel (the customer's own /orders page); the staff dashboard is read-only.
const SORT_ORDER_TEXT = { asc: "ascending", desc: "descending" };

function SortHeader({ column, data, basePath, keep, align }) {
  const active = data.sort === column;
  const nextDir = active ? (data.dir === "asc" ? "desc" : "asc") : SORTS[column].defaultDir;
  const href = hrefFor(basePath, keep, { sort: column, dir: nextDir, page: undefined }); // changing the sort restarts at page 1
  return (
    <th scope="col" aria-sort={active ? SORT_ORDER_TEXT[data.dir] : undefined} className={`px-4 py-3 font-semibold ${align === "right" ? "text-right" : ""}`}>
      <Link href={href} className="inline-flex items-center gap-1 rounded hover:underline">
        {SORTS[column].label}
        <span aria-hidden="true" className={active ? "text-forest" : "text-muted/50"}>{active ? (data.dir === "asc" ? "\u25B2" : "\u25BC") : "\u21C5"}</span>
        <span className="sr-only">{active ? `, sorted ${SORT_ORDER_TEXT[data.dir]}. Activate to reverse.` : ", activate to sort"}</span>
      </Link>
    </th>
  );
}

export default function OrderTable({ data, basePath, keep, noun = "Orders", showActions = false }) {
  const sortedBy = `${SORTS[data.sort].label.toLowerCase()}, ${SORT_ORDER_TEXT[data.dir]}`;
  const caption = `${noun}, sorted by ${sortedBy}. Page ${data.page} of ${data.pages}, ${data.total} in total.`;

  return (
    <div
      role="region"
      aria-label={`${noun} table. Scrolls sideways on narrow screens.`}
      tabIndex={0}
      className="overflow-x-auto rounded-2xl border border-injera bg-white"
    >
      <table className="w-full min-w-[40rem] text-left text-sm">
        <caption className="px-4 pb-2 pt-3 text-left text-sm font-medium text-muted">{caption}</caption>
        <thead className="border-y border-injera bg-injera/40">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">Order</th>
            <SortHeader column="date" data={data} basePath={basePath} keep={keep} />
            <SortHeader column="area" data={data} basePath={basePath} keep={keep} />
            <SortHeader column="stage" data={data} basePath={basePath} keep={keep} />
            <SortHeader column="total" data={data} basePath={basePath} keep={keep} align="right" />
            {showActions ? <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-injera">
          {data.rows.map((o) => (
            <tr key={o.id} className="align-top">
              <th scope="row" className="px-4 py-3 font-normal">
                <span className="font-display text-base font-semibold">{o.id}</span>
                <span className="mt-0.5 block max-w-xs text-xs text-muted">{o.items.map((i) => `${i.name} x ${i.qty}`).join(", ")}</span>
              </th>
              <td className="whitespace-nowrap px-4 py-3">{when(o.createdAt)}</td>
              <td className="px-4 py-3">{o.area}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${o.stage === "cancelled" ? "bg-berbere/10 text-berbere" : "bg-forest/10 text-forest"}`}>{o.stage}</span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums">{etb(o.total)}</td>
              {showActions ? (
                <td className="px-4 py-3">
                  <span className="flex flex-wrap items-start justify-end gap-3">
                    <Link href={`/track/${o.id}`} className="py-1.5 text-sm font-semibold text-forest underline">Track<span className="sr-only"> order {o.id}</span></Link>
                    {o.status === "placed" ? <CancelButton orderId={o.id} /> : null}
                  </span>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
