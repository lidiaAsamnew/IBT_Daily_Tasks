"use client";

// The last-resort boundary for the whole site (Day 36). Segments may add their own error.js.
export default function RootError({ error, reset }) {
  return (
    <div className="container narrow state-page" role="alert">
      <p className="eyebrow">Something went wrong</p>
      <h1>We hit a problem loading this page</h1>
      <p className="lede">It is on our side, not yours. Try again — and if it keeps happening, come back in a few minutes.</p>
      {error?.digest && <p className="muted">Reference: {error.digest}</p>}
      <div className="actions">
        <button type="button" className="btn btn-primary" onClick={() => reset()}>Try again</button>
      </div>
    </div>
  );
}
