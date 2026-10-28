import { readJSON, writeJSON } from '../utils/storage.js';
import { computeTotals } from './cartReducer.js';

const ORDERS_KEY = 'bookhaven-orders';
export const readOrders = () => {
  const list = readJSON(ORDERS_KEY, []);
  return Array.isArray(list) ? list : [];
};

export function getOrder(id) {
  return readOrders().find((o) => o.id === id) || null;
}

// Simulated order: totals are recomputed here, nothing is sent anywhere.
export function createOrder({ items, promo, customer, payment }) {
  if (!items || items.length === 0) throw new Error('Cannot create an order from an empty cart');
  const order = {
    id: `BH-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    items: items.map(({ id, title, price, qty }) => ({ id, title, price, qty })),
    promo,
    totals: computeTotals(items, promo),
    customer, // name, email, phone, address, city, notes (no card data is ever collected)
    payment,
  };
  if (!writeJSON(ORDERS_KEY, [order, ...readOrders()])) throw new Error('Could not save the order locally');
  return order;
}
