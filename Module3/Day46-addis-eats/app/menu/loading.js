import DishSkeleton from "./DishSkeleton";

// Shown in the page slot while the segment loads. The layouts stay on screen.
export default function Loading() {
  return (
    <div role="status" aria-live="polite">
      <h1 className="text-4xl font-semibold">Our menu</h1>
      <p className="mb-8 mt-2 text-muted">Loading the menu&hellip;</p>
      <DishSkeleton />
    </div>
  );
}
