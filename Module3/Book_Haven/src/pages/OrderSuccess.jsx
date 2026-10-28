import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState } from '../components/States.jsx';
import { Totals } from './Cart.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import { getOrder } from '../store/orders.js';
import { formatETB } from '../utils/pricing.js';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const order = useMemo(() => getOrder(orderId), [orderId]); // survives refresh (localStorage)
  useDocumentTitle('Order confirmation');

  if (!order) {
    return <EmptyState title="Order not found" actionLabel="Back to the store" to="/books">We have no saved order with the number {orderId} on this device.</EmptyState>;
  }
  return (
    <>
      <h1>Thank you, {order.customer.fullName}!</h1>
      <p role="status">Your demo order <strong>{order.id}</strong> was saved on this device. It was not sent to a real store.</p>
      <ul className="plain">{order.items.map((i) => <li key={i.id}>{i.qty} x {i.title} - {formatETB(i.price * i.qty)}</li>)}</ul>
      <Totals totals={order.totals} promo={order.promo} />
      <p className="muted">Delivery to {order.customer.address}, {order.customer.city} - {order.payment === 'cod' ? 'Cash on delivery' : 'Mobile money (simulated)'}</p>
    </>
  );
}
