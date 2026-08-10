# 1. Recursion Basics

# Recursive factorial.
# The function calls itself until it reaches the base case.
def factorial(n):
    if n < 0:
        return None

    if n == 0 or n == 1:
        return 1

    return n * factorial(n - 1)


# Iterative factorial for comparison.
def factorial_iterative(n):
    if n < 0:
        return None

    result = 1

    for number in range(1, n + 1):
        result *= number

    return result


print("1. Recursion Basics")

number = 5

print("Recursive factorial:", factorial(number))
print("Iterative factorial:", factorial_iterative(number))
print()


# 2. Recursion with Lists

def sum_list(numbers):
    # Base case: an empty list has a sum of 0.
    if len(numbers) == 0:
        return 0

    # Add the first number and recursively sum the rest.
    return numbers[0] + sum_list(numbers[1:])


print("2. Recursion with Lists")

numbers = [10, 20, 30, 40]

print("List:", numbers)
print("Sum:", sum_list(numbers))
print()


# 3. Linear Search

def linear_search(arr, target):
    # Check every element from left to right.
    for index in range(len(arr)):
        if arr[index] == target:
            return index

    # Target was not found.
    return -1


print("3. Linear Search")

numbers = [15, 8, 23, 42, 10]

print("Array:", numbers)
print("Index of 42:", linear_search(numbers, 42))
print("Index of 99:", linear_search(numbers, 99))
print()


# 4. Binary Search

def binary_search(arr, target):
    left = 0
    right = len(arr) - 1

    while left <= right:

        middle = (left + right) // 2

        if arr[middle] == target:
            return middle

        elif arr[middle] < target:
            # Target must be on the right side.
            left = middle + 1

        else:
            # Target must be on the left side.
            right = middle - 1

    return -1


print("4. Binary Search")

sorted_numbers = [5, 10, 15, 20, 25, 30, 35]

print("Sorted array:", sorted_numbers)
print("Index of 25:", binary_search(sorted_numbers, 25))
print("Index of 100:", binary_search(sorted_numbers, 100))

print(
    "Binary search needs a sorted array because it decides "
    "which half of the array can be ignored."
)
print()


# 5. Bubble Sort

def bubble_sort(arr):
    numbers = arr.copy()

    # Each pass moves the largest remaining value to the end.
    for pass_number in range(len(numbers) - 1):

        for index in range(len(numbers) - 1 - pass_number):

            if numbers[index] > numbers[index + 1]:

                numbers[index], numbers[index + 1] = (
                    numbers[index + 1],
                    numbers[index]
                )

        # Print the array after every pass.
        print(
            "After pass",
            pass_number + 1,
            ":",
            numbers
        )

    return numbers


print("5. Bubble Sort")

numbers = [5, 2, 8, 1, 3]

print("Original array:", numbers)

sorted_numbers = bubble_sort(numbers)

print("Sorted array:", sorted_numbers)