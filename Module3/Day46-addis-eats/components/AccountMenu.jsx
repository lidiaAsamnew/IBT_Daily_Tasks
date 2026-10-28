"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { signOut } from "@/app/actions";

// Asks /api/session who is signed in, so the layout never reads cookies and every
// public page stays static. The key includes the pathname: each navigation re-checks.
// Showing the Kitchen link is cosmetic - /kitchen refuses non-staff on the server.
export default function AccountMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { data, mutate } = useSWR(["/api/session", pathname], ([url]) => fetcher(url), { keepPreviousData: true });

  if (!data) return <span className="h-8 w-24" aria-hidden="true" />; // reserve the space, avoid a flash
  const user = data.user;

  if (!user) {
    return <Link href="/signin" className="btn btn-primary px-4 py-1.5 text-sm">Sign in</Link>;
  }

  function onSignOut() {
    startTransition(async () => {
      await signOut();
      await mutate();
      router.push("/");
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {user.role === "staff" && (
        <>
          <Link href="/kitchen" aria-current={pathname.startsWith("/kitchen") ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 font-medium ${pathname.startsWith("/kitchen") ? "bg-cream text-forest-deep" : "hover:bg-white/10"}`}>
            Kitchen
          </Link>
          <Link href="/dashboard" aria-current={pathname.startsWith("/dashboard") ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 font-medium ${pathname.startsWith("/dashboard") ? "bg-cream text-forest-deep" : "hover:bg-white/10"}`}>
            Dashboard
          </Link>
        </>
      )}
      <span className="hidden rounded-full bg-white/10 px-3 py-1 sm:inline">{user.name.split(" ")[0]}</span>
      <button type="button" onClick={onSignOut} disabled={pending} className="rounded-full border border-cream/40 px-3 py-1 hover:bg-white/10 disabled:opacity-50">
        {pending ? "..." : "Sign out"}
      </button>
    </div>
  );
}
