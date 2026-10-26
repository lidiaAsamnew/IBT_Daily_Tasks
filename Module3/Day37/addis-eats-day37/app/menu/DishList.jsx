import DishCard from "@/components/DishCard";
import { categories, getDishes, slugOf } from "@/lib/dishes";

// An async server component: it waits for the data itself.
// page.js wraps it in <Suspense>, so only this part waits.
export default async function DishList() {
  const dishes = await getDishes();

  return (
    <div className="space-y-12">
      {categories.map((c) => (
        <section key={c} id={slugOf(c)} aria-labelledby={`${slugOf(c)}-title`} className="scroll-mt-6">
          <h2 id={`${slugOf(c)}-title`} className="mb-4 text-2xl font-semibold">{c}</h2>
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {dishes.filter((d) => d.category === c).map((d) => <DishCard key={d.id} dish={d} />)}
          </ul>
        </section>
      ))}
    </div>
  );
}
