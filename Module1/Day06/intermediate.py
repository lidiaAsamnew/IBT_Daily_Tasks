from abc import ABC, abstractmethod

# Exercise 1: Apply SRP + DIP

class Account:
    """SRP - only handles account balance logic (deposit/withdraw)."""

    def __init__(self, owner, balance=0, notifier=None, repository=None):
        self.owner = owner
        self._balance = balance
        # DIP - Account RECEIVES its dependencies from outside (injection)
        # instead of creating them itself. This means Account doesn't
        # need to know HOW notifications or saving work - just that
        # they exist.
        self.notifier = notifier
        self.repository = repository

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            print("Deposit amount must be positive.")
            return
        self._balance += amount
        print(f"Deposited {amount}. New balance: {self._balance}")

    def withdraw(self, amount):
        if amount <= 0:
            print("Withdrawal amount must be positive.")
            return
        if amount > self._balance:
            print("Insufficient funds.")
            return
        self._balance -= amount
        print(f"Withdrew {amount}. New balance: {self._balance}")
        if self.notifier:
            self.notifier.notify(self.owner, amount)
        if self.repository:
            self.repository.save(self)


class EmailNotifier:
    """SRP - handles ONLY sending email notifications."""

    def notify(self, owner, amount):
        print(f"Email sent to {owner}: withdrawal of {amount} processed.")


class AccountRepository:
    """SRP - handles ONLY saving account data (simulated with a print)."""

    def save(self, account):
        print(f"Saved account for {account.owner} to database. Balance: {account.balance}")


# Test - dependencies are INJECTED into Account, not created inside it
notifier = EmailNotifier()
repository = AccountRepository()
account = Account("Helen", 5000, notifier=notifier, repository=repository)
account.withdraw(1000)
print()


# Exercise 2: Factory Pattern

class BaseAccount(ABC):
    """Abstract base account used for the factory example."""

    def __init__(self, owner, account_number, balance=0):
        self.owner = owner
        self.account_number = account_number
        self._balance = balance

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        self._balance += amount

    @abstractmethod
    def withdraw(self, amount):
        pass


class SavingsAccount(BaseAccount):
    def withdraw(self, amount):
        if amount <= self._balance:
            self._balance -= amount
        else:
            print("Insufficient funds.")


class CurrentAccount(BaseAccount):
    def __init__(self, owner, account_number, balance=0, overdraft_limit=1000):
        super().__init__(owner, account_number, balance)
        self.overdraft_limit = overdraft_limit

    def withdraw(self, amount):
        if amount <= self._balance + self.overdraft_limit:
            self._balance -= amount
        else:
            print("Overdraft limit exceeded.")


class FixedDepositAccount(BaseAccount):
    def withdraw(self, amount):
        print("Cannot withdraw from a Fixed Deposit Account.")


class AccountFactory:
    """
    Factory Pattern - centralizes account creation logic in ONE place.
    Code elsewhere doesn't need to know HOW each account type is built -
    it just calls AccountFactory.create(...).
    """

    @staticmethod
    def create(kind, owner, number, balance=0):
        kind = kind.lower()
        if kind == "savings":
            return SavingsAccount(owner, number, balance)
        elif kind == "current":
            return CurrentAccount(owner, number, balance)
        elif kind == "fixed":
            return FixedDepositAccount(owner, number, balance)
        else:
            raise ValueError(f"Unknown account type: {kind}")


# Test the factory
acc1 = AccountFactory.create("savings", "Marta", 1001, 5000)
acc2 = AccountFactory.create("current", "Daniel", 1002, 2000)
print(f"{acc1.owner}: {acc1.__class__.__name__}, Balance: {acc1.balance}")
print(f"{acc2.owner}: {acc2.__class__.__name__}, Balance: {acc2.balance}")
print()


# Exercise 3: Observer Pattern

class SMSAlert:
    """An observer that reacts to large withdrawals."""

    def update(self, owner, amount):
        print(f"[SMS Alert] {owner} withdrew {amount} - SMS sent!")


class AuditLog:
    """Another observer, watching the same events."""

    def update(self, owner, amount):
        print(f"[Audit Log] Large withdrawal recorded: {owner} - {amount}")


class ObservableAccount:
    """An account that can notify registered 'observers' of big events."""

    LARGE_WITHDRAWAL_THRESHOLD = 3000

    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance
        self._observers = []  # list of objects watching this account

    def add_observer(self, observer):
        """Registers a new observer to be notified of future events."""
        self._observers.append(observer)

    def _notify_observers(self, amount):
        """Calls update() on every registered observer."""
        for observer in self._observers:
            observer.update(self.owner, amount)

    def withdraw(self, amount):
        if amount > self._balance:
            print("Insufficient funds.")
            return
        self._balance -= amount
        print(f"Withdrew {amount}. New balance: {self._balance}")
        if amount > self.LARGE_WITHDRAWAL_THRESHOLD:
            self._notify_observers(amount)


# Test - small withdrawal (no notification), large withdrawal (notifies both)
observable_acc = ObservableAccount("Yonas", 10000)
observable_acc.add_observer(SMSAlert())
observable_acc.add_observer(AuditLog())

observable_acc.withdraw(1000)
observable_acc.withdraw(4000)
print()

# Exercise 4: Interface Segregation Principle (ISP)


class InterestBearing(ABC):
    """
    A small, focused interface - ONLY for account types that earn
    interest. ISP says: don't force classes to implement methods
    they don't actually need.
    """

    @abstractmethod
    def calculate_interest(self):
        pass

    @abstractmethod
    def add_interest(self):
        pass


class SavingsAccountISP(InterestBearing):
    """Implements InterestBearing because savings accounts DO earn interest."""

    def __init__(self, owner, balance=0, interest_rate=0.05):
        self.owner = owner
        self._balance = balance
        self.interest_rate = interest_rate

    def calculate_interest(self):
        return self._balance * self.interest_rate

    def add_interest(self):
        interest = self.calculate_interest()
        self._balance += interest
        print(f"Interest of {interest:.2f} added. New balance: {self._balance}")


class CurrentAccountISP:
    """
    Does NOT implement InterestBearing - current accounts don't earn
    interest, so this class is never forced to have fake/empty
    interest methods it doesn't need.
    """

    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance


# Test
savings = SavingsAccountISP("Bethel", 10000, 0.05)
savings.add_interest()

current = CurrentAccountISP("Kebede", 3000)
print(f"{current.owner}'s current account has no interest methods - correctly so.")