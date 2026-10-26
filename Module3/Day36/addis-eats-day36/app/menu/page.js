import DishList from "./DishList";
import CategoryBar from "./CategoryBar";
import { dishes, categories } from "./dishes";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function MenuPage({ searchParams }) {
  // In Next.js 15+ searchParams is a Promise; awaiting is safe in every version.
  const { category = "All", slow, error } = await searchParams;

  // Exercise helpers: force loading.js and error.js to appear.
  if (slow === "1") await wait(2500); // /menu?slow=1  -> loading.js shows
  if (error === "1") throw new Error("Forced menu error"); // /menu?error=1 -> error.js shows

  const visible = category === "All" ? dishes : dishes.filter((d) => d.category === category);

  return (
    <main>
      <h1 className="mb-4 text-2xl font-bold">Our menu</h1>
      <CategoryBar categories={categories} active={category} />
      <DishList dishes={visible} />
    </main>
  );
}
