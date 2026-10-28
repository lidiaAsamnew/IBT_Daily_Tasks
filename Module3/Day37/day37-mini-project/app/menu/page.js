import { Suspense } from "react";
import DishList from "./DishList";
import DishSkeleton from "./DishSkeleton";
import ErrorDemo from "./ErrorDemo";

// Incremental regeneration, one hour. Why: dishes and prices change a few times a day
// at most, a menu that is up to an hour old misleads nobody, and an hour keeps the page
// served instantly from a prebuilt file. (A price during a promotion would need less.)
// The build must still mark /menu static, so this page must not use searchParams,
// cookies() or headers().
export const revalidate = 3600;

export default function MenuPage() {
  return (
    <div>
      <h1 className="text-4xl font-semibold">Our menu</h1>
      <p className="mb-8 mt-2 text-muted">Pick a category on the left, or scroll through everything.</p>

      {/* Header and sidebar come from the layouts and arrive first. */}
      <Suspense fallback={<DishSkeleton />}>
        <DishList />
      </Suspense>

      <ErrorDemo />
    </div>
  );
}
