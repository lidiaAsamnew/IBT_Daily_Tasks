"use client";

import { useState } from "react";

const chip =
  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors";
const idle = `${chip} border-injera bg-white hover:border-forest`;
const on = `${chip} border-forest bg-forest text-white`;

export default function FilterShell({ children, categories }) {
  const [selected, setSelected] = useState("All");
  const filters = ["All", ...categories];
  const slug = selected === "All" ? "all" : selected.toLowerCase();

  return (
    <div>
      <div role="group" aria-label="Filter dishes by category" className="mb-8 flex flex-wrap gap-2">
        {filters.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={selected === c}
            onClick={() => setSelected(c)}
            className={selected === c ? on : idle}
          >
            {c}
          </button>
        ))}
      </div>
      {/* DishList is passed in as children — this file never imports it, so the cards stay server HTML. */}
      <div className="filter-shell" data-filter={slug}>
        {children}
      </div>
    </div>
  );
}
