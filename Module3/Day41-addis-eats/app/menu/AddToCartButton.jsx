"use client";

import { useCart } from "@/app/providers";

export default function AddToCartButton({ dish, className = "btn btn-green text-sm" }) {
  const { add } = useCart();
  return (
    <button type="button" onClick={() => add(dish)} className={className}>
      Add to cart
    </button>
  );
}
