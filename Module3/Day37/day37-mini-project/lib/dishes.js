// Shared by several routes, so it lives outside app/ (Day 36, slide 19).
export const categories = ["Meat", "Vegetarian", "Breakfast"];
export const slugOf = (category) => category.toLowerCase();

export const dishes = [
  { id: "kitfo", name: "Kitfo", category: "Meat", spicy: true, price: 320,
    description: "Finely minced beef warmed in spiced butter and mitmita, served with ayib and gomen.",
    palette: ["#8f2a1d"] },
  { id: "tibs", name: "Special Tibs", category: "Meat", spicy: true, price: 280,
    description: "Tender beef pieces sauteed with onion, green pepper and rosemary.",
    palette: ["#a4531f", "#3f7a46"] },
  { id: "shiro", name: "Shiro", category: "Vegetarian", spicy: false, price: 120,
    description: "Smooth chickpea stew simmered with garlic, onion and berbere.",
    palette: ["#d99a2b"] },
  { id: "misir", name: "Misir Wot", category: "Vegetarian", spicy: true, price: 160,
    description: "Red lentils slow-cooked in a deep berbere sauce.",
    palette: ["#b9461f"] },
  { id: "firfir", name: "Firfir", category: "Breakfast", spicy: true, price: 140,
    description: "Shredded injera tossed in a spiced tomato and berbere sauce.",
    palette: ["#9a3b1e", "#d9b36a"] },
  { id: "ful", name: "Ful", category: "Breakfast", spicy: false, price: 120,
    description: "Mashed fava beans with olive oil, tomato, onion and green chili.",
    palette: ["#7a5a2e", "#e0c46b"] },
];

export const specialIds = ["shiro", "kitfo", "tibs"];

export function getDish(id) {
  return dishes.find((d) => d.id === id);
}

// Stands in for a database call. The delay is only felt when a page is rendered
// on demand (npm run dev) - a prerendered page pays it once, at build time.
export const DATA_DELAY_MS = 1200;

export async function getDishes() {
  await new Promise((resolve) => setTimeout(resolve, DATA_DELAY_MS));
  return dishes;
}
