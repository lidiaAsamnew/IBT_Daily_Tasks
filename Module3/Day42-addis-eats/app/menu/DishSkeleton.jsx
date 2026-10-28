// Placeholder cards. Used by the Suspense fallback and by loading.js.
export default function DishSkeleton() {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <li key={n} className="overflow-hidden rounded-2xl border border-injera bg-white">
          <div className="h-44 bg-injera/60 motion-safe:animate-pulse" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-1/3 rounded bg-injera motion-safe:animate-pulse" />
            <div className="h-6 w-2/3 rounded bg-injera motion-safe:animate-pulse" />
            <div className="h-4 w-full rounded bg-injera motion-safe:animate-pulse" />
          </div>
        </li>
      ))}
    </ul>
  );
}
