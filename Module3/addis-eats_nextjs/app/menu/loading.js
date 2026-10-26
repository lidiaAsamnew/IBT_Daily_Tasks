import DishSkeleton from "./DishSkeleton";

export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <div className="page-head">
        <div className="skeleton skeleton-line skeleton-line--title" style={{ width: "40%" }} />
      </div>
      <p className="sr-only">Loading the menu…</p>
      <DishSkeleton />
    </div>
  );
}
