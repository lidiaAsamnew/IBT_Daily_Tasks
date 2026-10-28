// A small read-only table for chart data: the same numbers as the chart, for anyone who cannot see
// the SVG (and for anyone who wants to copy a value). Real markup, so it needs no JavaScript.
// columns: [{ key, label, align?: "right", format?: (value) => string }]
export default function DataTable({ caption, columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-injera bg-white">
      <table className="w-full text-left text-sm">
        <caption className="px-4 pb-2 pt-3 text-left text-sm font-medium text-muted">{caption}</caption>
        <thead className="border-y border-injera bg-injera/40">
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={`px-4 py-2 font-semibold ${c.align === "right" ? "text-right" : ""}`}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-injera">
          {rows.map((r, i) => (
            <tr key={i}>
              {columns.map((c, ci) =>
                ci === 0 ? (
                  <th key={c.key} scope="row" className="px-4 py-2 font-medium">{r[c.key]}</th>
                ) : (
                  <td key={c.key} className={`px-4 py-2 ${c.align === "right" ? "text-right tabular-nums" : ""}`}>
                    {c.format ? c.format(r[c.key]) : r[c.key]}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
