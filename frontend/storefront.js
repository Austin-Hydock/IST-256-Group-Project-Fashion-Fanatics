async function loadProducts() {
    const res = await fetch("http://localhost:3000/products");
    const products = await res.json();

    const container = document.getElementById("productList");
    container.innerHTML = "";

    products.forEach(p => {
        container.innerHTML += `
            <h3>${p.name}</h3>
            <p>$${p.price}</p>
            <button onclick="addToCart('${p.id}')">Add to Cart</button>
            <hr>
        `;
    });
}

// ADD TO CART
async function addToCart(id) {
    await fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ productId: id })
    });

    alert("Added to cart");
}

loadProducts();
