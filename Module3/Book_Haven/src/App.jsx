import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';

// Lazy loading: these pages download only when first visited (see <Suspense> in Layout).
const Catalog = lazy(() => import('./pages/Catalog.jsx'));
const BookDetails = lazy(() => import('./pages/BookDetails.jsx'));
const Wishlist = lazy(() => import('./pages/Wishlist.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess.jsx'));
const StateLab = lazy(() => import('./pages/StateLab.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="books" element={<Catalog />} />
        <Route path="books/:bookId" element={<BookDetails />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="checkout/success/:orderId" element={<OrderSuccess />} />
        <Route path="lab/state-management" element={<StateLab />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
