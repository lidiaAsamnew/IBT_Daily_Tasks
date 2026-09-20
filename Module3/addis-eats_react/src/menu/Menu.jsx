import { useSearchParams } from "react-router-dom";
import { getMenu } from "../api/menu";
import useFetch from "../hooks/useFetch";
import { useCart } from "../cart/cart-context";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";
import OrderForm from "../checkout/OrderForm";

const categories = ["All", "Main Dish", "Side Dish", "Beverage"];

function Menu() {
  const { data: menu, loading, error } = useFetch(getMenu);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem, total } = useCart();

  const category = searchParams.get("category") || "All";
  const dishes = Array.isArray(menu) ? menu : [];

  function handleSelectCategory(nextCategory) {
    if (nextCategory === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: nextCategory });
    }
  }

  if (loading) {
    return <p role="status">Loading menu...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (dishes.length === 0) {
    return <p role="status">The menu is empty right now.</p>;
  }

  const shown =
    category === "All"
      ? dishes
      : dishes.filter((item) => item.category === category);

  return (
    <div>
      <h2>Addis Eats - Our Menu</h2>
      <p>Total : {total}</p>
      <CategoryBar
        categories={categories}
        selectedCategory={category}
        onSelectCategory={handleSelectCategory}
      />
      <DishList dishes={shown} onAdd={addItem} />
      <OrderForm />
    </div>
  );
}

export default Menu;
