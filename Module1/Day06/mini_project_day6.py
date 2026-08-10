from abc import ABC, abstractmethod

# Singleton Pattern: BankConfig - shared bank-wide settings

class BankConfig:
    """Singleton - only ONE instance exists, holding shared bank rules."""

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.interest_rate = 0.05
            cls._instance.overdraft_limit = 1000
            cls._instance.large_withdrawal_threshold = 3000
        return cls._instance


# Observer Pattern: Notification classes

class Observer(ABC):
    """Abstraction (DIP/ISP) - any observer just needs an update() method."""

    @abstractmethod
    def update(self, owner, amount):
        pass


class SMSAlert(Observer):
    def update(self, owner, amount):
        print(f"[SMS Alert] Large withdrawal by {owner}: {amount} birr")


class AuditLog(Observer):
    def update(self, owner, amount):
        print(f"[Audit Log] {owner} withdrew {amount} birr - flagged for review")


# Account Hierarchy (SRP, OCP, LSP, ISP, DIP)

class Account(ABC):
    """
    Abstract base account.
    SRP - only responsible for balance logic + notifying observers.
    """

    def __init__(self, account_number, owner, balance=0):
        self.account_number = account_number
        self.owner = owner
        self._balance = balance
        self._observers = []  # Observer pattern - things to notify

    @property
    def balance(self):
        return self._balance

    def add_observer(self, observer):
        """Observers are injected from outside (Dependency Injection)."""
        self._observers.append(observer)

    def _notify_observers(self, amount):
        for observer in self._observers:
            observer.update(self.owner, amount)

    def deposit(self, amount):
        if amount <= 0:
            print("Deposit amount must be positive.")
            return False
        self._balance += amount
        print(f"Deposited {amount}. New balance: {self._balance}")
        return True

    @abstractmethod
    def withdraw(self, amount):
        """Every account type defines its own withdrawal rules (LSP-safe)."""
        pass

    def statement(self):
        print(f"Account #{self.account_number} [{self.__class__.__name__}] - "
              f"Owner: {self.owner}, Balance: {self._balance}")


class InterestBearing(ABC):
    """
    ISP - a small, separate interface ONLY for account types that earn
    interest. CurrentAccount does not implement this, so it is never
    forced to have interest-related methods it doesn't need.
    """

    @abstractmethod
    def calculate_interest(self):
        pass

    @abstractmethod
    def add_interest(self):
        pass


class SavingsAccount(Account, InterestBearing):
    """A savings account - implements InterestBearing since it earns interest."""

    def __init__(self, account_number, owner, balance=0):
        super().__init__(account_number, owner, balance)
        self.interest_rate = BankConfig().interest_rate  # shared config value

    def withdraw(self, amount):
        config = BankConfig()
        if amount <= 0:
            print("Withdrawal amount must be positive.")
            return False
        if amount > self._balance:
            print("Insufficient funds.")
            return False
        self._balance -= amount
        print(f"Withdrew {amount}. New balance: {self._balance}")
        if amount > config.large_withdrawal_threshold:
            self._notify_observers(amount)
        return True

    def calculate_interest(self):
        return self._balance * self.interest_rate

    def add_interest(self):
        interest = self.calculate_interest()
        self.deposit(interest)
        print(f"Interest of {interest:.2f} applied to account #{self.account_number}.")


class CurrentAccount(Account):
    """A current account - allows overdraft, does NOT earn interest."""

    def withdraw(self, amount):
        config = BankConfig()
        if amount <= 0:
            print("Withdrawal amount must be positive.")
            return False
        if amount > self._balance + config.overdraft_limit:
            print("Withdrawal denied: exceeds overdraft limit.")
            return False
        self._balance -= amount
        print(f"Withdrew {amount}. New balance: {self._balance}")
        if amount > config.large_withdrawal_threshold:
            self._notify_observers(amount)
        return True


class FixedDepositAccount(SavingsAccount):
    """A fixed deposit - inherits SavingsAccount but blocks withdrawals."""

    def withdraw(self, amount):
        print("Withdrawal denied: Fixed Deposit accounts are locked.")
        return False


# Factory Pattern: AccountFactory

class AccountFactory:
    """
    Factory Pattern - centralizes account creation logic.
    OCP in action: to add a NEW account type, we only add one new elif
    branch here - the rest of the program never needs to change.
    """

    @staticmethod
    def create(kind, account_number, owner, balance=0):
        kind = kind.lower()
        if kind == "savings":
            return SavingsAccount(account_number, owner, balance)
        elif kind == "current":
            return CurrentAccount(account_number, owner, balance)
        elif kind == "fixed":
            return FixedDepositAccount(account_number, owner, balance)
        else:
            raise ValueError(f"Unknown account type: {kind}")


# Main Program - Menu System

accounts = {}          # { account_number: account_object }
next_account_number = 3001


def create_account():
    """Creates a new account of a chosen type using the AccountFactory."""
    global next_account_number

    print("Account types: savings, current, fixed")
    kind = input("Enter account type: ").strip().lower()
    owner_name = input("Enter owner's name: ").strip()

    try:
        starting_balance = float(input("Enter starting balance: "))
        if starting_balance < 0:
            print("Starting balance cannot be negative.")
            return
    except ValueError:
        print("Invalid amount. Please enter a number.")
        return

    try:
        account_number = next_account_number
        # AccountFactory hides WHICH class gets built - the menu code
        # doesn't need to know about SavingsAccount vs CurrentAccount
        # directly. This is Dependency Inversion in practice.
        new_account = AccountFactory.create(kind, account_number, owner_name, starting_balance)

        # Attach standard observers to every new account
        new_account.add_observer(SMSAlert())
        new_account.add_observer(AuditLog())

        accounts[account_number] = new_account
        next_account_number += 1
        print(f"{kind.title()} account created! Account Number: {account_number}")
    except ValueError as error:
        print(f"Error: {error}")


def find_account():
    """Helper: asks for account number, returns the account object or None."""
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
    """Deposit into an account."""
    account = find_account()
    if account is None:
        return
    try:
        amount = float(input("Enter deposit amount: "))
        account.deposit(amount)
    except ValueError:
        print("Invalid amount.")


def withdraw_money():
    """Withdraw from an account (polymorphic - works for any account type)."""
    account = find_account()
    if account is None:
        return
    try:
        amount = float(input("Enter withdrawal amount: "))
        account.withdraw(amount)
    except ValueError:
        print("Invalid amount.")


def show_statement():
    """Show one account's statement."""
    account = find_account()
    if account is None:
        return
    account.statement()


def apply_interest_to_all():
    """
    New feature added WITHOUT modifying any existing class - we just
    check isinstance(account, InterestBearing). This shows how easily
    new bank-wide features fit into the existing design.
    """
    applied_any = False
    for account in accounts.values():
        if isinstance(account, InterestBearing):
            account.add_interest()
            applied_any = True
    if not applied_any:
        print("No interest-bearing accounts found.")


def show_all_accounts():
    """Show all accounts (polymorphism - same call, different output per type)."""
    if not accounts:
        print("No accounts have been created yet.")
        return
    print("\n===== All Accounts =====")
    for account in accounts.values():
        account.statement()


def run_bank_system():
    """Runs the main menu loop."""
    while True:
        print("\n===== Clean Addis Bank System =====")
        print("1. Create account (savings/current/fixed)")
        print("2. Deposit")
        print("3. Withdraw")
        print("4. Show statement")
        print("5. Apply interest to all interest-bearing accounts")
        print("6. Show all accounts")
        print("7. Exit")

        choice = input("Choose an option (1-7): ").strip()

        if choice == "1":
            create_account()
        elif choice == "2":
            deposit_money()
        elif choice == "3":
            withdraw_money()
        elif choice == "4":
            show_statement()
        elif choice == "5":
            apply_interest_to_all()
        elif choice == "6":
            show_all_accounts()
        elif choice == "7":
            print("Thank you for using Clean Addis Bank System. Goodbye!")
            break
        else:
            print("Invalid option. Please choose a number from 1 to 7.")


# Run the interactive menu
run_bank_system()