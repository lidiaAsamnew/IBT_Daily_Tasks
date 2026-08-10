
from abc import ABC, abstractmethod

class Account(ABC):
    """Abstract base class for all account types, with a proper @property."""

    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance

    @property
    def balance(self):
        """Getter - lets us safely read the balance as account.balance."""
        return self._balance

    def deposit(self, amount):
        """Adds money to the balance, with validation."""
        if amount <= 0:
            print("Deposit amount must be positive.")
            return
        self._balance += amount
        print(f"Deposited {amount}. New balance: {self._balance}")

    def withdraw(self, amount):
        """Default withdraw - subclasses may override."""
        if amount <= 0:
            print("Withdrawal amount must be positive.")
        elif amount > self._balance:
            print("Insufficient funds.")
        else:
            self._balance -= amount
            print(f"Withdrew {amount}. New balance: {self._balance}")

    def statement(self):
        """Default statement - subclasses override for extra detail."""
        print(f"Owner: {self.owner}, Balance: {self._balance}")

    @abstractmethod
    def calculate_interest(self):
        """Every subclass must define how its interest is calculated."""
        pass


class SavingsAccount(Account):
    """A savings account with a validated interest rate using @property."""

    def __init__(self, owner, balance=0, interest_rate=0.05):
        super().__init__(owner, balance)
        self._interest_rate = interest_rate  # protected, validated via property

    @property
    def interest_rate(self):
        """Getter for interest rate."""
        return self._interest_rate

    @interest_rate.setter
    def interest_rate(self, new_rate):
        """Setter for interest rate - only allows a sensible range (0 to 1)."""
        if 0 <= new_rate <= 1:
            self._interest_rate = new_rate
        else:
            print("Interest rate must be between 0 and 1 (e.g. 0.05 = 5%).")

    def calculate_interest(self):
        return self._balance * self._interest_rate

    def add_interest(self):
        interest_amount = self.calculate_interest()
        self.deposit(interest_amount)

    def statement(self):
        print(f"[Savings] Owner: {self.owner}, Balance: {self._balance}, "
              f"Interest Rate: {self._interest_rate * 100:.1f}%")


class CurrentAccount(Account):
    """A current account with a validated overdraft limit using @property."""

    def __init__(self, owner, balance=0, overdraft_limit=1000):
        super().__init__(owner, balance)
        self._overdraft_limit = overdraft_limit

    @property
    def overdraft_limit(self):
        """Getter for overdraft limit."""
        return self._overdraft_limit

    @overdraft_limit.setter
    def overdraft_limit(self, new_limit):
        """Setter for overdraft limit - must not be negative."""
        if new_limit >= 0:
            self._overdraft_limit = new_limit
        else:
            print("Overdraft limit cannot be negative.")

    def withdraw(self, amount):
        if amount <= 0:
            print("Withdrawal amount must be positive.")
        elif amount > self._balance + self._overdraft_limit:
            print("Withdrawal denied: exceeds overdraft limit.")
        else:
            self._balance -= amount
            print(f"Withdrew {amount}. New balance: {self._balance}")

    def calculate_interest(self):
        return 0  # current accounts don't earn interest

    def statement(self):
        print(f"[Current] Owner: {self.owner}, Balance: {self._balance}, "
              f"Overdraft Limit: {self._overdraft_limit}")


# Test the improved hierarchy

savings = SavingsAccount("Bethel", 10000, 0.05)
current = CurrentAccount("Kebede", 2000, 1500)

print(f"Savings balance (via property): {savings.balance}")
savings.interest_rate = 0.07   # valid - uses the setter
savings.interest_rate = 5      # invalid - should print an error message
savings.statement()

print()
print(f"Current balance (via property): {current.balance}")
current.overdraft_limit = -100  # invalid - should print an error message
current.withdraw(3000)          # within new overdraft limit
current.statement()