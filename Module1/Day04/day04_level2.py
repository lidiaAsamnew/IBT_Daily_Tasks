# Exercise 4: Student Class

class Student:
    def __init__(self, name, student_id):
        self.name = name
        self.student_id = student_id
        self.grades = []  # starts empty, grades are added later
    def add_grade(self, grade):
        self.grades.append(grade)
    def average_grade(self):
        if not self.grades:  # avoid dividing by zero if no grades yet
            return 0
        return sum(self.grades) / len(self.grades)
    
student1 = Student("Marta", "STU001")
student1.add_grade(85)
student1.add_grade(90)  
student1.add_grade(78)

print(f"Student: {student1.name} ({student1.student_id})")
print(f"Grades: {student1.grades}")
print(f"Average grade: {student1.average_grade():.2f}")
print()


# Exercise 5: Product Class

class Product:
    def __init__(self, name, price, stock):
        self.name = name
        self.price = price
        self.stock = stock
    def sell(self, quantity):
        if quantity > self.stock:
            print(f"Cannot sell {quantity} {self.name}(s). Only {self.stock} in stock.")
        else:
             self.stock -= quantity
             print(f"Sold {quantity} {self.name}(s). Remaining stock: {self.stock}")

    def restock(self, quantity):
        self.stock += quantity
        print(f"Restocked {quantity} {self.name}(s). New stock: {self.stock}")

product1 = Product("Laptop", 50000, 10)
print(f"Product: {product1.name}, Price: {product1.price}, Stock: {product1.stock}")
product1.sell(3)
product1.sell(20)  # should fail - not enough stock
product1.restock(5)
print()

# Exercise 6: Encapsulation Practice (Account class from Exercise 3)

class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.__balance = balance  # double underscore = private attribute

    @property
    def balance(self):
        return self.__balance

    def deposit(self, amount):
        if amount <= 0:
            print("Deposit amount must be positive.")
            return
        self.__balance += amount
        print(f"Deposited {amount}. New balance: {self.__balance}")

    def withdraw(self, amount):
        if amount <= 0:
            print("Withdrawal amount must be positive.")
        elif amount > self.__balance:
            print("Insufficient funds. Withdrawal cancelled.")
        else:
            self.__balance -= amount
            print(f"Withdrew {amount}. New balance: {self.__balance}")


# Test the encapsulated Account class
account = Account("Daniel", 2000)
print(f"Starting balance: {account.balance}")  # using the property (getter)
account.deposit(500)
account.withdraw(1000)
account.withdraw(-50)   # invalid - negative amount
account.deposit(0)      # invalid - zero amount