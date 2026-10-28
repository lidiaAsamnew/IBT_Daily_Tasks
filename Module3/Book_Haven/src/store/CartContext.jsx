import { createContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { CART_KEY, cartReducer, computeTotals, initCart } from './cartReducer.js';
import { writeJSON } from '../utils/storage.js';

export const CartContext = createContext(null);

// Context + useReducer: cart state is shared by header, cards, cart and checkout.
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, initCart);
  const [toast, setToast] = useState('');
  const timer = useRef();

  useEffect(() => { writeJSON(CART_KEY, state); }, [state]); // persist
  useEffect(() => () => clearTimeout(timer.current), []); // cleanup timer

  const value = useMemo(() => {
    const notify = (msg) => {
      setToast(msg);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setToast(''), 2500);
    };
    return {
      items: state.items,
      promo: state.promo,
      totals: computeTotals(state.items, state.promo),
      add: (book, qty = 1) => { dispatch({ type: 'add', book, qty }); notify(`Added "${book.title}" to cart`); },
      remove: (id) => dispatch({ type: 'remove', id }),
      setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
      clear: () => dispatch({ type: 'clear' }),
      applyPromo: (code) => dispatch({ type: 'promo', code }),
      qtyOf: (id) => state.items.find((i) => i.id === id)?.qty || 0,
    };
  }, [state]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <div className="toast" role="status" aria-live="polite">{toast}</div>
    </CartContext.Provider>
  );
}
CartProvider.propTypes = { children: PropTypes.node };
