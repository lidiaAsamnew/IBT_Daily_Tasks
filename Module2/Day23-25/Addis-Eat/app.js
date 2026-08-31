const state = {
    dishes: [],
    cart: [],
    search: "",
    category: "All"
};


const menuEl = document.querySelector("#menu");
const cartEl = document.querySelector("#cart");
const searchEl = document.querySelector("#search");
const categoryEl = document.querySelector("#category");
const menuMessageEl = document.querySelector("#menu-message");

const checkoutModal = document.querySelector("#checkout-modal");
const checkoutForm = document.querySelector("#checkout-form");
const closeModalButton = document.querySelector("#close-modal");
const checkoutTotalEl = document.querySelector("#checkout-total");

const successMessageEl = document.querySelector("#success-message");


async function loadMenu() {

    menuMessageEl.textContent = "Loading menu...";

    try {

        const response = await fetch("data/menu.json");

        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }

        state.dishes = await response.json();

        createCategoryOptions();

        menuMessageEl.textContent = "";

        render();

    } catch (error) {

        console.error("Menu loading error:", error);

        menuMessageEl.textContent =
            "Could not load the menu. Please try again.";

    }
}


function createCategoryOptions() {

    const categories = [
        ...new Set(
            state.dishes.map(dish => dish.category)
        )
    ];

    categoryEl.innerHTML = `
        <option value="All">All</option>
    `;

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryEl.appendChild(option);
    });
}


function getFilteredDishes() {

    const searchTerm = state.search.toLowerCase();

    return state.dishes.filter(dish => {

        const matchesSearch =
            dish.name
                .toLowerCase()
                .includes(searchTerm);

        const matchesCategory =
            state.category === "All" ||
            dish.category === state.category;

        return matchesSearch && matchesCategory;
    });
}


function render() {

    renderMenu();

    renderCart();
}


function renderMenu() {

    const shownDishes = getFilteredDishes();

    if (shownDishes.length === 0) {

        menuEl.innerHTML = `
            <div class="no-results">
                <h3>No dishes found</h3>
                <p>
                    Try another search or category.
                </p>
            </div>
        `;

        return;
    }


    menuEl.innerHTML = shownDishes.map(dish => {

        return `
            <article
                class="dish"
                data-id="${dish.id}"
            >

                <img
                    class="dish-image"
                    src="${dish.image}"
                    alt="${dish.name}"
                >

                <div class="dish-content">

                    <h3>${dish.name}</h3>

                    <p class="dish-description">
                        ${dish.description}
                    </p>

                    <div class="dish-meta">

                        <span class="price">
                            ${dish.price.toLocaleString()} ETB
                        </span>

                        <span class="category-badge">
                            ${dish.category}
                        </span>

                    </div>

                    <button
                        class="add-button"
                        type="button"
                    >
                        Add to Cart
                    </button>

                </div>

            </article>
        `;

    }).join("");
}


function cartTotal() {

    return state.cart.reduce(
        (sum, item) => {
            return sum + item.price * item.qty;
        },
        0
    );
}


function cartItemCount() {

    return state.cart.reduce(
        (sum, item) => {
            return sum + item.qty;
        },
        0
    );
}


function renderCart() {

    const total = cartTotal();
    const itemCount = cartItemCount();


    if (state.cart.length === 0) {

        cartEl.innerHTML = `
            <div class="cart-header">
                <h2>Your Order</h2>

                <span class="cart-count">
                    0 items
                </span>
            </div>

            <div class="empty-cart">
                <p>🛒</p>

                <p>
                    Your cart is empty.
                </p>

                <small>
                    Add some delicious food!
                </small>
            </div>
        `;

        return;
    }


    cartEl.innerHTML = `
        <div class="cart-header">

            <h2>Your Order</h2>

            <span class="cart-count">
                ${itemCount}
                ${itemCount === 1 ? "item" : "items"}
            </span>

        </div>

        <ul class="cart-list">

            ${state.cart.map(item => {

                return `
                    <li
                        class="cart-item"
                        data-id="${item.id}"
                    >

                        <div class="cart-item-top">

                            <span class="cart-item-name">
                                ${item.name}
                            </span>

                            <span class="cart-item-price">
                                ${(
                                    item.price * item.qty
                                ).toLocaleString()} ETB
                            </span>

                        </div>


                        <div class="cart-item-controls">

                            <button
                                class="quantity-button decrease"
                                type="button"
                                aria-label="Decrease quantity"
                            >
                                -
                            </button>

                            <span class="quantity">
                                ${item.qty}
                            </span>

                            <button
                                class="quantity-button increase"
                                type="button"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>

                            <button
                                class="remove-button"
                                type="button"
                            >
                                Remove
                            </button>

                        </div>

                    </li>
                `;

            }).join("")}

        </ul>


        <div class="cart-total">

            <span>Total</span>

            <span class="total-price">
                ${total.toLocaleString()} ETB
            </span>

        </div>


        <button
            class="checkout-button"
            type="button"
            id="checkout-button"
        >
            Proceed to Checkout
        </button>
    `;
}


menuEl.addEventListener("click", event => {

    if (!event.target.matches(".add-button")) {
        return;
    }


    const dishCard =
        event.target.closest(".dish");


    const id =
        Number(dishCard.dataset.id);


    const dish =
        state.dishes.find(item => item.id === id);


    if (!dish) {
        return;
    }


    const existingItem =
        state.cart.find(item => item.id === id);


    if (existingItem) {

        existingItem.qty++;

    } else {

        state.cart.push({
            ...dish,
            qty: 1
        });
    }


    save();

    render();
});


cartEl.addEventListener("click", event => {

    // Checkout button is outside cart items
    if (event.target.matches("#checkout-button")) {

        openCheckout();

        return;
    }


    const cartItem =
        event.target.closest(".cart-item");


    if (!cartItem) {
        return;
    }


    const id =
        Number(cartItem.dataset.id);


    if (event.target.matches(".increase")) {

        increaseQuantity(id);

        return;
    }


    if (event.target.matches(".decrease")) {

        decreaseQuantity(id);

        return;
    }


    if (event.target.matches(".remove-button")) {

        removeFromCart(id);

        return;
    }
});


function increaseQuantity(id) {

    const item =
        state.cart.find(item => item.id === id);


    if (!item) {
        return;
    }


    item.qty++;


    save();

    render();
}


function decreaseQuantity(id) {

    const item =
        state.cart.find(item => item.id === id);


    if (!item) {
        return;
    }


    item.qty--;


    if (item.qty <= 0) {

        state.cart =
            state.cart.filter(
                cartItem => cartItem.id !== id
            );
    }


    save();

    render();
}


function removeFromCart(id) {

    state.cart =
        state.cart.filter(
            item => item.id !== id
        );


    save();

    render();
}


searchEl.addEventListener("input", event => {

    state.search =
        event.target.value;

    render();
});


categoryEl.addEventListener("change", event => {

    state.category =
        event.target.value;

    render();
});


// Save cart to localStorage
function save() {

    localStorage.setItem(
        "addiseats",
        JSON.stringify(state.cart)
    );
}


function load() {

    const savedCart =
        localStorage.getItem("addiseats");


    if (savedCart) {

        try {

            state.cart =
                JSON.parse(savedCart);

        } catch (error) {

            console.error(
                "Could not load saved cart:",
                error
            );

            state.cart = [];
        }
    }
}


function openCheckout() {

    if (state.cart.length === 0) {
        return;
    }


    checkoutTotalEl.textContent =
        `${cartTotal().toLocaleString()} ETB`;


    checkoutModal.classList.remove("hidden");
}


function closeCheckout() {

    checkoutModal.classList.add("hidden");
}


closeModalButton.addEventListener(
    "click",
    closeCheckout
);


checkoutModal.addEventListener("click", event => {

    if (event.target === checkoutModal) {

        closeCheckout();
    }
});


function validateCheckoutForm() {

    let isValid = true;


    const name =
        document.querySelector("#customer-name");

    const phone =
        document.querySelector("#phone");

    const address =
        document.querySelector("#address");

    const payment =
        document.querySelector("#payment");


    clearErrors();


    if (name.value.trim().length < 2) {

        showError(
            "name-error",
            "Please enter your full name."
        );

        isValid = false;
    }


    const phonePattern =
        /^(09|\+2519)[0-9]{8}$/;


    if (!phonePattern.test(phone.value.trim())) {

        showError(
            "phone-error",
            "Enter a valid Ethiopian phone number."
        );

        isValid = false;
    }


    if (address.value.trim().length < 5) {

        showError(
            "address-error",
            "Please enter your delivery address."
        );

        isValid = false;
    }


    if (payment.value === "") {

        showError(
            "payment-error",
            "Please select a payment method."
        );

        isValid = false;
    }


    return isValid;
}


function showError(elementId, message) {

    const element =
        document.querySelector(`#${elementId}`);

    element.textContent = message;
}


function clearErrors() {

    const errors =
        document.querySelectorAll(".error-message");


    errors.forEach(error => {

        error.textContent = "";
    });
}


checkoutForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const isValid =
            validateCheckoutForm();


        if (!isValid) {
            return;
        }


        state.cart = [];


        save();

        render();


        checkoutForm.reset();

        closeCheckout();


        showSuccessMessage();
    }
);


function showSuccessMessage() {

    successMessageEl.classList.remove(
        "hidden"
    );


    setTimeout(() => {

        successMessageEl.classList.add(
            "hidden"
        );

    }, 4000);
}


async function init() {

    load();

    await loadMenu();
}


init();
