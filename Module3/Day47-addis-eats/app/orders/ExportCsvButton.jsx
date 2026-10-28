"use client";

import { toCsv, download } from "@/lib/csv";
import { dayKeyOf } from "@/lib/format";

// Day 47: the file is built and handed over entirely in the browser (Blob + object URL), from rows the server
// already shaped. Fine for a person's own order history; past a few thousand rows it should stream from a route
// handler instead, because building a huge string freezes the tab.
export default function ExportCsvButton({ rows, label = "Export CSV" }) {
  function onClick() {
    download(toCsv(rows), `addis-eats-orders-${dayKeyOf(Date.now())}.csv`);
  }
  return (
    <button type="button" onClick={onClick} disabled={rows.length === 0} className="btn btn-ghost px-4 py-2 text-sm text-forest disabled:opacity-50">
      {label} <span className="ml-1 text-muted">({rows.length} {rows.length === 1 ? "row" : "rows"})</span>
    </button>
  );
}
