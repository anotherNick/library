class Book {

    #id;
    #read;

    constructor(title, author, pages, read = false) {

        this.title = title;
        this.author = author;
        this.pages = pages;
        this.readMsg = "";
        this.#read = read;
        this.#id = crypto.randomUUID();
        this.setReadMsg();

    }

    info = function() {
        return `${title} by ${author}, ${pages} pages, ${read}`;
    }

    toggleRead = function() {
        this.#read = (this.#read === true) ? false : true;
        this.setReadMsg();
    }

    setReadMsg = function() {
        this.readMsg = (this.#read === true) ? 'Read' : 'Not yet read';
    }

    getId = function() {
        return this.#id;
    }
}

const Library = new class {

    #books = [];

    addBook(title, author, pages, read) {

        const book = new Book(title, author, pages, read);
        this.#books.push(book);
        return(book);

    }

    removeBook(id) {

        const index = this.#books.findIndex(book => book.getId() === id);

        if (index !== -1) {
            this.#books.splice(index, 1);
        }

    }

    getBookById(id) {

        const index = this.#books.findIndex(book => book.getId() === id);
        if(index !== -1) {
            return this.#books[index];
        }

    }

    getBooks(){
        return this.#books;
    }

}

const Display = new class {


    listBooks() {

        const table = document.getElementById('books');

        Library.getBooks().forEach(book => {
            this.addBook(table, book)
        });

    }

    addBook(table, book) {

        const row = document.createElement('tr');
            row.className = "book";

        for(const[key, value] of Object.entries(book)) {

            if(typeof value === 'function') { continue; };

            const cell = document.createElement('td');
                cell.innerText = value;
                cell.className = key;
            
            row.appendChild(cell);

        }

        const removeBtn = document.createElement('button');
                removeBtn.innerText = 'Remove from library';
                removeBtn.value = book.getId();
                removeBtn.addEventListener('click', e => {
                
                    const targetBook = Library.getBookById(e.target.value);
                    Library.removeBook(targetBook.getId());
                    Display.removeBook(e.target.closest('.book'));
                
                });
        const toggleReadBtn = document.createElement('button');
            toggleReadBtn.innerText = 'Toggle read / unread'
            toggleReadBtn.value = book.getId();
            toggleReadBtn.addEventListener('click', e => {

                    const targetBook = Library.getBookById(e.target.value);
                    const tableRow = e.target.closest('.book');
                    targetBook.toggleRead();
                    Display.updateReadCell(targetBook, tableRow);

            });

        const readBtnCell = document.createElement('td');
        readBtnCell.append(toggleReadBtn);
        
        const removeBtnCell = document.createElement('td');
        removeBtnCell.append(removeBtn);

        row.append(readBtnCell, removeBtnCell);
        table.append(row);

    }

    removeBook(tableRow) {

        tableRow.remove();

    }

    updateReadCell(book, row) {

        const cell = row.querySelector('.readMsg');
        cell.innerText = book.readMsg;

    }

}

Library.addBook('Faust', 'Johann Wolfgang von Goethe', 158, true);
Library.addBook('The Divine Comedy', 'Dante Aleghieri', 798, false);
Library.addBook('Paradise Lost', 'John Milton', 453, false);
Library.addBook('Doctor Faustus', 'Thomas Mann', 534, false);
Library.addBook('The Picture of Dorian Gray', 'Oscar Wilde', 254, false);
Library.addBook('The Master and Margarita', 'Mikhail Bulgakov', 384, false);
Library.addBook('The Magic Skin', 'Honore de Balzac', 304, false);
Library.addBook('Johannes Cabal the Necromancer', "Jonathan L. Howard", 320, false);
Library.addBook('Needful Things', 'Stephen King', 816, false);

Display.listBooks();

const newBookDialog = document.querySelector('#new-book-dialog');

const newBookBtn = document.querySelector('#new-book');
newBookBtn.addEventListener('click', () => {
    newBookDialog.showModal();
});

const dialogClose = document.getElementById('new-book-dialog-close');
dialogClose.addEventListener('click', e => {
    e.preventDefault();
    newBookDialog.close()
});

const newBookForm = document.querySelector('#new-book-form');
newBookForm.addEventListener('submit', () => {

    const formOutput = new FormData(newBookForm);
    const bookData = Object.fromEntries(formOutput.entries());
          bookData.read = (bookData.read === "Yes") ? true : false;
    const book = Library.addBook(bookData.title, bookData.author, bookData.pages, bookData.read);
    const table = document.getElementById('books');
    
    Display.addBook(table, book);
    newBookForm.reset();
});