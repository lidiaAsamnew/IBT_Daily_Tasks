class Account:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance
    def deposit(self, amount):
        self.balance += amount
    def statement(self):
        print(f"{self.owner}: {self.balance} ETB")

almaz = Account("Almaz", 1500)
print(almaz.owner)
print(almaz.balance)

 # @property give the safely of getter/setter with the clean look of plain attribute.


#Attributes and methods 

# abstraction means exposing what an object does while hiding how it does it
# encapsulation  and abstraction...encapsulation hides data abstraction hides complexity
# rescue (keadega madan)
# five rules of organizing code so that changing one thing doesn't cause chaos somewhre else.
# single responsibilityfdsasdfgj liskov sub interface segregation dependency inversion 
# single responsiblity principle SRP 
# interface segregation principle
#
# 




