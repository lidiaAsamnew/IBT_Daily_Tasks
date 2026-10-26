"use client";

import { usePathname, useSearchParams } from "next/navigation";
import CategoryLinks from "./CategoryLinks";

// Client leaf: the only thing it adds is "which category is selected", read from the URL.
export default function CategoryBar({ categories }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const requested = params.get("category") ?? "";
  const active = pathname === "/menu" && categories.includes(requested) ? requested : "";
  return <CategoryLinks categories={categories} active={pathname === "/menu" ? active : null} />;
}
