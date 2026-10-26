import Link from "next/link";

// Not a route. Links set ?category=..., which the menu page reads.
// NOTE: starter version. Swap in your own Day 35 CategoryBar if you prefer.
export default function CategoryBar({ categories, active }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {categories.map((c) => {
        const isActive = c === active;
        return (
          <Link
            key={c}
            href={c === "All" ? "/menu" : `/menu?category=${c}`}
            className={`rounded-full border px-3 py-1 text-sm ${
              isActive ? "bg-amber-800 text-white" : "border-amber-900/40"
            }`}
          >
            {c}
          </Link>
        );
      })}
    </div>
  );
}
