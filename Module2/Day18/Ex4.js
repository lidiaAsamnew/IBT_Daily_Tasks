//  Spread operator

// Original customer object
const customer = {
    name: "Lidia",
    city: "Addis Ababa",
    balance: 2500
};

// Create a new object using spread
const updatedCustomer = {
    ...customer,
    city: "Bahir Dar",
    phone: "0912345678"
};

// Show both objects
console.log("Original customer:", customer);
console.log("Updated customer:", updatedCustomer);