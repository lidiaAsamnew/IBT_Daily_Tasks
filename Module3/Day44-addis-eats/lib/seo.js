import { SITE_NAME, LOCALE } from "./site";

// Metadata for a page that SHOULD be found: title, description, canonical, Open Graph, Twitter card.
// `title` is only this page's part - the root layout's template adds " · Addis Eats".
// Why the repetition in openGraph: a page's `openGraph` object REPLACES the layout's, it is not merged
// field by field, so each page must carry siteName/locale/type itself. The preview image is not set
// here: the opengraph-image files next to each route add it (as an absolute URL, via metadataBase).
export function pageMetadata({ title, description, path }) {
  const full = `${title} · ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path }, // relative -> resolved against metadataBase
    openGraph: { title: full, description, url: path, siteName: SITE_NAME, locale: LOCALE, type: "website" },
    twitter: { card: "summary_large_image", title: full, description },
  };
}

// Metadata for a page that should NOT be found (cart, checkout, orders, kitchen, sign-in): a clear
// title and description for the browser tab, and noindex. robots.js disallows these too, and the
// sitemap leaves them out. `canonical` is for the one that accepts query parameters (/signin?next=).
export function privateMetadata({ title, description, canonical }) {
  return {
    title,
    description,
    robots: { index: false, follow: false },
    ...(canonical ? { alternates: { canonical } } : {}),
  };
}
