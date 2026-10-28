import { absoluteUrl } from "@/lib/site";

// Rules for crawlers, plus a pointer to the sitemap. The disallowed paths are the private ones:
// they redirect to sign-in (or hold one person's data) and would only waste a crawler's visit.
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cart", "/checkout", "/orders", "/kitchen", "/dashboard", "/signin", "/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
