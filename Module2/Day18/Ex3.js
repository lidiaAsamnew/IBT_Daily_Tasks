// Destructuring


// Customer object
const customer = {
    name: "Lidia",
    city: "Addis Ababa",
    balance: 2500
};

// Destructure name and city in one line
const { name, city } = customer;

console.log("Name:", name);
console.log("City:", city);

// Function using parameter destructuring
function greet({ name }) {
    console.log("Hello", name);
}

// Call the function
greet(customer);