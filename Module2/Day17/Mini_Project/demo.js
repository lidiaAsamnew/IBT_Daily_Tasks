const {
    createLoyaltyCard,
    normalEarnRule
} = require("./loyalty");

// Create a normal loyalty card
const card = createLoyaltyCard(normalEarnRule);

console.log("Starting balance:", card.balance());

// Earn points from spending 100 ETB
card.earn(100);

console.log("After spending 100 ETB:", card.balance(), "points");

// Redeem 5 points
const redeemed = card.redeem(5);

console.log("Redeemed 5 points:", redeemed);
console.log("Current balance:", card.balance(), "points");

// Try to redeem more points than the customer has
const tooMuch = card.redeem(20);

console.log("Trying to redeem 20 points:", tooMuch);
console.log("Balance after failed redeem:", card.balance(), "points");


// Holiday rule...double the normal points
function holidayEarnRule(amount) {
    return Math.floor(amount / 10) * 2;
}

// Create another card using the holiday rule
const holidayCard = createLoyaltyCard(holidayEarnRule);

holidayCard.earn(100);

console.log("Holiday card balance:", holidayCard.balance(), "points");


// The two cards have separate balances
console.log("Normal card balance:", card.balance(), "points");
console.log("Holiday card balance:", holidayCard.balance(), "points");