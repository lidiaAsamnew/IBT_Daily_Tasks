"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/app/providers";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/orders", label: "Orders" },
  { href: "/checkout", label: "Checkout" },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { count } = useCart();
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const cartActive = pathname.startsWith("/cart");

  return (
    <ul className="flex flex-wrap items-center gap-1 text-sm font-medium">
      {links.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            aria-current={isActive(l.href) ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 ${isActive(l.href) ? "bg-cream text-forest-deep" : "hover:bg-white/10"}`}
          >
            {l.label}
          </Link>
        </li>
      ))}
      <li>
        <Link
          href="/cart"
          aria-current={cartActive ? "page" : undefined}
          className={`rounded-full px-4 py-1.5 ${cartActive ? "bg-cream text-forest-deep" : "hover:bg-white/10"}`}
        >
          Cart{count > 0 ? ` (${count})` : ""}
        </Link>
      </li>
    </ul>
  );
}
