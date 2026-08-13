// map, filter, reduce on ETB prices

// Array of prices in ETB
const prices = [500, 800, 1200, 300, 950];

// Add 15% VAT to every price
const pricesWithVat = prices.map(function (price) {
    return price * 1.15;
});

// Keep only prices under 1000 ETB
const pricesUnder1000 = pricesWithVat.filter(function (price) {
    return price < 1000;
});

// Calculate the grand total
const grandTotal = pricesUnder1000.reduce(function (total, price) {
    return total + price;
}, 0);

console.log("Prices with VAT:", pricesWithVat);
console.log("Prices under 1000:", pricesUnder1000);
console.log("Grand Total:", grandTotal);