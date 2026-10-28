import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Field from '../components/Field.jsx';
import { EmptyState } from '../components/States.jsx';
import { Totals } from './Cart.jsx';
import { useCart } from '../hooks/useCart.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { createOrder } from '../store/orders.js';

const PHONE = /^(\+251|0)[79]\d{8}$/;

export default function Checkout() {
  useDocumentTitle('Checkout');
  const { items, promo, totals, clear } = useCart();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues: { payment: 'cod' } });
  const busy = useRef(false); // blocks double-clicks even before React re-renders
  const [submitError, setSubmitError] = useState('');

  if (items.length === 0) {
    return <EmptyState title="Your cart is empty" actionLabel="Browse books" to="/books">Add a book before checking out.</EmptyState>;
  }

  const onSubmit = async ({ payment, ...customer }) => {
    if (busy.current) return;
    busy.current = true;
    setSubmitError('');
    try {
      await new Promise((r) => setTimeout(r, 600)); // simulated processing
      const order = createOrder({ items, promo, customer, payment });
      clear(); // only after the order was saved
      navigate(`/checkout/success/${order.id}`, { replace: true });
    } catch (e) {
      setSubmitError(e.message);
      busy.current = false;
    }
  };

  return (
    <>
      <h1>Checkout</h1>
      <p className="notice">This is a demo. No payment is taken and no order is sent to a real store.</p>
      <div className="cart">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="form">
          <Field id="fullName" label="Full name" error={errors.fullName} register={register} rules={{ required: 'Full name is required' }} autoComplete="name" />
          <Field id="email" label="Email" type="email" error={errors.email} register={register} autoComplete="email"
            rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } }} />
          <Field id="phone" label="Phone (e.g. 0911234567)" type="tel" error={errors.phone} register={register} autoComplete="tel"
            rules={{ required: 'Phone number is required', validate: (v) => PHONE.test(v.replace(/\s/g, '')) || 'Enter a valid Ethiopian phone number' }} />
          <Field id="address" label="Delivery address" error={errors.address} register={register} rules={{ required: 'Delivery address is required' }} />
          <Field id="city" label="City" error={errors.city} register={register} rules={{ required: 'City is required' }} />
          <Field id="notes" label="Delivery instructions (optional)" as="textarea" rows={3} error={errors.notes} register={register} />
          <Field id="payment" label="Payment method (simulated)" as="select" error={errors.payment} register={register}>
            <option value="cod">Cash on delivery</option>
            <option value="mobile">Mobile money (simulated)</option>
          </Field>
          {submitError && <p className="field__err" role="alert">Error: {submitError}</p>}
          <button className="btn" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Placing order...' : 'Place demo order'}</button>
        </form>
        <aside className="summary" aria-label="Order summary">
          <h2>Your order</h2>
          <ul className="plain">{items.map((i) => <li key={i.id}>{i.qty} x {i.title}</li>)}</ul>
          <Totals totals={totals} promo={promo} />
        </aside>
      </div>
    </>
  );
}
