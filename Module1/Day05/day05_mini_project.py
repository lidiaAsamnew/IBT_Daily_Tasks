#Addis Bank System - Version 2

from abc import ABC, abstractmethod


# Abstract base class

class Account(ABC):
    """Abstract base class - cannot be created directly."""

    def __init__(self, account_number, owner, balance=0):
        self.account_number = account_number
        self.owner = owner
        self._balance = balance

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            print("Deposit amount must be positive.")
            return False
        self._balance += amount
        print(f"Deposited {amount}. New balance: {self._balance}")
        return True

    def withdraw(self, amount):
        if amount <= 0:
            print("Withdrawal amount must be positive.")
            return False
        if amount > self._balance:
            print("Insufficient funds.")
            return False
        self._balance -= amount
        print(f"Withdrew {amount}. New balance: {self._balance}")
        return True

    def statement(self):
        print(f"Account #{self.account_number} - Owner: {self.owner}, "
              f"Balance: {self._balance}, Type: {self.__class__.__name__}")

    @abstractmethod
    def calculate_interest(self):
        pass


# SavingsAccount

class SavingsAccount(Account):
    """A savings account that earns interest."""

    def __init__(self, account_number, owner, balance=0, interest_rate=0.05):
        super().__init__(account_number, owner, balance)
        self.interest_rate = interest_rate

    def calculate_interest(self):
        return self._balance * self.interest_rate

    def add_interest(self):
        interest_amount = self.calculate_interest()
        self.deposit(interest_amount)
        print(f"Interest of {interest_amount:.2f} added to account #{self.account_number}.")

    def statement(self):
        print(f"Account #{self.account_number} [Savings] - Owner: {self.owner}, "
              f"Balance: {self._balance}, Interest Rate: {self.interest_rate * 100:.1f}%")



# CurrentAccount

class CurrentAccount(Account):
    """A current account that allows overdraft."""

    def __init__(self, account_number, owner, balance=0, overdraft_limit=1000):
        super().__init__(account_number, owner, balance)
        self.overdraft_limit = overdraft_limit

    def withdraw(self, amount):
        if amount <= 0:
            print("Withdrawal amount must be positive.")
            return False
        if amount > self._balance + self.overdraft_limit:
            print("Withdrawal denied: exceeds overdraft limit.")
            return False
        self._balance -= amount
        print(f"Withdrew {amount}. New balance: {self._balance}")
        return True

    def calculate_interest(self):
        return 0

    def statement(self):
        print(f"Account #{self.account_number} [Current] - Owner: {self.owner}, "
              f"Balance: {self._balance}, Overdraft Limit: {self.overdraft_limit}")



#  FixedDepositAccount inherits from SavingsAccount

class FixedDepositAccount(SavingsAccount):
    """
    A fixed deposit account - like a SavingsAccount, but locked for a
    fixed term, usually with a higher interest rate. Demonstrates
    MULTI-LEVEL INHERITANCE: FixedDepositAccount -> SavingsAccount -> Account.
    """

    def __init__(self, account_number, owner, balance=0,
                 interest_rate=0.08, term_months=12):
        # Reuse SavingsAccount's constructor (which reuses Account's constructor)
        super().__init__(account_number, owner, balance, interest_rate)
        self.term_months = term_months

    def withdraw(self, amount):
        """Overrides withdraw() - fixed deposits cannot be withdrawn early."""
        print("Withdrawal denied: this is a Fixed Deposit Account "
              f"locked for {self.term_months} months.")
        return False

    def statement(self):
        print(f"Account #{self.account_number} [Fixed Deposit] - Owner: {self.owner}, "
              f"Balance: {self._balance}, Interest Rate: {self.interest_rate * 100:.1f}%, "
              f"Term: {self.term_months} months")


# Main Program - Menu System


# Dictionary to store all accounts: { account_number: account_object }
accounts = {}
next_account_number = 2001


def create_savings_account():
    """Option 1: Creates a new SavingsAccount."""
    global next_account_number
    owner_name = input("Enter account owner's name: ").strip()

    try:
        starting_balance = float(input("Enter starting balance: "))
        interest_rate = float(input("Enter interest rate (e.g. 0.05 for 5%): "))
        if starting_balance < 0 or not (0 <= interest_rate <= 1):
            print("Invalid balance or interest rate.")
            return
    except ValueError:
        print("Invalid input. Please enter numbers only.")
        return

    account_number = next_account_number
    accounts[account_number] = SavingsAccount(account_number, owner_name, starting_balance, interest_rate)
    next_account_number += 1
    print(f"Savings account created! Account Number: {account_number}")


def create_current_account():
    """Option 2: Creates a new CurrentAccount."""
    global next_account_number
    owner_name = input("Enter account owner's name: ").strip()

    try:
        starting_balance = float(input("Enter starting balance: "))
        overdraft_limit = float(input("Enter overdraft limit: "))
        if starting_balance < 0 or overdraft_limit < 0:
            print("Invalid balance or overdraft limit.")
            return
    except ValueError:
        print("Invalid input. Please enter numbers only.")
        return

    account_number = next_account_number
    accounts[account_number] = CurrentAccount(account_number, owner_name, starting_balance, overdraft_limit)
    next_account_number += 1
    print(f"Current account created! Account Number: {account_number}")


def find_account():
    """Helper: asks for account number and returns the account object, or None."""
    try:
        account_number = int(input("Enter account number: "))
    except ValueError:
        print("Invalid account number.")
        return None

    account = accounts.get(account_number)
    if account is None:
        print("Account not found.")
    return account


def deposit_money():
    """Option 3: Deposit into any account type."""
    account = find_account()
    if account is None:
        return
    try:
        amount = float(input("Enter deposit amount: "))
        account.deposit(amount)
    except ValueError:
        print("Invalid amount.")


def withdraw_money():
    """Option 4: Withdraw from any account type (polymorphic behavior)."""
    account = find_account()
    if account is None:
        return
    try:
        amount = float(input("Enter withdrawal amount: "))
        account.withdraw(amount)  # each account type handles this differently
    except ValueError:
        print("Invalid amount.")


def show_statement():
    """Option 5: Show statement for one account."""
    account = find_account()
    if account is None:
        return
    account.statement()


def apply_interest_to_savings():
    """Option 6: Apply interest to ALL savings accounts (including fixed deposits)."""
    applied_any = False
    for account in accounts.values():
        # isinstance() checks if this account is a SavingsAccount
        # (this also includes FixedDepositAccount, since it inherits from SavingsAccount)
        if isinstance(account, SavingsAccount):
            account.add_interest()
            applied_any = True

    if not applied_any:
        print("No savings accounts found.")


def show_all_accounts():
    """Option 7: Show all accounts using polymorphism."""
    if not accounts:
        print("No accounts have been created yet.")
        return

    print("\n===== All Accounts =====")
    for account in accounts.values():
        # Same method call (statement()) works differently for each account type -
        # this is polymorphism in action.
        account.statement()


def run_bank_system():
    """Runs the main menu loop."""
    while True:
        print("\n===== Addis Bank System - Version 2 =====")
        print("1. Create Savings Account")
        print("2. Create Current Account")
        print("3. Deposit")
        print("4. Withdraw")
        print("5. Show statement")
        print("6. Apply interest to all savings accounts")
        print("7. Show all accounts")
        print("8. Exit")

        choice = input("Choose an option (1-8): ").strip()

        if choice == "1":
            create_savings_account()
        elif choice == "2":
            create_current_account()
        elif choice == "3":
            deposit_money()
        elif choice == "4":
            withdraw_money()
        elif choice == "5":
            show_statement()
        elif choice == "6":
            apply_interest_to_savings()
        elif choice == "7":
            show_all_accounts()
        elif choice == "8":
            print("Thank you for using Addis Bank System. Goodbye!")
            break
        else:
            print("Invalid option. Please choose a number from 1 to 8.")



# demo of the Bonus FixedDepositAccount before running the menu

print("=" * 50)
print("BONUS: FIXED DEPOSIT ACCOUNT DEMO")
print("=" * 50)

fixed = FixedDepositAccount(9001, "Tigist", 20000, 0.08, 12)
accounts[9001] = fixed
next_account_number = 9002

fixed.statement()
fixed.withdraw(500)   # should be denied - locked account
fixed.add_interest()  # inherited from SavingsAccount
print()

# Run the interactive menu
run_bank_system()