import FilterShell from "./FilterShell";
import DishList from "./DishList";
import ErrorDemo from "./ErrorDemo";
import { categories, getDishes } from "@/lib/dishes";

// Incremental regeneration, one hour. Why: dishes and prices change a few times a day
// at most, a menu that is up to an hour old misleads nobody, and an hour keeps the page
// served instantly from a prebuilt file. (A price during a promotion would need less.)
// The build must still mark /menu static, so this page must not use searchParams,
// cookies() or headers().
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
