const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener("DOMContentLoaded", function (){
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event){
        event.preventDefault();
        addBook();
    });
});

function addBook (){
    const textBook = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const yearBook = document.getElementById('inputBookYear').value;

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, textBook, author, yearBook, false);
    books.push(bookObject);
    document.dispatchEvent (new Event(RENDER_EVENT));
}

function generateId(){
    return + new Date ();
}

function generateBookObject (id, task, author, year, isCompleted){
    return {
        id,
        task,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedBook = document.getElementById('incompleteBookshelfList');
    uncompletedBook.innerHTML='';

    const completedBook = document.getElementById('completeBookshelfList');
    completedBook.innerHTML='';

    for (const bookItem of books){
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted){
            uncompletedBook.append(bookElement);
        } else {
            completedBook.append(bookElement);
        }      
    }
});

//make book
function makeBook(bookObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.task;

    const textAuthorBook = document.createElement('p');
    textAuthorBook.innerText = bookObject.author;

    const textYearBook = document.createElement('p');
    textYearBook.innerText = bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('book_item');
    textContainer.append(textTitle, textAuthorBook, textYearBook);

    const container = document.createElement('div');
    container.classList.add('list', 'shadow');
    container.append(textContainer);
    container.setAttribute('id',`book-${bookObject.id}`);

    //implementasi fungsi check dan uncheck
    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');

        undoButton.addEventListener('click', function(){
            undoTaskFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');

        trashButton.addEventListener('click', function(){
            removeTaskFromCompleted(bookObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('book_shelf');

        checkButton.addEventListener('click', function (){
            addTaskToCompleted(bookObject.id);
        });

        container.append(checkButton);
    }

    return container;
}

function addTaskToCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}