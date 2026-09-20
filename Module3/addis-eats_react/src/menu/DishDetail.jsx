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
    <div className="page detail-card">
      <h2>{dish.name}</h2>
      <p className="price">
        {dish.price} {dish.currency || "ETB"}
      </p>
      <p className="meta">{dish.category}</p>
      {dish.isSpicy ? <p className="badge">Spicy</p> : null}
      <p className="page-links">
        <button
          type="button"
          onClick={() => addItem(dish)}
          aria-label={`Add ${dish.name} to cart`}
        >
          Add
        </button>
        <Link className="btn btn-secondary" to="/menu">
          Back to menu
        </Link>
      </p>
    </div>
  );
}

export default DishDetail;
