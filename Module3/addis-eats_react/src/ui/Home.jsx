import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h2>Welcome to Addis Eats</h2>
      <p>Order Ethiopian food from our menu.</p>
      <p>
        <Link to="/menu">View the menu</Link>
      </p>
    </div>
  );
}

export default Home;
