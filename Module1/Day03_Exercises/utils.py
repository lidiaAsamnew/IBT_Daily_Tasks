


def add_tax(price, rate=0.15):
    """
    Calculates the tax-included price of an item.

    price: the original price (before tax)
    rate: the tax rate as a decimal (default is 0.15, meaning 15%)

    Returns the price including tax.
    """
    price_with_tax = price + (price * rate)
    return price_with_tax