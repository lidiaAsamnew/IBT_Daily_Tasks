
                //Live Class Exercise
// * Store your name in a variable
// * Store total marks of 3 subjects in an array
// * Calculate the total of the 3 subjects (using for of loop)
// * Calculate the average 
// * Using if...else statement display the grade (>90 = A, 80>avg>90 = B, C, D, F)
// * Finally display the name, total, and grade of the student is a single statement using string literal (backtick)


const name = "Lidia";

const marks = [80, 92, 85];

let total = 0;
for (const mark of marks) {
  total += mark;
}

const average = total / marks.length;

let grade;
if (average > 90) {
  grade = "A";
} else if (average >= 80) {
  grade = "B";
} else if (average >= 70) {
  grade = "C";
} else if (average >= 60) {
  grade = "D";
} else {
  grade = "F";
}

console.log(`Hey ${name}, Your Total Marks is ${total} and your Grade is ${grade}`);


