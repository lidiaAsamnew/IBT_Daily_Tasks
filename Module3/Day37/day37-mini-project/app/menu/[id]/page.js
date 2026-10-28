import Link from "next/link";
import { notFound } from "next/navigation";
import DishArt from "@/components/DishArt";
import { dishes, getDish } from "@/lib/dishes";

// Tell Next.js every id we know at build time -> one static HTML page per dish.
// An id that is not listed (e.g. /menu/pizza) is rendered on request, and
// notFound() below turns it into the not-found screen.
// Same one-hour window as /menu: a dish page should never show a price the menu has
// already corrected. generateStaticParams still builds every page at build time.
export const revalidate = 3600;

export function generateStaticParams() {
  return dishes.map((d) => ({ id: d.id }));
}

export default async function DishPage({ params }) {
  const { id } = await params; // Next.js 15+: params is a Promise
  const dish = getDish(id);

  if (!dish) notFound();

  return (
    <div>
      <Link href="/menu" className="text-sm font-semibold text-forest underline">Back to the menu</Link>
      <div className="mt-6 grid items-center gap-8 md:grid-cols-2">
        <div className="rounded-3xl bg-injera/50 p-8">
          <DishArt palette={dish.palette} className="mx-auto h-56 w-56 drop-shadow-lg" />
        </div>
        <div>
          <div className="flex gap-2 text-xs font-semibold">
            <span className="rounded-full bg-forest/10 px-3 py-1 text-forest">{dish.category}</span>
            {dish.spicy && <span className="rounded-full bg-berbere/10 px-3 py-1 text-berbere">Spicy</span>}
          </div>
          <h1 className="mt-3 text-4xl font-semibold">{dish.name}</h1>
          <p className="mt-4 text-lg text-muted">{dish.description}</p>
          <p className="mt-6 font-display text-3xl font-semibold text-forest">ETB {dish.price}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/cart" className="btn btn-green">View cart</Link>
            <Link href="/menu" className="btn btn-ghost">More dishes</Link>
          </div>
          <p className="mt-8 text-sm text-muted">
            Route parameter <code className="rounded bg-injera px-1.5 py-0.5">id</code> = <code className="rounded bg-injera px-1.5 py-0.5">{id}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
