// Checkout reads the session cookie and prices the order live, so it must be rendered on every request.
// cookies() already forces this (Day 37); saying it here makes the decision visible and survives a refactor.
export const dynamic = "force-dynamic";

export default function CheckoutLayout({ children }) {
  return children;
}
