function CategoryBar({ categories, selectedCategory, onSelectCategory }) {
  return (
    <nav className="category-bar" aria-label="Menu categories">
      {categories.map((cat) => (
        <button
          type="button"
          className="chip"
          key={cat}
          onClick={() => onSelectCategory(cat)}
          aria-pressed={cat === selectedCategory}
        >
          {cat}
        </button>
      ))}
    </nav>
  );
}

export default CategoryBar;
