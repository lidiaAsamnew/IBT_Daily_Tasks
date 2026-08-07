# This line brings the add_tax function from utils.py into this file.
from utils import add_tax

print("=" * 50)
print("EXERCISE 7: MODULES & IMPORT")
print("=" * 50)

# Using the default tax rate (15%)
price1 = 1000
final_price1 = add_tax(price1)
print(f"Price {price1} birr with default tax (15%) -> {final_price1:.2f} birr")

# Using a custom tax rate (10%)
price2 = 2000
final_price2 = add_tax(price2, rate=0.10)
print(f"Price {price2} birr with 10% tax -> {final_price2:.2f} birr")

# Using another custom tax rate (20%)
price3 = 500
final_price3 = add_tax(price3, rate=0.20)
print(f"Price {price3} birr with 20% tax -> {final_price3:.2f} birr")