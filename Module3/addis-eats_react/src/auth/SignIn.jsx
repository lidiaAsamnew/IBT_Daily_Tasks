import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./auth-context";

function SignIn() {
  const { user, signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const from = location.state?.from || "/checkout";

  if (user) {
    return <Navigate to={from} replace />;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter your name to sign in.");
      return;
    }

    signIn(name);
    navigate(from, { replace: true });
  }

  return (
    <div className="page form-card">
      <h2>Sign in</h2>
      <p className="lede">Sign in to continue to checkout.</p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="signin-name">Name: </label>
          <input
            id="signin-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="Your name"
            autoComplete="name"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "signin-error" : undefined}
          />
        </div>
        {error && (
          <p id="signin-error" className="error-text" role="alert">
            {error}
          </p>
        )}
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}

export default SignIn;
