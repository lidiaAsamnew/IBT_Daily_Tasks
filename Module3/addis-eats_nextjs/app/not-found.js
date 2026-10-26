import Link from "next/link";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div className="container narrow state-page">
      <p className="eyebrow">Error 404</p>
      <h1>We could not find that page</h1>
      <p className="lede">The link may be old, or the page may have moved. The menu is a good place to start again.</p>
      <div className="actions">
        <Link href="/menu" className="btn btn-primary">Browse the menu</Link>
        <Link href="/" className="btn btn-ghost">Back to home</Link>
      </div>
    </div>
  );
}
