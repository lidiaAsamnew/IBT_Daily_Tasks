import { SITE_NAME, SITE_DESCRIPTION, absoluteUrl } from "./site";
import { dishes } from "./dishes";
import { etb } from "./format";

// MenuItem for one dish, built from the SAME object the page renders (name, price, description, image).
// The page shows "ETB {dish.price}", so price and priceCurrency here say the same thing.
export function dishJsonLd(dish) {
  return {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    image: absoluteUrl(dish.image),
    url: absoluteUrl(`/menu/${dish.id}`),
    offers: { "@type": "Offer", price: dish.price, priceCurrency: "ETB" },
  };
}

// Restaurant for the home page. Only facts the site actually states: no address, phone or opening
// hours are invented - add them here when the business has real ones.
export function restaurantJsonLd() {
  const prices = dishes.map((d) => d.price);
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    image: absoluteUrl("/dishes/hero.webp"),
    servesCuisine: "Ethiopian",
    areaServed: { "@type": "City", name: "Addis Ababa" },
    priceRange: `${etb(Math.min(...prices))}-${etb(Math.max(...prices))}`,
    hasMenu: { "@type": "Menu", url: absoluteUrl("/menu") },
  };
}
