import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { safeNext } from "@/lib/safe-next";
import SignInForm from "./SignInForm";

// Reads cookies and searchParams, so it is rendered per request.
export default async function SignInPage({ searchParams }) {
  const { next: rawNext } = await searchParams;
  const next = safeNext(rawNext); // checked here AND again inside the signIn action

  if (await getSession()) redirect(next); // already signed in

  return (
    <div className="wrap grid items-start gap-8 pt-12 md:grid-cols-[minmax(0,26rem)_1fr]">
      <div>
        <h1 className="text-4xl font-semibold">Sign in</h1>
        <p className="mb-6 mt-2 text-muted">
          {next !== "/" ? "Sign in to continue." : "Welcome back to Addis Eats."}
        </p>
        <SignInForm next={next} />
      </div>

      <aside className="rounded-2xl border border-dashed border-forest/40 bg-white p-6">
        <h2 className="text-lg font-semibold">Demo accounts</h2>
        <p className="mb-3 text-sm text-muted">For this course project only. Passwords are stored as hashes, not in the code.</p>
        <table className="w-full text-left text-sm">
          <thead className="text-muted"><tr><th className="pb-1 font-medium">Phone</th><th className="pb-1 font-medium">Password</th><th className="pb-1 font-medium">Role</th></tr></thead>
          <tbody className="divide-y divide-injera">
            <tr><td className="py-1.5">0911000001</td><td>almaz-demo</td><td>customer</td></tr>
            <tr><td className="py-1.5">0911000002</td><td>dawit-demo</td><td>customer</td></tr>
            <tr><td className="py-1.5">0911000003</td><td>selam-demo</td><td>staff</td></tr>
          </tbody>
        </table>
      </aside>
    </div>
  );
}
