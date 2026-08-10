
import time
from collections import deque


# 9. Performance Comparison

print("9. Performance Comparison")


# Search in a list vs dictionary

size = 100000

numbers = list(range(size))

number_dictionary = {
    number: True
    for number in range(size)
}

search_value = size - 1


# Search in list
start = time.perf_counter()

search_value in numbers

list_time = time.perf_counter() - start


# Search in dictionary
start = time.perf_counter()

search_value in number_dictionary

dictionary_time = time.perf_counter() - start


print("List search time:", list_time)
print("Dictionary search time:", dictionary_time)

print("List search: O(n)")
print("Dictionary lookup: O(1) average case")
print()


# Insert 10,000 elements at the beginning of a list

count = 10000


# Python list
start = time.perf_counter()

my_list = []

for number in range(count):
    my_list.insert(0, number)

list_insert_time = time.perf_counter() - start


# deque
start = time.perf_counter()

my_deque = deque()

for number in range(count):
    my_deque.appendleft(number)

deque_insert_time = time.perf_counter() - start


print("List insert at beginning time:", list_insert_time)
print("deque insert at beginning time:", deque_insert_time)

print("List insert at beginning: O(n)")
print("deque appendleft: O(1)")
print()


# 10. Choose the Right Structure

print("10. Choose the Right Structure")

print(
    "Checking if a username is taken: "
    "Dictionary - O(1) average lookup"
)

print(
    "Customer support tasks in arrival order: "
    "Queue - FIFO"
)

print(
    "Undo feature in a text editor: "
    "Stack - LIFO"
)

print(
    "Student IDs for fast lookup: "
    "Dictionary - O(1) average lookup"
)

print()


# 11. Linked List vs Array


# Remove the middle element from a Python list.
#
# Finding the middle index is O(1),
# but removing it can shift elements.
# Overall time complexity: O(n)
def remove_middle_list(items):

    if len(items) == 0:
        return

    middle = len(items) // 2

    items.pop(middle)


# Node for linked list
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None


# Linked List
class LinkedList:
    def __init__(self):
        self.head = None

    def append(self, value):

        new_node = Node(value)

        if self.head is None:
            self.head = new_node
            return

        current = self.head

        while current.next is not None:
            current = current.next

        current.next = new_node

    def remove_middle(self):

        if self.head is None:
            return

        # If there is only one node, remove it.
        if self.head.next is None:
            self.head = None
            return

        # Slow moves one step.
        # Fast moves two steps.
        # When fast reaches the end, slow is at the middle.
        previous = None
        slow = self.head
        fast = self.head

        while fast is not None and fast.next is not None:

            previous = slow
            slow = slow.next
            fast = fast.next.next

        # Remove the middle node.
        previous.next = slow.next

    def print_list(self):

        current = self.head

        while current is not None:
            print(current.value, end=" -> ")
            current = current.next

        print("None")


print("Python list before removing middle:")

list_data = [1, 2, 3, 4, 5]

print(list_data)

remove_middle_list(list_data)

print("Python list after removing middle:")
print(list_data)

print(
    "List middle removal: O(n) because "
    "later elements may be shifted."
)

print()


print("Linked list before removing middle:")

linked_list = LinkedList()

for number in [1, 2, 3, 4, 5]:
    linked_list.append(number)

linked_list.print_list()

linked_list.remove_middle()

print("Linked list after removing middle:")

linked_list.print_list()

print(
    "Linked list middle removal: O(n) because "
    "we still need to find the middle."
)

print()


# Trade-offs
print("Trade-off:")

print(
    "- Python list gives fast index access: O(1)."
)

print(
    "- Linked list gives flexible node connections "
    "but no fast index access."
)

print(
    "- Removing a known linked-list node can be O(1), "
    "but finding the node can take O(n)."
)