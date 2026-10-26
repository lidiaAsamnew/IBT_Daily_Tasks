// A skeleton the shape of the table: same number of rows, so nothing jumps when data arrives (Day 46).
export default function Loading() {
  return (
    <div className="container section" aria-busy="true">
      <div className="section-head"><h1>Your orders</h1></div>
      <p className="sr-only">Loading your orders…</p>
      <div className="skeleton-table" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => <div key={i} className="skeleton skeleton-row" />)}
      </div>
    </div>
  );
}
