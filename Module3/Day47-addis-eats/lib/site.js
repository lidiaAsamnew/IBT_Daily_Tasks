// Day 44: one place for everything a crawler or a shared link needs to know about the site.
export const SITE_NAME = "Addis Eats";
export const LOCALE = "en_ET";
export const DEFAULT_TITLE = "Addis Eats — food delivery in Addis Ababa";
export const SITE_DESCRIPTION =
  "Order Kitfo, Special Tibs, Shiro and more Ethiopian favourites. Delivered across Addis Ababa, with every order tracked to your door.";

// The PRODUCTION address. Social platforms fetch og:image from here, so a localhost value in a
// deployed build is the classic "works locally, no picture live" bug. Not a secret (it is in every
// page's HTML), so NEXT_PUBLIC_ is correct - but it is inlined at build time: change it, rebuild.
// To test cards against a local server, set NEXT_PUBLIC_SITE_URL=http://localhost:3000 in .env.local.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://addiseats.et").replace(/\/+$/, "");

// "/menu/kitfo" -> "https://addiseats.et/menu/kitfo". Used for JSON-LD and the sitemap, where
// (unlike the metadata API, which applies metadataBase itself) nothing makes a URL absolute for us.
export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
