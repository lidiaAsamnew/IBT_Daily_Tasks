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
        <p>
          {price} {currency}
        </p>
        <p>{category}</p>
        <p>{isSpicy && <em>Spicy</em>}</p>
        <button type="button" onClick={() => onAdd(dish)}>
          Add
        </button>
      </Card>
    </div>
  );
}

export default DishCard;
