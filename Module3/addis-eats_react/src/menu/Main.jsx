import { useState } from "react";
import Dish from "./Dish";
import OrderForm from "../checkout/OrderForm";

function Main({ menu }) {
  const [total, setTotal] = useState(0);

  function addToOrder(price) {
    setTotal(total + price);
  }

  return (
    <div>
      <h2>Addis Eats - Our Menu</h2>
      <h1>Total : {total}</h1>
      <div className="card-container">
        {menu.map((item) => (
          <Dish key={item.id} {...item} onAdd={addToOrder} />
        ))}
      </div>

      <OrderForm />
    </div>
  );
}

export default Main;
