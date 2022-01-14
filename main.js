// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAoFuZSa60BwEMnOx97J6yuPsmXvq6yStY",
    authDomain: "ntut-web-bb0af.firebaseapp.com",
    projectId: "ntut-web-bb0af",
    storageBucket: "ntut-web-bb0af.appspot.com",
    messagingSenderId: "791297949044",
    appId: "1:791297949044:web:e9cec4467fb9e9500f4021"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const ratyOptions = {
    starHalf: "https://cdnjs.cloudflare.com/ajax/libs/raty/3.1.1/images/star-half.png",
    starOff: "https://cdnjs.cloudflare.com/ajax/libs/raty/3.1.1/images/star-off.png",
    starOn: "https://cdnjs.cloudflare.com/ajax/libs/raty/3.1.1/images/star-on.png"
}

const $createBookForm = $("#createBookForm");
const $createBookTitle = $("#createBookTitle");
const $createBookLink = $("#createBookLink");
const $createBookImage = $("#createBookImage");
const $createBookImageURL = $("#createBookImageURL");
const $imagePreview = $("#imagePreview");
const $createBookBtn = $("#createBookBtn");
const $createBookRaty = $("#createBookRaty");
const $createBookComment = $("#createBookComment");
const $deleteBook = $("#deleteBook");

$createBookRaty.raty({
    starOn: ratyOptions.starOn,
    starOff: ratyOptions.starOff,
})

// Binding change event for createBookImage
$createBookImage.change(function (e) {
    // Get the file object when user choose any files
    const file = this.files[0];
    const fileName = file.name;
    // Setup folder path for firebase storage
    const storagePath = `bookImages/${fileName}`;
    const ref = firebase.storage().ref(storagePath);
    // Upload file to firebase storage
    console.log(`Start Upload image to: ${storagePath}`);
    $createBookImageURL.text(`Start Upload image to: ${storagePath}`);
    ref.put(file)
        .then(snapshot => {
            // If file is uploaded successfully
            console.log(snapshot);
            // Get image URL
            ref.getDownloadURL()
                .then(imageURL => {
                    console.log("imageURL", imageURL);
                    $createBookImageURL.text(`${imageURL}`);
                    const picture = (`<img src="${imageURL}" width="400" height="200">`);
                    $imagePreview.append(picture);
                    $createBookBtn.prop('disabled', false);
                })
                .catch(err => {
                    $createBookImageURL.text(`Error: ${err}`);
                    console.log(err)
                });
        })
        .catch(err => {
            $createBookImageURL.text(`Error: ${err}`);
            console.log(err)
        });
});

$createBookForm.submit(function (e) {
    e.preventDefault();
    console.log("New Book Form Submitted !");
    const book = {
        title: $createBookTitle.val(),
        link: $createBookLink.val(),
        image: $createBookImageURL.text(),
        comment: $createBookComment.val(),
        raty: $createBookRaty.data("raty").score()
    };
    db.collection("bookList").add(book)
        .then(() => {
            alert("成功加入新書籍!");
            window.location.reload();
        })
        .catch(err => console.log(err));
});

db
    .collection("bookList")
    .get()
    .then(docList => {
        var l = 0;
        docList.forEach(doc => {
            const product = doc.data();
            const col = `
            <div class="card" style="width: 18rem;">
                <a href="${product.link}">
                    <img class="perfect" src="${product.image}" class="card-img-top" alt="...">
                </a>
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">${product.comment}</p>
                    <div id="${l}"></div>
                </div>
            </div>`;
            $("#visitorWorkBookList").append(col)
            $("#" + l).raty({
                number: function () {
                    return 0;
                },
                starOff: ratyOptions.starOff,
                starOn: ratyOptions.starOn,
                score: product.raty,
            });
            l += 1;
        })
    })
    .catch(err => {
        console.log("[err]", err);
    });

const bookList = [];

db
    .collection("bookList")
    .get()
    .then(docList => {
        var k = 0;
        docList.forEach(doc => {
            const book = doc.data();
            const bookId = doc.id;
            book["id"] = bookId;
            bookList.push(book);
        })
        renderBookList();
    })
    .catch(err => {
        console.log("[err]", err);
    });

function renderBookList() {
    var k = 0;
    bookList.forEach(book => {
        const col = `
        <div class="card" style="width: 18rem;">
            <a href="${book.link}">
                <img class="perfect" src="${book.image}" class="card-img-top" alt="...">
            </a>
            <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-text">${book.comment}</p>
                <div id="${k}"></div><br>
                <button data-id="${book.id}" class="btn btn-danger delete-book-btn">刪除</button>
            </div>
        </div>`;
        $("#adminBookList").append(col)
        $("#" + k).raty({
            number: function () {
                return 0;
            },
            starOff: ratyOptions.starOff,
            starOn: ratyOptions.starOn,
            score: book.raty,
        });
        k += 1;
    })
}

$("body").delegate(".delete-book-btn", "click", function () {
    const bookId = $(this).attr("data-id");
    console.log("刪除成功");
    db
        .doc(`bookList/${bookId}`)
        .delete()
        .then(() => {
            alert("此書籍已被刪除");
            window.location.reload();
        })
        .catch(err => console.log(err))
});

db
    .collection("bookList")
    .get()
    .then(docList => {
        var i = 0;
        try {
            docList.forEach(doc => {
                const product = doc.data();
                const col = `
                <div class="card" style="width: 18rem;">
                    <img src="${product.image}" class="perfect" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${product.title}</h5>
                        <div id="${i}"></div>
                    </div>
                </div>`;
                $("#sign_inBookList").append(col)
                $("#" + i).raty({
                    number: function () {
                        return 0;
                    },
                    starOff: ratyOptions.starOff,
                    starOn: ratyOptions.starOn,
                    score: product.raty,
                });
                i += 1;
                if (i == 4) {
                    throw new Error('跳出迴圈');
                }
            })
        } catch (e) {
            console.log(e);
        }
    })
    .catch(err => {
        console.log("[err]", err);
    });

db
    .collection("bookList")
    .get()
    .then(docList => {
        var j = 0;
        docList.forEach(doc => {
            const product = doc.data();
            const col = `
            <div class="card" style="width: 18rem;">
                <a href="${product.link}">
                    <img src="${product.image}" class="perfect" class="card-img-top" alt="...">
                </a>
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">${product.comment}</p>
                    <div id="${j}"></div>
                </div>
            </div>`;
            $("#visitorBookList").append(col)
            $("#" + j).raty({
                starOff: ratyOptions.starOff,
                starOn: ratyOptions.starOn,
                score: product.raty,
            });
            j += 1;
        })
    })
    .catch(err => {
        console.log("[err]", err);
    });