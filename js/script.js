if (typeof (Storage) === "undefined")
    document.body.innerHTML = "This browser does not support local storage."

if (localStorage.getItem("books") === null)
    localStorage.setItem("books", JSON.stringify([]));

const render = (books) => {
    unfinished.innerHTML = "";
    finished.innerHTML = "";

    books.forEach((book) => {
        book = new Book(book);
        book.isComplete ?
            finished.append(book.renderHTML({onclick: editBook})) :
            unfinished.append(book.renderHTML({onclick: editBook}));
    });

    if (unfinished.innerHTML === "")
        unfinished.innerHTML = "<span>There are no unfinished books.</span>";

    if (finished.innerHTML === "")
        finished.innerHTML = "<span>There are no finished books.</span>";
}

const synchronize = (books = null) => {
    if (books)
        localStorage.setItem("books", JSON.stringify(books));
    else
        books = JSON.parse(localStorage.getItem("books"));

    render(books);
};

const unfinished = document.querySelector("#unfinished .books");
const finished = document.querySelector("#finished .books");
const form = document.getElementById("book");
const title = document.getElementById("title");
const author = document.getElementById("author");
const year = document.getElementById("year");
const cover = document.getElementById("cover");
const finish = document.getElementById("finish");
const reader = new FileReader();
const search = document.getElementById("search");
const deleteButton = document.querySelector("#book .delete");

const saveBook = ({cover = null}) => {
    const books = JSON.parse(localStorage.getItem("books"));
    const book = {
        title: title.value,
        author: author.value,
        year: year.value,
        isComplete: finish.checked,
        cover,
    };
    const id = form.querySelector("input[type=hidden]");

    if (!id) {
        book.id = +new Date();
        books.push(book);
    } else {
        const old = books.findIndex((book) => book.id === parseInt(id.value));
        books[old].title = book.title;
        books[old].author = book.author;
        books[old].year = book.year;
        books[old].isComplete = book.isComplete;
        books[old].cover = cover ?? books[old].cover;
    }

    synchronize(books);

    toggleModal();
    form.reset();
    id && id.remove();
    search.value = "";
};

const editBook = (ev) => {
    toggleModal();

    const id = parseInt(ev.currentTarget.dataset.id);
    const books = JSON.parse(localStorage.getItem("books"));
    const book = books[books.findIndex((book) => book.id === id)];

    title.value = book.title;
    author.value = book.author;
    year.value = book.year;
    finish.checked = book.isComplete;

    cover.removeAttribute("required");

    document.querySelectorAll("#book input[type=hidden]").forEach((input) => input.remove());

    const hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.value = id.toString();
    form.append(hidden);
    
    deleteButton.removeAttribute("hidden");
};

const searchBook = (ev) => {
    const keyword = ev.currentTarget.value;
    const regExp = new RegExp(keyword, "gi");
    let filtered = JSON.parse(localStorage.getItem("books"));

    if (keyword !== "")
        filtered = filtered.filter((book) => book.title.match(regExp));

    render(filtered);
};

reader.addEventListener("load", (ev) => {
    saveBook({cover: ev.target.result.toString()});
});

form.onsubmit = (ev) => {
    ev.preventDefault();
    cover.files[0] ? reader.readAsDataURL(cover.files[0]) : saveBook({});
};

deleteButton.onclick = () => {
    if (!confirm("Are you sure want to delete this book?"))
        return;

    const books = JSON.parse(localStorage.getItem("books"))
    const id = parseInt(form.querySelector("input[type=hidden]").value);
    const index = books.findIndex((book) => book.id === id);

    books.splice(index, 1);

    synchronize(books);
    toggleModal();
    search.value = "";
};

search.oninput = searchBook;

synchronize();