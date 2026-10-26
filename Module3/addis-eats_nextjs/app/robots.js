import { siteUrl } from "@/lib/site";

export default function robots() {
  const base = siteUrl();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/cart", "/checkout", "/orders", "/track", "/kitchen", "/dashboard", "/signin", "/signup"] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
