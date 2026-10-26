"use client";

import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
    return {
      items,
      count,
      subtotal,
      add(dish) {
        setItems((prev) => {
          const hit = prev.find((i) => i.id === dish.id);
          if (hit) return prev.map((i) => (i.id === dish.id ? { ...i, qty: i.qty + 1 } : i));
          return [...prev, { id: dish.id, name: dish.name, price: dish.price, qty: 1 }];
        });
      },
      setQty(id, qty) {
        setItems((prev) =>
          qty < 1 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i))
        );
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside Providers");
  return ctx;
}

// Isolated so layout.js stays a server component: pages arrive as children,
// so they are not imported here and are not pulled into the client bundle.
export default function Providers({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
