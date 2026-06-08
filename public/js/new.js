const form = document.querySelector(".needs-validation");
const inputs = document.querySelectorAll("input:not([type = 'file']), textarea");
const fileInput = document.getElementById("image");

for (let input of inputs) {
    input.addEventListener("input", () => {
        if(input.validity.valid) {
            input.classList.add("was-validated-input")
        } else {
            input.classList.remove("was-validated-input")
        }
    })
}
form.addEventListener("submit", (event)=> {
    for (let input of inputs) {
        input.classList.remove("was-validated-input")
    }
    if ((!form.checkValidity())) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add("was-validated");
});
fileInput.addEventListener("change", () => {
    let fileName = document.querySelector(".upload-filename");
    if(fileInput.files.length > 0) {
        fileName.textContent = fileInput.files[0].name;
        fileName.style.color = "#222";
    } else {
        fileName.textContent = "No file choosen";
        fileName.style.color = "#AAA";
    }
})