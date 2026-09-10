import React from "react";
import { useState } from "react";
import Card from "./Card";

function Dish({ name, price, category, isSpicy, currency = "ETB", onAdd }) {
  // const [count, setCount] = useState(0);

  // function add() {
  //   setCount(count + 1);
  // }

  return (
    <div className="card">
      <Card>
        <h2>{name}</h2>
        <p>
          {price} {currency}
        </p>
        <p>{category}</p>
        <p>{isSpicy && <em>Spicy</em>}</p>
        <button onClick={() => onAdd(price)}>Add</button>
        {/* <p>Quantity: {count}</p> */}
      </Card>
    </div>
  );
}

export default Dish;
