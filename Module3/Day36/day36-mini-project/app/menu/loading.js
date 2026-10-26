// Shown automatically (Suspense) while app/menu/page.js loads.
export default function Loading() {
  return (
    <div className="wrap pt-12" role="status" aria-live="polite">
      <h1 className="text-4xl font-semibold">Our menu</h1>
      <p className="mb-8 mt-2 text-muted">Loading the menu&hellip;</p>
      <div className="mb-8 flex gap-2">
        {[1, 2, 3, 4].map((n) => <div key={n} className="h-9 w-24 rounded-full bg-injera motion-safe:animate-pulse" />)}
      </div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <li key={n} className="overflow-hidden rounded-2xl border border-injera bg-white">
            <div className="h-48 bg-injera/60 motion-safe:animate-pulse" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-1/3 rounded bg-injera motion-safe:animate-pulse" />
              <div className="h-6 w-2/3 rounded bg-injera motion-safe:animate-pulse" />
              <div className="h-4 w-full rounded bg-injera motion-safe:animate-pulse" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
