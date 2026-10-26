import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 bg-forest-deep text-cream">
      <div className="wrap flex flex-col justify-between gap-6 py-10 sm:flex-row">
        <div>
          <p className="font-display text-xl font-semibold">Addis Eats</p>
          <p className="text-sm text-cream/70">Ethiopian food delivery in Addis Ababa.</p>
        </div>
        <ul className="flex gap-6 text-sm">
          <li><Link href="/menu" className="hover:underline">Menu</Link></li>
          <li><Link href="/cart" className="hover:underline">Cart</Link></li>
          <li><Link href="/checkout" className="hover:underline">Checkout</Link></li>
        </ul>
      </div>
    </footer>
  );
}
