"""
Day 2 - Level 1: Basic Python Exercises
Covers: Variables & Data Types, Arithmetic Operations,
        Type Conversion, Simple Decision (if/else)
"""


# 1. Variables & Data Types

full_name = "Lidia Asamnew"      # string
age = 22                         # integer
height = 1.58                    # float (in meters)
is_student = True                # boolean
favorite_food = "Shiro Wet"       # string

# Print the details in an attractive, readable sentence using f-strings
print("=" * 50)
print("PERSONAL PROFILE")
print("=" * 50)
print(f"👋 Hello! My name is {full_name}, I am {age} years old, "
      f"and I stand {height}m tall.")
print(f"📚 Student status: {'Yes, I am a student' if is_student else 'No, I am not a student'}.")
print(f"🍽️  My favorite food is {favorite_food}.")
print()

# 2. Arithmetic Operations

print("=" * 50)
print("ARITHMETIC OPERATIONS")
print("=" * 50)

# Get two numbers from the user and cast them to float
num1 = float(input("Enter the first number: "))
num2 = float(input("Enter the second number: "))

# Perform all arithmetic operations
addition = num1 + num2
subtraction = num1 - num2
multiplication = num1 * num2
division = num1 / num2 if num2 != 0 else "Undefined (division by zero)"
floor_division = num1 // num2 if num2 != 0 else "Undefined (division by zero)"
remainder = num1 % num2 if num2 != 0 else "Undefined (division by zero)"

# Display results neatly
print(f"\nResults for {num1} and {num2}:")
print(f"  ➕ Sum              : {addition}")
print(f"  ➖ Difference       : {subtraction}")
print(f"  ✖️  Product          : {multiplication}")
print(f"  ➗ Division         : {division}")
print(f"  🔽 Floor Division   : {floor_division}")
print(f"  🔄 Remainder        : {remainder}")
print()


# 3. Type Conversion

print("=" * 50)
print("AGE CALCULATOR")
print("=" * 50)

current_year = 2026  

birth_year = int(input("Enter your birth year: "))  # cast input to int
calculated_age = current_year - birth_year

print(f"You are approximately {calculated_age} years old in {current_year}.")
print()


# 4. Simple Decision (if/else)

print("=" * 50)
print("PASS OR FAIL CHECK")
print("=" * 50)

score = float(input("Enter your score (0-100): "))

if score >= 50:
    print(f"Score: {score} ->  Pass")
else:
    print(f"Score: {score} ->  Fail")