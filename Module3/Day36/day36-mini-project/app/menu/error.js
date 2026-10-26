"use client"; // error.js must be a client component (it has an event handler)

export default function MenuError({ reset }) {
  return (
    <div className="wrap py-20 text-center" role="alert">
      <h1 className="text-4xl font-semibold text-berbere">The menu could not load</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">
        Something went wrong on our side. Try again, and if it keeps happening come back in a few minutes.
      </p>
      <button onClick={() => reset()} className="btn btn-green mt-6">Try again</button>
    </div>
  );
}
