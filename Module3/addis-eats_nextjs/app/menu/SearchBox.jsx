"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/lib/use-debounce";
import { menuHref } from "@/lib/dish-query";

// Typing updates local state at once (the input never lags); the URL — and therefore the SWR key —
// follows 300 ms after the last keystroke. The result is a link someone can share.
export default function SearchBox({ initial }) {
  const router = useRouter();
  const params = useSearchParams();
  const [term, setTerm] = useState(initial);
  const debounced = useDebounce(term, 300);

  useEffect(() => {
    const wanted = debounced.trim().slice(0, 60);
    if (wanted === (params.get("q") ?? "")) return; // already in the URL — nothing to do
    router.replace(menuHref({ category: params.get("category") ?? "", q: wanted }), { scroll: false });
  }, [debounced, params, router]);

  return (
    <form role="search" className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="dish-search" className="sr-only">Search dishes</label>
      <input
        id="dish-search"
        type="search"
        className="input search-input"
        placeholder="Search dishes, e.g. tibs"
        value={term}
        maxLength={60}
        autoComplete="off"
        enterKeyHint="search"
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && setTerm("")}
      />
      {term && (
        <button type="button" className="search-clear" onClick={() => setTerm("")} aria-label="Clear search">
          <span aria-hidden="true">×</span>
        </button>
      )}
    </form>
  );
}
