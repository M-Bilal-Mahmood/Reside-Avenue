let toast = document.querySelector(".flash-toast");

// Guard: if no flash message was rendered, do nothing
if (toast) {
    let type = toast.getAttribute("data-type");
    let operationIcon = toast.querySelector(".operation-icon");
    let toastTitle = toast.querySelector(".toast-title");

    // Map type to display config
    let toastMap = {
        "create": { title: "Listing Created",  icon: "fa-solid fa-check" },
        "delete": { title: "Listing Deleted",  icon: "fa-solid fa-trash" },
        "update": { title: "Listing Updated",  icon: "fa-solid fa-pen-to-square" },
        "posted": { title: "Review Posted",    icon: "fa-regular fa-star" },
        "notFound": { title: "Listing Not Found",  icon: "fa-solid fa-magnifying-glass" },
        "error": { title: "Error",  icon: "fa-solid fa-triangle-exclamation" }
    };

    if (toastMap[type]) {
        toastTitle.textContent = toastMap[type].title;
        operationIcon.className = `operation-icon ${toastMap[type].icon}`;
    }

    let toastEnter = () => setTimeout(() => {
        toast.classList.remove("flash-toast-exit");
        toast.classList.add("flash-toast-enter");
        setTimeout(() => {
            toast.classList.remove("flash-toast-enter");
            toast.classList.add("flash-toast-exit");
        }, 4000);
    }, 100);

    toastEnter();
}