"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import DishGrid from "./DishGrid";
import DishSkeleton from "./DishSkeleton";
import SearchBox from "./SearchBox";
import Pager from "@/components/Pager";
import { fetcher } from "@/lib/fetcher";
import { menuHref } from "@/lib/dish-query";
import { positiveInt } from "@/lib/params";

/**
 * An interactive shell around server-rendered content (Day 38): `children` is the server-rendered list.
 * With no filter in the URL the shell renders `children` untouched (zero client work for the cards).
 * Once a search, category or page is in the URL it fetches that view with SWR (Day 41):
 *   - the key is the URL, so identical views share one cache entry and a late response can never overwrite a newer one
 *   - keepPreviousData holds the old results on screen while the next ones load (no empty flash)
 */
export default function FilterShell({ children, categories }) {
  const params = useSearchParams();
  const requested = params.get("category") ?? "";
  const category = categories.includes(requested) ? requested : "";
  const q = (params.get("q") ?? "").trim().slice(0, 60);
  const page = positiveInt(params.get("page"));
  const active = Boolean(category || q || page > 1);

  const query = new URLSearchParams({ ...(category && { category }), ...(q && { q }), page: String(page) });
  const key = active ? `/api/dishes?${query}` : null; // null key = "do not fetch"
  const { data, error, isLoading, mutate } = useSWR(key, fetcher, { keepPreviousData: true });

  let body;
  if (!active) body = children;
  else if (error) {
    body = (
      <div className="state-box" role="alert">
        <h2>We could not load those dishes</h2>
        <p className="muted">Check your connection and try again.</p>
        <button type="button" className="btn btn-primary" onClick={() => mutate()}>Try again</button>
      </div>
    );
  } else if (isLoading && !data) body = <DishSkeleton />;
  else if (data && data.dishes.length === 0) {
    body = (
      <div className="state-box">
        <h2>No dishes match{q ? ` “${q}”` : ""}</h2>
        <p className="muted">Try a different word, or clear the filters to see everything.</p>
        <Link href="/menu" className="btn btn-primary">Show all dishes</Link>
      </div>
    );
  } else if (data) {
    body = (
      <>
        <DishGrid dishes={data.dishes} />
        <Pager page={data.page} pages={data.pages} hrefFor={(n) => menuHref({ category, q, page: n })} label="Menu pages" />
      </>
    );
  }

  const summary = !active
    ? ""
    : data
      ? `${data.total} ${data.total === 1 ? "dish" : "dishes"}${category ? ` in ${category}` : ""}${q ? ` matching “${q}”` : ""}`
      : "Searching…";

  return (
    <div className="menu-main">
      <SearchBox initial={q} />
      <p className="results-note" role="status" aria-live="polite">{summary}</p>
      {body}
    </div>
  );
}
