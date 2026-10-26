import Link from "next/link";
import { notFound } from "next/navigation";
import DishArt from "@/components/DishArt";
import { getDish } from "@/lib/dishes";

export default async function DishPage({ params }) {
  // params arrives as a prop (no hook). Next.js 15+: it is a Promise, so await it.
  const { id } = await params;
  const dish = getDish(id); // the id is a string, which matches our string ids

  if (!dish) notFound(); // renders app/not-found.js

  return (
    <div className="wrap pt-10">
      <Link href="/menu" className="text-sm font-semibold text-forest underline">Back to the menu</Link>
      <div className="mt-6 grid items-center gap-10 md:grid-cols-2">
        <div className="rounded-3xl bg-injera/50 p-10">
          <DishArt palette={dish.palette} className="mx-auto h-64 w-64 drop-shadow-lg" />
        </div>
        <div>
          <div className="flex gap-2 text-xs font-semibold">
            <span className="rounded-full bg-forest/10 px-3 py-1 text-forest">{dish.category}</span>
            {dish.spicy && <span className="rounded-full bg-berbere/10 px-3 py-1 text-berbere">Spicy</span>}
          </div>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{dish.name}</h1>
          <p className="mt-4 max-w-md text-lg text-muted">{dish.description}</p>
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
