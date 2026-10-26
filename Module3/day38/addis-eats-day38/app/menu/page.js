import FilterShell from "./FilterShell";
import DishList from "./DishList";
import ErrorDemo from "./ErrorDemo";
import { categories, getDishes } from "@/lib/dishes";

// Incremental regeneration: built at build time, rebuilt in the background
// at most once an hour. The build should still mark /menu as static.
export const revalidate = 3600;

export default async function MenuPage() {
  const dishes = await getDishes();

  return (
    <div>
      <h1 className="text-4xl font-semibold">Our menu</h1>
      <p className="mb-8 mt-2 text-muted">Filter by category, or use the sidebar to jump to a section.</p>

      <FilterShell categories={categories}>
        <DishList dishes={dishes} />
      </FilterShell>

      <ErrorDemo />
    </div>
  );
}
