// 4. Write a higher-order applyToAll(list, fn) that runs fn over every item and returns the results, then use it to add VAT to an array of prices. 

// Apply a function to every item in a list
function applyToAll(list, fn) {
    const results = [];

    list.forEach(function (item) {
        results.push(fn(item));
    });

    return results;
}

// Add 15% VAT to a price
function addVat(price) {
    return price * 1.15;
}

const prices = [100, 500, 1000];

const pricesWithVat = applyToAll(prices, addVat);

console.log("Prices:", prices);
console.log("Prices with VAT:", pricesWithVat);