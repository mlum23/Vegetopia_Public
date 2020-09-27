firebase.auth().onAuthStateChanged(function (user) {
    let dbref = firebase.database().ref("users/" + user.uid + "/cart");
    let dbref_cc = firebase.database().ref("users/" + user.uid);

    // Display user info
    add_info(cc_info)
    add_info(billing_info);
    add_info(paypal_info);

    function add_info(user_info) {
        dbref_cc.once("value", function (snapshot) {
            let list = snapshot.val();  // key: value
            for (let i = 0; i < user_info.length; i++) {
                if (list[user_info[i]] != undefined) {
                    let x = document.getElementById(user_info[i]);
                    let x_in = x.innerHTML;
                    x.innerHTML = x_in + list[user_info[i]];
                    if(add_tracker == 0){
                        paypal_info_entered += 1;
                    }
                    else if(add_tracker == 1){
                        billing_info_entered += 1;
                    }

                    else if(add_tracker == 2){
                        cc_info_entered += 1;
                    } 
                }
            }
            add_tracker += 1;
        });
    }

    // Display cart items
    dbref.once("value", function (snapshot) {
        let list = snapshot.val();  // dictionary
        let cart_items = Object.values(list);  // list of values
        let total = 0;

        // Zoom page out if there are at least 6 times (18/3)
        if (cart_items.length >= 18) {
            document.body.style.zoom = "90%"
        }

        // Add items dynamically to table
        for (let i = 0; i < cart_items.length; i = i + 3) {
            if (i == 0) {
                let cat = document.createElement("tr");
                cat.id = "cat2"
                document.getElementById("table_container").appendChild(cat);

                let item = document.createElement("th");
                let qty = document.createElement("th");
                let pricee = document.createElement("th");

                item.innerHTML = "Item";
                qty.innerHTML = "Quantity";
                pricee.innerHTML = "Price";

                document.getElementById("cat2").appendChild(item);
                document.getElementById("cat2").appendChild(qty);
                document.getElementById("cat2").appendChild(pricee);
            }
            let tableRow = document.createElement("tr");
            tableRow_id = "tr" + i;
            tableRow.id = tableRow_id
            document.getElementById("table_container").appendChild(tableRow)

            let itemName = document.createElement("td");
            let quantity = document.createElement("td");
            let price = document.createElement("td");

            itemName.innerHTML = cart_items[i];
            quantity.innerHTML = cart_items[i + 2];
            quantity.setAttribute("align", "center");
            price.innerHTML = "$" + (cart_items[i + 1] * cart_items[i + 2]).toFixed(2);

            document.getElementById(tableRow_id).appendChild(itemName);
            document.getElementById(tableRow_id).appendChild(quantity);
            document.getElementById(tableRow_id).appendChild(price);

            total += cart_items[i + 1] * cart_items[i + 2];  // update total price

            if (i == cart_items.length - 3) {
                let lastRow = document.createElement("tr");
                lastRow.id = "lr";
                document.getElementById("table_container").appendChild(lastRow);

                let emptytd = document.createElement("td")
                let spantd = document.createElement("td");
                spantd.colSpan = "2";
                spantd.innerHTML = "Total: $" + total.toFixed(2);
                spantd.style.fontSize = "22px"
                spantd.style.alignContent = "center";
                document.getElementById("table_container").appendChild(emptytd);
                document.getElementById("table_container").appendChild(spantd);

            }
        }
    });
});

function submitted() {
    firebase.auth().onAuthStateChanged(function (user) {
        let payment_option = document.getElementById("payment_filter").value;
        let msg = document.getElementById("cant_submit");
        if (good_to_submit && billing_info_entered == 5) {
            let dbref = firebase.database().ref("users/" + user.uid);
            dbref.child("cart").remove();
            window.location.href = "thankyou.html"
        }
        else if(payment_option=="" && option_tracker == 0 ){
            msg.style.backgroundColor = "blue";
            msg.innerHTML = "Choose a payment option!"
            
            setTimeout(function () { document.getElementById("cant_submit").style.visibility = "visible" }, 350);
            setTimeout(function () { document.getElementById("cant_submit").style.visibility = "hidden" }, 2350);

        }
        else {
            msg.style.backgroundColor = "red";
            msg.innerhTMl = "Must fill out all payment and billing information!";
            setTimeout(function () { document.getElementById("cant_submit").style.visibility = "visible" }, 350);
            setTimeout(function () { document.getElementById("cant_submit").style.visibility = "hidden" }, 2350);
        }
    });
};

function go_to_update_page() {
    window.location.href = "update_profile.html";
}

function payment_option() {
    let payment_option = document.getElementById("payment_filter").value;

    if (payment_option == "credit_card") {
        document.getElementById("pay_by_paypal").style.display = "none";
        document.getElementById("pay_by_cc").style.display= "block";
        if(cc_info_entered >= 4){
            good_to_submit = true;
        }
    }
    else if (payment_option == "paypal") { // paypal
        document.getElementById("pay_by_cc").style.display = "none";
        document.getElementById("pay_by_paypal").style.display = "block";
        if(paypal_info_entered >= 1){
            good_to_submit = true;
        }
    }
}

let update_btn = document.getElementById("update_info");
let good_to_submit = false;

let cc_info = ["cc_number", "cc_expiry", "name", "ccv"];
let billing_info = ["address", "bill_city", "bill_zip", "bill_prov", "bill_phone"];
let paypal_info = ["paypal_email"];

let cc_info_entered = 0;
let billing_info_entered = 0;
let paypal_info_entered = 0;

let add_tracker = 0;
let option_tracker = 0;

update_btn.onclick = go_to_update_page;

