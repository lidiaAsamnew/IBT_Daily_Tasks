import Link from "next/link";
import { slugOf } from "@/lib/dishes";

// The category sidebar. Colocated in app/menu/, so it is not a route.
// A layout cannot read the URL on the server, so these are plain jump links
// to sections on /menu - which also keeps /menu fully static.
export default function CategoryBar({ categories, counts }) {
  const item =
    "flex items-center justify-between gap-3 rounded-full border border-injera bg-white px-4 py-2 text-sm font-medium hover:border-forest lg:rounded-xl";

  return (
    <nav aria-label="Menu categories">
      <h2 className="mb-3 text-lg font-semibold">Categories</h2>
      <ul className="flex flex-wrap gap-2 lg:flex-col">
        <li><Link href="/menu" className={item}>All dishes</Link></li>
        {categories.map((c) => (
          <li key={c}>
            <Link href={`/menu#${slugOf(c)}`} className={item}>
              {c}
              <span className="rounded-full bg-forest/10 px-2 text-xs text-forest">{counts[c]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
