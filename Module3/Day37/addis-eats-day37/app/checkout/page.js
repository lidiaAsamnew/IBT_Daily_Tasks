import Link from "next/link";
import { cookies } from "next/headers";
import OrderSummary from "@/components/OrderSummary";

const next = [
  "You confirm your delivery address.",
  "The kitchen starts cooking your order.",
  "A courier brings it to your door.",
];

export default async function CheckoutPage() {
  // WHY THIS ROUTE IS DYNAMIC: cookies() reads the incoming request, and a
  // prebuilt page has no request. Any cookies() call makes the whole route render
  // on every request - the build marker changes from static (circle) to dynamic.
  const cookieStore = await cookies(); // Next.js 15+: cookies() is async
  const session = cookieStore.get("session")?.value;

  return (
    <div className="wrap pt-12">
      <h1 className="text-4xl font-semibold">Checkout</h1>
      <p className="mb-6 mt-2 text-muted">Review your order before it is placed.</p>

      <p className="mb-8 inline-block rounded-full bg-forest/10 px-4 py-1.5 text-sm font-medium text-forest">
        {session ? `Ordering as ${session}` : "Ordering as a guest (no session cookie found)"}
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        <OrderSummary />
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
  );
}
