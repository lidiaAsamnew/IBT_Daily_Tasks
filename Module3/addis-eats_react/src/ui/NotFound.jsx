import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="page status">
      <h2>Page not found</h2>
      <p>Sorry, we could not find that page.</p>
      <p className="page-links">
        <Link className="btn" to="/">
          Go home
        </Link>
      </p>
    </div>
  );
}

export default NotFound;
