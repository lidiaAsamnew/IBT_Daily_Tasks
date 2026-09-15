import { Link, useParams } from "react-router-dom";
import { getMenu } from "../api/menu";
import useFetch from "../hooks/useFetch";
import { useCart } from "../cart/cart-context";

function DishDetail() {
  const { id } = useParams();
  const { data: menu, loading, error } = useFetch(getMenu);
  const { addItem } = useCart();

  if (loading) {
    return <p>Loading dish...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const dish = menu.find((item) => String(item.id) === String(id));

  if (!dish) {
    return (
      <div>
        <h2>Dish not found</h2>
        <p>We could not find a dish with ID {id}.</p>
        <p>
          <Link to="/menu">Back to menu</Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2>{dish.name}</h2>
      <p>
        {dish.price} {dish.currency || "ETB"}
      </p>
      <p>{dish.category}</p>
      <p>{dish.isSpicy && <em>Spicy</em>}</p>
      <p>
        <button type="button" onClick={() => addItem(dish)}>
          Add
        </button>
      </p>
      <p>
        <Link to="/menu">Back to menu</Link>
      </p>
    </div>
  );
}

export default DishDetail;
