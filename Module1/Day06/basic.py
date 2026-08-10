from abc import ABC, abstractmethod


# Exercise 1: Single Responsibility Principle (SRP)


# ---- BEFORE (violates SRP) ----
# class Employee:
#     def __init__(self, name, salary):
#         self.name = name
#         self.salary = salary
#     def calculate_salary(self):
#         return self.salary
#     def save_to_file(self):
#         with open("employee.txt", "w") as f:
#             f.write(f"{self.name},{self.salary}")
#     def send_email(self):
#         print(f"Emailing payslip to {self.name}")
#
# This ONE class has THREE reasons to change: salary rules changing,
# file format changing, or email system changing. SRP says a class
# should have only ONE reason to change.

# ---- AFTER (follows SRP - each class does ONE job) ----
class Employee:
    """Responsible ONLY for holding employee data and salary logic."""

    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def calculate_salary(self):
        return self.salary


class SalaryFileSaver:
    """Responsible ONLY for saving salary info to a file."""

    def save(self, employee):
        with open("employee.txt", "w") as f:
            f.write(f"{employee.name},{employee.calculate_salary()}\n")
        print(f"Saved {employee.name}'s data to file.")


class EmailSender:
    """Responsible ONLY for sending emails."""

    def send_payslip(self, employee):
        print(f"Emailing payslip to {employee.name}: {employee.calculate_salary()} birr")


# Test the refactored SRP-compliant classes
emp = Employee("Sara", 15000)
saver = SalaryFileSaver()
mailer = EmailSender()

print(f"{emp.name}'s salary: {emp.calculate_salary()}")
saver.save(emp)
mailer.send_payslip(emp)
print()

# Exercise 2: Open/Closed Principle (OCP)


# ---- BEFORE (violates OCP) ----
def calculate_bonus_old(employee_type):
    """Every new employee type means opening and editing this function."""
    if employee_type == "manager":
        return 5000
    elif employee_type == "developer":
        return 3000
    elif employee_type == "intern":
        return 1000
    else:
        return 0


# ---- AFTER (follows OCP - open for extension, closed for modification) ----
class EmployeeBonus(ABC):
    """Abstract base - every employee bonus type must implement get_bonus()."""

    @abstractmethod
    def get_bonus(self):
        pass


class ManagerBonus(EmployeeBonus):
    def get_bonus(self):
        return 5000


class DeveloperBonus(EmployeeBonus):
    def get_bonus(self):
        return 3000


class InternBonus(EmployeeBonus):
    def get_bonus(self):
        return 1000


# To add a new type (e.g. "DesignerBonus"), we just ADD a new class -
# we never need to reopen or edit calculate_bonus_old() ever again.

# Test both versions
print(f"Old style - manager bonus: {calculate_bonus_old('manager')}")

for bonus in [ManagerBonus(), DeveloperBonus(), InternBonus()]:
    print(f"New style - {bonus.__class__.__name__}: {bonus.get_bonus()} birr")
print()



# Exercise 3: Liskov Substitution Principle (LSP)


# ---- BEFORE (violates LSP) ----
# class Bird:
#     def fly(self):
#         print("Flying high!")
# class Penguin(Bird):
#     def fly(self):
#         raise Exception("Penguins can't fly!")
# def make_bird_fly(bird):
#     bird.fly()
# make_bird_fly(Penguin())  # CRASHES! Penguin breaks Bird's promise.
#
# LSP says: a child class (Penguin) must be usable anywhere its parent
# (Bird) is expected, WITHOUT breaking the program.

# ---- AFTER (follows LSP - redesign so both work safely) ----
class Bird(ABC):
    """Base class only requires behavior that EVERY bird can do: move."""

    @abstractmethod
    def move(self):
        pass


class FlyingBird(Bird):
    """Birds that CAN fly."""

    def move(self):
        print("Flying high in the sky!")


class FlightlessBird(Bird):
    """Birds that CANNOT fly, but can still move some other way."""

    def move(self):
        print("Walking or swimming on the ground!")


class Sparrow(FlyingBird):
    pass


class Penguin(FlightlessBird):
    pass


def make_bird_move(bird):
    """Works safely with ANY Bird subtype - no crashes, no exceptions."""
    bird.move()


# Test - both work correctly now
make_bird_move(Sparrow())
make_bird_move(Penguin())
print()


# Exercise 4: Identify SOLID Violations

print("=" * 50)
print("EXERCISE 4: IDENTIFY SOLID VIOLATIONS")
print("=" * 50)

print("""
The given code:
    class Account:
        def __init__(self):
            self.notifier = EmailNotifier()
        def withdraw(self, amount):
            ...
            self.notifier.send_email(...)
            self.save_to_db(...)

Violations found:
1. SRP (Single Responsibility Principle)
   Account handles withdrawal LOGIC, sending EMAILS, and saving to the
   DATABASE - three separate responsibilities in one class.

2. DIP (Dependency Inversion Principle)
   Account creates its OWN EmailNotifier instance directly inside
   __init__ (self.notifier = EmailNotifier()), instead of receiving it
   from outside. This tightly couples Account to one specific notifier
   class, making it hard to swap notifiers or test Account in isolation.
""")