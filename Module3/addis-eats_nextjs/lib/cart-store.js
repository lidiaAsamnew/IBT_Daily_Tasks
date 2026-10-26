// The cart: a tiny external store, persisted to localStorage (client only).
// It is consumed with useSyncExternalStore (see app/cart-context.jsx), which handles server rendering
// (always an empty cart) and hydration without a mismatch.
// Prices here are for DISPLAY only — the server re-prices every order from the real menu.
import { MAX_QUANTITY } from "./constants.js";

const KEY = "addis-eats-cart-v1";
const EMPTY = Object.freeze({ items: Object.freeze([]) });

let state = EMPTY;
let loaded = false;
const listeners = new Set();

function sanitize(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((i) => i && Number.isInteger(i.id) && typeof i.name === "string" && Number.isFinite(i.price))
    .map((i) => ({
      id: i.id,
      name: i.name.slice(0, 80),
      price: i.price,
      image: typeof i.image === "string" ? i.image : "",
      quantity: Math.min(MAX_QUANTITY, Math.max(1, Math.trunc(Number(i.quantity)) || 1)),
    }));
}

function read() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? sanitize(JSON.parse(raw)) : [];
  } catch {
    return []; // private mode or corrupt value: start empty rather than crash
  }
}

function commit(items) {
  state = { items };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage full or blocked — the cart still works for this tab */
  }
  listeners.forEach((l) => l());
}

export function getSnapshot() {
  if (!loaded && typeof window !== "undefined") {
    loaded = true;
    state = { items: read() };
  }
  return state;
}

export const getServerSnapshot = () => EMPTY;

export function subscribe(listener) {
  listeners.add(listener);
  const onStorage = (e) => {
    if (e.key === KEY || e.key === null) {
      state = { items: read() };
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export const cartActions = {
  add(dish) {
    const items = [...getSnapshot().items];
    const i = items.findIndex((x) => x.id === dish.id);
    if (i >= 0) items[i] = { ...items[i], quantity: Math.min(MAX_QUANTITY, items[i].quantity + 1) };
    else items.push({ id: dish.id, name: dish.name, price: dish.price, image: dish.image ?? "", quantity: 1 });
    commit(items);
  },
  setQuantity(id, quantity) {
    const q = Math.min(MAX_QUANTITY, Math.trunc(Number(quantity)) || 0);
    const items = getSnapshot().items
      .map((x) => (x.id === id ? { ...x, quantity: q } : x))
      .filter((x) => x.quantity > 0);
    commit(items);
  },
  remove(id) {
    commit(getSnapshot().items.filter((x) => x.id !== id));
  },
  clear() {
    commit([]);
  },
};

/** Test helper. */
export function resetCartForTests() {
  state = EMPTY;
  loaded = false;
  listeners.clear();
}

export const cartTotals = (items) => ({
  count: items.reduce((n, i) => n + i.quantity, 0),
  total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
});
