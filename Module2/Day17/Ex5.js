// 5. Use forEach (a callback) to print each Ethiopian city in an array with its index, e.g. "1. Addis Ababa".

const cities = [
    "Addis Ababa",
    "Bahir Dar",
    "Hawassa",
    "Mekelle"
];

cities.forEach(function (city, index) {
    console.log((index + 1) + ". " + city);
});