function payment_option() {
    let payment_option = document.getElementById("payment_filter").value;

    if (payment_option == "credit_card") {
        document.getElementById("paypal").style.visibility = "hidden";
        document.getElementById("cc").style.visibility = "visible"
    }
    else if (payment_option == "paypal") { // paypal
        document.getElementById("cc").style.visibility = "hidden";
        document.getElementById("paypal").style.visibility = "visible";
    }

    else {
        // pass; do nothing
    }
}

function update() {
    firebase.auth().onAuthStateChanged(function (user) {
        let dbref = firebase.database().ref("users/" + user.uid);

        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;

        let cc_num = document.getElementById("cc_num").value;
        let expiry_date = document.getElementById("exp").value;
        let ccv = document.getElementById("ccv").value;

        let paypal_email = document.getElementById("ppe").value.trim();

        // Billing
        let address = document.getElementById("address").value;
        let bill_city = document.getElementById("bill_city").value;
        let bill_prov = document.getElementById("bill_prov").value;
        let bill_zip = document.getElementById("bill_zip").value;
        let bill_phone = document.getElementById("bill_phone").value;

        let categories = ["name", "email", "address", "cc_number", "cc_expiry", "ccv", "paypal_email", 
                          "bill_city", "bill_prov", "bill_zip", "bill_phone"];

        var values = [name, email, address, cc_num.replace(/ /g, ''), expiry_date.replace(/ /g, ''), ccv.replace(/ /g, ''), 
                      paypal_email.replace(/ /g, ''), bill_city, bill_prov, bill_zip, bill_phone]

        if ((name=="" && email=="" && address=="" && cc_num=="" && expiry_date=="" && ccv=="" && paypal_email==""
             && bill_city=="" && bill_prov=="" && bill_zip=="" && bill_phone=="" )) {
            let msg = document.getElementById("added");
            msg.innerHTML = "There is nothing to change!"
            msg.style.backgroundColor = "red";
            msg.style.color = "white";
        }

        else{
            let msg = document.getElementById("added");
            msg.innerHTML = "Changes Saved";
            msg.style.backgroundColor = "yellow";
            msg.style.color = "black";
        }

        for (let i = 0; i < categories.length; i++) {
            if (values[i].trim() != "") {
                dbref.update({
                    [categories[i]]: values[i]
                })

            }
        }
    })

    setTimeout(function () { document.getElementById("added").style.visibility = "visible" }, 350);
    setTimeout(function () { document.getElementById("added").style.visibility = "hidden" }, 2350);
}

