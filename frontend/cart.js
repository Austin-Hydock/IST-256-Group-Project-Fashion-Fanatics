async function loadCart() {
    const res = await fetch("http://localhost:3000/cart");
    const items = await res.json();

    const container = document.getElementById("cartList");
    container.innerHTML = "";

    items.forEach(item => {
        container.innerHTML += `<p>${item.productId}</p>`;
    });
}

loadCart();
