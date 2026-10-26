import { randomUUID } from "node:crypto";
import CheckoutForm from "./CheckoutForm";
import { requireUser } from "@/lib/guards";
import { findUserById } from "@/lib/users";

export const metadata = { title: "Checkout", robots: { index: false, follow: false } };

export default async function CheckoutPage() {
  const session = await requireUser("/checkout"); // layer two: the right screen for this person
  const user = await findUserById(session.id);
  return (
    <div className="container section">
      <h1>Checkout</h1>
      <p className="lede">Tell us where to deliver. You can review everything before it is sent.</p>
      {/* A fresh key per page load: pressing "Place order" twice (or replaying the request) creates ONE order. */}
      <CheckoutForm defaults={{ name: user?.name ?? session.name, phone: user?.phone ?? "" }} idempotencyKey={randomUUID()} />
    </div>
  );
}
