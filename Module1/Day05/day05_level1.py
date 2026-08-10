# Exercise 1: Simple Inheritance - Vehicle

class Vehicle:
    """Parent class representing a general vehicle."""

    def __init__(self, name, model, year):
        self.name = name
        self.model = model
        self.year = year

    def info(self):
        """Prints basic information common to all vehicles."""
        print(f"{self.year} {self.name} {self.model}")


class Car(Vehicle):
    """Car inherits everything from Vehicle, and adds its own attribute/method."""

    def __init__(self, name, model, year, num_doors):
        # super().__init__() runs Vehicle's constructor first,
        # so we don't have to repeat the name/model/year setup code.
        super().__init__(name, model, year)
        self.num_doors = num_doors  # unique attribute for Car

    def honk(self):
        """A method unique to Car."""
        print(f"{self.name} says: Beep beep! It has {self.num_doors} doors.")


class Motorcycle(Vehicle):
    """Motorcycle also inherits from Vehicle, with its own unique attribute/method."""

    def __init__(self, name, model, year, has_sidecar):
        super().__init__(name, model, year)
        self.has_sidecar = has_sidecar  # unique attribute for Motorcycle

    def wheelie(self):
        """A method unique to Motorcycle."""
        print(f"{self.name} does a wheelie! Sidecar: {self.has_sidecar}")


# Create one Car and one Motorcycle to test
car = Car("Toyota", "Corolla", 2022, 4)
motorcycle = Motorcycle("Yamaha", "MT-07", 2023, False)

car.info()      # inherited method from Vehicle
car.honk()       # Car's own method

motorcycle.info()     # inherited method from Vehicle
motorcycle.wheelie()  # Motorcycle's own method
print()


# Exercise 2: SavingsAccount Inheritance


class Account:
    """The base Account class from Day 4 (simplified for this exercise)."""

    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance # single underscore for protected attribute... "treat this as internal", but child classes CAN still access it directly.

    def deposit(self, amount):
        """Adds money to the balance."""
        if amount <= 0:
            print("Deposit amount must be positive.")
            return
        self._balance += amount
        print(f"Deposited {amount}. New balance: {self._balance}")

    def withdraw(self, amount):
        """Removes money from the balance if there are enough funds."""
        if amount <= 0:
            print("Withdrawal amount must be positive.")
        elif amount > self._balance:
            print("Insufficient funds.")
        else:
            self._balance -= amount
            print(f"Withdrew {amount}. New balance: {self._balance}")


class SavingsAccount(Account):
    """SavingsAccount inherits all of Account's behavior, and adds interest."""

    def __init__(self, owner, balance=0, interest_rate=0.05):
        super().__init__(owner, balance)  # reuse Account's constructor
        self.interest_rate = interest_rate  # new data just for SavingsAccount

    def add_interest(self):
        """Calculates interest based on the current balance and adds it."""
        interest_amount = self._balance * self.interest_rate
        self.deposit(interest_amount)
        print(f"Interest of {interest_amount:.2f} added.")


# Test SavingsAccount
savings = SavingsAccount("Lidia", 10000, 0.05)
print(f"Starting balance: {savings._balance}")
savings.add_interest()
print()

# Exercise 3: CurrentAccount Inheritance\

class CurrentAccount(Account):
    """CurrentAccount inherits from Account, and allows overdraft."""

    def __init__(self, owner, balance=0, overdraft_limit=1000):
        super().__init__(owner, balance)
        self.overdraft_limit = overdraft_limit  # new data for CurrentAccount

    def withdraw(self, amount):
        """
        Overrides Account's withdraw() to allow the balance to go
        negative, but only up to the overdraft limit.
        """
        if amount <= 0:
            print("Withdrawal amount must be positive.")
        elif amount > self._balance + self.overdraft_limit:
            print("Withdrawal denied: exceeds overdraft limit.")
        else:
            self._balance -= amount
            print(f"Withdrew {amount}. New balance: {self._balance}")


# Test CurrentAccount - overriding withdraw() to allow overdraft
current = CurrentAccount("Abel", 500, 1000)
print(f"Starting balance: {current._balance}")
current.withdraw(1200)  # goes negative, but within overdraft limit
current.withdraw(1000)  # should be denied - exceeds overdraft limit

