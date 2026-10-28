"use client"; // error.js must be a client component (it has an event handler)

// Catches errors in the page below it. The menu layout (sidebar) stays visible.
export default function MenuError({ reset }) {
  return (
    <div className="rounded-2xl border border-berbere/30 bg-white px-6 py-14 text-center" role="alert">
      <h1 className="text-3xl font-semibold text-berbere">The menu could not load</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">
        Something went wrong on our side. Try again, and if it keeps happening come back in a few minutes.
      </p>
      <button onClick={() => reset()} className="btn btn-green mt-6">Try again</button>
    </div>
  );
}
