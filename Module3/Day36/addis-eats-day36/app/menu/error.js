"use client"; // error.js must be a client component

export default function MenuError({ error, reset }) {
  return (
    <main className="space-y-3">
      <h1 className="text-2xl font-bold">The menu could not load</h1>
      <p className="text-sm">{error.message}</p>
      <button onClick={() => reset()} className="rounded bg-amber-800 px-4 py-2 text-white">
        Try again
      </button>
    </main>
  );
}
