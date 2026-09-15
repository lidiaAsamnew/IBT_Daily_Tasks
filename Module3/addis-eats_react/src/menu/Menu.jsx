import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getMenu } from "../api/menu";
import useFetch from "../hooks/useFetch";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";
import OrderForm from "../checkout/OrderForm";

const categories = ["All", "Main Dish", "Side Dish", "Beverage"];

function Menu() {
  const { data: menu, loading, error } = useFetch(getMenu);
  const [searchParams, setSearchParams] = useSearchParams();
  const [total, setTotal] = useState(0);

  const category = searchParams.get("category") || "All";

  function handleSelectCategory(nextCategory) {
    if (nextCategory === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: nextCategory });
    }
  }

  function addToOrder(price) {
    setTotal(total + price);
  }

  if (loading) {
    return <p>Loading menu...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const shown =
    category === "All"
      ? menu
      : menu.filter((item) => item.category === category);

  return (
    <div>
      <h2>Addis Eats - Our Menu</h2>
      <h1>Total : {total}</h1>
      <CategoryBar
        categories={categories}
        selectedCategory={category}
        onSelectCategory={handleSelectCategory}
      />
      <DishList dishes={shown} onAdd={addToOrder} />
      <OrderForm />
    </div>
  );
}

export default Menu;
