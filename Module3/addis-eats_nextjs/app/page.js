import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import DishGrid from "./menu/DishGrid";
import { getDishes } from "@/lib/dishes";
import { SITE, siteUrl } from "@/lib/site";

// Static: nothing here depends on who is asking, and the story rarely changes (Day 37).
export const metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  const specials = (await getDishes()).filter((d) => d.special);

  const restaurant = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE.name,
    url: siteUrl(),
    description: SITE.description,
    servesCuisine: "Ethiopian",
    telephone: SITE.phone,
    image: `${siteUrl()}/assets/hero.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address,
      addressLocality: SITE.locality,
      addressCountry: SITE.country,
    },
  };

  return (
    <>
      <section className="hero">
        {/* Full-bleed photo behind the copy. priority: it is the largest image above the fold (Day 43). */}
        <Image
          src="/assets/tibs.jpg"
          alt=""
          fill
          sizes="100vw"
          priority
          className="hero-bg"
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="container hero-inner">
          <div className="hero-copy">
            <h1>Ethiopian food, delivered across Addis</h1>
            <p className="lede">
              Order doro wat, shiro, tibs and more from the kitchens you love. Pick your area, place the order, and
              follow it on the map until it arrives.
            </p>
            <div className="actions">
              <Link href="/menu" className="btn btn-primary btn-lg">Order now</Link>
              <Link href="/cart" className="btn btn-light btn-lg">View cart</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container section" aria-labelledby="specials-title">
        <div className="section-head">
          <h2 id="specials-title">Today&rsquo;s specials</h2>
          <Link href="/menu" className="text-link">See the full menu</Link>
        </div>
        <div className="specials">
          <DishGrid dishes={specials} />
        </div>
      </section>

      <section className="container section" aria-labelledby="why-title">
        <h2 id="why-title">How it works</h2>
        <ol className="steps">
          <li>
            <span className="step-num" aria-hidden="true">1</span>
            <h3>Pick your dishes</h3>
            <p>Search the menu or filter by category. Your cart is saved on your phone, even if you close the tab.</p>
          </li>
          <li>
            <span className="step-num" aria-hidden="true">2</span>
            <h3>Order in a minute</h3>
            <p>Sign in, tell us where to deliver, and place the order. Pressing the button twice never orders twice.</p>
          </li>
          <li>
            <span className="step-num" aria-hidden="true">3</span>
            <h3>Follow it live</h3>
            <p>Watch the status change and see the courier move on the map until your food arrives.</p>
          </li>
        </ol>
      </section>

      <JsonLd data={restaurant} />
    </>
  );
}
