import { Link } from "react-router-dom";
import Card from "../ui/Card";
import { useCart } from "../cart/cart-context";

function DishCard({ dish, onAdd }) {
  const { id, name, price, category, isSpicy, spicy, currency = "ETB", image, description } = dish;
  const { items, removeItem } = useCart();
  const line = items.find((item) => item.id === id);
  const tag = category || (isSpicy || spicy ? "Spicy" : "");

  function decrease() {
    if (!line) {
      return;
    }
    if (line.quantity <= 1) {
      removeItem(id);
      return;
    }
    removeItem(id);
    for (let i = 0; i < line.quantity - 1; i++) {
      onAdd(dish);
    }
  }

  return (
    <div className="card dish-card">
      <Link to={`/menu/${id}`}>
        {image ? <img className="dish-photo" src={image} alt="" /> : null}
      </Link>
      <div className="dish-body">
        <Card>
          <div className="dish-top">
            <h2>
              <Link to={`/menu/${id}`}>{name}</Link>
            </h2>
            {tag ? <span className="badge">{tag}</span> : null}
          </div>
          {description ? <p className="dish-desc">{description}</p> : null}
          <div className="dish-footer">
            <p className="price">
              {price} <span>{currency}</span>
            </p>
            {line ? (
              <div className="stepper">
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={decrease}
                  aria-label={`Decrease ${name}`}
                >
                  −
                </button>
                <span className="stepper-count">{line.quantity}</span>
                <button
                  type="button"
                  className="stepper-btn"
                  onClick={() => onAdd(dish)}
                  aria-label={`Add ${name} to cart`}
                >
                  +
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="dish-add"
                onClick={() => onAdd(dish)}
                aria-label={`Add ${name} to cart`}
              >
                Add to cart
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default DishCard;
