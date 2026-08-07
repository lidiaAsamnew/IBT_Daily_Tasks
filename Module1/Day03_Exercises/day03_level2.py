
# Exercise 4: List Operations

numbers = [10, 25, 40, 15, 60, 30]
print(f"Original list: {numbers}")


print("\nNumbers greater than 30:")

for num in numbers:
    if num > 30: 
        print(num, end=" ")
print()


numbers.sort()
print(f"\nSorted list: {numbers}")


total = sum(numbers)

# Average = total sum divided by how many items there are (len()).
average = total / len(numbers)

print(f"Sum of numbers: {total}")
print(f"Average of numbers: {average:.2f}")
print()

# Exercise 5: Dictionary Operations


products = {
    "Laptop": 50000,
    "Phone": 25000,
    "Headphones": 1500,
    "Keyboard": 1200,
    "Mouse": 800
}

# Loop through the dictionary using .items() to get both key and value.
print("Available Products:")
for product_name, price in products.items():
    print(f"  {product_name:<12} : {price} birr")


user_product = input("\nEnter product name: ")


price = products.get(user_product.title(), None)

if price is not None:
    print(f"{user_product.title()} costs {price} birr.")
else:
    print("Product not found.")
print()


# Exercise 6: List Comprehension


# List comprehension is a short way to build a list in one line.
# The basic structure is: [expression for item in range/iterable if condition]

# 1. Numbers from 1 to 20
numbers_1_to_20 = [n for n in range(1, 21)]
print(f"Numbers 1 to 20: {numbers_1_to_20}")

# 2. Even numbers from 1 to 30 (the "if" part filters which numbers are kept)
even_numbers = [n for n in range(1, 31) if n % 2 == 0]
print(f"Even numbers 1 to 30: {even_numbers}")

# 3. Odd numbers from 1 to 10
odd_numbers = [n for n in range(1, 11) if n % 2 != 0]
print(f"Odd numbers 1 to 10: {odd_numbers}")


















with open("stock.txt") as f:
    content = f.read()
    print(content)

with open("stock.txt") as f:
     text = f.read()
print(text)