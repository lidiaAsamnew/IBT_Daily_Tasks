// JavaScript Code
// Expected to be connected to my HTML
// CSS - LINK TAG
// JS - SCRIPT TAG

// CSS IS LINKED WITH IN THE HEAD
// DIFFERENCE FROM CSS IS THAT JS
// IS INCLUDED IN THE BODY BEFORE
// THE CLOSING BODY TAG

// PYTHON DISPLAY - Print("Hello World")

console.log("Hello World");
console.log("This is my first Js");

console.log(10 + 20);

console.log(true);
console.log(10.45 * 7);

// DATA TYPE EXAMPLES
// STRING - "Abebe Kebede"
// NUMBER - 10, 20, 30, 40.0 (int, float...)
// BOOLEAN - true, false
// ARRAY - [10, 20, 30, 40]
// NULL - null

// VARIABLE
let name = "Abebe Kebede";
console.log(name);

let age = 25;
console.log(age);

let isStudent = true;
console.log(isStudent);

let grades = [85, 90, 78, 92];
console.log(grades);
console.log(grades[2]);
console.log(grades[3]);

let address = null;
console.log(address);

//CONSTANT
const PI = 3.14159;
console.log(PI);

// PI = 3.14; // This will throw an error because PI is a constant

let x = 10; // int
console.log(x);

let y = String(x); // convert int to string
console.log(y);

let z = Number(y); // convert string to int
console.log(z);

let a = 10; // int
let b = "10"; // string

// FSTRING IN PYTHON
// name = "Abebe"
// print(f"My Name Is {name}")

// EQUIVALENT IN JAVA
// name = "Abebe";
// console.log("My Name Is " + name); // CONCATENATION

// backtick above tab key(template literal)
console.log(`My Name Is ${name}. I am ${age} years old.`); // TEMPLATE LITERAL

console.log(a == b);
// true, because == does type coercion
// checks only the value ignoring the type

console.log(a === b);
// false, because === checks for
// both value and type

// ALWAYS USE === FOR COMPARISON IN JS
// let p = 20;
// let p = 30;
// This will throw an error because
// p is already declared
// LET CAN NOT BE RE DECLARED

var q = 40;
var q = 50;
// This will not throw an error because
// q is declared with var
// VAR CAN BE RE DECLARED

// ARITHMETIC OPERATORS
let num1 = 10;
let num2 = 5;

console.log(num1 + num2);
console.log(num1 - num2);
console.log(num1 * num2);
console.log(num1 / num2);
console.log(num1 % num2); // MODULUS - REMAINDER
console.log(num1 ** num2); // EXPONENTIATION - POWER

// COMPARISON OPERATORS
console.log(num1 > num2); // TRUE
console.log(num1 < num2); // FALSE
console.log(num1 >= num2); // TRUE
console.log(num1 <= num2); // FALSE
console.log(num1 == num2); // FALSE
console.log(num1 === num2); // FALSE
console.log(num1 != num2); // TRUE
console.log(num1 !== num2); // TRUE

// LOGICAL OPERATORS
console.log(num1 > num2 && num2 < 50); // TRUE
console.log(num1 > num2 || num2 < 50); // TRUE
console.log(!(num1 > num2)); // FALSE

// AND (BOTH MUST BE TRUE)
// T && T = T
// T && F = F
// F && T = F
// F && F = F

// OR (AT LEAST ONE MUST BE TRUE)
// T || T = T
// T || F = T
// F || T = T
// F || F = F

// FLOW CONTROLS

// 1. SEQUENTIAL STATEMENTS
// (line-by-line execution of code)

// 2. CONDITIONAL STATEMENTS
// ITS A STATEMENT THAT EXECUTES A
// BLOCK OF CODE BASED ON A CONDITION
// EXECUTE IF TRUE,
// OTHERWISE EXECUTE ELSE BLOCK
// if, if..else, else if (elif in python), switch

let hight = 34;

// IN JS THERE IS NO INDENTATION RULE LIKE PYTHON
// INSTEAD, WE USE CURLY BRACES TO DEFINE BLOCKS OF CODE
if (hight < 20) {
  console.log("You are a short");
  console.log("Hi Mr. Short");
} else if (hight >= 20 && hight < 30) {
  console.log("You are a medium");
  console.log("Hi Mr. Medium");
} else if (hight >= 30 && hight < 40) {
  console.log("You are a tall");
  console.log("Hi Mr. Tall");
} else {
  console.log("You are a giant");
  console.log("Hi Mr. Giant");
}

// TERNARY OPERATOR (IF ELSE IN ONE LINE, SHORT HAND NOTATION)
// ? : (QUESTION MARK AND COLON)
// condition ? trueExpression1 : falseExpression2
let result = 30;
let grade;

// if (result >= 50) {
//   grade = "Pass";
// } else {
//   grade = "Fail";
// }
// console.log(grade);

// SHORTHAND NOTATION (TERNARY OPERATOR)
grade = result >= 50 ? "Pass" : "Fail";
console.log(grade);

switch (true) {
  case hight < 20: // hight < 20 => 34 < 20 => false (false === true)
    console.log("You are a short");
    break;
  case hight >= 20 && hight < 30: // hight >= 20 && hight < 30 => 34 >= 20 && 34 < 30 => true && false => false (false === true)
    console.log("You are a medium");
    break;
  case hight >= 30 && hight < 40: // true && true => true (true === true)
    console.log("You are a tall");
    break;
  default:
    console.log("You are a giant");
}

// SWITCH STATEMENT
let day = 5;
// THE SWITHCED ITEM IS COMPARED WITH EACH CASE
switch (day) {
  case 1: // IS 3 === 1? NO, GO TO NEXT CASE
    console.log("Today is Monday");
    break;
  case 2: // IS 3 === 2? NO, GO TO NEXT CASE
    console.log("Today is Tuesday");
    break;
  case 3: // IS 3 === 3? YES, EXECUTE THIS CASE
    console.log("Today is Wednesday");
    break; // BREAK OUT OF THE SWITCH STATEMENT
  case 4: // IS 3 === 4? NO, GO TO NEXT CASE
    console.log("Today is Thursday");
    break;
  case 5: // IS 3 === 5? NO, GO TO NEXT CASE
    console.log("Today is Friday");
    break;
  case 6: // IS 3 === 6? NO, GO TO NEXT CASE
    console.log("Today is Saturday");
    break;
  case 7: // IS 3 === 7? NO, GO TO NEXT CASE
    console.log("Today is Sunday");
    break;
  default:
    console.log("Invalid day");
}

// 3. LOOPING STATEMENTS
// EXECUTE SOME BLOCK OF CODE
// REPEATEDLY UNTIL A CONDITION IS MET
// while, do..while, for, for..in, for..

// WE NEED A COUNTER VARIABLE TO CONTROL THE LOOP

// WHILE LOOP
let count = 1;

while (count < 11) {
  console.log("Hi");
  count++;
}

// DO WHILE LOOP
let count2 = 5;

do {
  console.log("Hello");
  count2++;
} while (count2 < 5);

// FOR LOOP
for (let i = 0; i <= 10; i++) {
  console.log(i);
}

// FOR OF LOOP
const menu = ["Doro Wat", "Tibs", "Shiro"];

// cleanest way to walk a list

for (const x of menu) {
  console.log(x);
}

let r = 10;
console.log(r);

greet();

function greet() {
  console.log("Hello Everyone");
}

greet();
