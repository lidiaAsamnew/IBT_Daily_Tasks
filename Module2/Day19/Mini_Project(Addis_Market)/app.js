// Cache all the element references once
const form = document.querySelector("#item-form");
const itemNameInput = document.querySelector("#item-name");
const itemPriceInput = document.querySelector("#item-price");
const shoppingList = document.querySelector("#shopping-list");
const totalElement = document.querySelector("#total");

// Store the total price
let total = 0;

// Add an item when the form is submitted
form.addEventListener("submit", function (event) {
    event.preventDefault();  // Prevent the page from reloading

    // Get the values from the inputs
    const itemName = itemNameInput.value.trim();
    const itemPrice = Number(itemPriceInput.value);

    // Validate that both fields are filled
    if (itemName === "" || itemPriceInput.value === "") {
        alert("Please enter both the item name and price.");
        return;
    }

    // this helps us to sure the price is not negative
    if (itemPrice < 0) {
        alert("Price cannot be negative.");
        return;
    }

    // Create a new list item
    const listItem = document.createElement("li");
    listItem.classList.add("item");

    // Create the item name and price text
    const itemText = document.createElement("span");
    itemText.textContent = `${itemName} - ${itemPrice.toFixed(2)} ETB`;

    // Create the delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.setAttribute("type", "button");

    // Store the price on the list item
    listItem.dataset.price = itemPrice;

    // Add the text and button to the list item
    listItem.append(itemText, deleteButton);

    // Add the new item to the shopping list
    shoppingList.append(listItem);

    // Add the price to the total
    total += itemPrice;
    updateTotal();

    // Clear the form
    form.reset();

    // Put the cursor back in the item name field
    itemNameInput.focus();
});

// One delegated listener on the parent list
shoppingList.addEventListener("click", function (event) {

    // Check if the clicked element is the delete button
    if (event.target.classList.contains("delete-btn")) {

        // Get the row containing the button
        const listItem = event.target.parentElement;

        // Get the price stored on the row
        const itemPrice = Number(listItem.dataset.price);

        // Remove the price from the total
        total -= itemPrice;
        updateTotal();

        // Remove the item from the list
        listItem.remove();

        return;
    }

    // If the user clicks the row, toggle the bought class
    if (event.target.closest(".item")) {
        const listItem = event.target.closest(".item");
        listItem.classList.toggle("bought");
    }
});

// Update the total shown on the page
function updateTotal() {
    totalElement.textContent = total.toFixed(2);
}