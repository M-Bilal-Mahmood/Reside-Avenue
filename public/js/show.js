let ratingWrapper = document.querySelector('.rating-wrapper');
let star = document.querySelectorAll('.review-star');
let ratingValueInput = document.querySelector('.rating-value');
if (ratingWrapper) {
    ratingWrapper.addEventListener("click", (event) => {
    let starElement = event.target.closest(".review-star");
    if (starElement) {
        let checkedStar = Number(starElement.getAttribute("data-rating"));
        ratingValueInput.value = checkedStar;
        for (let stars of star) {
        if(Number(stars.getAttribute("data-rating")) <= checkedStar) {
            stars.classList.remove("fa-regular");
            stars.classList.add("fa-solid");
        } else {
            stars.classList.remove("fa-solid");
            stars.classList.add("fa-regular");
        }
    }
    };
    })
}
