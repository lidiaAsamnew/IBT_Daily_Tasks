"use client";

import { useActionState } from "react";
import { signIn } from "@/app/actions";

const input = "mt-1 w-full rounded-xl border border-injera bg-white px-4 py-2.5 outline-none focus:border-forest";

export default function SignInForm({ next }) {
  const [state, formAction, pending] = useActionState(signIn, null);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-injera bg-white p-6">
      <input type="hidden" name="next" value={next} />
      <label className="block text-sm font-medium">
        Phone number
        <input name="phone" type="tel" autoComplete="tel" required placeholder="0911000001" defaultValue={state?.values?.phone ?? ""} className={input} />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input name="password" type="password" autoComplete="current-password" required className={input} />
      </label>
      {state?.error && <p role="alert" className="text-sm text-berbere">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-60">
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
