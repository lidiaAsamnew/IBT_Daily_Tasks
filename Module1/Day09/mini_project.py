
# Addis Bank Network & Priority System


import heapq
from collections import deque



# TREE

class TreeNode:
    def __init__(self, name):
        self.name = name
        self.children = []

    # Adding a child is O(1)
    def add_child(self, child):
        self.children.append(child)


def print_tree(node, level=0):
    print("  " * level + node.name)

    for child in node.children:
        print_tree(child, level + 1)


# Create the bank tree
bank = TreeNode("Addis Bank")

bole = TreeNode("Bole Branch")
piassa = TreeNode("Piassa Branch")

bole.add_child(TreeNode("Teller"))
bole.add_child(TreeNode("Loan Officer"))

piassa.add_child(TreeNode("Teller"))

bank.add_child(bole)
bank.add_child(piassa)



# GRAPH

graph = {
    "Almaz": ["Dawit"],
    "Dawit": ["Almaz", "Tigist"],
    "Tigist": ["Dawit", "Hanna"],
    "Hanna": ["Tigist"]
}


# Add a new customer if they don't exist
def add_customer(name):
    if name not in graph:
        graph[name] = []


# Add a money transfer connection
# Adding a connection is O(1) on average
def add_transfer(customer1, customer2):
    add_customer(customer1)
    add_customer(customer2)

    graph[customer1].append(customer2)
    graph[customer2].append(customer1)

    print("Transfer connection added.")


# BFS visits customers level by level
# Time complexity: O(V + E)
def bfs(start):
    if start not in graph:
        print("Customer not found.")
        return

    visited = set()
    queue = deque([start])

    print("BFS:", end=" ")

    while queue:
        customer = queue.popleft()

        if customer not in visited:
            print(customer, end=" ")
            visited.add(customer)

            for connection in graph[customer]:
                if connection not in visited:
                    queue.append(connection)

    print()


# DFS goes as deep as possible before going back
# Time complexity: O(V + E)
def dfs(start, visited=None):
    if start not in graph:
        print("Customer not found.")
        return

    if visited is None:
        visited = set()

    visited.add(start)
    print(start, end=" ")

    for connection in graph[start]:
        if connection not in visited:
            dfs(connection, visited)



# HEAP


transactions = []


# Add a transaction to the heap
# Time complexity: O(log n)
def add_transaction(priority, name):
    heapq.heappush(transactions, (priority, name))
    print("Transaction added.")


# Process the highest priority transaction
# Time complexity: O(log n)
def process_transaction():
    if not transactions:
        print("There are no urgent transactions.")
        return

    priority, name = heapq.heappop(transactions)

    print("Processing:", name)
    print("Priority:", priority)



# CUSTOMER BST


class BSTNode:
    def __init__(self, account_number):
        self.account_number = account_number
        self.left = None
        self.right = None


class CustomerBST:
    def __init__(self):
        self.root = None

    # Average: O(log n)
    # Worst case: O(n)
    def insert(self, account_number):
        new_node = BSTNode(account_number)

        if self.root is None:
            self.root = new_node
            return

        current = self.root

        while True:
            if account_number < current.account_number:

                if current.left is None:
                    current.left = new_node
                    return

                current = current.left

            else:

                if current.right is None:
                    current.right = new_node
                    return

                current = current.right

    # Average: O(log n)
    # Worst case: O(n)
    def search(self, account_number):
        current = self.root

        while current is not None:

            if account_number == current.account_number:
                return True

            if account_number < current.account_number:
                current = current.left
            else:
                current = current.right

        return False


# Create customer accounts
customer_accounts = CustomerBST()

customer_accounts.insert(1001)
customer_accounts.insert(1005)
customer_accounts.insert(1003)
customer_accounts.insert(1010)



# MENU FUNCTIONALITY


def add_branch_or_employee():
    name = input("Enter new branch or employee name: ")

    print("Choose where to add it:")
    print("1. Under Head Office")
    print("2. Under Bole Branch")
    print("3. Under Piassa Branch")

    choice = input("Choose: ")

    new_node = TreeNode(name)

    if choice == "1":
        bank.add_child(new_node)
        print("Added under Head Office.")

    elif choice == "2":
        bole.add_child(new_node)
        print("Added under Bole Branch.")

    elif choice == "3":
        piassa.add_child(new_node)
        print("Added under Piassa Branch.")

    else:
        print("Invalid choice.")


def show_customers():
    start = input("Enter starting customer: ")

    print("\nBFS:")
    bfs(start)

    print("\nDFS:")
    dfs(start)
    print()


def search_account():
    account = input("Enter account number: ")

    try:
        account_number = int(account)

        if customer_accounts.search(account_number):
            print("Account exists.")
        else:
            print("Account does not exist.")

    except ValueError:
        print("Please enter a valid account number.")



# MAIN MENU


while True:

    print("\n==============================")
    print(" Addis Bank Network System")
    print("==============================")

    print("1. Add new branch / employee")
    print("2. Add money transfer connection")
    print("3. Show connected customers using BFS/DFS")
    print("4. Add urgent transaction")
    print("5. Process highest priority transaction")
    print("6. Search for customer account in BST")
    print("7. Show bank tree")
    print("8. Exit")

    choice = input("Choose an option: ")

    if choice == "1":

        add_branch_or_employee()

    elif choice == "2":

        customer1 = input("Enter first customer: ")
        customer2 = input("Enter second customer: ")

        add_transfer(customer1, customer2)

    elif choice == "3":

        show_customers()

    elif choice == "4":

        try:
            priority = int(input("Enter priority number: "))
            name = input("Enter transaction name: ")

            add_transaction(priority, name)

        except ValueError:
            print("Priority must be a number.")

    elif choice == "5":

        process_transaction()

    elif choice == "6":

        search_account()

    elif choice == "7":

        print("\nBank Branch Hierarchy:")
        print_tree(bank)

    elif choice == "8":

        print("Goodbye!")
        break

    else:

        print("Invalid option. Please try again.")

   