"use client"; // useRouter needs a client component
import { useRouter } from "next/navigation";

export default function CheckoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/checkout")}
      className="rounded bg-amber-800 px-4 py-2 text-white"
    >
      Go to checkout
    </button>
  );
}
