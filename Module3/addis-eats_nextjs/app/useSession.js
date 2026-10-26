"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

/**
 * Who is signed in, for the header. Fetched on the client so the layout (and therefore every public page)
 * can stay static — reading the cookie on the server would make the whole site dynamic (Day 37).
 * Re-checked on every navigation, so signing in or out is reflected immediately.
 */
export function useSession() {
  const pathname = usePathname();
  const { data, isLoading, mutate } = useSWR("/api/me", fetcher, { revalidateOnFocus: true, shouldRetryOnError: false });
  useEffect(() => {
    mutate();
  }, [pathname, mutate]);
  return { user: data?.user ?? null, isLoading, refresh: mutate };
}
