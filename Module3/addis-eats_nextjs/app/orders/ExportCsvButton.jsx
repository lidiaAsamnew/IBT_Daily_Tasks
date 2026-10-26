"use client";

import { toCsv, download } from "@/lib/csv";
import { when } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/order-status";

const COLUMNS = [
  { key: "id", label: "Order" },
  { key: "placed", label: "Placed (Addis Ababa time)" },
  { key: "items", label: "Items" },
  { key: "area", label: "Area" },
  { key: "address", label: "Address" },
  { key: "total", label: "Total (ETB)" },
  { key: "status", label: "Status" },
];

// Built entirely in the browser from rows already on the page (Day 47) — no server round trip.
export default function ExportCsvButton({ orders }) {
  function handleClick() {
    const rows = orders.map((o) => ({
      id: o.id,
      placed: when(o.placedAt),
      items: o.items.map((i) => `${i.quantity} x ${i.name}`).join("; "),
      area: o.area,
      address: o.address,
      total: o.total,
      status: STATUS_LABEL[o.status] ?? o.status,
    }));
    download(toCsv(rows, COLUMNS), "addis-eats-orders.csv");
  }
  return (
    <button type="button" className="btn btn-ghost" onClick={handleClick}>
      Download CSV
    </button>
  );
}
