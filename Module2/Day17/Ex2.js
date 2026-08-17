// 2. Write a makeCounter closure that returns a function incrementing a private count. Call it several times and, in a comment, explain why count stays private.

function makeCounter() {
    let count = 0;

    return function () {
        count++;
        return count;
    };
}

const counter = makeCounter();

console.log(counter());
console.log(counter());
console.log(counter());
console.log(counter());