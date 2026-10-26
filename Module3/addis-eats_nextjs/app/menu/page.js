import { Suspense } from "react";
import DishList from "./DishList";
import DishSkeleton from "./DishSkeleton";
import FilterShell from "./FilterShell";
import { getCategories, getDishes } from "@/lib/dishes";
import { queryDishes } from "@/lib/dish-query";

// ISR (Day 37): served as a static page and rebuilt in the background at most once an hour.
// An hour is honest for a menu; it would not be for a price during a promotion.
export const revalidate = 3600;

export const metadata = {
  title: "Menu",
  description: "Doro Wat, Shiro, Tibs, Firfir and more, delivered across Addis Ababa.",
  alternates: { canonical: "/menu" }, // /menu?category=… and /menu?page=2 all count as this one page (Day 44)
};

export default function MenuPage() {
  return (
    <>
      <header className="page-head">
        <h1>Our menu</h1>
        <p className="lede">Fresh Ethiopian food, ready to be delivered to your door.</p>
      </header>
      {/* Boundary one: the fast heading above is sent immediately; only the data-dependent part streams in. */}
      <Suspense fallback={<DishSkeleton />}>
        <MenuBrowser />
      </Suspense>
    </>
  );
}

async function MenuBrowser() {
  const [dishes, categories] = await Promise.all([getDishes(), getCategories()]);
  const first = queryDishes(dishes, { page: 1 });
  const list = <DishList dishes={first.dishes} page={first.page} pages={first.pages} />;
  // Boundary two: FilterShell reads the URL (useSearchParams), which cannot be known at build time.
  // Its fallback is the real, server-rendered list — so crawlers and no-JS visitors get the dishes.
  return (
    <Suspense fallback={list}>
      <FilterShell categories={categories}>{list}</FilterShell>
    </Suspense>
  );
}
