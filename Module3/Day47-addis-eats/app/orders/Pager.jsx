import Link from "next/link";
import { hrefFor } from "@/lib/order-query";

// Numbered pages as real links to real URLs (/orders?page=3): the back button, middle-click, copy-link
// and a crawler all work. Not buttons, not infinite scroll. A server component: no JavaScript shipped.
function windowed(page, pages) {
  const set = new Set([1, pages, page - 1, page, page + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push("gap");
    out.push(n);
  });
  return out;
}

export default function Pager({ basePath, keep, page, pages, total, pageSize }) {
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const href = (n) => hrefFor(basePath, keep, { page: n === 1 ? undefined : n });
  const box = "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm font-medium";

  return (
    <nav aria-label="Pagination" className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted">Showing {from}&ndash;{to} of {total}</p>
      <ul className="flex flex-wrap items-center gap-1">
        <li>
          {page > 1 ? (
            <Link href={href(page - 1)} rel="prev" className={`${box} border border-injera bg-white hover:bg-injera/50`}>Previous</Link>
          ) : (
            <span aria-disabled="true" className={`${box} border border-injera text-muted/60`}>Previous</span>
          )}
        </li>
        {windowed(page, pages).map((n, i) =>
          n === "gap" ? (
            <li key={`g${i}`} aria-hidden="true" className="px-1 text-muted">&hellip;</li>
          ) : (
            <li key={n}>
              {n === page ? (
                <span aria-current="page" className={`${box} bg-forest text-white`}>
                  <span className="sr-only">Page </span>{n}
                </span>
              ) : (
                <Link href={href(n)} aria-label={`Page ${n}`} className={`${box} border border-injera bg-white hover:bg-injera/50`}>{n}</Link>
              )}
            </li>
          )
        )}
        <li>
          {page < pages ? (
            <Link href={href(page + 1)} rel="next" className={`${box} border border-injera bg-white hover:bg-injera/50`}>Next</Link>
          ) : (
            <span aria-disabled="true" className={`${box} border border-injera text-muted/60`}>Next</span>
          )}
        </li>
      </ul>
    </nav>
  );
}
