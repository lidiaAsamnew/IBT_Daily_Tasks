

# Dictionary to store our inventory: { "ProductName": quantity }
inventory = {
    "Laptop": 5,
    "Mouse": 10
}

# Option 1: Add a new product

def add_product():
    """Asks for a product name and quantity, then adds it to the inventory."""
    product_name = input("Enter product name: ").strip().title()

    # Don't let the user accidentally overwrite an existing product.
    if product_name in inventory:
        print(f"'{product_name}' already exists in the inventory. "
              "Use 'Update quantity' instead if you want to change it.")
        return

    try:
        quantity = int(input("Enter quantity: "))
        if quantity < 0:
            print("Quantity cannot be negative.")
            return
        inventory[product_name] = quantity
        print(f"'{product_name}' added with quantity {quantity}.")
    except ValueError:
        print("Invalid quantity. Please enter a whole number.")



# Option 2: Update quantity of an existing product

def update_quantity():
    """Asks for a product name and updates its quantity if it exists."""
    product_name = input("Enter product name to update: ").strip().title()

    if product_name not in inventory:
        print(f"'{product_name}' was not found in the inventory.")
        return

    try:
        new_quantity = int(input("Enter new quantity: "))
        if new_quantity < 0:
            print("Quantity cannot be negative.")
            return
        inventory[product_name] = new_quantity
        print(f"'{product_name}' updated to quantity {new_quantity}.")
    except ValueError:
        print("Invalid quantity. Please enter a whole number.")


# Option 3: View all products

def view_products():
    """Displays all products and their quantities."""
    if not inventory:  # an empty dictionary is "falsy" in Python
        print("The inventory is empty.")
        return

    print("\n===== Inventory =====")
    for product_name, quantity in inventory.items():
        print(f"{product_name:<12}: {quantity}")



# Option 4: Save inventory to a file

def save_to_file():
    """Saves the inventory dictionary to inventory.txt."""
    try:
        with open("inventory.txt", "w") as file:
            for product_name, quantity in inventory.items():
                file.write(f"{product_name},{quantity}\n")
        print("Inventory saved to inventory.txt.")
    except OSError:
        # OSError covers general file-writing problems (e.g. permissions).
        print("An error occurred while saving the file.")


# Option 5: Load inventory from a file

def load_from_file():
    """Loads the inventory dictionary from inventory.txt, replacing current data."""
    global inventory
    try:
        with open("inventory.txt", "r") as file:
            lines = file.readlines()

        loaded_inventory = {}
        for line in lines:
            line = line.strip()
            if not line:
                continue  # skip any blank lines

            # Handle badly formatted lines gracefully instead of crashing.
            parts = line.split(",")
            if len(parts) != 2:
                print(f"Skipping invalid line: {line}")
                continue

            product_name, quantity_text = parts
            try:
                quantity = int(quantity_text)
                loaded_inventory[product_name] = quantity
            except ValueError:
                print(f"Skipping line with invalid quantity: {line}")

        inventory = loaded_inventory
        print("Inventory loaded from inventory.txt.")

    except FileNotFoundError:
        print("inventory.txt was not found. Please save the inventory first.")



# Main Menu Loop

def run_inventory_manager():
    """Runs the main menu loop until the user chooses to exit."""
    while True:
        print("\n===== Inventory Manager =====")
        print("1. Add new product")
        print("2. Update quantity")
        print("3. View all products")
        print("4. Save to file")
        print("5. Load from file")
        print("6. Exit")

        choice = input("Choose an option (1-6): ").strip()

        if choice == "1":
            add_product()
        elif choice == "2":
            update_quantity()
        elif choice == "3":
            view_products()
        elif choice == "4":
            save_to_file()
        elif choice == "5":
            load_from_file()
        elif choice == "6":
            print("Goodbye! Thanks for using Inventory Manager.")
            break 
        else:
            print("Invalid option. Please choose a number from 1 to 6.")



run_inventory_manager()