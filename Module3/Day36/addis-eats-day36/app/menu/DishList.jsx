import Link from "next/link";

// Not a route - just a component (no page.js needed or wanted here).
// NOTE: starter version. Swap in your own Day 35 DishList if you prefer.
export default function DishList({ dishes }) {
  if (dishes.length === 0) return <p>No dishes in this category.</p>;

  return (
    <ul className="space-y-3">
      {dishes.map((dish) => (
        <li key={dish.id} className="rounded border border-amber-900/30 p-4">
          <Link href={`/menu/${dish.id}`} className="text-lg font-semibold underline">
            {dish.name}
          </Link>
          <p className="text-sm">{dish.description}</p>
          <p className="text-sm font-medium">{dish.price} ETB</p>
        </li>
      ))}
    </ul>
  );
}
