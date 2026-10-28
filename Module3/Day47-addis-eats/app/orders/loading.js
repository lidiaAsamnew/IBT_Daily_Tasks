import TableSkeleton from "@/components/TableSkeleton";

// The LOADING state: a skeleton shaped like the page (heading, then five table rows - the page size).
// Shown in the page slot while /orders renders; the header and footer stay on screen.
// /orders/[id] has its own loading.js, so this one never covers the tracking page.
export default function Loading() {
  return (
    <div className="wrap pt-12">
      <h1 className="text-4xl font-semibold">Your orders</h1>
      <p className="mb-8 mt-2 text-muted">Loading your orders&hellip;</p>
      <TableSkeleton rows={5} label="Loading your orders" />
    </div>
  );
}
