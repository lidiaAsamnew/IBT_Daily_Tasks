
# 5. Big-O Analysis

# Finding the maximum takes one pass through the list.
# Time complexity: O(n)
def find_max(numbers):
    if len(numbers) == 0:
        return None

    maximum = numbers[0]

    for number in numbers:
        if number > maximum:
            maximum = number

    return maximum


numbers = [10, 25, 7, 40, 15]

print("5. Maximum number:", find_max(numbers))
print("Time complexity of find_max: O(n)")


# Two nested loops each go through n items.
# Time complexity: O(n^2)
def nested_loops(numbers):
    count = 0

    for first in numbers:
        for second in numbers:
            count += 1

    return count


print("Nested loop count:", nested_loops([1, 2, 3]))
print("The time complexity of nested_loops: O(n^2)")
print()


# 6. Linked List Basics

class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


class LinkedList:
    def __init__(self):
        self.head = None

    # Append is O(n) here because we travel to the last node.
    def append(self, value):
        new_node = Node(value)

        if self.head is None:
            self.head = new_node
            return

        current = self.head

        while current.next is not None:
            current = current.next

        current.next = new_node

    # Printing the whole linked list is O(n).
    def print_list(self):
        current = self.head

        while current is not None:
            print(current.value, end=" -> ")
            current = current.next

        print("None")


print("6. Linked List")

linked_list = LinkedList()

linked_list.append("Abebe")
linked_list.append("Betty")
linked_list.append("Dawit")

linked_list.print_list()
print()


# 7. Stack (LIFO)

class Stack:
    def __init__(self):
        self.items = []

    # O(1) average case
    def push(self, value):
        self.items.append(value)

    # O(1) average case
    def pop(self):
        if len(self.items) == 0:
            return None

        return self.items.pop()

    # O(1)
    def peek(self):
        if len(self.items) == 0:
            return None

        return self.items[-1]


def reverse_string(text):
    stack = Stack()

    # Put every character on the stack.
    for character in text:
        stack.push(character)

    reversed_text = ""

    # Remove characters from the top of the stack.
    while stack.peek() is not None:
        reversed_text += stack.pop()

    return reversed_text


print("7. Stack")

text = "Addis Ababa"

print("Original:", text)
print("Reversed:", reverse_string(text))

# The exact character-by-character reverse is:
# "ababA siddA"
#
# The assignment writes "ababa siddA", but that changes
# the uppercase A from the original "Ababa".
print()


# 8. Queue (FIFO)

class Queue:
    def __init__(self):
        self.items = []

    # Adding at the end of a list is O(1) average case.
    def enqueue(self, value):
        self.items.append(value)

    # Removing from the beginning of a list is O(n).
    def dequeue(self):
        if len(self.items) == 0:
            return None

        return self.items.pop(0)

    def is_empty(self):
        return len(self.items) == 0


print("8. Queue - Bank Simulation")

bank_queue = Queue()

# Customers arrive in this order.
bank_queue.enqueue("Customer 1")
bank_queue.enqueue("Customer 2")
bank_queue.enqueue("Customer 3")

# Customers are served in the same order they arrived.
while not bank_queue.is_empty():
    customer = bank_queue.dequeue()
    print("Serving:", customer)