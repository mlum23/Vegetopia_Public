firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        let dbref = firebase.database().ref("users/" + user.uid);
        dbref.once("value", function (snapshot) {
            let list = snapshot.val();
            let logged_in_as = document.createElement("h5");
            logged_in_as.innerHTML = "Logged in as " + list.name;
            logged_in_as.id = "logged_in_as"
            document.getElementById("nav_container").appendChild(logged_in_as);

            let log_out = document.createElement("h5");
            log_out.id = "logout_click";
            log_out.innerHTML = "Logout";
            log_out.onclick = logout;
            document.getElementById("nav_container").appendChild(log_out);

        });
    }
    else {
        let log_in = document.createElement("h5");
        log_in.id = "login_click";
        log_in.innerHTML = "Login";
        log_in.onclick = login;
        document.getElementById("nav_container").appendChild(log_in);
    }
});

function login() {
    window.location.assign("login.html");
}

function logout() {
    var promise = firebase.auth().signOut();
    promise.then(function () {
        window.location.href = 'logout.html';
    });
}
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      document.getElementById("login").style.display = "none";
      logout.addEventListener("click", function(e) {
		var promise = firebase.auth().signOut();
        promise.then(function(){
            window.location.href='logout.html';
        });
	});
    } else {
      // No user is signed in.
      document.getElementById("logout").style.display = "none";
    }
  });