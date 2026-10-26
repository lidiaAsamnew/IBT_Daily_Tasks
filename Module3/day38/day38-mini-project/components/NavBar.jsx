import Link from "next/link";
import NavLinks from "./NavLinks";

export default function NavBar() {
  return (
    <header className="bg-forest-deep text-cream">
      <nav aria-label="Main" className="wrap flex flex-wrap items-center justify-between gap-3 py-3">
        <Link href="/" className="font-display text-2xl font-semibold">Addis Eats</Link>
        <NavLinks />
      </nav>
    </header>
  );
}
