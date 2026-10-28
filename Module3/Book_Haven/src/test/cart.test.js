import { describe, expect, it } from 'vitest';
import { cartReducer, computeTotals, emptyCart, sanitizeCart } from '../store/cartReducer.js';

const book = (o = {}) => ({ id: 'b1', title: 'Book One', authors: ['A'], thumbnail: null, price: 500, stock: 3, ...o });
const add = (s, b, qty = 1) => cartReducer(s, { type: 'add', book: b, qty });

describe('cart reducer', () => {
  it('adds a new item', () => {
    const s = add(emptyCart, book());
    expect(s.items).toHaveLength(1);
    expect(s.items[0].qty).toBe(1);
  });
  it('merges repeated additions into one line', () => {
    const s = add(add(emptyCart, book()), book());
    expect(s.items).toHaveLength(1);
    expect(s.items[0].qty).toBe(2);
  });
  it('never exceeds stock', () => {
    const s = add(emptyCart, book(), 99);
    expect(s.items[0].qty).toBe(3);
    expect(cartReducer(s, { type: 'setQty', id: 'b1', qty: 10 }).items[0].qty).toBe(3);
  });
  it('never goes below one', () => {
    const s = cartReducer(add(emptyCart, book()), { type: 'setQty', id: 'b1', qty: 0 });
    expect(s.items[0].qty).toBe(1);
  });
  it('ignores out-of-stock books', () => {
    expect(add(emptyCart, book({ stock: 0 })).items).toHaveLength(0);
  });
  it('removes and clears', () => {
    const s = add(add(emptyCart, book()), book({ id: 'b2' }));
    expect(cartReducer(s, { type: 'remove', id: 'b1' }).items).toHaveLength(1);
    expect(cartReducer(s, { type: 'clear' }).items).toHaveLength(0);
  });
});

describe('cart totals', () => {
  const items = [{ id: 'a', price: 500, qty: 2, stock: 5 }, { id: 'b', price: 300, qty: 1, stock: 5 }];
  it('computes subtotal and delivery', () => {
    expect(computeTotals(items)).toEqual({ count: 3, subtotal: 1300, discount: 0, delivery: 100, total: 1400 });
  });
  it('applies the BOOK10 discount', () => {
    const t = computeTotals(items, 'BOOK10');
    expect(t.discount).toBe(130);
    expect(t.total).toBe(1300 - 130 + 100);
  });
  it('gives free delivery over the threshold and nothing for an empty cart', () => {
    expect(computeTotals([{ id: 'a', price: 2500, qty: 1, stock: 2 }]).delivery).toBe(0);
    expect(computeTotals([]).total).toBe(0);
  });
  it('rejects unknown promo codes', () => {
    expect(cartReducer(emptyCart, { type: 'promo', code: 'nope' }).promo).toBe('');
    expect(cartReducer(emptyCart, { type: 'promo', code: ' book10 ' }).promo).toBe('BOOK10');
  });
});

describe('cart persistence safety', () => {
  it('survives garbage', () => {
    expect(sanitizeCart(null)).toEqual(emptyCart);
    expect(sanitizeCart('oops')).toEqual(emptyCart);
    expect(sanitizeCart({ items: 5 })).toEqual(emptyCart);
  });
  it('drops invalid lines and clamps quantity to stock', () => {
    const s = sanitizeCart({ items: [{ id: 'x', title: 'X', price: 100, stock: 2, qty: 9 }, { id: 5 }, null], promo: 'BAD' });
    expect(s.items).toHaveLength(1);
    expect(s.items[0].qty).toBe(2);
    expect(s.promo).toBe('');
  });
});
