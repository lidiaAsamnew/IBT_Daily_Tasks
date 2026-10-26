// Site-wide constants. The contact details are the ones from the original footer.
export const SITE = {
  name: "Addis Eats",
  tagline: "Ethiopian food delivery in Addis Ababa",
  description:
    "Order Doro Wat, Shiro, Tibs and more from kitchens across Addis Ababa. Pick your area, place the order and follow the delivery live.",
  owner: "Lidia Asamnew",
  contactName: "AphoLi",
  phone: "0900023344",
  address: "Ferensay legasiyon, Addis Ababa",
  locality: "Addis Ababa",
  country: "ET",
};

/**
 * The absolute origin of the deployed site, used for metadataBase, the sitemap and robots.
 * Order: explicit NEXT_PUBLIC_SITE_URL -> Vercel production domain -> Vercel preview URL -> localhost.
 * (Day 44: a wrong or missing origin is the #1 reason social previews arrive without an image.)
 */
export function siteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
