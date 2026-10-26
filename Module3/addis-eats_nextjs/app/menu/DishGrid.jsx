import DishCard from "./DishCard";

export default function DishGrid({ dishes, priorityFirst = false }) {
  return (
    <ul className="dish-grid">
      {dishes.map((dish, i) => (
        <li key={dish.id}>
          <DishCard dish={dish} priority={priorityFirst && i === 0} />
        </li>
      ))}
    </ul>
  );
}
