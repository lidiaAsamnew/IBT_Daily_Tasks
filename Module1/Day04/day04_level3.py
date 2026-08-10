# Exercise 7: Full Bank Account with Properties


class BankAccount:

    def __init__(self, owner, balance=0):
        self.owner = owner
        self.__balance = balance  # private attribute

    @property
    def balance(self):
        return self.__balance

    @balance.setter
    def balance(self, new_balance):

        if new_balance < 0:
            print("Balance cannot be set to a negative value.")
        else:
            self.__balance = new_balance

    def deposit(self, amount):
        """Adds money to the balance. Only positive amounts allowed."""
        if amount <= 0:
            print("Deposit amount must be positive.")
            return
        self.__balance += amount
        print(f"Deposited {amount}. New balance: {self.__balance}")

    def withdraw(self, amount):
        if amount <= 0:
            print("Withdrawal amount must be positive.")
        elif amount > self.__balance:
            print("Insufficient funds.")
        else:
            self.__balance -= amount
            print(f"Withdrew {amount}. New balance: {self.__balance}")

    def transfer(self, to_account, amount):
        if amount <= 0:
            print("Transfer amount must be positive.")
        elif amount > self.__balance:
            print("Insufficient funds for transfer.")
        else:
            self.__balance -= amount
            to_account.deposit(amount)
            print(f"Transferred {amount} from {self.owner} to {to_account.owner}.")

# Create BankAccount objects and test deposit, withdraw, and transfer
acc_a = BankAccount("Helen", 5000)
acc_b = BankAccount("Yonas", 1000)

print(f"{acc_a.owner}'s balance: {acc_a.balance}")
print(f"{acc_b.owner}'s balance: {acc_b.balance}")

acc_a.deposit(1000)     # "borrow" style test - add money
acc_a.withdraw(2000)    # "return" style test - remove money
acc_a.transfer(acc_b, 1500)

print(f"\nFinal balance - {acc_a.owner}: {acc_a.balance}")
print(f"Final balance - {acc_b.owner}: {acc_b.balance}")
print()

# Exercise 8: Library System

# A class representing a single book.
class Book:

    def __init__(self, title, author, isbn, available=True):
        self.title = title
        self.author = author
        self.isbn = isbn
        self.__available = available  # private - only changed through Library methods

    @property
    def available(self):
        """Getter for whether the book is currently available."""
        return self.__available

    @available.setter
    def available(self, status):
        self.__available = status


class Library:
    """A class that manages a collection of Book objects."""

    def __init__(self):
        self.books = []  # list to hold all Book objects

    def add_book(self, book):
        """Adds a new Book object to the library."""
        self.books.append(book)
        print(f"Book added: '{book.title}' by {book.author}")

    def borrow_book(self, isbn):
        """Marks a book as borrowed (unavailable), found by its ISBN."""
        for book in self.books:
            if book.isbn == isbn:
                if book.available:
                    book.available = False
                    print(f"You borrowed '{book.title}'.")
                else:
                    print(f"'{book.title}' is already borrowed.")
                return
        print("Book not found.")

    def return_book(self, isbn):
        """Marks a book as available again, found by its ISBN."""
        for book in self.books:
            if book.isbn == isbn:
                if not book.available:
                    book.available = True
                    print(f"You returned '{book.title}'.")
                else:
                    print(f"'{book.title}' was not borrowed.")
                return
        print("Book not found.")


# Create a Book, add it to a Library, and test borrow/return
library = Library()
book1 = Book("Things Fall Apart", "Fikr Eskemekabr", "12345")

library.add_book(book1)
library.borrow_book("12345")
library.borrow_book("12345")  # already borrowed - should show message
library.return_book("12345")
library.return_book("12345")  # not borrowed anymore - should show message
print()


# Exercise 9: Car Class with Encapsulation


class Car:
    """A class representing a car with private speed and fuel attributes."""

    def __init__(self, speed=0, fuel=100):
        self.__speed = speed   # private - km/h
        self.__fuel = fuel     # private - percentage (0-100)

    @property
    def speed(self):
        """Getter for the car's current speed."""
        return self.__speed

    @property
    def fuel(self):
        """Getter for the car's current fuel level."""
        return self.__fuel

    def accelerate(self, amount):
        """Increases speed, but only if there is enough fuel."""
        if self.__fuel <= 0:
            print("Cannot accelerate - out of fuel!")
            return
        self.__speed += amount
        self.__fuel -= 5  # accelerating uses some fuel
        if self.__fuel < 0:
            self.__fuel = 0
        print(f"Accelerated. Speed: {self.__speed} km/h, Fuel: {self.__fuel}%")

    def brake(self, amount):
        """Decreases speed, but never below 0."""
        self.__speed -= amount
        if self.__speed < 0:
            self.__speed = 0
        print(f"Braked. Speed: {self.__speed} km/h")

    def refuel(self, amount):
        """Increases fuel, but never above 100%."""
        self.__fuel += amount
        if self.__fuel > 100:
            self.__fuel = 100
        print(f"Refueled. Fuel: {self.__fuel}%")


# Create a Car object and test accelerate, brake, and refuel
car = Car()
print(f"Starting speed: {car.speed} km/h, fuel: {car.fuel}%")
car.accelerate(30)
car.brake(10)
car.refuel(20)