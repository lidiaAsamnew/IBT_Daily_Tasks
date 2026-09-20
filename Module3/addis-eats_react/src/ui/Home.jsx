import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page">
      <section className="hero">
        <div>
          <h2>Welcome to Addis Eats</h2>
          <p>
            Order Ethiopian food from our menu. Injera, wot, and fresh flavors
            from Addis Ababa, delivered across the city.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-light" to="/menu">
              View the menu
            </Link>
          </div>
        </div>
      </section>
      <section className="highlights">
        <article className="highlight">
          <h3>Kitchen classics</h3>
          <p>Doro wot, shiro, and injera made the way you remember them.</p>
        </article>
        <article className="highlight">
          <h3>Fast city delivery</h3>
          <p>From Bole to Gullele, checkout in a few taps.</p>
        </article>
        <article className="highlight">
          <h3>Order with care</h3>
          <p>See spicy dishes clearly, then add them to your cart.</p>
        </article>
      </section>
    </div>
  );
}

export default Home;
