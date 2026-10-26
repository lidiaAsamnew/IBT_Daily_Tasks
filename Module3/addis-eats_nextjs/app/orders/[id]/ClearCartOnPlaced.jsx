"use client";

import { useEffect } from "react";
import { useCart } from "../../cart-context";

// The order is safely stored; now the cart can be emptied (the checkout redirect lands here with ?placed=1).
export default function ClearCartOnPlaced() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
