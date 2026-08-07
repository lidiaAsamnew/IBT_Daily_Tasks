
# Exercise 8: File Reading & Writing

# Data we want to save: 5 students and their scores.
students_data = [
    ("Lidia", 85),
    ("Sara", 90),
    ("Abel", 78),
    ("Marta", 88),
    ("Daniel", 95)
]

with open("students.txt", "w") as file:
    for name, score in students_data:
        file.write(f"{name},{score}\n")

print("students.txt has been created and filled with student data.")


# Reading the file back. We wrap this in try/except in case the file is missing or unreadable.
try:
    with open("students.txt", "r") as file:
        lines = file.readlines()  # reads every line into a list of strings

    scores = []
    print("\nStudents read from file:")
    for line in lines:
        line = line.strip() 
        name, score_text = line.split(",") 
        score = int(score_text) 
        scores.append(score)
        print(f"  {name}: {score}")

    average_score = sum(scores) / len(scores)
    print(f"\nAverage score: {average_score:.2f}")

except FileNotFoundError:
    # This runs only if students.txt does not exist.
    print("Error: students.txt was not found. Please make sure it was created.")
print()


# Exercise 9: Error Handling

print("=" * 50)

try:
    first_number = float(input("Enter the first number: "))
    second_number = float(input("Enter the second number: "))

    result = first_number / second_number
    print(f"Result: {first_number} / {second_number} = {result}")

except ValueError:
    # Runs if the user typed something that isn't a valid number.
    print("Error: Please enter valid numbers only.")

except ZeroDivisionError:
    # Runs if the user tries to divide by zero.
    print("Error: You cannot divide by zero.")

finally:
    # This block ALWAYS runs, whether an error happened or not.
    print("Calculation attempt completed")