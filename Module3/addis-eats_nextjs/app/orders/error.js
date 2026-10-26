"use client";

export default function OrdersError({ reset }) {
  return (
    <div className="container section">
      <div className="state-box" role="alert">
        <h2>We could not load your orders</h2>
        <p className="muted">Nothing has been lost. Try again in a moment.</p>
        <button type="button" className="btn btn-primary" onClick={() => reset()}>Try again</button>
      </div>
    </div>
  );
}
