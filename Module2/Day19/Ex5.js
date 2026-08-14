const form = document.querySelector("#itemForm");
const input = document.querySelector("#itemInput");
const list = document.querySelector("#formList");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const li = document.createElement("li");

    li.textContent = input.value;

    list.append(li);

    input.value = "";
});
