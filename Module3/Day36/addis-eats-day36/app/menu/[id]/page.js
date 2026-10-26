import Link from "next/link";
import { notFound } from "next/navigation";
import { getDish } from "../dishes";

export default async function DishPage({ params }) {
  // In Next.js 15+ params is a Promise; awaiting is safe in every version.
  const { id } = await params;
  const dish = getDish(id);

  if (!dish) notFound(); // renders app/not-found.js

  return (
    <main className="space-y-3">
      <p className="text-sm">Dish id from params: <code>{id}</code></p>
      <h1 className="text-2xl font-bold">{dish.name}</h1>
      <p>{dish.description}</p>
      <p className="font-medium">{dish.price} ETB</p>
      <Link href="/menu" className="underline">Back to the menu</Link>
    </main>
  );
}
