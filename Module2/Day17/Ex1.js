//vat function using a default parameter
function vat(amount, rate = 0.15) {
    return amount * rate;
}

console.log("VAT:", vat(1000));

// using an arrow function
const vatA = (amount, rate = 0.15) => amount * rate;

console.log("VAT:", vatA(1000));