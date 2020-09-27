let dbref = firebase.database().ref("produces/");
dbref.once("value", function (snapshot) {
    let list = snapshot.val();  // dictionary
    let keys = Object.keys(list);  // list of keys
    let random_category = keys[Math.abs(Math.round(Math.random() * keys.length - 1))];
    let child_keys = Object.keys(snapshot.val()[random_category]);
    let random_item = child_keys[Math.abs(Math.round(Math.random() * child_keys.length - 1))];

    let potw_name = list[random_category][random_item].name;
    let potw_price= list[random_category][random_item].price;
    let potw_image = list[random_category][random_item].image;
    let potw_seller = list[random_category][random_item].seller;

    // a tag for image
    let product_page = document.createElement("a");
    product_page.setAttribute("href", "details_page.html");
    product_page.id = "atag"
    product_page.style.textAlign = "center";
    localStorage.setItem("product_name", potw_name);
    localStorage.setItem("product_price", potw_price);
    localStorage.setItem("product_img", potw_image);
    localStorage.setItem("product_seller", potw_seller);
    localStorage.setItem("product_cat", random_category);


    document.getElementById("potw_content").appendChild(product_page);

    // Create image box
    let product_image = document.createElement("div");
    product_image.style.backgroundImage = 'url(' + potw_image + ')';
    product_image.style.width = "93%";
    product_image.style.height = "75%";
    product_image.style.marginLeft = "25px";
    product_image.style.display = "in-line block";
    product_image.style.backgroundSize = "93% 75%";
    product_image.style.backgroundRepeat = "no-repeat";
    document.getElementById("atag").appendChild(product_image);

    // Create name of product text
    let product_name = document.createElement("div");
    product_name.innerHTML = potw_name;
    product_name.style.fontSize = "22px";
    product_name.style.marginTop = "-40px";
    document.getElementById("potw_content").appendChild(product_name);

    // Create price of product
    let product_price = document.createElement("div");
    product_price.innerHTML = "Starting at: $" + (potw_price * 1).toFixed(2);
    document.getElementById("potw_content").appendChild(product_price);
})
