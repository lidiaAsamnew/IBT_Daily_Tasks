import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "../AddToCartButton";
import JsonLd from "@/components/JsonLd";
import { getDish, getDishes } from "@/lib/dishes";
import { etb } from "@/lib/format";
import { SITE, siteUrl } from "@/lib/site";

// Every dish is known at build time, so each one becomes a static page (Day 37).
// A dish added after the build is still rendered on first request, then cached.
export async function generateStaticParams() {
  const dishes = await getDishes();
  return dishes.map((d) => ({ id: String(d.id) }));
}

// Runs on the server before the page; getDish is cached per render, so this costs no second lookup (Day 44).
export async function generateMetadata({ params }) {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) return { title: "Dish not found", robots: { index: false } };
  const description = `${dish.name} — ${etb(dish.price)}. ${dish.description}`;
  return {
    title: dish.name,
    description,
    alternates: { canonical: `/menu/${dish.id}` },
    openGraph: { title: `${dish.name} · ${SITE.name}`, description, type: "website", url: `/menu/${dish.id}` },
  };
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) notFound();

  // Generated from the SAME object the page renders — structured data that disagrees with the page
  // costs you the rich result (Day 44).
  const menuItem = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    image: `${siteUrl()}${dish.image}`,
    suitableForDiet: dish.category === "Vegetarian" ? "https://schema.org/VegetarianDiet" : undefined,
    offers: { "@type": "Offer", price: dish.price, priceCurrency: "ETB" },
  };

  return (
    <article className="dish-detail">
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <Link href="/menu">Menu</Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{dish.name}</span>
      </nav>
      <div className="dish-detail-grid">
        <div className="dish-detail-media">
          <Image
            src={dish.image}
            alt={dish.alt ?? dish.name}
            fill
            sizes="(max-width: 900px) 100vw, 480px"
            priority
            className="dish-img"
          />
        </div>
        <div className="dish-detail-info">
          <div className="chips">
            <span className="chip">{dish.category}</span>
            {dish.spicy && <span className="chip chip-spicy">Spicy</span>}
          </div>
          <h1>{dish.name}</h1>
          <p className="lede">{dish.description}</p>
          <p className="price price--lg">{etb(dish.price)}</p>
          <div className="actions">
            <AddToCartButton dish={dish} large />
            <Link href="/cart" className="btn btn-ghost btn-lg">View cart</Link>
          </div>
        </div>
      </div>
      <JsonLd data={menuItem} />
    </article>
  );
}
