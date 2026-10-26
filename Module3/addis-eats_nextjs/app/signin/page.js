import { redirect } from "next/navigation";
import AuthForm from "./AuthForm";
import { getSession } from "@/lib/session";
import { safeNext } from "@/lib/safe-next";
import { first } from "@/lib/params";

export const metadata = { title: "Sign in", robots: { index: false, follow: false } };

// Reads the session cookie, so this route is dynamic — correct, it depends on who is asking.
export default async function SignInPage({ searchParams }) {
  const next = safeNext(first((await searchParams).next)); // Day 42: never trust a redirect target from the URL
  if (await getSession()) redirect(next);
  return (
    <div className="container auth-page">
      <h1>Sign in</h1>
      <p className="lede">Sign in to place and track your orders.</p>
      <AuthForm mode="signin" next={next} />
    </div>
  );
}
