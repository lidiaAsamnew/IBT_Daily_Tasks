import TableSkeleton from "@/components/TableSkeleton";

// The LOADING state: the shape of the page - heading, two chart-sized boxes (the same fixed height as the
// real charts, h-72) and a table of ten rows (the page size) - so nothing jumps when the data lands.
export default function Loading() {
  return (
    <div className="wrap pt-12">
      <h1 className="text-4xl font-semibold">Dashboard</h1>
      <p className="mb-8 mt-2 text-muted">Loading the numbers&hellip;</p>
      <div role="status" aria-live="polite" className="space-y-14">
        <span className="sr-only">Loading the dashboard</span>
        {[1, 2].map((n) => (
          <div key={n} aria-hidden="true" className="space-y-3">
            <div className="h-8 w-2/3 rounded bg-injera/60 motion-safe:animate-pulse" />
            <div className="h-[22.5rem] rounded-2xl border border-injera bg-white p-5">
              <div className="h-72 rounded bg-injera/50 motion-safe:animate-pulse" />
            </div>
          </div>
        ))}
        <TableSkeleton rows={10} label="Loading orders" />
      </div>
    </div>
  );
}
