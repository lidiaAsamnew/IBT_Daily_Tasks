# Addis Market Shopping List

## What It Does

Addis Market is a simple shopping list web application.

The user can:

* Add an item with a name and ETB price.
* Mark an item as bought.
* Delete an item.
* See the running total of all item prices.

## Technologies Used

* HTML
* CSS
* JavaScript
* DOM manipulation
* Events
* Event delegation

## How to Open

1. Download or clone the repository.
2. Open the project folder.
3. Open `index.html` in a web browser.

No server or installation is required.

## How It Works

The form accepts an item name and price. JavaScript prevents the page from reloading when the form is submitted.

Each item is created using `createElement()` and added to the shopping list using `append()`.

The shopping list has one click listener. This listener uses event delegation to handle deleting items and toggling the bought state.

The total is updated whenever an item is added or removed.


