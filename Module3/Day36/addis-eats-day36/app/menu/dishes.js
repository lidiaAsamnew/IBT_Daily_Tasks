// Sample data. Replace with your Day 35 data if it differs.
export const categories = ["All", "Meat", "Vegetarian", "Breakfast"];

export const dishes = [
  { id: "kitfo", name: "Kitfo", category: "Meat", price: 320, description: "Minced beef with spiced butter and mitmita." },
  { id: "tibs", name: "Doro Tibs", category: "Meat", price: 280, description: "Sauteed chicken with onion and rosemary." },
  { id: "shiro", name: "Shiro", category: "Vegetarian", price: 150, description: "Chickpea stew simmered with berbere." },
  { id: "misir", name: "Misir Wot", category: "Vegetarian", price: 160, description: "Spicy red lentil stew." },
  { id: "firfir", name: "Firfir", category: "Breakfast", price: 140, description: "Shredded injera tossed in spiced sauce." },
  { id: "ful", name: "Ful", category: "Breakfast", price: 120, description: "Mashed fava beans with oil and spices." },
];

export function getDish(id) {
  return dishes.find((d) => d.id === id);
}
