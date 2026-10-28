import { beforeEach, describe, expect, it } from 'vitest';
import { createOrder, getOrder, readOrders } from '../store/orders.js';

const items = [{ id: 'a', title: 'A', price: 500, qty: 2, stock: 5 }];
const customer = { fullName: 'Abebe', email: 'a@b.co', phone: '0911234567', address: 'Bole', city: 'Addis Ababa' };

beforeEach(() => localStorage.clear());

describe('orders', () => {
  it('creates, saves and retrieves an order with recomputed totals', () => {
    const o = createOrder({ items, promo: '', customer, payment: 'cod' });
    expect(o.totals.total).toBe(1100);
    expect(getOrder(o.id).customer.fullName).toBe('Abebe');
    expect(readOrders()).toHaveLength(1);
  });
  it('refuses empty carts', () => {
    expect(() => createOrder({ items: [], promo: '', customer, payment: 'cod' })).toThrow();
  });
  it('returns null for unknown ids and survives corrupted storage', () => {
    expect(getOrder('nope')).toBeNull();
    localStorage.setItem('bookhaven-orders', '{broken');
    expect(readOrders()).toEqual([]);
  });
});
