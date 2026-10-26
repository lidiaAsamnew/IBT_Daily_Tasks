import { cache } from "react";
import { MENU, CATEGORY_ORDER } from "../data/menu.js";
import { categoriesOf } from "./dish-query.js";

// Async on purpose: swapping MENU for a database query later changes nothing for callers.
// React's cache() means generateMetadata and the page share one lookup per render (Day 44).
export const getDishes = cache(async () => MENU);

export const getDish = cache(async (id) => {
  const key = String(id);
  return MENU.find((d) => String(d.id) === key) ?? null;
});

export const getCategories = cache(async () => categoriesOf(MENU, CATEGORY_ORDER));
