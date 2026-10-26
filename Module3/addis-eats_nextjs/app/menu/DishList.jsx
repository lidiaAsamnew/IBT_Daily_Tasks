import DishGrid from "./DishGrid";
import Pager from "@/components/Pager";
import { menuHref } from "@/lib/dish-query";

// Server component: markup from data, ships no JavaScript of its own (Day 38).
// This is the first paint of /menu, and what crawlers and no-JS visitors see.
export default function DishList({ dishes, page, pages }) {
  return (
    <>
      <DishGrid dishes={dishes} priorityFirst />
      <Pager page={page} pages={pages} hrefFor={(n) => menuHref({ page: n })} label="Menu pages" />
    </>
  );
}
