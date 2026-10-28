import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { listAllOrders } from "@/lib/orders";
import { privateMetadata } from "@/lib/seo";
import { etb, when } from "@/lib/format";

// Private: a clear tab title, noindex, and absent from the sitemap and disallowed in robots.js.
export const metadata = privateMetadata({ title: "Kitchen", description: "Addis Eats kitchen board: every order and its stage. Staff only." });

// Staff only. The role is checked HERE, on the server, before any order is read. Hiding the
// nav link (AccountMenu) is only tidiness: typing /kitchen as a customer still lands on the
// refusal below, and no order data is ever fetched or sent.
export default async function KitchenPage() {
  const user = await getSession();
  if (!user) redirect("/signin?next=/kitchen");

  if (user.role !== "staff") {
    return (
      <div className="wrap pt-16">
        <section role="alert" className="mx-auto max-w-lg rounded-2xl border border-berbere/30 bg-white p-8 text-center">
          <h1 className="text-3xl font-semibold text-berbere">Staff only</h1>
          <p className="mt-3 text-muted">Your account ({user.name}) is not allowed to open the kitchen.</p>
          <Link href="/" className="btn btn-green mt-6">Back to the home page</Link>
        </section>
      </div>
    );
  }

  const orders = listAllOrders();
  const open = orders.filter((o) => !["delivered", "cancelled"].includes(o.stage));

  return (
    <div className="wrap pt-12">
      <h1 className="text-4xl font-semibold">Kitchen</h1>
      <p className="mb-8 mt-2 text-muted">
        {open.length} open of {orders.length} orders. Reload to refresh. Signed in as {user.name}.
      </p>

      {orders.length === 0 ? (
        <p className="rounded-2xl border border-injera bg-white p-6 text-muted">No orders yet.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {orders.map((o) => (
            <li key={o.id} className="flex flex-col gap-2 rounded-2xl border border-injera bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-display text-lg font-semibold">{o.id}</span>
                <span className="rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold capitalize text-forest">{o.stage}</span>
              </div>
              <p className="text-sm text-muted">{o.customer} - {o.phone} - {o.area}</p>
              <p>{o.items.map((i) => `${i.name} x ${i.qty}`).join(", ")}</p>
              <p className="flex items-center justify-between font-semibold text-forest"><span>{etb(o.total)}</span><span className="text-xs font-normal text-muted">Placed {when(o.createdAt)}</span></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
