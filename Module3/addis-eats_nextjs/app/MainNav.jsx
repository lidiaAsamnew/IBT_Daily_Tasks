"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useCart } from "./cart-context";
import { useSession } from "./useSession";
import { signOut } from "./signin/actions";

export default function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const { user, isLoading, refresh } = useSession();
  const [pending, startTransition] = useTransition();

  // The menu is "open" only on the page where it was opened, so it closes by itself on navigation
  // without an effect.
  const [openAt, setOpenAt] = useState(null);
  const open = openAt === pathname;

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));
  const link = (href, label, extra) => (
    <Link key={href} href={href} className="nav-link" aria-current={isActive(href) ? "page" : undefined}>
      {label}
      {extra}
    </Link>
  );

  function handleSignOut() {
    startTransition(async () => {
      await signOut();
      await refresh();
      router.push("/");
      router.refresh();
    });
  }

  return (
    <div className="nav-wrap" onKeyDown={(e) => e.key === "Escape" && setOpenAt(null)}>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        aria-controls="primary-nav"
        onClick={() => setOpenAt(open ? null : pathname)}
      >
        <span className="nav-toggle-bars" aria-hidden="true" />
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>

      <nav id="primary-nav" className={`nav ${open ? "nav--open" : ""}`} aria-label="Primary">
        {link("/", "Home")}
        {link("/menu", "Menu")}
        {link(
          "/cart",
          "Cart",
          count > 0 ? (
            <>
              <span className="cart-badge" aria-hidden="true">{count}</span>
              <span className="sr-only"> ({count} {count === 1 ? "item" : "items"})</span>
            </>
          ) : null,
        )}
        {user && link("/orders", "Orders")}
        {user?.role === "staff" && link("/kitchen", "Kitchen")}
        {user?.role === "staff" && link("/dashboard", "Dashboard")}

        <div className="nav-auth">
          {isLoading ? (
            <span className="nav-auth-placeholder" aria-hidden="true" />
          ) : user ? (
            <>
              <span className="nav-user">Hi, {user.name.split(" ")[0]}</span>
              <button type="button" className="btn btn-ghost" onClick={handleSignOut} disabled={pending}>
                {pending ? "Signing out…" : "Sign out"}
              </button>
            </>
          ) : (
            <>
              <Link href="/signin" className="btn btn-ghost">Sign in</Link>
              <Link href="/signup" className="btn btn-primary">Create account</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
