

# Global variables to track finances

balance = 0.0
total_income = 0.0
total_expense = 0.0

# Function to add income

def add_income():
    """Asks the user for an income amount and adds it to the balance."""
    global balance, total_income
    try:
        amount = float(input("Enter income amount: "))
        if amount < 0:
            print(" Income cannot be negative. Please try again.")
            return
        balance += amount
        total_income += amount
        print(f"Income of {amount:.2f} added successfully!")
    except ValueError:
        print(" Invalid input! Please enter a valid number.")


# Function to add expense

def add_expense():
    """Asks the user for an expense amount and subtracts it from the balance."""
    global balance, total_expense
    try:
        amount = float(input("Enter expense amount: "))
        if amount < 0:
            print(" Expense cannot be negative. Please try again.")
            return
        if amount > balance:
            print(" Warning: This expense exceeds your current balance!")
        balance -= amount
        total_expense += amount
        print(f" Expense of {amount:.2f} recorded successfully!")
    except ValueError:
        print("  Invalid input! Please enter a valid number.")



# Function to show current balance

def show_balance():
    """Displays the current balance."""
    print(f"💰 Current Balance: {balance:.2f}")



# Function to show final summary (Bonus)

def show_summary():
    """Displays a summary of total income, total expense, and final balance."""
    print("\n" + "=" * 50)
    print("FINAL SUMMARY")
    print("=" * 50)
    print(f"Total Income   : {total_income:.2f}")
    print(f"Total Expense  : {total_expense:.2f}")
    print(f"Final Balance  : {balance:.2f}")
    print("=" * 50)
    print("Thank you for using the Personal Finance Tracker!")



# Main Menu Loop

def run_finance_tracker():
    """Runs the main menu loop for the finance tracker."""
    while True:
        print("\n" + "=" * 50)
        print("PERSONAL FINANCE TRACKER")
        print("=" * 50)
        print("1. Add Income")
        print("2. Add Expense")
        print("3. Show Balance")
        print("4. Exit")

        try:
            choice = int(input("Choose an option (1-4): "))
        except ValueError:
            print(" Invalid input! Please enter a number between 1 and 4.")
            continue  # go back to the top of the loop

        if choice == 1:
            add_income()
        elif choice == 2:
            add_expense()
        elif choice == 3:
            show_balance()
        elif choice == 4:
            show_summary()  # bonus summary before exiting
            break  # exit the while loop and end the program
        else:
            print(" Invalid option! Please choose a number between 1 and 4.")


run_finance_tracker()