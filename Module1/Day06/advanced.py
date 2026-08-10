from abc import ABC, abstractmethod


# Exercise 9: Full SOLID Refactoring

# ---- BEFORE: a "God Class" doing everything (violates several principles) ----
# class Account:
#     def __init__(self, owner, balance):
#         self.owner = owner
#         self.balance = balance
#     def withdraw(self, amount):
#         if amount > self.balance:
#             print("Insufficient funds")
#         else:
#             self.balance -= amount
#             print(f"Email sent to {self.owner}")      # notification logic
#             print("Saved to database")                 # persistence logic
#             if amount > 3000:
#                 print("SMS sent - large withdrawal")    # more notification logic
#
# This class mixes balance logic, email, database saving, and SMS all
# together (SRP violation), and creates its own dependencies internally
# with no way to swap them out (DIP violation).

# ---- AFTER: Responsibilities split into focused, injectable classes ----


class Notifier(ABC):
    """Abstraction (DIP) - any notifier just needs a notify() method."""

    @abstractmethod
    def notify(self, owner, message):
        pass


class EmailNotifier(Notifier):
    def notify(self, owner, message):
        print(f"[Email] To {owner}: {message}")


class SMSNotifier(Notifier):
    def notify(self, owner, message):
        print(f"[SMS] To {owner}: {message}")


class Repository(ABC):
    """Abstraction (DIP) - any storage system just needs a save() method."""

    @abstractmethod
    def save(self, account):
        pass


class DatabaseRepository(Repository):
    def save(self, account):
        print(f"[Database] Saved account for {account.owner}, balance: {account.balance}")


class RefactoredAccount:
    """
    SRP - only handles account balance logic.
    DIP - depends on abstractions (Notifier, Repository) injected from
    outside, not concrete classes it builds itself.
    """

    LARGE_WITHDRAWAL = 3000

    def __init__(self, owner, balance=0, notifiers=None, repository=None):
        self.owner = owner
        self._balance = balance
        self.notifiers = notifiers or []
        self.repository = repository

    @property
    def balance(self):
        return self._balance

    def withdraw(self, amount):
        if amount <= 0:
            print("Withdrawal amount must be positive.")
            return
        if amount > self._balance:
            print("Insufficient funds.")
            return
        self._balance -= amount
        print(f"Withdrew {amount}. New balance: {self._balance}")

        for notifier in self.notifiers:
            notifier.notify(self.owner, f"Withdrawal of {amount} processed.")

        if self.repository:
            self.repository.save(self)


# Test the refactored, SOLID-friendly Account
refactored_account = RefactoredAccount(
    "Helen", 10000,
    notifiers=[EmailNotifier(), SMSNotifier()],
    repository=DatabaseRepository()
)
refactored_account.withdraw(4000)
print()


# Exercise 10: Combine Factory + Observer + Singleton

class BankConfig:
    """
    Singleton Pattern - only ONE instance of BankConfig ever exists,
    keeping bank-wide settings (interest rate, overdraft limit)
    consistent everywhere in the program.
    """

    _instance = None  # class-level variable holding the single instance

    def __new__(cls):
        # __new__ runs BEFORE __init__ and controls object creation.
        # If an instance already exists, we return that SAME one
        # instead of building a new one.
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.interest_rate = 0.05
            cls._instance.overdraft_limit = 1000
        return cls._instance


class SOLIDAccount(ABC):
    """Abstract base account for this exercise."""

    def __init__(self, owner, account_number, balance=0):
        self.owner = owner
        self.account_number = account_number
        self._balance = balance
        self._observers = []

    @property
    def balance(self):
        return self._balance

    def add_observer(self, observer):
        self._observers.append(observer)

    def _notify_observers(self, amount):
        for observer in self._observers:
            observer.update(self.owner, amount)

    def deposit(self, amount):
        self._balance += amount
        print(f"Deposited {amount}. New balance: {self._balance}")

    @abstractmethod
    def withdraw(self, amount):
        pass


class SOLIDSavingsAccount(SOLIDAccount):
    def withdraw(self, amount):
        if amount > self._balance:
            print("Insufficient funds.")
            return
        self._balance -= amount
        print(f"Withdrew {amount}. New balance: {self._balance}")
        if amount > 3000:
            self._notify_observers(amount)


class SOLIDCurrentAccount(SOLIDAccount):
    def withdraw(self, amount):
        config = BankConfig()  # always the SAME shared instance
        if amount > self._balance + config.overdraft_limit:
            print("Overdraft limit exceeded.")
            return
        self._balance -= amount
        print(f"Withdrew {amount}. New balance: {self._balance}")
        if amount > 3000:
            self._notify_observers(amount)


class SOLIDAccountFactory:
    """Factory Pattern - creates the correct account type in one place."""

    @staticmethod
    def create(kind, owner, number, balance=0):
        kind = kind.lower()
        if kind == "savings":
            return SOLIDSavingsAccount(owner, number, balance)
        elif kind == "current":
            return SOLIDCurrentAccount(owner, number, balance)
        else:
            raise ValueError(f"Unknown account type: {kind}")


class SMSAlertObserver:
    def update(self, owner, amount):
        print(f"[SMS Alert] Large withdrawal by {owner}: {amount}")


class AuditLogObserver:
    def update(self, owner, amount):
        print(f"[Audit Log] {owner} withdrew {amount} (flagged as large)")


# Test: Singleton returns the SAME instance every time
config1 = BankConfig()
config2 = BankConfig()
print(f"Same config instance? {config1 is config2}")

# Test: Factory + Observer working together
solid_account = SOLIDAccountFactory.create("current", "Tigist", 3001, 2000)
solid_account.add_observer(SMSAlertObserver())
solid_account.add_observer(AuditLogObserver())
solid_account.withdraw(4000)  # triggers both observers
print()


# Exercise 11: Refactoring Challenge - Add InvestmentAccount


class InvestmentAccount(SOLIDAccount):
    """
    A brand NEW account type. We did NOT need to change SOLIDAccount,
    the existing branches of the factory, or any other existing class -
    we just ADD this new class. This demonstrates OCP: the design was
    OPEN for this extension, while existing code stayed CLOSED
    (unmodified).
    """

    def __init__(self, owner, account_number, balance=0, risk_level="medium"):
        super().__init__(owner, account_number, balance)
        self.risk_level = risk_level

    def withdraw(self, amount):
        if amount > self._balance:
            print("Insufficient funds.")
            return
        self._balance -= amount
        print(f"Withdrew {amount}. New balance: {self._balance}")
        if amount > 3000:
            self._notify_observers(amount)


class SOLIDAccountFactoryV2(SOLIDAccountFactory):
    """
    Extends the original factory with just ONE new branch for the new
    account type, while reusing all the existing logic unchanged.
    """

    @staticmethod
    def create(kind, owner, number, balance=0, **kwargs):
        kind = kind.lower()
        if kind == "investment":
            return InvestmentAccount(owner, number, balance, kwargs.get("risk_level", "medium"))
        # Falls back to the original factory for existing account types
        return SOLIDAccountFactory.create(kind, owner, number, balance)


# Test the new account type
investment_account = SOLIDAccountFactoryV2.create("investment", "Robel", 4001, 15000, risk_level="high")
investment_account.add_observer(AuditLogObserver())
print(f"{investment_account.owner}'s account type: {investment_account.__class__.__name__}, "
      f"Risk Level: {investment_account.risk_level}")
investment_account.withdraw(3500)