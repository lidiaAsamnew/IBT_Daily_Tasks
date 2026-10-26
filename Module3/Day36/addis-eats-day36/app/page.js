import Link from "next/link";

export default function HomePage() {
  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-bold">Welcome to Addis Eats</h1>
      <p>Kitfo, shiro, tibs and more.</p>
      <Link href="/menu" className="inline-block rounded bg-amber-800 px-4 py-2 text-white">
        See the menu
      </Link>

      <section className="mt-8 rounded border border-amber-900/30 p-4">
        <h2 className="font-semibold">Exercise helpers (Day 36)</h2>
        <ul className="list-disc pl-5">
          <li><Link className="underline" href="/menu?slow=1">Force the loading state</Link></li>
          <li><Link className="underline" href="/menu?error=1">Force the error state</Link></li>
          <li><Link className="underline" href="/menu/pizza">Missing dish (notFound)</Link></li>
          <li><Link className="underline" href="/no-such-page">Unclaimed path (root not-found)</Link></li>
        </ul>
      </section>
    </main>
  );
}
