firebase.auth().onAuthStateChanged(function (user) {
    if (user) {  // is logged in
        window.location = "homepage.html";
    }
    else {// stay on this page
    }
});

let signin_btn = document.getElementById("signin");
signin_btn.onclick = function () {
    window.location = "login.html";
}

let browse_btn = document.getElementById("browse");
browse_btn.onclick = function() {
    window.location = "homepage.html";
}
