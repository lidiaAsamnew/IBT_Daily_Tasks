import React from "react";

function CategoryBar({ onSelectCategory }) {
  const categories = ["All", "Main Dish", "Side Dish", "Beverage"];

  return (
    <div>
      {categories.map((cat) => (
        <button onClick={() => onSelectCategory(cat)} key={cat}>
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryBar;
