import Link from "next/link";
import NavLinks from "./NavLinks";
import AccountMenu from "./AccountMenu";

export default function NavBar() {
  return (
    <header className="bg-forest-deep text-cream">
      <nav aria-label="Main" className="wrap flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
        <Link href="/" className="font-display text-2xl font-semibold">Addis Eats</Link>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <NavLinks />
          <AccountMenu />
        </div>
      </nav>
    </header>
  );
}
