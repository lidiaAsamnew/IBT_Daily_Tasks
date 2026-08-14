const button = document.querySelector("#clickButton");
const container = document.querySelector("#buttonContainer");

button.addEventListener("click", function (event) {
    console.log("Button clicked");
    console.log(event.target);
});

container.addEventListener("click", function () {
    console.log("Container clicked");
});
