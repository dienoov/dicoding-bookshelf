class Book {
    constructor({id, title, author, year, cover, isComplete}) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.year = year;
        this.cover = cover;
        this.isComplete = isComplete;
    }

    renderHTML({onclick}) {
        const book = document.createElement("li");
        const cover = document.createElement("img");
        const title = document.createElement("h3");
        const author = document.createElement("h4");
        const year = document.createElement("span");

        book.dataset.id = this.id;
        book.onclick = onclick;
        cover.src = this.cover;
        cover.alt = "cover";
        title.innerText = this.title;
        author.innerText = this.author;
        year.innerText = this.year;

        book.append(cover, title, author);
        author.append(year);

        return book;
    }
}