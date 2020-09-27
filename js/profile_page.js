firebase.auth().onAuthStateChanged(function (user) {
    if (user) {  // is logged in
        document.getElementById("information").style.visibility = "visible";

        let btns = document.createElement("div");
        btns.id = "buttons";
        document.body.appendChild(btns);

        let update_info_btn = document.createElement("button");
        update_info_btn.id = "update_info_btn";

        update_info_btn.innerHTML = "Update Information";

        document.getElementById(btns.id).appendChild(update_info_btn);

        document.getElementById("update_info_btn").onclick = function () {
            window.location = "update_profile.html";
        }
        display_info()
    }
    else {  // user not logged in
        document.getElementById("information").style.visibility = "hidden";
        let msg = document.createElement("h1");

        msg.innerHTML = "Must login to see profile page.";
        msg.style.marginLeft = "36.5%";
        document.getElementById("nav_container").appendChild(msg);

        let login = document.createElement("a");
        login.setAttribute("href", "login.html");
        login.style.fontSize = "22px";
        login.innerHTML = "CLICK TO LOGIN";
        login.style.marginLeft = "45%";
        document.getElementById("nav_container").appendChild(login);

    }

});

function display_info() {
    firebase.auth().onAuthStateChanged(function (user) {
        let dbref = firebase.database().ref("users/" + user.uid);
        dbref.once("value", function (snapshot) {
            let list = snapshot.val();
            console.log(list);
            let user_info = Object.values(list);
            let user_info_key = Object.keys(list);
            let l = ["name", "email", "address", "payment", "bill_city", "bill_phone", "bill_prov", "bill_zip",
                     "cc_number", "cc_expiry", "ccv", "paypal_email"];
            for (let i = 0; i < l.length; i++) {
                let index = user_info_key.indexOf(l[i]);

                if (index != -1) {
                    if (l[i].slice(0, 4) == "bill") {
                        document.getElementById(l[i]).innerHTML += user_info[index];
                    }
                    
                    else if(l[i].slice(0,2) == "cc"){
                        document.getElementById(l[i]).innerHTML += user_info[index];
                    }

                    else {
                        document.getElementById(l[i]).innerHTML += user_info[index];
                    }
                }
            }

        });
    });
}





