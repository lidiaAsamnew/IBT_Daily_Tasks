"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp } from "./actions";
import { PASSWORD_MIN, PASSWORD_MAX, PHONE_HINT, PHONE_PATTERN, NAME_MAX } from "@/lib/constants";

function Field({ id, label, error, hint, children }) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children({ describedBy, invalid: Boolean(error) })}
      {hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
      {error && <p id={`${id}-error`} className="field-error" role="alert">{error}</p>}
    </div>
  );
}

// One form component for both pages: mode = "signin" | "signup".
export default function AuthForm({ mode, next }) {
  const signingUp = mode === "signup";
  const [state, formAction, pending] = useActionState(signingUp ? signUp : signIn, null);
  const err = (name) => state?.fieldErrors?.[name]?.[0];

  return (
    <form action={formAction} className="card form" noValidate={false}>
      <input type="hidden" name="next" value={next} />

      {state?.error && <p className="form-error" role="alert">{state.error}</p>}

      {signingUp && (
        <Field id="name" label="Your name" error={err("name")}>
          {({ describedBy, invalid }) => (
            <input id="name" name="name" className="input" autoComplete="name" required minLength={2} maxLength={NAME_MAX}
              defaultValue={state?.values?.name ?? ""} aria-invalid={invalid} aria-describedby={describedBy} />
          )}
        </Field>
      )}

      <Field id="phone" label="Phone number" hint={PHONE_HINT} error={err("phone")}>
        {({ describedBy, invalid }) => (
          <input id="phone" name="phone" type="tel" inputMode="numeric" className="input" autoComplete="tel" required
            pattern={PHONE_PATTERN} title={PHONE_HINT} defaultValue={state?.values?.phone ?? ""}
            aria-invalid={invalid} aria-describedby={describedBy} />
        )}
      </Field>

      <Field id="password" label="Password" hint={signingUp ? `At least ${PASSWORD_MIN} characters.` : undefined} error={err("password")}>
        {({ describedBy, invalid }) => (
          <input id="password" name="password" type="password" className="input" required
            autoComplete={signingUp ? "new-password" : "current-password"}
            minLength={signingUp ? PASSWORD_MIN : 1} maxLength={PASSWORD_MAX}
            aria-invalid={invalid} aria-describedby={describedBy} />
        )}
      </Field>

      <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={pending} aria-busy={pending}>
        {pending ? (signingUp ? "Creating account…" : "Signing in…") : signingUp ? "Create account" : "Sign in"}
      </button>

      <p className="form-alt">
        {signingUp ? "Already have an account? " : "New to Addis Eats? "}
        <Link href={`${signingUp ? "/signin" : "/signup"}${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`}>
          {signingUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
