import Link from "next/link";

// Shared by every route, so it lives outside app/ (see slide 19).
export default function NavBar() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/cart", label: "Cart" },
    { href: "/checkout", label: "Checkout" },
  ];

  return (
    <nav className="flex gap-6 border-b border-amber-900/20 bg-amber-900 px-6 py-3 text-amber-50">
      <span className="font-bold">Addis Eats</span>
      {links.map((l) => (
        <Link key={l.href} href={l.href} className="hover:underline">
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
