import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import Cover from '../components/Cover.jsx';
import { EmptyState } from '../components/States.jsx';
import { useCart } from '../hooks/useCart.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { formatETB } from '../utils/pricing.js';

export function Totals({ totals, promo }) {
  return (
    <dl className="totals">
      <div><dt>Subtotal</dt><dd>{formatETB(totals.subtotal)}</dd></div>
      {totals.discount > 0 && <div><dt>Discount ({promo})</dt><dd>-{formatETB(totals.discount)}</dd></div>}
      <div><dt>Delivery (demo)</dt><dd>{totals.delivery === 0 ? 'Free' : formatETB(totals.delivery)}</dd></div>
      <div className="totals__final"><dt>Total</dt><dd>{formatETB(totals.total)}</dd></div>
    </dl>
  );
}

export default function Cart() {
  useDocumentTitle('Cart');
  const { items, totals, promo, setQty, remove, clear, applyPromo } = useCart();
  const [code, setCode] = useState('');
  const [promoMsg, setPromoMsg] = useState('');

  if (items.length === 0) {
    return <EmptyState title="Your cart is empty" actionLabel="Continue shopping" to="/books">Find something good to read.</EmptyState>;
  }
  const tryPromo = (e) => {
    e.preventDefault();
    applyPromo(code);
    setPromoMsg(code.trim().toUpperCase() === 'BOOK10' ? 'Code applied: 10% off.' : 'That code is not valid. Try BOOK10.');
  };

  return (
    <>
      <h1>Your cart</h1>
      <div className="cart">
        <ul className="lines">
          {items.map((i) => (
            <li key={i.id} className="line">
              <div className="line__cover"><Cover book={i} /></div>
              <div className="line__info">
                <Link to={`/books/${i.id}`}>{i.title}</Link>
                <p className="muted small">{formatETB(i.price)} each (demo price)</p>
                <div className="row">
                  <button className="icon-btn" aria-label={`Decrease quantity of ${i.title}`} disabled={i.qty <= 1} onClick={() => setQty(i.id, i.qty - 1)}>-</button>
                  <span aria-live="polite" aria-label={`Quantity ${i.qty}`}>{i.qty}</span>
                  <button className="icon-btn" aria-label={`Increase quantity of ${i.title}`} disabled={i.qty >= i.stock} onClick={() => setQty(i.id, i.qty + 1)}>+</button>
                  {i.qty >= i.stock && <span className="small muted">Max available</span>}
                </div>
              </div>
              <div className="line__end">
                <strong>{formatETB(i.price * i.qty)}</strong>
                <button className="icon-btn" aria-label={`Remove ${i.title} from cart`} onClick={() => remove(i.id)}><Trash2 size={18} aria-hidden="true" /></button>
              </div>
            </li>
          ))}
        </ul>
        <aside className="summary" aria-label="Order summary">
          <h2>Summary</h2>
          <form className="with-btn" onSubmit={tryPromo}>
            <label htmlFor="promo" className="sr">Promo code</label>
            <input id="promo" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Promo code (BOOK10)" />
            <button className="btn btn--sm" type="submit">Apply</button>
          </form>
          {promoMsg && <p className="small" role="status">{promoMsg}</p>}
          <Totals totals={totals} promo={promo} />
          <Link className="btn" to="/checkout">Proceed to checkout</Link>
          <button className="btn btn--ghost" onClick={clear}>Clear cart</button>
          <Link to="/books" className="small">Continue shopping</Link>
        </aside>
      </div>
    </>
  );
}
