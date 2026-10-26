import { Suspense } from "react";
import DishList from "./DishList";
import DishSkeleton from "./DishSkeleton";
import ErrorDemo from "./ErrorDemo";

// Incremental regeneration: built at build time, rebuilt in the background
// at most once an hour. The build should still mark /menu as static.
// (No searchParams, cookies() or headers() here - any of them would make it dynamic.)
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
