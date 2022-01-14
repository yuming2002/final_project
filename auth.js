// Scripts start here...

// Select DOM from web

// Sign Up form
var $signUpForm = $("#signUpForm"),
    $signUpEmail = $("#signUpEmail"),
    $signUpPassword = $("#signUpPassword");
$signUpPasswordAgain = $("#signUpPasswordAgain");

// Sign in form
var $signInForm = $("#signInForm"),
    $signInEmail = $("#signInEmail"),
    $signInPassword = $("#signInPassword");

// Sign out button
var $signOutBtn = $("#signOutBtn");

$signUpForm.submit(function (e) {
    e.preventDefault();
    // When sign up form submitted
    console.log("Ready for sign up");
    const email = $signUpEmail.val();
    const password = $signUpPassword.val();
    const passwordAgain = $signUpPasswordAgain.val();
    console.log(email, password, passwordAgain);
    // firebase sign Up method
    if (passwordAgain != password) {
        alert("請再次填入相同密碼");
    }
    else {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(res => {
                console.log("Sign Up", res);
                alert("註冊成功");
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
            });
    }
});

$signInForm.submit(function (e) {
    e.preventDefault();
    // When sign in form submitted
    console.log("Ready for sign in");
    const email = $signInEmail.val();
    const password = $signInPassword.val();
    console.log(email, password);
    // firebase sign in method
    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(res => {
            console.log("Sign In", res);
            alert("登入成功");
            if (email == "admin@gmail.com") {
                window.location = "admin.html";
            }
            else {
                window.location = "visitor.html";
            }
        })
        .catch(err => {
            console.log(err);
            if (err.code == 'auth/wrong-password') {
                alert("密碼錯誤!")
            } else if (err.code == 'auth/user-not-found') {
                alert("找不到此帳戶!");
            }
        });
});

$signOutBtn.click(function () {
    // When click sign out button
    console.log("Ready for sign out");
    firebase
        .auth()
        .signOut()
        .then(() => {
            alert("登出成功");
            window.location = "index.html"
        })
        .catch(err => console.log(err))
});

