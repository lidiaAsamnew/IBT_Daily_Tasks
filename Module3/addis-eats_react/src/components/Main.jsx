import React, { useState, useEffect } from "react";
import Dish from "./Dish";
import OrderForm from "./OrderForm";
import CategoryBar from "./CategoryBar";

function Main() {
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState("All");

  const menu = [
    {
      id: 1,
      name: "Doro Wot",
      price: 120,
      category: "Main Dish",
      isSpicy: true,
    },
    {
      id: 2,
      name: "Injera",
      price: 80,
      category: "Side Dish",
      isSpicy: false,
    },
    {
      id: 3,
      name: "Shiro",
      price: 100,
      category: "Main Dish",
      isSpicy: true,
    },
    {
      id: 4,
      name: "Doro Wot",
      price: 120,
      category: "Main Dish",
      isSpicy: true,
    },
    {
      id: 5,
      name: "Injera",
      price: 80,
      category: "Side Dish",
      isSpicy: false,
    },
    {
      id: 6,
      name: "Shiro",
      price: 100,
      category: "Main Dish",
      isSpicy: true,
    },
    {
      id: 7,
      name: "Doro Wot",
      price: 120,
      category: "Main Dish",
      isSpicy: true,
    },
    {
      id: 8,
      name: "Injera",
      price: 80,
      category: "Side Dish",
      isSpicy: false,
    },
    {
      id: 9,
      name: "Shiro",
      price: 100,
      category: "Main Dish",
      isSpicy: true,
    },
    {
      id: 10,
      name: "Doro Wot",
      price: 120,
      category: "Main Dish",
      isSpicy: true,
    },
    {
      id: 11,
      name: "Injera",
      price: 80,
      category: "Side Dish",
      isSpicy: false,
    },
    {
      id: 12,
      name: "Shiro",
      price: 100,
      category: "Main Dish",
      isSpicy: true,
    },
    {
      id: 13,
      name: "Ambo",
      price: 60,
      category: "Beverage",
      isSpicy: false,
    },
  ];

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
