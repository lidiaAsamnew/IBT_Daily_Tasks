import Link from "next/link";

export default function NotFound() {
  return (
    <main className="space-y-3">
      <h1 className="text-2xl font-bold">Not found</h1>
      <p>We could not find that page or dish.</p>
      <Link href="/menu" className="underline">Back to the menu</Link>
    </main>
  );
}
