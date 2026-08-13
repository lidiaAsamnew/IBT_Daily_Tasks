// Import addVat and VAT from money.js
const { addVat, VAT } = require("./money");

// Price before VAT
const price = 1000;

// Calculate price with VAT
const finalPrice = addVat(price);

console.log("VAT:", VAT);
console.log("Price:", price);
console.log("Price with VAT:", finalPrice);