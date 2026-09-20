import DishCard from "./DishCard";

function DishList({ dishes, onAdd }) {
  if (!dishes || dishes.length === 0) {
    return <p role="status">No dishes found for this category.</p>;
  }

  return (
    <div className="card-container">
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} onAdd={onAdd} />
      ))}
    </div>
  );
}

export default DishList;
