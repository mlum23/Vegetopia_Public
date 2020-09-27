function create_table(){
firebase.auth().onAuthStateChanged(function (user) {
        if (user) { // User is logged in
            let dbref = firebase.database().ref("users/" + user.uid + "/cart");
            dbref.once("value", function (snapshot) {
                let list = snapshot.val();

                // If list is empty
                if (list == null) {
                    let msg = document.createElement("h1");
                    msg.innerHTML = "Cart Empty";
                    msg.style.marginLeft = "45%";
                    document.getElementById("nav_container").appendChild(msg);

                    let back_to_home = document.createElement("a");
                    back_to_home.setAttribute("href", "homepage.html");
                    back_to_home.innerHTML = "Return Home";
                    back_to_home.style.marginLeft = "47.5%";
                    document.getElementById("nav_container").appendChild(back_to_home);
                }

                else {
                    let cart_items = Object.values(list);  // list of values
                    let cart_keys = Object.keys(list);
                    console.log(cart_items);
                    console.log(cart_keys);
                    let total_price = 0;

                    // Dynamically display item name, quantity, and total_price price
                    for (let i = 0; i < cart_items.length; i = i + 3) {
                        if (i == 0) {
                            let cat = document.createElement("tr");
                            cat.id = "cat2"
                            document.getElementById("table_container").appendChild(cat);

                            let item = document.createElement("th");
                            let qty = document.createElement("th");
                            let pricee = document.createElement("th");
                            let remove = document.createElement("th");

                            remove.innerHTML = "Delete";
                            item.innerHTML = "Item";
                            qty.innerHTML = "Quantity";
                            pricee.innerHTML = "Price";

                            document.getElementById("cat2").appendChild(item);
                            document.getElementById("cat2").appendChild(qty);
                            document.getElementById("cat2").appendChild(pricee);
                            document.getElementById("cat2").appendChild(remove);

                        }
                        let tableRow = document.createElement("tr");
                        tableRow_id = "tr" + i;
                        tableRow.id = tableRow_id
                        document.getElementById("table_container").appendChild(tableRow)

                        let itemName = document.createElement("td");
                        let quantity = document.createElement("td");
                        let price = document.createElement("td");
                        let remove_item = document.createElement("td");

                        itemName.innerHTML = cart_items[i];
                        quantity.innerHTML = cart_items[i + 2];
                        quantity.setAttribute("align", "center");

                        remove_item.innerHTML = "X";
                        remove_item.id = "remove_btn";
                        remove_item.setAttribute("align", "center");
                        remove_item.onclick = function () {
                            dbref.child(cart_keys[i]).remove();
                            dbref.child(cart_keys[i + 1]).remove();
                            dbref.child(cart_keys[i + 2]).remove();
                            document.getElementById("table_container").innerHTML = "";
                            total = 0;
                            create_table();
                        }

                        price.innerHTML = "$" + (cart_items[i + 1] * cart_items[i + 2]).toFixed(2);

                        document.getElementById(tableRow_id).appendChild(itemName);
                        document.getElementById(tableRow_id).appendChild(quantity);
                        document.getElementById(tableRow_id).appendChild(price);
                        document.getElementById(tableRow_id).appendChild(remove_item);


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

                    let confirmButton = document.createElement("button");
                    confirmButton.innerHTML = "Check out";
                    confirmButton.onclick = function () { window.location = "submit_order.html" };
                    document.getElementById("table_container").appendChild(confirmButton)
                }
            });

        }
        else {  // user not logged in
            let msg = document.createElement("h1");

            msg.innerHTML = "Must login to see cart";
            msg.style.marginLeft = "40%";
            document.getElementById("nav_container").appendChild(msg);

            let login = document.createElement("a");
            login.setAttribute("href", "login.html");
            login.style.fontSize = "22px";
            login.innerHTML = "CLICK TO LOGIN";
            login.style.marginLeft = "45%";
            document.getElementById("nav_container").appendChild(login);

        }

    });
}

create_table();
let total = 0
