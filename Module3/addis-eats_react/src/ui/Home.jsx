import { Link } from "react-router-dom";
import { getMenu } from "../api/menu";
import useFetch from "../hooks/useFetch";

function Home() {
  const { data: menu, loading, error } = useFetch(getMenu);
  const dishes = Array.isArray(menu) ? menu : [];
  const specials = dishes.filter((item) => item.special);

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-inner">
          <h2>Ethiopian food, delivered across Addis</h2>
          <p>
            Order doro wat, shiro, tibs and more from the kitchens you love.
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/menu">
              Order now
            </Link>
            <Link className="btn btn-light" to="/cart">
              View cart
            </Link>
          </div>
        </div>
      </section>
      <section className="specials">
        <div className="section-head">
          <h3>Today's specials</h3>
          <Link to="/menu">See full menu</Link>
        </div>
        {loading ? (
          <p className="status" role="status">
            Loading menu...
          </p>
        ) : null}
        {error ? (
          <p className="status status--error" role="alert">
            {error}
          </p>
        ) : null}
        {!loading && !error ? (
          <div className="specials-grid">
            {specials.map((dish) => (
              <article className="special-card" key={dish.id}>
                <Link to={`/menu/${dish.id}`}>
                  <img src={dish.image} alt="" />
                </Link>
                <div className="special-body">
                  <div className="special-top">
                    <h3>
                      <Link to={`/menu/${dish.id}`}>{dish.name}</Link>
                    </h3>
                    <span className="badge">{dish.category}</span>
                  </div>
                  <p className="price">
                    {dish.price} <span>ETB</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default Home;
