import Link from "next/link";
import { hrefFor } from "@/lib/order-query";

// Makes each state appear on demand, for the demo and for the assessment. These are real renders, not
// pictures of states: ?demo=slow waits 3 s on the server so loading.js shows, ?demo=error throws so
// error.js shows, ?demo=empty returns no rows. Harmless: it only changes what THIS page request shows.
// `extra` adds page-specific links, e.g. { label: "Sample data", params: { data: "sample" } }.
export default function StateDemo({ basePath, extra = [] }) {
  const items = [
    ...extra,
    { label: "Loading (3 s)", params: { demo: "slow" } },
    { label: "Empty", params: { demo: "empty" } },
    { label: "Error", params: { demo: "error" } },
    { label: "Back to normal", params: {} },
  ];
  return (
    <aside aria-label="Demonstrate the page states" className="mt-12 rounded-2xl border border-dashed border-forest/40 p-5 text-sm">
      <h2 className="font-semibold">See every state</h2>
      <p className="mb-3 mt-1 text-muted">Each link reloads this page and forces one state, so you can check them without breaking anything.</p>
      <ul className="flex flex-wrap gap-2">
        {items.map((i) => (
          <li key={i.label}>
            <Link href={hrefFor(basePath, {}, i.params)} className="inline-block rounded-full border border-forest/30 px-3 py-1 text-forest hover:bg-forest/10">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
