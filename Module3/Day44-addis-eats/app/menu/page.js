import { Suspense } from "react";
import FilterShell from "./FilterShell";
import SearchBox from "./SearchBox";
import DishList from "./DishList";
import ErrorDemo from "./ErrorDemo";
import { categories, getDishes } from "@/lib/dishes";
import { pageMetadata } from "@/lib/seo";

// /menu?q=tibs&page=2 shows different results to a person but is the same page to a crawler: the canonical tag says /menu is the real one.
export const metadata = pageMetadata({
  title: "Menu",
  description: "Meat, vegetarian and breakfast dishes with prices in ETB. Search or filter the Addis Eats menu and get it delivered across Addis Ababa.",
  path: "/menu",
});

// Incremental regeneration, one hour. Why: dishes and prices change a few times a day
// at most, a menu that is up to an hour old misleads nobody, and an hour keeps the page
// served instantly from a prebuilt file. (A price during a promotion would need less.)
// The build must still mark /menu static, so this page must not use searchParams,
// cookies() or headers(). The search box reads ?q=&page= in the browser instead (it is
// a client component inside <Suspense>, which keeps the page itself static).
export const revalidate = 3600;

export default async function MenuPage() {
  const dishes = await getDishes();

  // The server-rendered menu: the first paint, and what shows while the search box is empty.
  const menu = (
    <FilterShell categories={categories}>
      <DishList dishes={dishes} />
    </FilterShell>
  );

  return (
    <div>
      <h1 className="text-4xl font-semibold">Our menu</h1>
      <p className="mb-8 mt-2 text-muted">Search, filter by category, or use the sidebar to jump to a section.</p>

      <Suspense fallback={menu}>
        <SearchBox>{menu}</SearchBox>
      </Suspense>

      <ErrorDemo />
    </div>
  );
}
