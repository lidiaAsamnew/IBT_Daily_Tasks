// Object.entries + for...of loop

//customer object
const customer = {
    name: "Lidia",
    city: "Addis Ababa",
    balance: 2500
};

// Get the keys and values as pairs
const customerEntries = Object.entries(customer);

// Loop through every key and value
for (const [key, value] of customerEntries) {
    console.log(key, ":", value);
}