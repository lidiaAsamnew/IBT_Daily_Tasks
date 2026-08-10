# Day 7 - Basic Exercises
# DSA I - Linear Structures & Big-O

# 1. Big-O Notation
print("1. Big-O Notation")
print("Accessing a list element by index: O(1)")
print("Searching for an element in a list using 'in': O(n)")
print("Inserting at the beginning of a list: O(n)")
print("Dictionary lookup by key: O(1) average case")
print()


# 2. Compare Complexities
print("2. Compare Complexities")
print("Fastest to slowest for large input:")
print("O(1) < O(log n) < O(n) < O(n^2)")
print()


# 3. Arrays / Lists
print("3. Arrays / Lists")

students = [
    "Abebe", "Betty", "Dawit", "Hana", "Kalkidan",
    "Liya", "Mekdes", "Nahom", "Sara", "Yonas"
]

# Access an element by index - O(1)
print("Student at index 2:", students[2])

# Add a student at the end - O(1) average case
students.append("Meron")
print("After adding at the end:", students)

# Insert a student at position 0 - O(n)
students.insert(0, "Samuel")
print("After inserting at position 0:", students)
print()


# 4. Hashmaps / Dictionaries
print("4. Hashmaps / Dictionaries")

student_grades = {
    "Abebe": 85,
    "Betty": 90,
    "Dawit": 78,
    "Hana": 92,
    "Kalkidan": 88
}

# Add a new student - O(1) average case
student_grades["Liya"] = 95

# Update a grade - O(1) average case
student_grades["Abebe"] = 91

# Check if a student exists - O(1) average case
student_name = "Hana"

if student_name in student_grades:
    print(student_name, "exists in the dictionary.")
else:
    print(student_name, "does not exist.")

print("Student grades:", student_grades)