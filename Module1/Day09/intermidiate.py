#Trees, Graphs and Heaps


# TREE 

class TreeNode:
    def __init__(self, name):
        self.name = name
        self.children = []

    def add_child(self, child):
        self.children.append(child)


def show_tree(node, level=0):
    print("  " * level + node.name)

    for child in node.children:
        show_tree(child, level + 1)


bank = TreeNode("Addis Bank")

branch1 = TreeNode("Bole Branch")
branch2 = TreeNode("Piassa Branch")

branch1.add_child(TreeNode("Cashier"))
branch1.add_child(TreeNode("Manager"))

branch2.add_child(TreeNode("Cashier"))

bank.add_child(branch1)
bank.add_child(branch2)

print("Bank Tree:")
show_tree(bank)


# GRAPH

customers = {
    "Almaz": ["Dawit", "Hanna"],
    "Dawit": ["Almaz", "Tigist"],
    "Tigist": ["Dawit"],
    "Hanna": ["Almaz"]
}

print("\nCustomer Connections:")

for customer, connections in customers.items():
    print(customer, "->", connections)



# HEAP 

import heapq

transactions = []

heapq.heappush(transactions, (3, "Normal Payment"))
heapq.heappush(transactions, (1, "Fraud Alert"))
heapq.heappush(transactions, (2, "Loan Request"))

print("\nTransactions:")

while transactions:
    priority, transaction = heapq.heappop(transactions)
    print(priority, "-", transaction)