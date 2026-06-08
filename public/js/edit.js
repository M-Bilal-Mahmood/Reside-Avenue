const form = document.querySelector(".needs-validation");
const fileInput = document.getElementById("image");

form.addEventListener("submit", (event)=> {
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