"use client";

import Link from "next/link";
import { useCart } from "../cart-context";
import { etb } from "@/lib/format";

// On phones and tablets the side panel is hidden; this thumb-reachable bar replaces it.
export default function MobileCartBar() {
  const { count, total, ready } = useCart();
  if (!ready || count === 0) return null;
  return (
    <div className="mobile-cart-bar">
      <Link href="/cart" className="btn btn-primary btn-block btn-lg">
        View cart · {count} {count === 1 ? "item" : "items"} · {etb(total)}
      </Link>
    </div>
  );
}
