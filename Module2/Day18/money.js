

// This module holds money-related helpers and constants.

// VAT rate
const VAT = 0.15;

// Function to add VAT to a price
function addVat(price) {
    return price * (1 + VAT);
}

// Export the function and VAT
module.exports = {
    addVat,
    VAT
};