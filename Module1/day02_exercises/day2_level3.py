
# 9. Tip Calculator (Full Program)

def calculate_tip(bill_amount, tip_percentage):
    """Calculates and returns the tip amount based on the bill and tip %."""
    return bill_amount * (tip_percentage / 100)


def split_bill(total_amount, number_of_people):
    """Calculates and returns how much each person should pay."""
    return total_amount / number_of_people


def run_tip_calculator():
    """Runs the full tip calculator program using user input."""
    bill_amount = float(input("Enter the bill amount: "))

    # Ask for a valid tip percentage (10, 15, or 20)
    while True:
        tip_percentage = int(input("Enter tip percentage (10, 15, or 20): "))
        if tip_percentage in (10, 15, 20):
            break
        print(" Please enter a valid option: 10, 15, or 20.")

    number_of_people = int(input("Enter number of people splitting the bill: "))

    # Use the helper functions to calculate results
    tip_amount = calculate_tip(bill_amount, tip_percentage)
    total_amount = bill_amount + tip_amount
    amount_per_person = split_bill(total_amount, number_of_people)

    # Display the results neatly
    print("\n----- BILL SUMMARY -----")
    print(f"Bill Amount        : {bill_amount:.2f}")
    print(f"Tip ({tip_percentage}%)          : {tip_amount:.2f}")
    print(f"Total Amount        : {total_amount:.2f}")
    print(f"Amount per Person   : {amount_per_person:.2f}")


run_tip_calculator()
print()


# 10. Simple Quiz Game

# List of questions stored as dictionaries (question, correct answer)
quiz_questions = [
    {"question": "What is the capital city of Ethiopia?", "answer": "addis ababa"},
    {"question": "Which calendar does Ethiopia uniquely use? (Ethiopian/Gregorian)", "answer": "ethiopian"},
    {"question": "What is the currency of Ethiopia?", "answer": "birr"},
    {"question": "How many continents are there on Earth?", "answer": "7"},
    {"question": "What is the largest planet in our solar system?", "answer": "jupiter"},
]


def ask_question(question_data):
    """Asks a single question and returns True if the answer is correct."""
    user_answer = input(question_data["question"] + " ")
    return user_answer.strip().lower() == question_data["answer"]


def show_result(score, total_questions):
    """Displays the final score and a message based on performance."""
    print(f"\ You scored {score} out of {total_questions}!")
    percentage = (score / total_questions) * 100

    if percentage >= 80:
        print("Excellent! You really know your stuff!")
    elif percentage >= 50:
        print("Good job! Keep learning!")
    else:
        print("Keep practicing, you'll improve!")


def run_quiz():
    """Runs the full quiz game and keeps track of the score."""
    score = 0
    for question_data in quiz_questions:
        if ask_question(question_data):
            print(" Correct!\n")
            score += 1
        else:
            print(f"Incorrect. The correct answer was: {question_data['answer']}\n")

    show_result(score, len(quiz_questions))


run_quiz()
print()


# 11. Function with Default & Return

def calculate_final_price(price, tax_rate=0.15, discount=0):
    """
    Calculates the final price of an item after applying tax and discount.
    - price: original price of the item
    - tax_rate: tax rate as a decimal (default 0.15 = 15%)
    - discount: discount amount to subtract from the price (default 0)
    Returns the final price.
    """
    price_after_discount = price - discount
    tax_amount = price_after_discount * tax_rate
    final_price = price_after_discount + tax_amount
    return final_price


# Test the function with different values
print(f"Price 100, default tax & discount -> Final Price: {calculate_final_price(100):.2f}")
print(f"Price 200, tax 10%, no discount    -> Final Price: {calculate_final_price(200, tax_rate=0.10):.2f}")
print(f"Price 150, default tax, discount 20 -> Final Price: {calculate_final_price(150, discount=20):.2f}")
print(f"Price 300, tax 20%, discount 50    -> Final Price: {calculate_final_price(300, tax_rate=0.20, discount=50):.2f}")