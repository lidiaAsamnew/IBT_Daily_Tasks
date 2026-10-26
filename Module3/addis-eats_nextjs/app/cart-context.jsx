"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { cartActions, cartTotals, getServerSnapshot, getSnapshot, subscribe } from "@/lib/cart-store";

export const CartContext = createContext(null);
const noopSubscribe = () => () => {};

export function CartProvider({ children }) {
  const { items } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // false while rendering on the server and during hydration, true afterwards — lets screens show a
  // placeholder instead of flashing "your cart is empty" before localStorage has been read.
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const value = useMemo(() => ({ items, ready, ...cartTotals(items), ...cartActions }), [items, ready]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <Providers>");
  return ctx;
}
