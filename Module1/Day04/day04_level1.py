# Exercise 1: Simple Class - Person

class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
         print(f"Hi, my name is {self.name} and I am {self.age} years old.")

#create two person objects
person1 = Person("Lidia", 22)
person2 = Person("Meron", 22)

#call introduce method on each object
person1.introduce() 
person2.introduce()

# Exercise 2: Rectangle Class

class Rectangle:
    def __init__(self, length, width):
        self.length = length
        self.width = width

    def area(self):
        return self.length * self.width

    def perimeter(self):
        return 2 * (self.length + self.width)

rectangle1 = Rectangle(10, 5)
rectangle2 = Rectangle(7, 3)

print(f"Area of rectangle1: {rectangle1.area()}, Perimeter of rectangle1: {rectangle1.perimeter()}")
print(f"Area of rectangle2: {rectangle2.area()}, Perimeter of rectangle2: {rectangle2.perimeter()}")
print()

# Exercise 3: Bank Account (Basic)

class Account:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance
    def deposit(self, amount):
        self.balance += amount
        print(f"Deposited {amount}. New balance: {self.balance}")
    def withdraw(self, amount):
        if amount > self.balance:
            print("Insufficient funds")
        else:
            self.balance -= amount
            print(f"Withdrew {amount}. New balance: {self.balance}")


account1 = Account("Lidia", 1000)
account1.deposit(500)
account1.withdraw(200)  
account1.withdraw(2000)  # This should print "Insufficient funds"
print(f"Final balance for {account1.owner}: {account1.balance}")
