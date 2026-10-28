import Link from "next/link";
import { redirect } from "next/navigation";
import OrderSummary from "@/components/OrderSummary";
import { getSession } from "@/lib/session";
import CheckoutForm from "./CheckoutForm";

const next = [
  "You confirm your delivery address.",
  "The kitchen starts cooking your order.",
  "A courier brings it to your door.",
];

// Forced dynamic: this page is rendered fresh for every request, never prebuilt.
// The read that requires it is getSession() below: it reads the signed "session" cookie
// from the incoming request, and a build-time page has no request to read it from.
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  // LAYER 2: middleware only saw that a cookie exists; this verifies it while rendering.
  const session = await getSession(); // <- reads cookies(): THE LINE that needs a real request
  if (!session) redirect("/signin?next=/checkout");

  return (
    <div className="wrap pt-12">
      <h1 className="text-4xl font-semibold">Checkout</h1>
      <p className="mb-6 mt-2 text-muted">Review your order before it is placed.</p>

      <p className="mb-8 inline-block rounded-full bg-forest/10 px-4 py-1.5 text-sm font-medium text-forest">
        Ordering as {session.name}
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        <OrderSummary />
        <div className="space-y-8">
          <CheckoutForm />
          <section>
          <h2 className="text-2xl font-semibold">What happens next</h2>
          <ol className="mt-4 space-y-3">
            {next.map((t, i) => (
              <li key={t} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-semibold text-white">{i + 1}</span>
                <span className="pt-0.5">{t}</span>
              </li>
            ))}
          </ol>
          <Link href="/cart" className="btn btn-ghost mt-8 text-forest">Back to the cart</Link>
          </section>
        </div>
      </div>
    </div>
  );
}
