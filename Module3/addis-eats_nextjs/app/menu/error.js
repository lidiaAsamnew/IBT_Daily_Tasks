"use client";

// Catches a throw in the menu segment only — the header, footer and sidebar stay up (Day 37).
export default function MenuError({ reset }) {
  return (
    <div className="state-box" role="alert">
      <h2>The menu could not be loaded</h2>
      <p className="muted">Something went wrong on our side. Your cart is safe.</p>
      <button type="button" className="btn btn-primary" onClick={() => reset()}>Try again</button>
    </div>
  );
}
