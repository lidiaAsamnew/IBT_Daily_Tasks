"use client";

// Context needs state, so it is a client component. Keeping it in its own file keeps the root layout
// a server component: `children` is passed IN, so every page below is still rendered on the server (Day 38).
import { SWRConfig } from "swr";
import { CartProvider } from "./cart-context";
import { fetcher } from "@/lib/fetcher";

export default function Providers({ children }) {
  return (
    <SWRConfig value={{ fetcher, dedupingInterval: 2000, errorRetryCount: 2 }}>
      <CartProvider>{children}</CartProvider>
    </SWRConfig>
  );
}
