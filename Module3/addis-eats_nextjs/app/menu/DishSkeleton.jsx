// Same shape and number of cards as the real list, so nothing jumps when the data lands (Day 46).
export default function DishSkeleton({ count = 6 }) {
  return (
    <ul className="dish-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <div className="dish-card dish-card--skeleton">
            <div className="dish-media skeleton" />
            <div className="dish-body">
              <div className="skeleton skeleton-line skeleton-line--title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-line--short" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
