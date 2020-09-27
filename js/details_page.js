let count = 1
let item = localStorage.getItem("product_name");
let price = localStorage.getItem("product_price");
let img = localStorage.getItem("product_img");
let category = localStorage.getItem("product_cat");
let item_trim = item.replace("%20", " ");

document.location.hash = item;  // Modifies URL

document.getElementById("prod_name").innerHTML = item;
document.getElementById("image").style.backgroundImage = "url(" + img + ")";
document.getElementById("price").innerHTML = "Price: $" + (price * 1).toFixed(2);
document.getElementById("add").onclick = adding
document.getElementById("negate").onclick = negating

let name_stripped = item.replace(/\s/g, "+");
let price_item_var = name_stripped + "_price";
let quantity_item_var = name_stripped + "_qty";

// Display seller name and item description (if it exists in database)
var ref = firebase.database().ref("produces/" + category + "/" + name_stripped + "/");
ref.once('value', function (snapshot) {
    let seller_name = document.getElementById("Seller");
    seller_name.innerHTML = snapshot.val().seller;
    if (snapshot.hasChild("description")) {
        let product_description = document.getElementById("descrp");
        product_description.innerHTML = snapshot.val().description;
    }
});

// When cart button is clicked
document.getElementById("cartbutton").onclick = function () {
    setTimeout(function () { document.getElementById("added").style.visibility = "visible" }, 350);
    setTimeout(function () { document.getElementById("added").style.visibility = "hidden" }, 2350);

    let db = firebase.database()

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.ref("users/" + user.uid + "/cart").once('value', function (snapshot) {
                if (snapshot.hasChild(quantity_item_var)) {
                    let databaseRef = firebase.database().ref("users/" + user.uid + "/cart").child(quantity_item_var);
                    databaseRef.transaction(function (item_qty) {
                        if (item_qty) {
                            item_qty = item_qty + parseInt(document.getElementById("quantity").innerHTML);
                        }
                        return item_qty;
                    });
                }
                else {
                    db.ref("users/" + user.uid + "/cart").update({
                        [name_stripped]: item,
                        [price_item_var]: parseInt(price),
                        [quantity_item_var]: parseInt(document.getElementById("quantity").innerHTML)
                    });
                }
            });
        }
        else {
            let msg = document.getElementById("added");
            msg.style.backgroundColor = "red";
            msg.style.color = "white";
            msg.innerHTML = "You must login before adding to cart!";
            msg.style.padding = "5px";
        }
    })
}

// Adding and subtracting item quantity
function adding() {
    count++
    document.getElementById("quantity").innerHTML = count;
    document.getElementById("price").innerHTML = "Price: $" + (price * count).toFixed(2);
    document.getElementById("price").style.color = "red";

}
function negating() {
    if (count >= 2) {
        count--
        document.getElementById("quantity").innerHTML = count;
        document.getElementById("price").innerHTML = "Price: $" + (price * count).toFixed(2);
        document.getElementById("price").style.color = "blue";
    }
    else {
        count = 2;
    }
}