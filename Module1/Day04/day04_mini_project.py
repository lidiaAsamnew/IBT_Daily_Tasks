
# Addis Bank Account System (Version 1)


# BankAccount class (with full encapsulation)

class BankAccount:
    """A bank account with a private balance and validated operations."""

    def __init__(self, account_number, owner, balance=0):
        self.account_number = account_number
        self.owner = owner
        self.__balance = balance  # private attribute

    @property
    def balance(self):
        """Getter for the account balance (read-only from outside)."""
        return self.__balance

    def deposit(self, amount):
        """Adds money to the balance if the amount is valid."""
        if amount <= 0:
            print("Deposit amount must be positive.")
            return False
        self.__balance += amount
        print(f"Deposited {amount}. New balance: {self.__balance}")
        return True

    def withdraw(self, amount):
        """Removes money from the balance if there are sufficient funds."""
        if amount <= 0:
            print("Withdrawal amount must be positive.")
            return False
        if amount > self.__balance:
            print("Insufficient funds.")
            return False
        self.__balance -= amount
        print(f"Withdrew {amount}. New balance: {self.__balance}")
        return True

    def show_info(self):
        """Prints all the information about this account."""
        print("----- Account Info -----")
        print(f"Account Number : {self.account_number}")
        print(f"Owner          : {self.owner}")
        print(f"Balance        : {self.__balance}")
        print(f"Account Type   : {self.__class__.__name__}")



# SavingsAccount inherits from BankAccount 

class SavingsAccount(BankAccount):
    """
    A savings account that works just like a BankAccount, but also
    has an interest rate. This demonstrates INHERITANCE - SavingsAccount
    reuses everything BankAccount already does, and just adds extra features.
    """

    def __init__(self, account_number, owner, balance=0, interest_rate=0.05):
        # super().__init__() calls the parent class's constructor,
        # so we don't have to rewrite the same setup code again.
        super().__init__(account_number, owner, balance)
        self.interest_rate = interest_rate

    def add_interest(self):
        """Adds interest to the balance based on the interest rate."""
        interest_amount = self.balance * self.interest_rate
        self.deposit(interest_amount)
        print(f"Interest of {interest_amount:.2f} added at rate {self.interest_rate * 100}%.")


# Main Program - Menu System


# Dictionary to store all accounts: { account_number: account_object }
accounts = {}
next_account_number = 1001  # simple counter to generate account numbers


def create_account():
    """Creates a new account and stores it in the accounts dictionary."""
    global next_account_number

    owner_name = input("Enter account owner's name: ").strip()

    try:
        starting_balance = float(input("Enter starting balance: "))
        if starting_balance < 0:
            print("Starting balance cannot be negative.")
            return
    except ValueError:
        print("Invalid amount. Please enter a number.")
        return

    account_number = next_account_number
    new_account = BankAccount(account_number, owner_name, starting_balance)
    accounts[account_number] = new_account
    next_account_number += 1

    print(f"Account created successfully! Account Number: {account_number}")


def find_account():
    """Asks the user for an account number and returns the matching account, or None."""
    try:
        account_number = int(input("Enter account number: "))
    except ValueError:
        print("Invalid account number. Please enter numbers only.")
        return None

    account = accounts.get(account_number)
    if account is None:
        print("Account not found.")
    return account


def deposit_money():
    """Handles the deposit menu option."""
    account = find_account()
    if account is None:
        return
    try:
        amount = float(input("Enter deposit amount: "))
        account.deposit(amount)
    except ValueError:
        print("Invalid amount. Please enter a number.")


def withdraw_money():
    """Handles the withdraw menu option."""
    account = find_account()
    if account is None:
        return
    try:
        amount = float(input("Enter withdrawal amount: "))
        account.withdraw(amount)
    except ValueError:
        print("Invalid amount. Please enter a number.")


def check_balance():
    """Handles the check balance menu option."""
    account = find_account()
    if account is None:
        return
    print(f"Current balance: {account.balance}")


def view_account_info():
    """Handles the view account info menu option."""
    account = find_account()
    if account is None:
        return
    account.show_info()


def run_bank_system():
    """Runs the main menu loop for the banking program."""
    while True:
        print("\n===== Addis Bank Account System =====")
        print("1. Create new account")
        print("2. Deposit")
        print("3. Withdraw")
        print("4. Check balance")
        print("5. View account info")
        print("6. Exit")

        choice = input("Choose an option (1-6): ").strip()

        if choice == "1":
            create_account()
        elif choice == "2":
            deposit_money()
        elif choice == "3":
            withdraw_money()
        elif choice == "4":
            check_balance()
        elif choice == "5":
            view_account_info()
        elif choice == "6":
            print("Thank you for using Addis Bank Account System. Goodbye!")
            break
        else:
            print("Invalid option. Please choose a number from 1 to 6.")


savings = SavingsAccount(9001, "Bethel", 10000, interest_rate=0.05)
savings.show_info()
savings.add_interest()
print()

# Run the interactive menu system
run_bank_system()