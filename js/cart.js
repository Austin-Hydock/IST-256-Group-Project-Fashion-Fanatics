// ── Load products from server on page load ───────────────────────────────────
let products = [];
let cart = [];
 
$(document).ready(function () {
    loadProducts();
 
    // Search button
    $("#searchBtn").on("click", function () {
        const value = $("#searchInput").val().toLowerCase();
        const filtered = products.filter(p =>
            p.title.toLowerCase().includes(value) ||
            p.category.toLowerCase().includes(value) ||
            String(p.product_id).includes(value)
        );
        displayResults(filtered);
    });
 
    // Search on Enter key
    $("#searchInput").on("keyup", function (e) {
        if (e.key === "Enter") $("#searchBtn").click();
    });
});
 
// ── Fetch products from Express server ──────────────────────────────────────
function loadProducts() {
    $.ajax({
        url: "http://localhost:3000/products",
        method: "GET",
        success: function (data) {
            products = data;
            displayResults(products);
        },
        error: function () {
            alert("Could not load products from server.");
        }
    });
}
 
// ── Display search results table ─────────────────────────────────────────────
function displayResults(data) {
    const $table = $("#searchResultsTable");
    $table.empty();
 
    data.forEach(p => {
        const row = `
            <tr>
                <td>${p.product_id}</td>
                <td>${p.title}</td>
                <td>${p.category}</td>
                <td>${p.type}</td>
                <td>$${parseFloat(p.price).toFixed(2)}</td>
                <td><button type="button" onclick="addToCart(${p.product_id})">Add</button></td>
            </tr>
        `;
        $table.append(row);
    });
}
 
// ── Add product form validation + POST to server ─────────────────────────────
document.getElementById("productForm").addEventListener("submit", function (e) {
    e.preventDefault();
 
    const product_id  = document.getElementById("productId").value.trim();
    const description = document.getElementById("description").value.trim();
    const category    = document.getElementById("category").value.trim();
    const unit        = document.getElementById("unit").value.trim();
    const price       = parseFloat(document.getElementById("price").value.trim());
 
    if (!product_id || !description || !category || !unit || isNaN(price)) {
        alert("Please fill in all fields correctly.");
        return;
    }
 
    const newProduct = {
        product_id: parseInt(product_id),
        title: description,
        type: unit,
        category: category,
        price: price,
        image_url: null,
        extra_info: null
    };
 
    // POST new product to server
    $.ajax({
        url: "http://localhost:3000/products",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(newProduct),
        success: function () {
            alert("Product added successfully.");
            this.reset();
            loadProducts(); // refresh the list from DB
        }.bind(this),
        error: function (xhr) {
            alert("Error adding product: " + xhr.responseText);
        }
    });
});
 
// ── Add to cart (in memory + display) ───────────────────────────────────────
function addToCart(id) {
    const product = products.find(p => p.product_id === id);
    if (product) {
        cart.push(product);
        renderCart();
    }
}
 
// ── Render cart table ────────────────────────────────────────────────────────
function renderCart() {
    const table = document.getElementById("cartTable");
    table.innerHTML = "";
 
    cart.forEach((item, index) => {
        const row = `
            <tr>
                <td>${item.product_id}</td>
                <td>${item.title}</td>
                <td>${item.category}</td>
                <td>${item.type}</td>
                <td>$${parseFloat(item.price).toFixed(2)}</td>
                <td><button type="button" onclick="removeFromCart(${index})">Remove</button></td>
            </tr>
        `;
        table.innerHTML += row;
    });
}
 
// ── Remove from cart ─────────────────────────────────────────────────────────
function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}
 
// ── Send cart to server ───────────────────────────────────────────────────────
document.getElementById("sendDataBtn").addEventListener("click", function () {
    if (cart.length === 0) {
        alert("Cart is empty.");
        return;
    }
 
    // POST each cart item to /cart on the real server
    const requests = cart.map(item =>
        $.ajax({
            url: "http://localhost:3000/cart",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                product_id:  item.product_id,
                description: item.title,
                category:    item.category,
                unit:        item.type,
                price:       item.price
            })
        })
    );
 
    $.when(...requests)
        .done(function () {
            console.log("Cart sent to server:", cart);
            alert("Cart sent successfully!");
        })
        .fail(function () {
            alert("Error sending cart data.");
        });
});
