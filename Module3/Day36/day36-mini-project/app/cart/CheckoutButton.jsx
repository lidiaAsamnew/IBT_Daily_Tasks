"use client"; // useRouter only works in a client component
import { useRouter } from "next/navigation";

export default function CheckoutButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.push("/checkout")} className="btn btn-primary w-full">
      Continue to checkout
    </button>
  );
}
