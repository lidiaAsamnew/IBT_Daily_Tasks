import { Suspense } from "react";
import CategoryBar from "./CategoryBar";
import CategoryLinks from "./CategoryLinks";
import OrderPanel from "./OrderPanel";
import MobileCartBar from "./MobileCartBar";
import { getCategories } from "@/lib/dishes";

// The shell for everything under /menu. It stays mounted while you move between /menu and /menu/[id],
// so the sidebar keeps its place (Day 37). A layout cannot read the current URL on the server, so the
// "which category is active" part is a small client leaf inside it.
export default async function MenuLayout({ children }) {
  const categories = await getCategories();
  return (
    <div className="container menu-shell">
      <aside className="menu-sidebar" aria-label="Browse the menu">
        <p className="sidebar-title">Categories</p>
        <Suspense fallback={<CategoryLinks categories={categories} />}>
          <CategoryBar categories={categories} />
        </Suspense>
      </aside>
      <div className="menu-content">{children}</div>
      <OrderPanel />
      <MobileCartBar />
    </div>
  );
}
