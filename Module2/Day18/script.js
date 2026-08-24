const vowel = [ "a", "e", "i", "o", "u"];

vowel[0]
console.log(vowel.length);
console.log(vowel[vowel.length-1]);

const newVowel = vowel.map((vowel => vowel + " is a vowel"));
console.log(newVowel);

console.log(vowel.push("u"));
console.log(vowel.pop());
console.log(vowel.includes("i"));
console.log(vowel.indexOf("e"));

const bankAccount = {
    balance: 1000,
    owner: "Lidia Asamnew",
    interest: 200,

    deposit(amount) {
        this.balance += amount;
        console.log(`Deposited ${amount}. Balance: ${this.balance}`);
    },

    withdraw(amount) {
        if (amount > this.balance) {
            console.log("Insufficient balance");
        } else {
            this.balance -= amount;
            console.log(`Withdrew ${amount}. Balance: ${this.balance}`);
        }
    }
};

console.log(bankAccount.deposit(20000));
console.log(bankAccount.withdraw(200));


//map is an array method
//map is a function 
//filter take condition


//create an array which is called numbers [10,17, 20,23,25,28,29,32]
//use map, filter , reducer
//filter the even nums 
// map the filtered ones to there square
//redu e the squares to the sum

const numbers = [10, 17, 20, 23, 25, 28, 29, 32];

console.log(numbers.includes("17"))
console.log(numbers.indexOf(17))

const result = numbers
    .filter((n) => n % 2 === 0)
    .map((e) => e * e)
    .reduce((a, c) => a + c, 0);

console.log(result);

const total = numbers.reduce((sum, p) => sum + p, 0)

// looping over objects
const prices = { tibs: 200, shiro:120 }

//1 object.keys gives us the names of the key
for (const dish of Object.keys(prices)){
    console.log(dish)
}
//2 object.entities both as [key, value]
for(const [dish, price] of Object.entries(prices)){
    console.log(`${dish}, ${price}`)
}

//destructuring: pulls the values out 
//spread: coopies and merges 
//rest: gathers the leftover


