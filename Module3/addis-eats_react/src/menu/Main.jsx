import { useState, useEffect } from "react";
import Dish from "./Dish";
import OrderForm from "../checkout/OrderForm";
import CategoryBar from "./CategoryBar";
import { getMenu } from "../api/menu";

function Main() {
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState("All");
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    let ignore = false;

    getMenu().then((items) => {
      if (!ignore) {
        setMenu(items);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  const mainCat = menu.filter((item) => item.category === category);
  const sideCat = menu.filter((item) => item.category === category);
  const bevCat = menu.filter((item) => item.category === category);

  const shown =
    category == "All"
      ? menu
      : category == "Main Dish"
        ? mainCat
        : category == "Side Dish"
          ? sideCat
          : bevCat;

  function addToOrder(price) {
    setTotal(total + price);
  }

  return (
    <div>
      <h2>Addis Eats - Our Menu</h2>
      <h1>Total : {total}</h1>
      <CategoryBar onSelectCategory={setCategory} />
      <div className="card-container">
        {shown.map((item) => (
          <Dish key={item.id} {...item} onAdd={addToOrder} />
        ))}
      </div>

      <OrderForm />
    </div>
  );
}

export default Main;
