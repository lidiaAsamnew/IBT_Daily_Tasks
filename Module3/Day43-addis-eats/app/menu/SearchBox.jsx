"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import DishCard from "@/components/DishCard";
import { fetcher } from "@/lib/fetcher";
import { useDebounce } from "@/lib/useDebounce";

const toPage = (v) => (Number.isInteger(Number(v)) && Number(v) >= 1 ? Number(v) : 1);

// Update ?q=&page= without asking the server for anything. Next.js 15 keeps
// useSearchParams in sync with history.pushState / replaceState.
function writeUrl({ q, page }, mode) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  window.history[mode === "push" ? "pushState" : "replaceState"](null, "", qs ? `?${qs}` : window.location.pathname);
}

// `children` is the server-rendered menu. It is shown whenever there is no search term,
// so the first paint of /menu is still pure server HTML.
export default function SearchBox({ children }) {
  const sp = useSearchParams();
  const urlQ = (sp.get("q") ?? "").trim();
  const page = toPage(sp.get("page"));

  const [term, setTerm] = useState(urlQ);
  const debounced = useDebounce(term.trim(), 300); // typing "tibs" = one change, 300 ms after the last key
  const written = useRef(urlQ);

  // The debounced term goes into the URL (replace, and back to page 1).
  useEffect(() => {
    if (debounced === written.current) return;
    written.current = debounced;
    writeUrl({ q: debounced, page: 1 }, "replace");
  }, [debounced]);

  // URL changed from outside (back button, a shared link): follow it.
  useEffect(() => {
    if (urlQ !== written.current) {
      written.current = urlQ;
      setTerm(urlQ);
    }
  }, [urlQ]);

  // The URL is the single source of truth for the key: one change, one request.
  // Empty term -> null key -> SWR does not fetch at all.
  const key = urlQ ? `/api/dishes?q=${encodeURIComponent(urlQ)}&page=${page}` : null;
  const { data, error, isLoading, isValidating } = useSWR(key, fetcher, {
    keepPreviousData: true,        // keep showing the last results while the next ones load
    revalidateOnFocus: false,      // dish data changes a few times a day, not when a tab refocuses
    dedupingInterval: 5 * 60_000,  // SWR's nearest thing to staleTime: reuse a result for 5 minutes
  });

  const goToPage = (n) => writeUrl({ q: urlQ, page: n }, "push");
  const href = (n) => `?q=${encodeURIComponent(urlQ)}${n > 1 ? `&page=${n}` : ""}`;

  return (
    <div>
      <div className="relative mb-8 max-w-xl">
        <label htmlFor="dish-search" className="sr-only">Search dishes</label>
        <input
          id="dish-search"
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search dishes, e.g. tibs or lentils"
          autoComplete="off"
          className="w-full rounded-full border border-injera bg-white px-5 py-3 outline-none focus:border-forest"
        />
      </div>

      {!urlQ && children}

      {urlQ && (
        <section aria-label="Search results" aria-busy={isLoading || isValidating}>
          {error && !data && (
            <p role="alert" className="rounded-xl bg-berbere/10 px-4 py-3 text-sm text-berbere">
              Search failed ({error.message}). Try again in a moment.
            </p>
          )}

          {!data && !error && (
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading results">
              {[0, 1, 2].map((n) => <li key={n} className="h-72 animate-pulse rounded-2xl bg-injera/50" />)}
            </ul>
          )}

          {data && (
            <>
              <p className="mb-4 text-sm text-muted" aria-live="polite">
                {data.total === 0
                  ? `No dishes match "${data.q}".`
                  : `${data.total} ${data.total === 1 ? "dish matches" : "dishes match"} "${data.q}" - page ${Math.min(data.page, data.totalPages)} of ${data.totalPages}`}
                {isLoading || isValidating ? " - updating..." : ""}
              </p>

              {data.total > 0 && data.items.length === 0 ? (
                <p className="mb-6">
                  That page does not exist. <a href={href(1)} onClick={(e) => { e.preventDefault(); goToPage(1); }} className="font-semibold text-forest underline">Go to page 1</a>
                </p>
              ) : (
                <ul className={`grid gap-5 transition-opacity sm:grid-cols-2 xl:grid-cols-3 ${isLoading ? "opacity-50" : ""}`}>
                  {data.items.map((d) => <DishCard key={d.id} dish={d} />)}
                </ul>
              )}

              {data.totalPages > 1 && (
                <nav aria-label="Pages" className="mt-8 flex items-center gap-3">
                  {[["Previous", page - 1, page <= 1], ["Next", page + 1, page >= data.totalPages]].map(([label, n, disabled]) => (
                    <a
                      key={label}
                      href={disabled ? undefined : href(n)}
                      aria-disabled={disabled}
                      onClick={(e) => { e.preventDefault(); if (!disabled) goToPage(n); }}
                      className={`btn btn-ghost px-5 py-2 text-sm text-forest ${disabled ? "pointer-events-none opacity-40" : ""}`}
                    >
                      {label}
                    </a>
                  ))}
                </nav>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}
