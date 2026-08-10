# Day 8 :- Mini Project

# Addis Bank Transaction Analyzer


# The program demonstrates:
# - Recursion
# - Sorting
# - Linear search
# - Binary search
# - Recursive report generation


# Sample transactions.
# Each transaction contains amount, date, and type.

transactions = [
    {"amount": 5000, "date": "2026-08-01", "type": "deposit"},
    {"amount": 1200, "date": "2026-08-03", "type": "withdrawal"},
    {"amount": 3000, "date": "2026-08-05", "type": "deposit"},
    {"amount": 800, "date": "2026-08-07", "type": "withdrawal"},
    {"amount": 2500, "date": "2026-08-09", "type": "deposit"}
]


# Recursive function to calculate total balance.
#
# Deposits increase the balance.
# Withdrawals decrease the balance.
#
# Time complexity: O(n)
def calculate_balance(transactions, index=0):

    # Base case.
    if index == len(transactions):
        return 0

    transaction = transactions[index]

    if transaction["type"] == "deposit":
        amount = transaction["amount"]
    else:
        amount = -transaction["amount"]

    return amount + calculate_balance(
        transactions,
        index + 1
    )


# Selection Sort by amount.
#
# Time complexity: O(n^2)
def sort_by_amount(transactions):

    sorted_transactions = transactions.copy()

    for i in range(len(sorted_transactions) - 1):

        minimum_index = i

        for j in range(i + 1, len(sorted_transactions)):

            if (
                sorted_transactions[j]["amount"]
                < sorted_transactions[minimum_index]["amount"]
            ):
                minimum_index = j

        if minimum_index != i:

            sorted_transactions[i], sorted_transactions[minimum_index] = (
                sorted_transactions[minimum_index],
                sorted_transactions[i]
            )

    return sorted_transactions


# Selection Sort by date.
#
# Dates are stored as YYYY-MM-DD, so normal string
# comparison sorts them in chronological order.
#
# Time complexity: O(n^2)
def sort_by_date(transactions):

    sorted_transactions = transactions.copy()

    for i in range(len(sorted_transactions) - 1):

        minimum_index = i

        for j in range(i + 1, len(sorted_transactions)):

            if (
                sorted_transactions[j]["date"]
                < sorted_transactions[minimum_index]["date"]
            ):
                minimum_index = j

        if minimum_index != i:

            sorted_transactions[i], sorted_transactions[minimum_index] = (
                sorted_transactions[minimum_index],
                sorted_transactions[i]
            )

    return sorted_transactions


# Linear search for an unsorted transaction list.
#
# We search by amount.
# Time complexity: O(n)
def linear_search_transaction(transactions, target_amount):

    for transaction in transactions:

        if transaction["amount"] == target_amount:
            return transaction

    return None


# Binary search after sorting by amount.
#
# The list MUST be sorted by amount first.
# Time complexity: O(log n)
def binary_search_transaction(transactions, target_amount):

    left = 0
    right = len(transactions) - 1

    while left <= right:

        middle = (left + right) // 2

        current_amount = transactions[middle]["amount"]

        if current_amount == target_amount:
            return transactions[middle]

        elif current_amount < target_amount:
            left = middle + 1

        else:
            right = middle - 1

    return None


# Bonus:
# Recursively print all transactions above a threshold.
#
# Time complexity: O(n)
def report_above_threshold(
    transactions,
    threshold,
    index=0
):

    # Base case.
    if index == len(transactions):
        return

    transaction = transactions[index]

    if transaction["amount"] > threshold:

        print_transaction(transaction)

    report_above_threshold(
        transactions,
        threshold,
        index + 1
    )


def print_transaction(transaction):

    print(
        "Amount:",
        transaction["amount"],
        "| Date:",
        transaction["date"],
        "| Type:",
        transaction["type"]
    )


def show_transactions(transactions):

    if len(transactions) == 0:
        print("No transactions found.")
        return

    for transaction in transactions:
        print_transaction(transaction)


def show_menu():

    print("\n===== Addis Bank Transaction Analyzer =====")
    print("1. Show transactions")
    print("2. Calculate total balance")
    print("3. Sort transactions by amount")
    print("4. Sort transactions by date")
    print("5. Linear search by amount")
    print("6. Binary search by amount")
    print("7. Report transactions above a threshold")
    print("8. Exit")


def main():

    while True:

        show_menu()

        choice = input("Choose an option: ")

        if choice == "1":

            print("\nTransactions:")
            show_transactions(transactions)

        elif choice == "2":

            balance = calculate_balance(transactions)

            print("Total balance:", balance)

        elif choice == "3":

            sorted_transactions = sort_by_amount(
                transactions
            )

            print("\nTransactions sorted by amount:")
            show_transactions(sorted_transactions)

        elif choice == "4":

            sorted_transactions = sort_by_date(
                transactions
            )

            print("\nTransactions sorted by date:")
            show_transactions(sorted_transactions)

        elif choice == "5":

            try:

                amount = float(
                    input("Enter transaction amount: ")
                )

                result = linear_search_transaction(
                    transactions,
                    amount
                )

                if result is None:
                    print("Transaction not found.")
                else:
                    print("Transaction found:")
                    print_transaction(result)

            except ValueError:

                print("Please enter a valid number.")

        elif choice == "6":

            try:

                amount = float(
                    input("Enter transaction amount: ")
                )

                # Binary search requires sorted data.
                sorted_transactions = sort_by_amount(
                    transactions
                )

                result = binary_search_transaction(
                    sorted_transactions,
                    amount
                )

                if result is None:
                    print("Transaction not found.")
                else:
                    print("Transaction found:")
                    print_transaction(result)

            except ValueError:

                print("Please enter a valid number.")

        elif choice == "7":

            try:

                threshold = float(
                    input("Enter threshold amount: ")
                )

                print(
                    "\nTransactions above",
                    threshold,
                    ":"
                )

                report_above_threshold(
                    transactions,
                    threshold
                )

            except ValueError:

                print("Please enter a valid number.")

        elif choice == "8":

            print(
                "Thank you for using "
                "Addis Bank Transaction Analyzer."
            )

            break

        else:

            print(
                "Invalid option. "
                "Please choose from 1 to 8."
            )


# Start the console application.
main()