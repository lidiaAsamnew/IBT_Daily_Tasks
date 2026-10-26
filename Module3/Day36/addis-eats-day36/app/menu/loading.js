// Shown automatically while app/menu/page.js is loading.
export default function Loading() {
  return (
    <main aria-busy="true">
      <h1 className="mb-4 text-2xl font-bold">Loading the menu...</h1>
      <ul className="space-y-3">
        {[1, 2, 3].map((n) => (
          <li key={n} className="h-20 animate-pulse rounded bg-amber-900/15" />
        ))}
      </ul>
    </main>
  );
}
