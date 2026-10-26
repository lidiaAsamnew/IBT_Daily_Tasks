import { Link, useParams } from "react-router-dom";
import { getMenu } from "../api/menu";
import useFetch from "../hooks/useFetch";
import { useCart } from "../cart/cart-context";

function DishDetail() {
  const { id } = useParams();
  const { data: menu, loading, error } = useFetch(getMenu);
  const { addItem } = useCart();

  if (loading) {
    return (
      <p className="status" role="status">
        Loading dish...
      </p>
    );
  }

  if (error) {
    return (
      <p className="status status--error" role="alert">
        {error}
      </p>
    );
  }

  const dishes = Array.isArray(menu) ? menu : [];
  const dish = dishes.find((item) => String(item.id) === String(id));

  if (!dish) {
    return (
      <div className="page status" role="status">
        <h2>Dish not found</h2>
        <p>We could not find a dish with ID {id || "(missing)"}.</p>
        <p className="page-links">
          <Link className="btn" to="/menu">
            Back to menu
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="page">
      <Link className="back-link" to="/menu">
        ← Back to menu
      </Link>
      <div className="dish-layout">
        {dish.image ? (
          <img className="detail-photo" src={dish.image} alt="" />
        ) : null}
        <div className="dish-detail-copy">
          {dish.category ? <p className="badge">{dish.category}</p> : null}
          <h2>{dish.name}</h2>
          {dish.description ? <p className="dish-desc">{dish.description}</p> : null}
          <p className="price">
            {dish.price} <span>{dish.currency || "ETB"}</span>
          </p>
          <p className="page-links">
            <button
              type="button"
              className="btn"
              onClick={() => addItem(dish)}
              aria-label={`Add ${dish.name} to cart`}
            >
              Add to cart · {dish.price} {dish.currency || "ETB"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default DishDetail;
