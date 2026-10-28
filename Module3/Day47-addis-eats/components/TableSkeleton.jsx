// The LOADING state: the shape of the content, not a spinner. Same number of rows as the real page
// (pass the page size), so nothing jumps when the data lands.
export default function TableSkeleton({ rows = 5, label = "Loading\u2026" }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="overflow-hidden rounded-2xl border border-injera bg-white">
        <div className="h-11 border-b border-injera bg-injera/50" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-injera px-4 py-3 last:border-b-0">
            <div className="h-10 flex-1 rounded bg-injera/60 motion-safe:animate-pulse" />
            <div className="hidden h-4 w-24 rounded bg-injera/60 motion-safe:animate-pulse sm:block" />
            <div className="h-4 w-20 rounded bg-injera/60 motion-safe:animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
