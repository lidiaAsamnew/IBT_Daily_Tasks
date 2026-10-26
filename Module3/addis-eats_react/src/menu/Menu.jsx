import { Link, useSearchParams } from "react-router-dom";
import { getMenu } from "../api/menu";
import useFetch from "../hooks/useFetch";
import { useCart } from "../cart/cart-context";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";
import OrderForm from "../checkout/OrderForm";

const categories = ["All", "Main", "Vegetarian", "Breakfast", "Drinks"];

function Menu() {
  const { data: menu, loading, error } = useFetch(getMenu);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem, total, items, removeItem } = useCart();

  const category = searchParams.get("category") || "All";
  const dishes = Array.isArray(menu) ? menu : [];
  const query = searchParams.get("q") || "";

  function handleSelectCategory(nextCategory) {
    if (nextCategory === "All") {
      setSearchParams(query ? { q: query } : {});
    } else {
      setSearchParams(query ? { category: nextCategory, q: query } : { category: nextCategory });
    }
  }

  function handleSearchChange(e) {
    const nextQuery = e.target.value;
    const next = {};
    if (category !== "All") {
      next.category = category;
    }
    if (nextQuery) {
      next.q = nextQuery;
    }
    setSearchParams(next);
  }

  if (loading) {
    return (
      <p className="status" role="status">
        Loading menu...
      </p>
    );
  }

  if (error) {
    return (
      <p className="status status--error" role="alert">
        {error}
      </p>
    );
  }

  if (dishes.length === 0) {
    return (
      <p className="status" role="status">
        The menu is empty right now.
      </p>
    );
  }

  const shown = (
    category === "All"
      ? dishes
      : dishes.filter((item) => item.category === category)
  ).filter((item) => {
    if (!query.trim()) {
      return true;
    }
    const haystack = `${item.name} ${item.description || ""}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  function setQuantity(dish, quantity) {
    removeItem(dish.id);
    for (let i = 0; i < quantity; i++) {
      addItem(dish);
    }
  }

  return (
    <div className="page menu-page">
      <div className="menu-toolbar">
        <div>
          <h2>Popular Ethiopian dishes</h2>
          <p className="lede">{dishes.length} dishes</p>
        </div>
        <label className="search-pill">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            className="search-input"
            type="search"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search dishes"
            aria-label="Search dishes"
          />
        </label>
      </div>
      <div className="menu-layout">
        <div>
          <CategoryBar
            categories={categories}
            selectedCategory={category}
            onSelectCategory={handleSelectCategory}
          />
          <DishList dishes={shown} onAdd={addItem} />
        </div>
        <aside className="order-panel" aria-label="Your order">
          <div className="order-head">
            <h3>Your order</h3>
            <span className="order-count">{itemCount} Items</span>
          </div>
          {items.length === 0 ? (
            <p className="order-empty">Add dishes from the menu to start an order.</p>
          ) : (
            items.map((item) => (
              <div className="order-line" key={item.id}>
                {item.image ? (
                  <img className="thumb" src={item.image} alt="" />
                ) : (
                  <div className="thumb thumb-fallback" aria-hidden="true">
                    ○
                  </div>
                )}
                <div>
                  <h4>{item.name}</h4>
                  <div className="stepper">
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => setQuantity(item, item.quantity - 1)}
                      aria-label={`Decrease ${item.name}`}
                    >
                      −
                    </button>
                    <span className="stepper-count">{item.quantity}</span>
                    <button
                      type="button"
                      className="stepper-btn"
                      onClick={() => addItem(item)}
                      aria-label={`Increase ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="order-line-side">
                  <strong>
                    {item.price * item.quantity} ETB
                  </strong>
                  <button
                    type="button"
                    className="remove-link"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
          <div className="order-total">
            <span>Total</span>
            <span>{total} ETB</span>
          </div>
          <Link className="btn order-checkout" to="/checkout">
            Go to checkout
          </Link>
        </aside>
      </div>
      <OrderForm />
    </div>
  );
}

export default Menu;
