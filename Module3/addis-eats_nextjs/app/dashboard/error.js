"use client";

export default function DashboardError({ reset }) {
  return (
    <div className="container section">
      <div className="state-box" role="alert">
        <h2>The dashboard could not be loaded</h2>
        <p className="muted">The numbers could not be read. Try again in a moment.</p>
        <button type="button" className="btn btn-primary" onClick={() => reset()}>Try again</button>
      </div>
    </div>
  );
}
