console.log("This is JS Functions Exercise.");

function sum(a, b) {
    return a + b;
}
console.log(sum(10, 20));


//total price with VAT calculator

//A function with two parameter
//param 1- rest(...varNamen)
//param 2- default value(vat= 0.15)
//sum of the passed values (array)
//return sum*vat

//call the function with 3 values and console log  the result

function totalPrice(vat = 0.15, ...vatNumbers) {
    let sum = 0;

    for (let price of vatNumbers) {
        sum = sum + price;
    }

    return sum * vat;
}

console.log(totalPrice(undefined, 100, 200, 400));

//today we learned about arrow function and about arguments
//Functions, Closures &
//Higher-Order Functions

