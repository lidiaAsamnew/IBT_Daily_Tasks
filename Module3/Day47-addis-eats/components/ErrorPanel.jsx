"use client"; // used by error.js files, which must be client components (they have a retry handler)

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

// The ERROR state: what failed, and a way to retry. reset() alone only re-renders on the client, so we
// also ask the server for fresh data with router.refresh() - otherwise "Try again" would show the same failure.
export default function ErrorPanel({ title, children, reset, backHref, backLabel }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function retry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <div className="wrap pt-12">
      <div role="alert" className="max-w-xl rounded-2xl border border-berbere/30 bg-white p-6">
        <h1 className="text-2xl font-semibold text-berbere">{title}</h1>
        <p className="mt-2 text-sm text-muted">{children}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={retry} disabled={pending} className="btn btn-green text-sm disabled:opacity-50">
            {pending ? "Trying\u2026" : "Try again"}
          </button>
          {backHref ? <Link href={backHref} className="btn btn-ghost text-sm text-forest">{backLabel}</Link> : null}
        </div>
      </div>
    </div>
  );
}
