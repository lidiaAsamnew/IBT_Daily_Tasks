import Link from "next/link";

// Colocated, not a route. Each link sets ?category=..., which page.js reads.
export default function CategoryBar({ categories, active }) {
  return (
    <nav aria-label="Categories" className="mb-8">
      <ul className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <li key={c}>
            <Link
              href={c === "All" ? "/menu" : `/menu?category=${c}`}
              aria-current={c === active ? "true" : undefined}
              className={`inline-block rounded-full border px-4 py-1.5 text-sm font-medium ${
                c === active ? "border-forest bg-forest text-white" : "border-injera bg-white hover:border-forest"
              }`}
            >
              {c}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
