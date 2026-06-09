let skeletonCards = document.querySelectorAll(".skeleton-card");
let listingCards = document.querySelectorAll(".listing_cards");
let images = document.querySelectorAll(".listing_card_image img");
let i = 0;
for (let img of images) {
    let skeletonCard = skeletonCards[i];
    let listingCard = listingCards[i];
    if(img.complete) {
        skeletonCard.style.display = "none";
        listingCard.classList.add("loaded");
    } else {
        img.addEventListener("load", () => {
            skeletonCard.style.display = "none";
            listingCard.classList.add("loaded");
        });
    }
    i++;
};