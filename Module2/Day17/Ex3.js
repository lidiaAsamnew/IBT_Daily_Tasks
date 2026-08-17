//3. Write a discountBy(rate) factory and create memberPrice (10%) and salePrice (30%) from it. Apply both to a price of 1000 ETB. 

//a function that creates discount functions
function discountBy(rate) {
    return function (price) {
        return price - (price * rate);
    };
}

//discount functions
const memberPrice = discountBy(0.10);
const salePrice = discountBy(0.30);

const price = 1000;

console.log("Member price:", memberPrice(price), "ETB");
console.log("Sale price:", salePrice(price), "ETB");