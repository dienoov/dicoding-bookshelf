const aside = document.querySelector("aside");
const newButton = document.getElementById("new");

const toggleModal = () => document.body.classList.toggle("show");

aside.onclick = (ev) => {
    if (ev.target.tagName === "ASIDE") toggleModal();
};

newButton.onclick = () => {
    document.getElementById("book").reset();
    document.querySelectorAll("#book input[type=hidden]").forEach((input) => input.remove());
    document.querySelector("#book .delete").setAttribute("hidden", "hidden");
    toggleModal();
};