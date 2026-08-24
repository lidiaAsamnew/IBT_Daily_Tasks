```Submit the github link here

What you will build 
A loyalty-points module for a TeleBirr shop that tracks a customer’s points balance privately and lets 
you earn and redeem points. The balance must not be directly reachable from outside — only 
through the functions you expose. 
Requirements 
• Use a closure to keep the points balance private — no outside code can read or change it 
directly. 
• Expose three operations: earn(amount), redeem(amount), and balance() (a getter that returns 
the current points). 
• earn should add points (e.g. 1 point per 10 ETB spent); redeem should subtract, but refuse to 
go below zero. 
• Use a higher-order function to apply an "earn rule" passed in — so a holiday rule (double 
points) can be swapped in without changing the module. 
• Keep the calculation functions pure; confine any console output to the edges. 

What to submit 
Push your module and a short demo script (earning, redeeming, printing the balance, and using a 
swapped-in earn rule) to a GitHub repository, with a README explaining how the balance stays 
private. 
Check yourself 
• Is the points balance truly private — impossible to read or set except through your functions? 
• Does redeem refuse to push the balance below zero? 
• Can you swap in a different earn rule without editing the module body? 
• Are the calculation functions pure, with side effects (logging) only at the edges? 
• Does a second card created from the factory keep its own independent balance? ```



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