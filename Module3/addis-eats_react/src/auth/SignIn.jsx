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
    <div>
      <h2>Sign in</h2>
      <p>Sign in to continue to checkout.</p>
      <form onSubmit={handleSubmit}>
        <p>
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
          />
        </p>
        {error && <p>{error}</p>}
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}

export default SignIn;
