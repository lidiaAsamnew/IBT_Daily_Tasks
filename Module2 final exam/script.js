const state = {
  recipes: [],
  favorites: [],
  search: "",
};

const formEl = document.querySelector("#search-form");
const searchEl = document.querySelector("#search-input");
const recipesEl = document.querySelector("#recipes");
const favoritesEl = document.querySelector("#favorites");
const messageEl = document.querySelector("#message");
const favCountEl = document.querySelector("#fav-count");
const favoritesBtn = document.querySelector("#favorites-btn");
const favoritesPanel = document.querySelector("#favorites-panel");

function render() {
  const term = state.search.toLowerCase().trim();

  const shown = state.recipes.filter((item) =>
    item.name.toLowerCase().includes(term),
  );

  recipesEl.innerHTML = shown.map((recipe) => createCard(recipe)).join("");

  if (state.favorites.length === 0) {
    favoritesEl.innerHTML = `<p class="empty">No favorites yet.</p>`;
  } else {
    favoritesEl.innerHTML = state.favorites
      .map((recipe) => createCard(recipe))
      .join("");
  }

  favCountEl.textContent = state.favorites.length;

  if (state.recipes.length > 0) {
    messageEl.textContent =
      shown.length === 0 ? `No recipes match "${state.search}".` : "";
  }
}

function createCard(recipe) {
  const saved = state.favorites.some((fav) => fav.id === recipe.id);

  return `
    <article class="card">
      <img src="${recipe.image}" alt="${recipe.name}">
      <div class="card-content">
        <div>
          <h3 class="card-title">${recipe.name}</h3>
          <p class="card-meta">${recipe.cuisine} · ${recipe.difficulty}</p>
        </div>
        <button class="${saved ? "active" : ""}" onclick="addOrRemove(${recipe.id})">
          ${saved ? "Remove" : "Favorite"}
        </button>
      </div>
    </article>
  `;
}

async function loadRecipes() {
  messageEl.classList.remove("error");
  messageEl.textContent = "Loading...";

  try {
    const response = await fetch("https://dummyjson.com/recipes");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    state.recipes = data.recipes || [];

    messageEl.textContent = state.recipes.length === 0 ? "No recipes found." : "";
    render();
  } catch (error) {
    messageEl.classList.add("error");
    messageEl.textContent = "Error loading recipes. Check your connection and refresh.";
    console.error("Error loading recipes:", error);
  }
}

function addOrRemove(id) {
  const exists = state.favorites.some((fav) => fav.id === id);

  if (exists) {
    state.favorites = state.favorites.filter((fav) => fav.id !== id);
  } else {
    const recipe = state.recipes.find((item) => item.id === id);
    if (recipe) {
      state.favorites.push(recipe);
    }
  }

  saveFavorites();
  render();
}

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(state.favorites));
}

function loadFavorites() {
  try {
    state.favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  } catch (error) {
    state.favorites = [];
  }
}

formEl.addEventListener("submit", function (event) {
  event.preventDefault();

  state.search = searchEl.value.trim();
  render();
});

searchEl.addEventListener("input", function () {
  state.search = searchEl.value.trim();
  render();
});

favoritesBtn.addEventListener("click", function () {
  favoritesPanel.scrollIntoView({ behavior: "smooth" });
});

function init() {
  loadFavorites();
  render();
  loadRecipes();
}

init();