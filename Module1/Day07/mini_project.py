# mini_project
# Addis Bank Customer Service Simulator

# Stack:
# Used for transaction history and undo.

# Dictionary:
# Used for fast customer lookup by account number.


# Stack class
class Stack:

    def __init__(self):
        self.items = []

    # Push is O(1) average case.
    def push(self, value):
        self.items.append(value)

    # Pop is O(1) average case.
    def pop(self):

        if len(self.items) == 0:
            return None

        return self.items.pop()

    # Checking if stack is empty is O(1).
    def is_empty(self):
        return len(self.items) == 0


# Dictionary for customers.
#
# Account number is the key.
# Dictionary lookup is O(1) average case.

customers = {
    "1001": {
        "name": "Abebe Kebede",
        "balance": 5000
    },

    "1002": {
        "name": "Betty Alemu",
        "balance": 7500
    },

    "1003": {
        "name": "Dawit Tesfaye",
        "balance": 10000
    }
}


# Stack for transaction history
transaction_history = Stack()


# 12. Make a transaction
def make_transaction():

    account_number = input("Enter account number: ")

    # Dictionary lookup: O(1) average case.
    if account_number not in customers:

        print("Customer not found.")
        return

    try:

        amount = float(
            input("Enter transaction amount: ")
        )

        if amount <= 0:

            print("Amount must be greater than 0.")
            return

        customer = customers[account_number]

        # Save the old balance.
        # We need this when undoing the transaction.
        old_balance = customer["balance"]

        # Make the transaction.
        customer["balance"] += amount

        # Store transaction information.
        transaction = {
            "account_number": account_number,
            "amount": amount,
            "old_balance": old_balance
        }

        # Stack push: O(1) average case.
        transaction_history.push(transaction)

        print("Transaction completed.")
        print("New balance:", customer["balance"])

    except ValueError:

        print("Please enter a valid number.")


# 13. Undo last transaction
def undo_transaction():

    # Stack pop: O(1) average case.
    transaction = transaction_history.pop()

    if transaction is None:

        print("There is no transaction to undo.")
        return

    account_number = transaction["account_number"]

    old_balance = transaction["old_balance"]

    # Restore the old balance.
    customers[account_number]["balance"] = old_balance

    print("Last transaction was undone.")

    print(
        "Current balance:",
        customers[account_number]["balance"]
    )


# 14. Search customer by account number
def search_customer():

    account_number = input(
        "Enter account number: "
    )

    # Dictionary lookup: O(1) average case.
    if account_number in customers:

        customer = customers[account_number]

        print("Customer name:", customer["name"])
        print("Balance:", customer["balance"])

    else:

        print("Customer not found.")


# Display the menu
def show_menu():

    print("\n===== Addis Bank Customer Service =====")

    print("1. Make a transaction")
    print("2. Undo last transaction")
    print("3. Search customer by account number")
    print("4. Exit")


# Main program loop
while True:

    show_menu()

    choice = input(
        "Choose an option: "
    )

    if choice == "1":

        make_transaction()

    elif choice == "2":

        undo_transaction()

    elif choice == "3":

        search_customer()

    elif choice == "4":

        print(
            "Thank you for using "
            "Addis Bank Customer Service."
        )

        break

    else:

        print(
            "Invalid option. "
            "Please choose 1, 2, 3, or 4."
        )