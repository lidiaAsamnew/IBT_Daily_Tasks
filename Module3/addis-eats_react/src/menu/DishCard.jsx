import Card from "../ui/Card";

function DishCard({ dish, onAdd }) {
  const { name, price, category, isSpicy, currency = "ETB" } = dish;

  return (
    <div className="card">
      <Card>
        <h2>{name}</h2>
        <p>
          {price} {currency}
        </p>
        <p>{category}</p>
        <p>{isSpicy && <em>Spicy</em>}</p>
        <button type="button" onClick={() => onAdd(price)}>
          Add
        </button>
      </Card>
    </div>
  );
}

export default DishCard;
