"use client";
import { useState } from "react";

// Day 36 check, kept: throwing while rendering inside the menu segment shows
// app/menu/error.js. (The old ?error=1 trick needed searchParams, which would
// make /menu dynamic and break today's static + revalidate exercise.)
export default function ErrorDemo() {
  const [broken, setBroken] = useState(false);
  if (broken) throw new Error("Test error thrown from the menu page");

  return (
    <div className="mt-12 rounded-2xl border-2 border-dashed border-forest/40 p-5">
      <h2 className="text-lg font-semibold">Developer check</h2>
      <p className="mb-3 text-sm text-muted">Throws an error inside the menu segment to show error.js.</p>
      <button onClick={() => setBroken(true)} className="btn btn-green text-sm">Trigger error.js</button>
    </div>
  );
}
