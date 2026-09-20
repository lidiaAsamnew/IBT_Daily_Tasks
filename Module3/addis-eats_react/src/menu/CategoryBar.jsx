function CategoryBar({ categories, selectedCategory, onSelectCategory }) {
  return (
    <nav aria-label="Menu categories">
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
    </nav>
  );
}

export default CategoryBar;
