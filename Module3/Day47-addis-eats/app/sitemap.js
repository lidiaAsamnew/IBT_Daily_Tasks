import { getDishes } from "@/lib/dishes";
import { absoluteUrl } from "@/lib/site";

// Built from the dish records, so a dish added next month appears with no one editing a file.
// Only public, indexable pages: /cart, /checkout, /orders, /kitchen and /signin are deliberately
// absent (see app/robots.js) - they need a session or have nothing to rank.
export default async function sitemap() {
  const dishes = await getDishes(); // stands in for the database query, as everywhere else

  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/menu"), changeFrequency: "daily", priority: 0.8 },
    ...dishes.map((d) => ({ url: absoluteUrl(`/menu/${d.id}`), changeFrequency: "weekly", priority: 0.6 })),
  ];
}
