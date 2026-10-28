import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCartButton from "../AddToCartButton";
import JsonLd from "@/components/JsonLd";
import { dishJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { dishes, getDish } from "@/lib/dishes";
import { etb } from "@/lib/format";

// Tell Next.js every id we know at build time -> one static HTML page per dish.
// An id that is not listed (e.g. /menu/pizza) is rendered on request, and
// notFound() below turns it into the not-found screen.
// Same one-hour window as /menu: a dish page should never show a price the menu has
// already corrected. generateStaticParams still builds every page at build time.
export const revalidate = 3600;

export function generateStaticParams() {
  return dishes.map((d) => ({ id: d.id }));
}

// Runs on the server before the page, with the same params. getDish is a plain lookup here, so calling it
// in both places costs nothing (with a real database call, React/Next would dedupe it within the render).
// Name, price and description all come from the dish record, so no two dishes share a description.
export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = getDish(id);
  if (!dish) return { title: "Dish not found", robots: { index: false } };

  return pageMetadata({
    title: dish.name,
    description: `${dish.name} — ${etb(dish.price)}. ${dish.description}`,
    path: `/menu/${dish.id}`,
  });
}

export default async function DishPage({ params }) {
  const { id } = await params; // Next.js 15+: params is a Promise
  const dish = getDish(id);

  if (!dish) notFound();

  return (
    <div>
      <JsonLd data={dishJsonLd(dish)} />
      <Link href="/menu" className="text-sm font-semibold text-forest underline">Back to the menu</Link>
      <div className="mt-6 grid items-center gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-injera/50">
          <Image
            src={dish.image}
            alt={dish.alt}
            width={800}
            height={600}
            sizes="(max-width: 768px) 100vw, 560px"
            className="h-auto w-full"
          />
        </div>
        <div>
          <div className="flex gap-2 text-xs font-semibold">
            <span className="rounded-full bg-forest/10 px-3 py-1 text-forest">{dish.category}</span>
            {dish.spicy && <span className="rounded-full bg-berbere/10 px-3 py-1 text-berbere">Spicy</span>}
          </div>
          <h1 className="mt-3 text-4xl font-semibold">{dish.name}</h1>
          <p className="mt-4 text-lg text-muted">{dish.description}</p>
          <p className="mt-6 font-display text-3xl font-semibold text-forest">{etb(dish.price)}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton dish={{ id: dish.id, name: dish.name, price: dish.price }} />
            <Link href="/cart" className="btn btn-ghost">View cart</Link>
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
