const myLibrary = [];

function Book(title, author, pages, read = false) {

    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor.");
    }

    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readMsg = "";

    Object.defineProperties(this, {
      'read': {
        value: read,
        writable: true,
        enumerable: false,
      },
      'id': {
        value: crypto.randomUUID(),
        enumerable: false,
      }
    });

    this.info = function() {
        return `${title} by ${author}, ${pages} pages, ${read}`;
    }

    this.toggleRead = function() {
        this.read = (this.read === true) ? false : true;
        this.setReadMsg();
    }

    this.setReadMsg = function() {
        this.readMsg = (this.read === true) ? 'Read' : 'Not yet read';
    }

    this.setReadMsg();

}

function getBookById(id) {

    const index = myLibrary.findIndex(book => book.id === id);
    
    if(index !== -1) {
        return myLibrary[index];
    }

}

function addBookToLibrary(title, author, pages, read) {

    const book = new Book(title, author, pages, read);
    myLibrary.push(book);
    return(book);

}

function removeBookFromLibrary(id) {

    const index = myLibrary.findIndex(book => book.id === id);

    if (index !== -1) {
        myLibrary.splice(index, 1);
    }

}

function listBooks() {

    const table = document.getElementById('books');

    myLibrary.forEach(book => {
        addBookToTable(table, book)
    });

}

function addBookToTable(table, book) {

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
            removeBtn.value = book.id;
            removeBtn.addEventListener('click', e => {
            
                const targetBook = getBookById(e.target.value);
                removeBookFromLibrary(targetBook);
                removeBookFromTable(e.target.closest('.book'));
            
            });
    const toggleReadBtn = document.createElement('button');
          toggleReadBtn.innerText = 'Toggle read / unread'
          toggleReadBtn.value = book.id;
          toggleReadBtn.addEventListener('click', e => {

                const targetBook = getBookById(e.target.value);
                const tableRow = e.target.closest('.book');
                targetBook.toggleRead();
                updateReadCell(targetBook, tableRow);

          });

    const readBtnCell = document.createElement('td');
    readBtnCell.append(toggleReadBtn);
    
    const removeBtnCell = document.createElement('td');
    removeBtnCell.append(removeBtn);

    row.append(readBtnCell, removeBtnCell);
    table.append(row);

}

function removeBookFromTable(tableRow) {

    tableRow.remove();

}

function updateReadCell(book, row) {

    const cell = row.querySelector('.readMsg');
    cell.innerText = book.readMsg;

}

addBookToLibrary('Faust', 'Johann Wolfgang von Goethe', 158, true);
addBookToLibrary('The Divine Comedy', 'Dante Aleghieri', 798, false);
addBookToLibrary('Paradise Lost', 'John Milton', 453, false);
addBookToLibrary('Doctor Faustus', 'Thomas Mann', 534, false);
addBookToLibrary('The Picture of Dorian Gray', 'Oscar Wilde', 254, false);
addBookToLibrary('The Master and Margarita', 'Mikhail Bulgakov', 384, false);
addBookToLibrary('The Magic Skin', 'Honore de Balzac', 304, false);
addBookToLibrary('Johannes Cabal the Necromancer', "Jonathan L. Howard", 320, false);
addBookToLibrary('Needful Things', 'Stephen King', 816, false);

listBooks();

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
    const book = addBookToLibrary(bookData.title, bookData.author, bookData.pages, bookData.read);
    const table = document.getElementById('books');
    
    addBookToTable(table, book);
    newBookForm.reset();
});