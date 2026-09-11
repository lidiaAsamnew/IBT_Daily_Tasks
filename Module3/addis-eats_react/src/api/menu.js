const menuData = [
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

export function getMenu() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(menuData);
    }, 300);
  });
}
