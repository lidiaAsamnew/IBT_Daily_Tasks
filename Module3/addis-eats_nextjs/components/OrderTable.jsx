import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { etb, when } from "@/lib/format";

// Real table markup (Day 46): caption, scope, aria-sort — accessible, printable, and no JavaScript.
// Sorting lives in the URL, so it is linkable and survives a refresh.
const COLUMNS = [
  { key: "date", label: "Placed", defaultDir: "desc" },
  { key: "area", label: "Area", defaultDir: "asc" },
  { key: "total", label: "Total", defaultDir: "desc", numeric: true },
  { key: "status", label: "Status", defaultDir: "asc" },
];

const itemsText = (items) => items.map((i) => `${i.quantity}× ${i.name}`).join(", ");

export default function OrderTable({ orders, caption, sort, dir, basePath = "/orders", sortable = true, showCustomer = false }) {
  const hrefFor = (col) => {
    const nextDir = sort === col.key ? (dir === "asc" ? "desc" : "asc") : col.defaultDir;
    return `${basePath}?sort=${col.key}&dir=${nextDir}`; // changing the sort returns to page 1
  };
  const header = (col) => {
    const active = sort === col.key;
    return (
      <th key={col.key} scope="col" className={[col.numeric && "num", col.key === "area" && "hide-sm"].filter(Boolean).join(" ") || undefined} aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : sortable ? "none" : undefined}>
        {sortable ? (
          <Link href={hrefFor(col)} className="sort-link">
            {col.label}
            <span aria-hidden="true" className="sort-arrow">{active ? (dir === "asc" ? " ▲" : " ▼") : ""}</span>
          </Link>
        ) : (
          col.label
        )}
      </th>
    );
  };

  return (
    <div className="table-scroll" role="region" aria-label={`${caption} (scrolls sideways on small screens)`} tabIndex={0}>
      <table className="table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Order</th>
            {showCustomer && <th scope="col">Customer</th>}
            {header(COLUMNS[0])}
            <th scope="col" className="hide-sm">Items</th>
            {header(COLUMNS[1])}
            {header(COLUMNS[2])}
            {header(COLUMNS[3])}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <th scope="row"><Link href={`/orders/${o.id}`} className="text-link">{o.id}</Link></th>
              {showCustomer && <td>{o.customer}</td>}
              <td className="nowrap">{when(o.placedAt)}</td>
              <td className="items-cell hide-sm">{itemsText(o.items)}</td>
              <td className="hide-sm">{o.area}</td>
              <td className="num">{etb(o.total)}</td>
              <td><StatusBadge status={o.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
