import Link from "next/link";
import OrderSummary from "@/components/OrderSummary";
import CheckoutButton from "./CheckoutButton";

export default function CartPage() {
  return (
    <div className="wrap pt-12">
      <h1 className="text-4xl font-semibold">Your cart</h1>
      <p className="mb-8 mt-2 text-muted">Check your order, then continue to checkout.</p>
      <div className="max-w-xl space-y-4">
        <OrderSummary />
        <CheckoutButton />
        <Link href="/menu" className="btn btn-ghost w-full text-forest">Keep browsing</Link>
      </div>
    </div>
  );
}
