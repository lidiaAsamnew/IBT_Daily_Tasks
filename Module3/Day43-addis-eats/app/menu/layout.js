import CategoryBar from "./CategoryBar";
import LayoutCounter from "./LayoutCounter";
import { categories, dishes } from "@/lib/dishes";

// Wraps /menu AND /menu/[id]. It stays mounted when you move between them,
// so the sidebar (and the counter's state) survive navigation.
// It is sent immediately, before the page data arrives.
export default function MenuLayout({ children }) {
  const counts = Object.fromEntries(
    categories.map((c) => [c, dishes.filter((d) => d.category === c).length])
  );

  return (
    <div className="wrap grid gap-8 pt-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <CategoryBar categories={categories} counts={counts} />
        <LayoutCounter />
      </aside>
      <div>{children}</div>
    </div>
  );
}
