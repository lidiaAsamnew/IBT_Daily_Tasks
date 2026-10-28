import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App.jsx';
import BookCard from '../components/BookCard.jsx';
import Checkout from '../pages/Checkout.jsx';
import { CartProvider } from '../store/CartContext.jsx';
import { FALLBACK_BOOKS } from '../data/fallbackBooks.js';
import { useWishlist } from '../store/wishlistStore.js';

const inStock = FALLBACK_BOOKS.find((b) => b.stock > 0);
const wrap = (ui, path = '/') => render(<MemoryRouter initialEntries={[path]}><CartProvider>{ui}</CartProvider></MemoryRouter>);

beforeEach(() => { localStorage.clear(); useWishlist.setState({ items: [] }); });

describe('BookCard', () => {
  it('shows a labelled demo price, hides missing ratings and toggles the wishlist', async () => {
    wrap(<BookCard book={inStock} />);
    expect(screen.getByText('Demo price')).toBeInTheDocument();
    expect(screen.queryByLabelText(/Rated/)).toBeNull();
    const heart = screen.getByRole('button', { name: /add .* to wishlist/i });
    await userEvent.click(heart);
    expect(screen.getByRole('button', { name: /remove .* from wishlist/i })).toHaveAttribute('aria-pressed', 'true');
  });
  it('turns Add to cart into Remove from cart and back', async () => {
    wrap(<BookCard book={inStock} />);
    await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }));
    await userEvent.click(screen.getByRole('button', { name: 'Remove from cart' }));
    expect(screen.getByRole('button', { name: 'Add to cart' })).toBeInTheDocument();
  });
});

describe('Checkout', () => {
  it('shows an empty state when the cart is empty', () => {
    wrap(<Checkout />);
    expect(screen.getByText(/cart is empty/i)).toBeInTheDocument();
  });
  it('shows field errors for invalid input', async () => {
    localStorage.setItem('bookhaven-cart', JSON.stringify({ items: [{ id: 'x', title: 'X', authors: [], price: 400, stock: 3, qty: 1 }], promo: '' }));
    wrap(<Checkout />);
    await userEvent.click(screen.getByRole('button', { name: /place demo order/i }));
    expect(await screen.findByText(/full name is required/i)).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Email'), 'nope');
    await userEvent.type(screen.getByLabelText(/phone/i), '123');
    await userEvent.click(screen.getByRole('button', { name: /place demo order/i }));
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
    expect(screen.getByText(/valid ethiopian phone/i)).toBeInTheDocument();
  });
});

describe('routing', () => {
  it('renders the 404 page for unknown routes', async () => {
    wrap(<App />, '/definitely/not/here');
    expect(await screen.findByText(/404/)).toBeInTheDocument();
  });
  it('handles an invalid book id', async () => {
    wrap(<App />, '/books/not-a-real-id');
    expect(await screen.findByText(/book not found/i)).toBeInTheDocument();
  });
  it('shows a missing order gracefully', async () => {
    wrap(<App />, '/checkout/success/BH-NOPE');
    await waitFor(() => expect(screen.getByText(/order not found/i)).toBeInTheDocument());
  });
  it('opens and closes the mobile menu', async () => {
    wrap(<App />);
    const btn = screen.getByRole('button', { name: /open menu/i });
    await userEvent.click(btn);
    expect(screen.getByRole('navigation', { name: 'Mobile' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).toBeNull();
  });
});
