console.log("1-take order")

setTimeout(()=>{
    console.log("3-food is ready")
}, 2000)

console.log("2-this one is ready")// Imagine fetching data from the internet
const fetchData = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve({ name: "John", age: 25 });  // After 2 seconds, resolve with data
  }, 2000);
});

// Wait for the promise to resolve, then use the data
fetchData.then((data) => {
  console.log("Data arrived:", data);
});


// PROMISES

const x = new Promise((resolve, reject) => {
  resolve("Hello, World!");
  reject("Error: Something went wrong!");
});

console.log(x);

// function getSth() {
//   return new Promise((resolve, reject) => {
//     resolve("Hello, World!");
//     reject("Error: Something went wrong!");
//   });
// }

// PROMISES WITH CALLBACKS
let y = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Hello, World!");
  }, 2000);
});

console.log(y);

async function getDishes () {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    if (!res.ok) {
        throw new Error("HTTP " + res.status);
    }   
    const dishes = await res.json();
    return dishes;
}
