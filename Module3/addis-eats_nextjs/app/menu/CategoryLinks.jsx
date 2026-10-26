import Link from "next/link";
import { menuHref } from "@/lib/dish-query";

// Pure markup — no hooks — so it can also be the Suspense fallback while the client bar loads.
export default function CategoryLinks({ categories, active = "" }) {
  const items = [{ label: "All dishes", value: "" }, ...categories.map((c) => ({ label: c, value: c }))];
  return (
    <nav aria-label="Menu categories" className="category-nav">
      <ul className="category-list">
        {items.map((item) => (
          <li key={item.value || "all"}>
            <Link
              href={menuHref({ category: item.value })}
              className="category-link"
              aria-current={item.value === active ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
