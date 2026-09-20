import { Link } from "react-router-dom";
import Card from "../ui/Card";

function DishCard({ dish, onAdd }) {
  const { id, name, price, category, isSpicy, currency = "ETB" } = dish;

  return (
    <div className="card">
      <Card>
        <h2>
          <Link to={`/menu/${id}`}>{name}</Link>
        </h2>
        <p className="price">
          {price} {currency}
        </p>
        <p className="meta">{category}</p>
        {isSpicy ? <p className="badge">Spicy</p> : null}
        <button
          type="button"
          onClick={() => onAdd(dish)}
          aria-label={`Add ${name} to cart`}
        >
          Add
        </button>
      </Card>
    </div>
  );
}

export default DishCard;
