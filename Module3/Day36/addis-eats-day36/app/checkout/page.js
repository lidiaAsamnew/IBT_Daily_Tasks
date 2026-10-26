import Link from "next/link";

export default function CheckoutPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p>Payment details arrive in a later day.</p>
      <Link href="/cart" className="underline">Back to the cart</Link>
    </main>
  );
}
