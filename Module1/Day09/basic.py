
# Trees, Graphs and Heaps


# 1. TREE BASICS

class TreeNode:
    def __init__(self, name):
        self.name = name
        self.children = []

    def add_child(self, child):
        self.children.append(child)



def print_tree(node, level=0):
    print("  " * level + node.name)

    for child in node.children:
        print_tree(child, level + 1)


# Create the bank hierarchy
head_office = TreeNode("Head Office")

bole_branch = TreeNode("Bole Branch")
teller = TreeNode("Teller")
loan_officer = TreeNode("Loan Officer")

piassa_branch = TreeNode("Piassa Branch")

# Build the tree
bole_branch.add_child(teller)
bole_branch.add_child(loan_officer)

head_office.add_child(bole_branch)
head_office.add_child(piassa_branch)

print("1. Bank Hierarchy")
print_tree(head_office)



# 2. BINARY SEARCH TREE

class BSTNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


class BinarySearchTree:
    def __init__(self):
        self.root = None

    # Insert a value into the BST
    # Average time: O(log n)
    # Worst case: O(n)
    def insert(self, value):
        new_node = BSTNode(value)

        if self.root is None:
            self.root = new_node
            return

        current = self.root

        while True:
            if value < current.value:
                if current.left is None:
                    current.left = new_node
                    return
                current = current.left

            else:
                if current.right is None:
                    current.right = new_node
                    return
                current = current.right

    # Search for a value
    # Average time: O(log n)
    # Worst case: O(n)
    def search(self, value):
        current = self.root

        while current is not None:
            if value == current.value:
                return True

            if value < current.value:
                current = current.left
            else:
                current = current.right

        return False


bst = BinarySearchTree()

values = [50, 30, 70, 20, 40, 60]

for value in values:
    bst.insert(value)

print("\n2. Binary Search Tree")

if bst.search(40):
    print("40 exists in the tree.")
else:
    print("40 does not exist in the tree.")

if bst.search(100):
    print("100 exists in the tree.")
else:
    print("100 does not exist in the tree.")


# 3. GRAPH BASICS

# Dictionary is used as an adjacency list
graph = {
    "Almaz": [],
    "Dawit": [],
    "Tigist": [],
    "Hanna": []
}


# Add connections between customers
def add_connection(customer1, customer2):
    graph[customer1].append(customer2)
    graph[customer2].append(customer1)


add_connection("Almaz", "Dawit")
add_connection("Almaz", "Tigist")
add_connection("Dawit", "Hanna")
add_connection("Tigist", "Hanna")


print("\n3. Customer Money Transfer Graph")

for customer, connections in graph.items():
    print(customer, "->", connections)



# 4. HEAP BASICS

import heapq

# Create an empty priority queue
transactions = []

# Add transactions to the heap
heapq.heappush(transactions, (5000, "Big Loan"))
heapq.heappush(transactions, (200, "Small Deposit"))
heapq.heappush(transactions, (10000, "Fraud Alert"))

print("\n4. Urgent Transactions")

print("Priority queue:", transactions)

# Pop the smallest value because heapq is a min-heap
highest_priority = heapq.heappop(transactions)

print("Highest priority item:", highest_priority)