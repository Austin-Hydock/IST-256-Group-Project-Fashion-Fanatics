async function loadProducts() {
    const res = await fetch("http://localhost:3000/products");
    const data = await res.json();

    const container = document.getElementById("productList");
    container.innerHTML = "";

    data.forEach(p => {
        container.innerHTML += `
            <h3>${p.name}</h3>
            <p>$${p.price}</p>
        `;
    });
}
