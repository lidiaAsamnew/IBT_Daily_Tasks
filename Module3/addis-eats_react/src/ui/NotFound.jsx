import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div>
      <h2>Page not found</h2>
      <p>Sorry, we could not find that page.</p>
      <p>
        <Link to="/">Go home</Link>
      </p>
    </div>
  );
}

export default NotFound;
