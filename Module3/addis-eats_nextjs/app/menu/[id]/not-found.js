import Link from "next/link";

export default function DishNotFound() {
  return (
    <div className="state-box">
      <h1>That dish is not on the menu</h1>
      <p className="muted">It may have been removed, or the link is wrong.</p>
      <Link href="/menu" className="btn btn-primary">Back to the menu</Link>
    </div>
  );
}
