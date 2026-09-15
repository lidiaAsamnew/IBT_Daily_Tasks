function CategoryBar({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div>
      {categories.map((cat) => (
        <button
          type="button"
          key={cat}
          onClick={() => onSelectCategory(cat)}
          aria-pressed={cat === selectedCategory}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryBar;
