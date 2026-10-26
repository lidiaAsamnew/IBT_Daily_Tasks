import Link from "next/link";
import CheckoutButton from "./CheckoutButton";

export default function CartPage() {
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Your cart</h1>
      <p>Cart contents arrive in a later day. For now this is the route.</p>
      <div className="flex items-center gap-4">
        <CheckoutButton />
        <Link href="/menu" className="underline">Keep browsing</Link>
      </div>
    </main>
  );
}
