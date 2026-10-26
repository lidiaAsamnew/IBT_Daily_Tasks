import DishList from "./DishList";
import CategoryBar from "./CategoryBar";
import { dishes, categories } from "@/lib/dishes";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function MenuPage({ searchParams }) {
  // Next.js 15+ passes searchParams as a Promise; await works on every version.
  const { category = "All", slow, error } = await searchParams;

  // Day 36 proof helpers:
  if (slow === "1") await wait(2500);                       // /menu?slow=1  -> loading.js
  if (error === "1") throw new Error("Forced menu error");  // /menu?error=1 -> error.js

  const visible = category === "All" ? dishes : dishes.filter((d) => d.category === category);

  return (
    <div className="wrap pt-12">
      <h1 className="text-4xl font-semibold">Our menu</h1>
      <p className="mb-8 mt-2 text-muted">Pick a category, then open a dish for the details.</p>
      <CategoryBar categories={categories} active={category} />
      <DishList dishes={visible} />
    </div>
  );
}
