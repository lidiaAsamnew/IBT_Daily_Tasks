export default function Loading() {
  return (
    <div className="container section" aria-busy="true">
      <h1>Dashboard</h1>
      <p className="sr-only">Loading the dashboard…</p>
      <div className="kpi-grid" aria-hidden="true">
        {Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton skeleton-kpi" />)}
      </div>
      <div className="skeleton skeleton-chart" aria-hidden="true" />
    </div>
  );
}
