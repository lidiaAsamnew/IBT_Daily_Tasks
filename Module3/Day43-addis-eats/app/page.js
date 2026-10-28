import Link from "next/link";
import Image from "next/image";
import DishCard from "@/components/DishCard";
import { dishes, specialIds } from "@/lib/dishes";

const steps = [
  { title: "Pick your dishes", text: "Browse the menu and filter by category." },
  { title: "Order in a minute", text: "Tell us where to deliver and place the order." },
  { title: "Eat while it is hot", text: "Your food leaves the kitchen and comes to your door." },
];

const checks = [
  { href: "/menu", label: "Menu with sidebar (ISR)" },
  { href: "/menu/kitfo", label: "Prebuilt dish page" },
  { href: "/menu/pizza", label: "notFound() for a missing dish" },
  { href: "/no-such-page", label: "Bad URL, root not-found.js" },
  { href: "/checkout", label: "Dynamic checkout (cookies)" },
];

export default function HomePage() {
  const specials = specialIds.map((id) => dishes.find((d) => d.id === id));

  return (
    <>
      <section className="bg-forest text-cream">
        <div className="wrap grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          <div>
            <h1 className="text-4xl font-semibold sm:text-5xl lg:text-6xl">
              Ethiopian food, delivered across Addis.
            </h1>
            <p className="mt-5 max-w-md text-lg text-cream/85">
              Doro wat, shiro, tibs and more from the kitchens you love.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/menu" className="btn btn-primary">Order now</Link>
              <Link href="/cart" className="btn btn-ghost">View cart</Link>
            </div>
          </div>
          {/* The one `priority` image in the whole app: the largest picture visible without scrolling.
              It turns off lazy loading and preloads the file, which is what moves LCP. */}
          <Image
            src="/dishes/hero.webp"
            alt="An injera platter with five colourful Ethiopian stews"
            width={960}
            height={960}
            sizes="(max-width: 640px) 288px, 384px"
            priority
            className="mx-auto h-72 w-72 drop-shadow-xl sm:h-96 sm:w-96"
          />
        </div>
      </section>

      <section className="wrap mt-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-3xl font-semibold">Today&rsquo;s specials</h2>
          <Link href="/menu" className="font-semibold text-forest underline">See the full menu</Link>
        </div>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {specials.map((d) => <DishCard key={d.id} dish={d} />)}
        </ul>
      </section>

      <section className="wrap mt-16">
        <h2 className="mb-6 text-3xl font-semibold">How it works</h2>
        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-injera bg-white p-6">
              <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-forest font-semibold text-white">{i + 1}</span>
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap mt-16">
        <div className="rounded-2xl border-2 border-dashed border-forest/40 p-6">
          <h2 className="text-xl font-semibold">Route checks</h2>
          <p className="mb-3 text-sm text-muted">Each link shows one layout, rendering strategy or special file at work.</p>
          <ul className="flex flex-wrap gap-3">
            {checks.map((c) => (
              <li key={c.href}><Link href={c.href} className="btn btn-green text-sm">{c.label}</Link></li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
