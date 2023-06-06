const STORAGE_KEY = 'BUKUKU_APPS';

const title = document.querySelector("#inputBookTitle");
const author = document.querySelector("#inputBookAuthor");
const year = document.querySelector("#inputBookYear");
const bookComplete = document.querySelector("#inputBookIsComplete");
const btnSubmit = document.querySelector("#bookSubmit");
const searchValue = document.querySelector("#searchBookTitle");
const btnSearch = document.querySelector("#searchSubmit");
const searchText = document.querySelector("#searchText")

function generateId() {
    return + new Date();
}


function isStorageExist() { /* boolean */
    if (typeof(Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem(STORAGE_KEY) !== null) {
        const booksData = getData();
        showData(booksData);
    }
});

function addData(book) {
    let bookData = [];
    if (isStorageExist()) {
        if (localStorage.getItem(STORAGE_KEY) === null) {
            localStorage.setItem(STORAGE_KEY, "");
        } else {
            bookData = JSON.parse(localStorage.getItem(STORAGE_KEY));
        } bookData.unshift(book);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));

        showData(getData());
    }
}

function getData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}


function showData(books =[]) {
    const inCompleted = document.querySelector("#incompleteBookshelfList");
    const completed = document.querySelector("#completeBookshelfList");
    const bookOpen = document.querySelector("#bookOpen");
    const bookClose = document.querySelector("#bookClose");
    bookOpen.innerHTML += "";
    bookClose.innerHTML += "";

    inCompleted.innerHTML = "";
    completed.innerHTML = "";
    let countComplete = 0,
        countIncomplete = 0;
    books.forEach((book) => {
        if (book.isCompleted == false) {
            countComplete++;
            let el = `
      <div class="book-list">
      <img class="img" src="https://source.unsplash.com/random/?book,${
                book.title
            }"  />
      <span class="text">
        <p>${
                book.author
            }</p>
        <h3>${
                book.title
            }</h3>
        <p>${
                book.year
            }</p></span
      >
      <span class="btn">
        <div class="btn">
          <button class="red" onclick="deleteBook('${
                book.id
            }')">
            <i class="bx bx-message-rounded-x"></i>
          </button>
        </div>
        <div class="btn">
          <button class="yellow" onclick="editBook('${
                book.id
            }')">
            <i class="bx bx-edit-alt"></i>
          </button>
        </div>
        <div class="btn">
          <button class="green" onclick="bookCompleteBook('${
                book.id
            }')"><i class="bx bx-book-open"></i></button>
        </div>
      </span>
    </div>
            `;

            inCompleted.innerHTML += el;

        } else {
            countIncomplete++;
            let el = `
            
      <div class="book-list">
      <img class="img" src="https://source.unsplash.com/random/?book,${
                book.title
            }"  />
      <span class="text">
        <p>${
                book.author
            }</p>
        <h3>${
                book.title
            }</h3>
        <p>${
                book.year
            }</p></span
      >
      <span class="btn">
        <div class="btn">
          <button class="red" onclick="deleteBook('${
                book.id
            }')">
            <i class="bx bx-message-rounded-x"></i>
          </button>
        </div>
        <div class="btn">
          <button class="yellow" onclick="editBook('${
                book.id
            }')">
            <i class="bx bx-edit-alt"></i>
          </button>
        </div>
        <div class="btn">
          <button class="green" onclick="unbookCompleteBook('${
                book.id
            }')"><i class="bx bx-book"></i></button>
        </div>
      </span>
    </div>`;
            completed.innerHTML += el;

        } bookClose.innerHTML = ` <i class="bx bx-book"></i>
        <span class="text">
          <h3>${countComplete}</h3>
          <p>Buku blm dibaca</p>
        </span>`;
        bookOpen.innerHTML = ` <i class="bx bx-book-open"></i>
        <span class="text">
          <h3>${countIncomplete}</h3>
          <p>Buku sudah dibaca</p>
        </span>`;
    });

    modal.style.display = "none";
}


function bookCompleteBook(id) {
    let confirmation = confirm("Pindahkan ke buku sudah dibaca?");

    if (confirmation == true) {
        const bookDataDetail = getData().filter((result) => result.id == id);
        const newBook = {
            id: bookDataDetail[0].id,
            title: bookDataDetail[0].title,
            author: bookDataDetail[0].author,
            year: bookDataDetail[0].year,
            isCompleted: true
        };

        const bookData = getData().filter((result) => result.id != id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));

        addData(newBook);

        location.reload();
    } else {
        return 0;
    }
}

function unbookCompleteBook(id) {
    let confirmation = confirm("Pindahkan ke blm dibaca?");

    if (confirmation == true) {
        const bookDataDetail = getData().filter((result) => result.id == id);
        const newBook = {
            id: bookDataDetail[0].id,
            title: bookDataDetail[0].title,
            author: bookDataDetail[0].author,
            year: bookDataDetail[0].year,
            isCompleted: false
        };

        const bookData = getData().filter((result) => result.id != id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));

        addData(newBook);

        location.reload();
    } else {
        return 0;
    }
}

function editBook(id) {
    modal.style.display = "block";
    const bookDataDetail = getData().filter((result) => result.id == id);
    title.value = bookDataDetail[0].title;
    author.value = bookDataDetail[0].author;
    year.value = bookDataDetail[0].year;
    bookDataDetail[0].isCompleted ? (bookComplete.checked = true) : (bookComplete.checked = false);

    btnSubmit.innerHTML = "Edit buku";
    btnSubmit.value = bookDataDetail[0].id;

}

function deleteBook(id) {
    let confirmation = confirm("Yakin akan menghapusnya?");

    if (confirmation == true) {
        const bookDataDetail = getData().filter((result) => result.id == id);
        const bookData = getData().filter((result) => result.id != id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));
        showData(getData());
        alert(`Buku ${
            bookDataDetail[0].title
        } berhasil terhapus`);
        location.reload();
    } else {
        return 0;
    }
}

btnSearch.addEventListener("click", function (e) {
    e.preventDefault();
    if (localStorage.getItem(STORAGE_KEY) == "") {
        alert("Tidak ada data buku");
        return location.reload();

    } else {
        console.log(searchValue.value.trim());
        const getByTitle = getData().filter((result) => result.title.toUpperCase().includes(searchValue.value.toUpperCase()));
        if (getByTitle.length == 0) {
            const getByAuthor = getData().filter((result) => result.author.toUpperCase().includes(searchValue.value.toUpperCase()));
            if (getByAuthor.length == 0) {
                const getByYear = getData().filter((result) => result.year.includes(searchValue.value));
                if (getByYear.length == 0) {
                    alert(`Data yang anda cari tidak ditemukan`);
                    return location.reload();
                } else {
                    showSearchResult(getByYear);
                }
            } else {
                showSearchResult(getByAuthor);
            }
        } else {
            showSearchResult(getByTitle);
        }
    } searchValue.value = "";
});

function showSearchResult(books) {
    const searchResult = document.querySelector("#searchResult");
    searchText.innerText = `Berikut Hasil Pencarian ${
        books.length
    } buku ditemukan`
    searchResult.innerHTML = "";

    books.forEach((book) => {
        if (book.isCompleted) {
            let el = `
           
    <div class="book-list">
    <img class="img" src="https://source.unsplash.com/random/?book,${
                book.title
            }" />
    <span class="text">
      <p>${
                book.author
            }</p>
      <h3>${
                book.title
            }</h3>
      <p>${
                book.year
            }</p>
      <p>${
                book.isCompleted ? "Sudah Dibaca" : "Blm dibaca"
            }</p></span
    >
    <span class="btn">
      <div class="btn">
        <button class="red" onclick="deleteBook('${
                book.id
            }')">
          <i class="bx bx-message-rounded-x"></i>
        </button>
      </div>
      <div class="btn">
        <button class="yellow" onclick="editBook('${
                book.id
            }')">
          <i class="bx bx-edit-alt"></i>
        </button>
      </div>
      <div class="btn">
        <button class="green" onclick="unbookCompleteBook('${
                book.id
            }')"><i class="bx bx-book"></i></button>
      </div>
    </span>
  </div>`;

            searchResult.innerHTML += el;
        } else {
            let el = `
           
        <div class="book-list">
        <img class="img" src="https://source.unsplash.com/random/?book" />
        <span class="text">
          <p>${
                book.author
            }</p>
          <h3>${
                book.title
            }</h3>
          <p>${
                book.year
            }</p>
          <p>${
                book.isCompleted ? "Sudah Dibaca" : "Blm dibaca"
            }</p></span
        >
        <span class="btn">
          <div class="btn">
            <button class="red" onclick="deleteBook('${
                book.id
            }')">
              <i class="bx bx-message-rounded-x"></i>
            </button>
          </div>
          <div class="btn">
            <button class="yellow" onclick="editBook('${
                book.id
            }')">
              <i class="bx bx-edit-alt"></i>
            </button>
          </div>
          <div class="btn">
            <button class="green" onclick="bookCompleteBook('${
                book.id
            }')"><i class="bx bx-book-open"></i></button>
          </div>
        </span>
      </div>`;

            searchResult.innerHTML += el;
        }
    });

}

var modal = document.getElementById("myModal");

var btn = document.getElementById("myBtn");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
    modal.style.display = "block";
};

span.onclick = function () {
    modal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};


btnSubmit.addEventListener("click", function () {


    if (btnSubmit.value == "") {
        let error = "";
        const errorText = document.querySelector("#error")
        let errorCond = false;
        errorText.innerText = "";

        if (title.value == "") {
            error = error + "Judul belum diisi ,"
            errorCond = true;
        }

        if (author.value == "") {
            error = error + "Author belum diisi ,"
            errorCond = true;
        }
        if (year.value == "") {
            error = error + "Tahun belum diisi ,"
            errorCond = true;
        }

        errorText.innerText = error;
        if (errorCond == true) {
            return false;
        } else {
            const newBook = {
                id: generateId(),
                title: title.value.trim(),
                author: author.value.trim(),
                year: year.value,
                isCompleted: bookComplete.checked
            };
            addData(newBook);

            title.value = "";
            author.value = "";
            year.value = "";
            bookComplete.checked = false;

            alert("Buku berhasil ditambahkan");
        }
    } else {
        const bookData = getData().filter((result) => result.id != btnSubmit.value);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookData));

        const newBook = {
            id: btnSubmit.value,
            title: title.value.trim(),
            author: author.value.trim(),
            year: year.value,
            isCompleted: bookComplete.checked
        };
        addData(newBook);
        btnSubmit.innerHTML = "Masukkan Buku";
        btnSubmit.value = "";
        title.value = "";
        author.value = "";
        year.value = "";
        bookComplete.checked = false;
        alert("Buku berhasil diedit");

        return location.reload();
    }
});

