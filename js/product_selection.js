function filter() {
    let filter_value = document.getElementById("search_filter").value;  // Get value from drop down menu
    if (filter_value == "") { } // pass (do nothing)
    else if (filter_value == "__name"){
        check_in_db(user_search);
    }
    else {  // Since we only have 1 filter; specify what to do when there is more than 1 filter
        user_search = search_perm + filter_value;
        check_in_db(user_search);
    }

}
// Search database to see if user_search exists
function check_in_db(search) {  // search is the search query (?search_query=...)
    if (search.slice(-5) == "__pri") {
        user_search = search.slice(14, -5);
    }
    else {
        user_search = search.slice(14);
    }
    let dbref = firebase.database().ref("produces/");

    let product_name = [];
    let product_price = [];
    let product_seller = [];
    let product_image = [];
    let product_category = [];

    dbref.once("value", function (snapshot) {
        let list = snapshot.val();  // dictionary
        let keys = Object.keys(list);  // list of keys

        for (let i = 0; i < keys.length; i++) {  // loop through all the keys
            let child_keys = Object.keys(snapshot.val()[keys[i]]);
            for (let j = 0; j < child_keys.length; j++) {  // loop through child keys
                if (child_keys[j].toLowerCase().includes(user_search.toLowerCase())) {
                    product_name.push(snapshot.val()[keys[i]][child_keys[j]].name);
                    product_price.push(snapshot.val()[keys[i]][child_keys[j]].price);
                    product_seller.push(snapshot.val()[keys[i]][child_keys[j]].seller);
                    product_image.push(snapshot.val()[keys[i]][child_keys[j]].image);
                    product_category.push(Object.keys(snapshot.val())[i]);
                    
                }
            }
        }

        if (search.slice(-5) == "__pri") { //  sort by price
            let product_name_filter = [];
            let product_price_filter = [];
            let product_seller_filter = [];
            let product_image_filter = [];
            let product_category_filter = [];

            let prod_len = product_name.length;

            // If filter sorted by price, find index of lowest price, then push everything in that index into corresponding object
            for (let i = 0; i < prod_len; i++) {
                let min_price_index = product_price.indexOf(Math.min.apply(null, product_price));
                product_name_filter.push(product_name[min_price_index]);
                product_price_filter.push(product_price[min_price_index]);
                product_seller_filter.push(product_seller[min_price_index]);
                product_image_filter.push(product_image[min_price_index]);
                product_category_filter.push(product_category[min_price_index]);

                product_name.splice(min_price_index, 1);
                product_price.splice(min_price_index, 1);
                product_seller.splice(min_price_index, 1);
                product_image.splice(min_price_index, 1);
                product_category_filter.splice(min_price_index, 1);
            }
            // Dynamically create the product boxes when filter is chosen
            create_product_box(product_price_filter.length, product_name_filter, product_price_filter, product_seller_filter, product_image_filter, product_category_filter);
            document.getElementById("search_result").innerHTML = product_price_filter.length + " results for " + user_search + " (sorted by price)";
        }
        else {
            // Dynamically create the product boxes, no filter (initial page)
            create_product_box(product_price.length, product_name, product_price, product_seller, product_image, product_category);
            document.getElementById("search_result").innerHTML = product_price.length + " results for " + user_search;
        }
    });
}

function create_product_box(num_of_products, prod, price, seller, image, category) {
    localStorage.clear();  // Clear local storage

    // This removes everything in the container div when a filter is chosen
    if (document.getElementsByTagName('div').length > num_of_products + 4) {
        document.getElementById("container").innerHTML = "";
    }
    let left_style = 228;
    let top_style = 145;

    for (let i = 0; i < num_of_products; i++) {
        var div = document.createElement("div")
        div.className = "product_box"
        let div_id = "prod_box" + i;
        div.id = div_id;
        div.style.top = top_style + "px";
        div.style.left = left_style + "px";
        left_style += 350;
        if (left_style > screen.width-300) {
            left_style = 228;
            top_style += 460;
        }
        document.getElementById("container").appendChild(div);

        // Anchor tag when clicking image
        let product_page = document.createElement("a");
        product_page.setAttribute("href", "details_page.html");
        let click_image_id = "atag" + i;
        product_page.id = click_image_id;
        document.getElementById(div_id).appendChild(product_page);

        // This checks when image is clicked. When clicked, store info in local storage
        document.getElementById(click_image_id).onclick = function () {loc(prod[i], price[i], image[i], category[i])};

        // Create image_prod# div, append to prod#
        let div_img = document.createElement("div");
        div_img.className = "image_prod";
        div_img.style.backgroundImage = 'url(' + image[i] + ')';
        document.getElementById(click_image_id).appendChild(div_img);

        // Create product_name, append to prod#
        let product_name = document.createElement("div");
        product_name.className = "product_name";
        product_name.innerHTML = prod[i];
        product_name.style.fontSize = "22px";
        document.getElementById(div_id).appendChild(product_name);

        // Create price#, append to prod#
        let price_text = document.createElement("div");
        let price_id = "price" + i;
        price_text.id = price_id;
        price_text.className = "price_texts";
        price_text.display = "inline-block";

        price_text.innerHTML = "$" + price[i].toFixed(2);
        price_text.style.fontSize = "22px";
        document.getElementById(div_id).appendChild(price_text);

        // Cart button, append to prod#
        let cart_button = document.createElement("div");
        let cart_id = "cart" + i;
        cart_button.id = cart_id;
        cart_button.className = "add_to_cart";
        cart_button.innerHTML = "<p>Add to Cart</p>";
        document.getElementById(div_id).appendChild(cart_button);

        document.getElementById(cart_id).onclick = function () { addItem(prod[i], price[i], 1); }

        // Add whitespace at the bottom of the page
        if (i == num_of_products - 1) {
            let whitespace = document.createElement("div");
            whitespace.style.position = "absolute";
            whitespace.style.left = left_style + "px";
            whitespace.style.top = top_style + 460 + "px";
            whitespace.innerHTML = "this is whitespace. this message is not supposed to be seen";
            whitespace.style.visibility = "hidden";
            document.getElementById("container").appendChild(whitespace);
        }
    }
}

// Set local storage when image is clicked
function loc(name, price, image, category) {
    localStorage.setItem("product_name", name);
    localStorage.setItem("product_price", price);
    localStorage.setItem("product_img", image);
    localStorage.setItem("product_cat", category);
}

// Add item to cart, and show a message depending on if user is logged in or not
function addItem(name, price, count) {
    setTimeout(function () { document.getElementById("added").style.visibility = "visible" }, 350);
    setTimeout(function () { document.getElementById("added").style.visibility = "hidden" }, 2350);


    let name_stripped = name.replace(/\s/g, "+");
    let price_item_var = name_stripped + "_price";
    let quantity_item_var = name_stripped + "_qty";

    let db = firebase.database()

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            db.ref("users/" + user.uid + "/cart").once('value', function (snapshot) {
                if (snapshot.hasChild(quantity_item_var)) {
                    let databaseRef = firebase.database().ref("users/" + user.uid + "/cart").child(quantity_item_var);
                    databaseRef.transaction(function (item_qty) {
                        if (item_qty) {
                            item_qty = item_qty + 1;
                        }
                        return item_qty;
                    });
                }
                else {
                    db.ref("users/" + user.uid + "/cart").update({
                        [name_stripped]: name,
                        [price_item_var]: price,
                        [quantity_item_var]: count
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

let user_search = ""
let search = location.search.toLowerCase();
let search_perm = search;  // The original search query string 
check_in_db(search_perm);
