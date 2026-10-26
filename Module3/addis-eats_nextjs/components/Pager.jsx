import Link from "next/link";

/** Numbered pages as real links (Day 46): back button, middle-click and crawlers all work. */
export default function Pager({ page, pages, hrefFor, label = "Pagination" }) {
  if (pages <= 1) return null;
  const numbers = Array.from({ length: pages }, (_, i) => i + 1);
  return (
    <nav className="pager" aria-label={label}>
      {page > 1 ? (
        <Link className="pager-link" href={hrefFor(page - 1)} rel="prev">Previous</Link>
      ) : (
        <span className="pager-link pager-link--disabled" aria-disabled="true">Previous</span>
      )}
      <ul className="pager-pages">
        {numbers.map((n) => (
          <li key={n}>
            <Link
              className={`pager-link ${n === page ? "pager-link--current" : ""}`}
              href={hrefFor(n)}
              aria-current={n === page ? "page" : undefined}
              aria-label={`Page ${n}`}
            >
              {n}
            </Link>
          </li>
        ))}
      </ul>
      {page < pages ? (
        <Link className="pager-link" href={hrefFor(page + 1)} rel="next">Next</Link>
      ) : (
        <span className="pager-link pager-link--disabled" aria-disabled="true">Next</span>
      )}
    </nav>
  );
}
