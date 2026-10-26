// CSV export (Day 47). The escaping is the whole problem: quote anything containing a comma,
// quote or newline, and double the quotes inside.

/** Stop spreadsheet formula injection: a text cell that starts with = + - @ is prefixed with '. */
function neutralise(s, raw) {
  if (typeof raw === "number") return s;
  return /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
}

function cell(raw) {
  const s = neutralise(String(raw ?? ""), raw);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * @param {Array<object>} rows
 * @param {Array<{key: string, label?: string}>} [columns] explicit columns (needed to export an empty list)
 */
export function toCsv(rows, columns) {
  const cols = columns ?? (rows[0] ? Object.keys(rows[0]).map((key) => ({ key })) : []);
  const header = cols.map((c) => cell(c.label ?? c.key)).join(",");
  const body = rows.map((row) => cols.map((c) => cell(row[c.key])).join(","));
  return [header, ...body].join("\r\n");
}

/** Browser only: hand the text over as a file. A BOM makes Excel read UTF-8 correctly. */
export function download(text, filename) {
  const blob = new Blob(["\uFEFF", text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
