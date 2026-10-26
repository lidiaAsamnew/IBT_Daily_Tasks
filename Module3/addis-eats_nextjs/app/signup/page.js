import { redirect } from "next/navigation";
import AuthForm from "../signin/AuthForm";
import { getSession } from "@/lib/session";
import { safeNext } from "@/lib/safe-next";
import { first } from "@/lib/params";

export const metadata = { title: "Create account", robots: { index: false, follow: false } };

export default async function SignUpPage({ searchParams }) {
  const next = safeNext(first((await searchParams).next));
  if (await getSession()) redirect(next);
  return (
    <div className="container auth-page">
      <h1>Create your account</h1>
      <p className="lede">It takes a minute. Your phone number is how the restaurant reaches you about an order.</p>
      <AuthForm mode="signup" next={next} />
    </div>
  );
}
