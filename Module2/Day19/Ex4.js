const itemList = document.querySelector("#itemList");

itemList.addEventListener("click", function (event) {
    if (event.target.classList.contains("deleteButton")) {
        event.target.parentElement.remove();
    }
});
