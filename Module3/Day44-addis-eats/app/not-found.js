import Link from "next/link";
import DishArt from "@/components/DishArt";

// Rendered for an unclaimed URL AND whenever notFound() is called.
export default function NotFound() {
  return (
    <div className="wrap flex flex-col items-center py-20 text-center">
      <DishArt palette={["#e9dcc0"]} className="h-40 w-40 opacity-80" />
      <h1 className="mt-6 text-4xl font-semibold">We could not find that</h1>
      <p className="mt-2 max-w-md text-muted">
        The page or dish you asked for does not exist. It may have been removed, or the address has a typo.
      </p>
      <Link href="/menu" className="btn btn-green mt-6">Back to the menu</Link>
    </div>
  );
}
