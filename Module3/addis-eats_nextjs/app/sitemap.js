import { getDishes } from "@/lib/dishes";
import { siteUrl } from "@/lib/site";

// Generated from the real data (Day 44): add a dish and it appears here with no file to remember.
// Private routes (/cart, /checkout, /orders, /track, /kitchen, /dashboard) are deliberately absent.
export default async function sitemap() {
  const base = siteUrl();
  const dishes = await getDishes();
  return [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/menu`, priority: 0.8 },
    ...dishes.map((d) => ({ url: `${base}/menu/${d.id}`, priority: 0.6 })),
  ];
}
