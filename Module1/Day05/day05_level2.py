# Exercise 6: Abstract Base Class (built first, used by Ex 4 & 5)

from abc import ABC, abstractmethod

class Account(ABC):
    """
    Account is now an ABSTRACT class - it cannot be created directly
    (you can't do Account("name", 100)). It only exists so that
    SavingsAccount and CurrentAccount can inherit a common structure.
    """

    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance  # protected attribute

    def deposit(self, amount):
        """Adds money to the balance. Shared by all account types."""
        if amount <= 0:
            print("Deposit amount must be positive.")
            return
        self._balance += amount
        print(f"Deposited {amount}. New balance: {self._balance}")

    def withdraw(self, amount):
        """Default withdraw behavior. Subclasses may override this."""
        if amount <= 0:
            print("Withdrawal amount must be positive.")
        elif amount > self._balance:
            print("Insufficient funds.")
        else:
            self._balance -= amount
            print(f"Withdrew {amount}. New balance: {self._balance}")

    def statement(self):
        """Default statement - subclasses override this for extra info."""
        print(f"Owner: {self.owner}, Balance: {self._balance}")

    # @abstractmethod means: "every child class MUST provide its own
    # version of this method." Account itself has no implementation for it.
    @abstractmethod
    def calculate_interest(self):
        pass


# Trying Account("test", 100) directly would raise:
# TypeError: Can't instantiate abstract class Account with abstract method calculate_interest
print("Account is now abstract - it cannot be created directly.\n")


# Exercise 4: Method Overriding 


class SavingsAccount(Account):
    """A savings account that earns interest."""

    def __init__(self, owner, balance=0, interest_rate=0.05):
        super().__init__(owner, balance)
        self.interest_rate = interest_rate

    def calculate_interest(self):
        """Implements the abstract method - required by Account."""
        return self._balance * self.interest_rate

    def add_interest(self):
        """Adds calculated interest to the balance."""
        interest_amount = self.calculate_interest()
        self.deposit(interest_amount)

    def statement(self):
        """Overrides Account's statement() to show the interest rate too."""
        print(f"[Savings] Owner: {self.owner}, Balance: {self._balance}, "
              f"Interest Rate: {self.interest_rate * 100:.1f}%")


class CurrentAccount(Account):
    """A current account that allows overdraft."""

    def __init__(self, owner, balance=0, overdraft_limit=1000):
        super().__init__(owner, balance)
        self.overdraft_limit = overdraft_limit

    def withdraw(self, amount):
        """Overrides Account's withdraw() to allow overdraft."""
        if amount <= 0:
            print("Withdrawal amount must be positive.")
        elif amount > self._balance + self.overdraft_limit:
            print("Withdrawal denied: exceeds overdraft limit.")
        else:
            self._balance -= amount
            print(f"Withdrew {amount}. New balance: {self._balance}")

    def calculate_interest(self):
        """Current accounts don't earn interest, so this always returns 0."""
        return 0

    def statement(self):
        """Overrides Account's statement() to show the overdraft info."""
        print(f"[Current] Owner: {self.owner}, Balance: {self._balance}, "
              f"Overdraft Limit: {self.overdraft_limit}")


# Test of overridden statement() methods
savings_test = SavingsAccount("Marta", 5000, 0.06)
current_test = CurrentAccount("Daniel", 300, 500)

savings_test.statement()
current_test.statement()
print()

# Exercise 5: Polymorphism Practice

# Create a list with different account types.
# NOTE: We cannot put a plain Account() here since it's abstract now.
accounts = [
    SavingsAccount("Helen", 8000, 0.05),
    CurrentAccount("Yonas", 1000, 800),
    SavingsAccount("Sara", 3000, 0.04),
]

# POLYMORPHISM: even though each object is a different class
# (SavingsAccount or CurrentAccount), we can call the SAME method names
# on all of them, and each one runs its OWN version of the method.
for account in accounts:
    account.statement()       # each class prints its own style of statement
    account.deposit(100)      # same deposit() logic works for both types
    print()