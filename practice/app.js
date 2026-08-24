// ---------- State: the single source of truth ----------
const state = {
  dishes: [],   // loaded from JSON
  cart: [],     // { id, name, price, qty }
  search: "",   // current filter text
};

// ---------- Element references ----------
const menuEl = document.querySelector("#menu");
const cartListEl = document.querySelector("#cart-list");
const cartTotalEl = document.querySelector("#cart-total");
const checkoutTotalEl = document.querySelector("#checkout-total");
const checkoutBtn = document.querySelector("#checkout-btn");
const searchEl = document.querySelector("#search");
const dialog = document.querySelector("#checkout-dialog");
const checkoutForm = document.querySelector("#checkout-form");
const cancelBtn = document.querySelector("#cancel-checkout");

const STORAGE_KEY = "addiseats-cart";

// ---------- Load data ----------
async function loadMenu() {
  menuEl.innerHTML = `<p class="loading-msg">Loading menu…</p>`;
  try {
    const res = await fetch("data/menu.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    state.dishes = await res.json();
    render();
  } catch (err) {
    menuEl.innerHTML = `<p class="error-msg">Could not load the menu. Please refresh.</p>`;
    console.error(err);
  }
}

// ---------- Persistence ----------
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
}

function load() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      state.cart = JSON.parse(saved);
    } catch {
      state.cart = [];
    }
  }
}

// ---------- Totals ----------
function cartTotal() {
  return state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function formatMoney(n) {
  return n.toLocaleString("en-US");
}

// ---------- Render ----------
function render() {
  renderMenu();
  renderCart();
}

function renderMenu() {
  const term = state.search.trim().toLowerCase();
  const shown = state.dishes.filter(d =>
    d.name.toLowerCase().includes(term) ||
    d.category.toLowerCase().includes(term)
  );

  if (state.dishes.length === 0) {
    menuEl.innerHTML = `<p class="loading-msg">Loading menu…</p>`;
    return;
  }

  if (shown.length === 0) {
    menuEl.innerHTML = `<p class="empty-msg">No dishes found for "${escapeHtml(state.search)}".</p>`;
    return;
  }

  menuEl.innerHTML = shown.map(d => `
    <article class="dish" data-id="${d.id}">
      <span class="category">${escapeHtml(d.category)}</span>
      <h3>${escapeHtml(d.name)} ${d.spicy ? '<span class="spicy-tag" title="Spicy">🌶️</span>' : ""}</h3>
      <p class="description">${escapeHtml(d.description || "")}</p>
      <p class="price">${formatMoney(d.price)} ETB</p>
      <button class="btn-add" type="button">Add to order</button>
    </article>
  `).join("");
}

function renderCart() {
  if (state.cart.length === 0) {
    cartListEl.innerHTML = `<li class="empty-msg">Your cart is empty. Add a dish to get started.</li>`;
  } else {
    cartListEl.innerHTML = state.cart.map(line => `
      <li class="cart-line" data-id="${line.id}">
        <span class="line-name">${escapeHtml(line.name)}</span>
        <span class="qty">x${line.qty}</span>
        <span class="line-price">${formatMoney(line.price * line.qty)} ETB</span>
        <button class="btn-rm" type="button" aria-label="Remove ${escapeHtml(line.name)}">✕</button>
      </li>
    `).join("");
  }

  const total = cartTotal();
  cartTotalEl.textContent = formatMoney(total);
  checkoutTotalEl.textContent = formatMoney(total);
  checkoutBtn.disabled = state.cart.length === 0;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Search (core interaction 1) ----------
searchEl.addEventListener("input", (e) => {
  state.search = e.target.value;
  renderMenu();
});

// ---------- Cart: add (delegated on the menu) ----------
menuEl.addEventListener("click", (e) => {
  if (!e.target.matches(".btn-add")) return;
  const card = e.target.closest(".dish");
  const id = Number(card.dataset.id);
  const dish = state.dishes.find(d => d.id === id);
  if (!dish) return;

  const line = state.cart.find(i => i.id === id);
  if (line) {
    line.qty++;
  } else {
    state.cart.push({ id: dish.id, name: dish.name, price: dish.price, qty: 1 });
  }
  save();
  renderCart();
});

// ---------- Cart: remove (delegated on the cart list) ----------
cartListEl.addEventListener("click", (e) => {
  if (!e.target.matches(".btn-rm")) return;
  const li = e.target.closest(".cart-line");
  const id = Number(li.dataset.id);
  state.cart = state.cart.filter(i => i.id !== id);
  save();
  renderCart();
});

// ---------- Checkout dialog ----------
checkoutBtn.addEventListener("click", () => {
  checkoutTotalEl.textContent = formatMoney(cartTotal());
  dialog.showModal();
});

cancelBtn.addEventListener("click", () => {
  checkoutForm.reset();
  clearErrors();
  dialog.close();
});

// ---------- Checkout form validation ----------
const validators = {
  name: (v) => v.trim().length >= 2 ? "" : "Please enter your full name.",
  phone: (v) => /^(09|07)\d{8}$/.test(v.trim())
    ? ""
    : "Enter a valid TeleBirr number, e.g. 0912345678.",
  address: (v) => v.trim().length >= 5 ? "" : "Please enter a delivery address in Addis Ababa.",
};

function clearErrors() {
  document.querySelectorAll(".field-error").forEach(el => el.textContent = "");
}

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearErrors();

  const formData = new FormData(checkoutForm);
  let hasError = false;

  for (const [field, validate] of Object.entries(validators)) {
    const value = formData.get(field) || "";
    const message = validate(value);
    if (message) {
      hasError = true;
      const errorEl = document.querySelector(`.field-error[data-for="cust-${field}"]`);
      if (errorEl) errorEl.textContent = message;
    }
  }

  if (hasError) return;

  // Order placed successfully
  const name = formData.get("name");
  alert(`Thanks, ${name}! Your order of ${formatMoney(cartTotal())} ETB has been placed. Pay with TeleBirr on delivery.`);

  state.cart = [];
  save();
  renderCart();
  checkoutForm.reset();
  dialog.close();
});

// ---------- Init ----------
async function init() {
  load();        // restore saved cart
  await loadMenu(); // fetch dishes + render
}

init();
