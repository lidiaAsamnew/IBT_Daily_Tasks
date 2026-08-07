# 5. Grade Classifier

score = float(input("Enter your score (0-100): "))

# Use if/elif/else to classify the score into a grade
if score >= 90:
    grade = "Excellent"
elif score >= 80:
    grade = "Very Good"
elif score >= 70:
    grade = "Good"
elif score >= 50:
    grade = "Pass"
else:
    grade = "Fail"

print(f"Your score is {score} -> Grade: {grade}")
print()


# 6. Number Pattern

# Print all numbers from 1 to 20
print("All numbers from 1 to 20:")
for number in range(1, 21):
    print(number, end=" ")
print("\n")

# Print only odd numbers
print("Odd numbers from 1 to 20:")
for number in range(1, 21):
    if number % 2 != 0:
        print(number, end=" ")
print("\n")

# Print only numbers divisible by 5 using a nested if inside a for loop
print("Numbers divisible by 5 (from 1 to 20):")
for number in range(1, 21):
    if number % 5 == 0:  # nested if inside the for loop
        print(number, end=" ")
print("\n")


# 7. While Loop Practice


total_sum = 0  # keeps track of the running total

while True:
    user_number = float(input("Enter a positive number (0 to stop): "))
    if user_number == 0:
        break  # exit the loop when user enters 0
    total_sum += user_number  # add the number to the running total

print(f"\n Total sum of all entered numbers: {total_sum}")
print()


# 8. Function Practice




def greet(name):
    """Prints a welcome message for the given name."""
    print(f" Welcome, {name}! Great to have you here.")


def square(number):
    """Returns the square of the given number."""
    return number * number


def is_even(number):
    """Returns True if the number is even, False otherwise."""
    return number % 2 == 0


# Testing the functions
greet("Sara")

num_to_square = 6
print(f"The square of {num_to_square} is {square(num_to_square)}.")

num_to_check = 7
if is_even(num_to_check):
    print(f"{num_to_check} is an even number.")
else:
    print(f"{num_to_check} is an odd number.")