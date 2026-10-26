import DishCard from "@/components/DishCard";

// Colocated in app/menu/ but NOT a route: only page.js is reachable.
export default function DishList({ dishes }) {
  if (dishes.length === 0) return <p className="text-muted">No dishes in this category yet.</p>;

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {dishes.map((dish) => <DishCard key={dish.id} dish={dish} />)}
    </ul>
  );
}
