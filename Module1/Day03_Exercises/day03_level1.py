
# Exercise 1: Lists & Tuples

favorite_foods = ["shiro", "Kuanta firfir", "Testy tibs", "chocolate", "Ertib"]

print(f"First food: {favorite_foods[0]}")
print(f"Last food: {favorite_foods[-1]}")

# .append() adds a new item to the end of the list
favorite_foods.append("Chips")
print(f"List after append(): {favorite_foods}")

# .pop(index) removes and returns the item at that index.
removed_food = favorite_foods.pop(1)
print(f"Removed food (was 2nd in list): {removed_food}")
print(f"List after pop(): {favorite_foods}")


ethiopia_coordinates = (9.1450, 40.4897)  # (latitude, longitude)

# Tuple unpacking which is that assigning each value in the tuple to its own variable.
latitude, longitude = ethiopia_coordinates
print(f"Ethiopia's coordinates -> Latitude: {latitude}, Longitude: {longitude}")
print()

# Exercise 2: Dictionaries

# key-value pairs 
student = {
    "name": "Lidia Asamnew",
    "age": 22,
    "grade": "3.5",
    "city": "Addis Ababa",
    "department": "Software Engineering"
}

# Access values using their key inside square brackets
print(f"Student Name: {student['name']}")
print(f"Department: {student['department']}")
print(f"Grade: {student['grade']}")

# Adding a new key-value pair is as simple as assigning to a new key.
student["phone"] = "0900024893"

# Updating an existing key just overwrites its value.
student["grade"] = "3.56"

print("\nUpdated student dictionary:")
for key, value in student.items():
    print(f"  {key}: {value}")
print()


# Exercise 3: Sets

# A list that contains duplicate names on purpose.
names_with_duplicates = ["Abel", "Sara", "Abel", "Marta", "Sara", "Daniel"]
print(f"Original list (with duplicates): {names_with_duplicates}")

# Converting a list to a set automatically removes duplicates, because a set is a collection that only allows UNIQUE items.
unique_names = set(names_with_duplicates)
print(f"Set after we remove duplicates: {unique_names}")

# .add() inserts a new item into the set (if it isn't already there).
unique_names.add("Lidia")
print(f"Set after we add a new name: {unique_names}")