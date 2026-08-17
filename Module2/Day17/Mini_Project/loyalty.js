// Calculate normal points...1 point for every 10 ETB
function normalEarnRule(amount) {
    return Math.floor(amount / 10);
}

// Apply any earn rule passed to this function
function applyEarnRule(amount, earnRule) {
    return earnRule(amount);
}

// Create a new loyalty card
function createLoyaltyCard(earnRule = normalEarnRule) {
    let points = 0;

    function earn(amount) {
        const newPoints = applyEarnRule(amount, earnRule);
        points = points + newPoints;
    }

    function redeem(amount) {
        if (amount <= points) {
            points = points - amount;
            return true;
        }

        return false;
    }

    function balance() {
        return points;
    }

    return {
        earn,
        redeem,
        balance
    };
}

module.exports = {
    createLoyaltyCard,
    normalEarnRule,
    applyEarnRule
};