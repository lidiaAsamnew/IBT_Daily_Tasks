// Pure cart logic (no React) so it is easy to test. Used with useReducer.
import { readJSON } from '../utils/storage.js';

export const CART_KEY = 'bookhaven-cart';
export const PROMOS = { BOOK10: 0.1 }; // demo promo code: 10% off
export const DELIVERY = { fee: 100, freeOver: 2000 }; // demo delivery rules (ETB)

export const emptyCart = { items: [], promo: '' };

const clampQty = (qty, stock) => Math.max(1, Math.min(Number.isFinite(qty) ? Math.floor(qty) : 1, stock));

export function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { book, qty = 1 } = action;
      if (!book || !(book.stock > 0)) return state;
      const existing = state.items.find((i) => i.id === book.id);
      const line = {
        id: book.id, title: book.title, authors: book.authors, thumbnail: book.thumbnail,
        price: book.price, stock: book.stock,
        qty: clampQty((existing?.qty || 0) + qty, book.stock),
      };
      const items = existing ? state.items.map((i) => (i.id === book.id ? line : i)) : [...state.items, line];
      return { ...state, items };
    }
    case 'setQty':
      return { ...state, items: state.items.map((i) => (i.id === action.id ? { ...i, qty: clampQty(action.qty, i.stock) } : i)) };
    case 'remove':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'promo': {
      const code = String(action.code || '').trim().toUpperCase();
      return { ...state, promo: PROMOS[code] ? code : '' };
    }
    case 'clear':
      return emptyCart;
    default:
      return state;
  }
}

export function computeTotals(items, promo = '') {
  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = Math.round(subtotal * (PROMOS[promo] || 0));
  const afterDiscount = subtotal - discount;
  const delivery = items.length === 0 || afterDiscount >= DELIVERY.freeOver ? 0 : DELIVERY.fee;
  return { count, subtotal, discount, delivery, total: afterDiscount + delivery };
}

// Defends against corrupted / outdated localStorage data.
export function sanitizeCart(raw) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.items)) return emptyCart;
  const items = raw.items
    .filter((i) => i && typeof i.id === 'string' && typeof i.title === 'string'
      && Number.isFinite(i.price) && i.price >= 0 && Number.isInteger(i.stock) && i.stock > 0 && Number.isFinite(i.qty))
    .map((i) => ({ ...i, authors: Array.isArray(i.authors) ? i.authors : [], qty: clampQty(i.qty, i.stock) }));
  return { items, promo: PROMOS[raw.promo] ? raw.promo : '' };
}

export const initCart = () => sanitizeCart(readJSON(CART_KEY, null));
