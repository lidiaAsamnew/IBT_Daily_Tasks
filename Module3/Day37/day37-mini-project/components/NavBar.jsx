"use client"; // usePathname highlights the current page
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
];

export default function NavBar() {
  const pathname = usePathname();
  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="bg-forest-deep text-cream">
      <nav aria-label="Main" className="wrap flex flex-wrap items-center justify-between gap-3 py-3">
        <Link href="/" className="font-display text-2xl font-semibold">Addis Eats</Link>
        <ul className="flex flex-wrap gap-1 text-sm font-medium">
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
        </ul>
      </nav>
    </header>
  );
}
