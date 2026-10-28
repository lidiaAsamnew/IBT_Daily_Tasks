// Day 47: CSV out. The escaping is the whole problem (RFC 4180): a value containing a comma, a double quote
// or a line break is wrapped in double quotes, and every double quote inside it is doubled. One unquoted comma
// in one restaurant name shifts every column after it. Both functions run in the browser only when called.

// A spreadsheet runs a text cell that starts with = + - or @ as a FORMULA. Customer names reach this export, so
// those cells get a leading apostrophe. Numbers are never touched: -5 stays a number.
const FORMULA_START = /^[=+\-@\t\r]/;

function cell(value) {
  let s = value === null || value === undefined ? "" : String(value);
  if (typeof value === "string" && FORMULA_START.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * rows: an array of plain objects. columns: the keys to write, in order (default: the first row's keys).
 * Lines end with CRLF, as the RFC and Excel expect; a quoted cell may itself contain a line break.
 */
export function toCsv(rows, columns = rows[0] ? Object.keys(rows[0]) : []) {
  if (columns.length === 0) return "";
  return [columns, ...rows.map((row) => columns.map((c) => row[c]))].map((r) => r.map(cell).join(",")).join("\r\n");
}

/** Hands `text` to the person as a file, built entirely in the browser: a Blob, an object URL and a click. */
export function download(text, filename, type = "text/csv;charset=utf-8") {
  // The BOM makes Excel read the file as UTF-8 (Amharic names, the birr sign) instead of guessing.
  const blob = new Blob(["\uFEFF", text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a); // Firefox ignores a click on a link that is not in the page
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000); // release the memory, after the browser has taken the file
}
