// ----- Simulated JSON data -----
var productsData = [
    { id: "P1001", description: "USB-C Charging Cable", category: "Accessories", unit: "Each", price: 9.99, weight: "0.2 lb" },
    { id: "P1002", description: "Wireless Mouse",        category: "Electronics", unit: "Each", price: 24.50, weight: "0.3 lb" }
];

// ----- Helper functions -----
function renderTable(dataArray) {
    var tbody = document.getElementById("productTableBody");
    tbody.innerHTML = "";
    dataArray.forEach(function (item) {
        var row = document.createElement("tr");
        row.innerHTML =
            "<td><img src '" + (item.image || "") + "' width= '50'></td> +
            "<td>" + item.id + "</td>" +
            "<td>" + item.description + "</td>" +
            "<td>" + item.unit + "</td>" +
            "<td>" + item.category + "</td>" +
            "<td>$" + Number(item.price).toFixed(2) + "</td>" +
            "<td>" + (item.weight || "") + "</td>" +
            "<td></td>;
        row.addEventListener("click", function () {
            loadItemIntoForm(item.id);
        });
        tbody.appendChild(row);
    });
}

function clearErrors() {
    ["idError","descriptionError","categoryError","unitError","priceError"].forEach(function(id){
        document.getElementById(id).textContent = "";
    });
}

function validateForm() {
    var id = document.getElementById("productId").value.trim();
    var description = document.getElementById("productDescription").value.trim();
    var category = document.getElementById("productCategory").value.trim();
    var unit = document.getElementById("productUnit").value.trim();
    var price = document.getElementById("productPrice").value.trim();
    clearErrors();
    var ok = true;

    if (id === "") { document.getElementById("idError").textContent = "Product ID is required."; ok = false; }
    if (description === "") { document.getElementById("descriptionError").textContent = "Description is required."; ok = false; }
    if (category === "") { document.getElementById("categoryError").textContent = "Category is required."; ok = false; }
    if (unit === "") { document.getElementById("unitError").textContent = "Unit is required."; ok = false; }
    if (price === "") {
        document.getElementById("priceError").textContent = "Price is required.";
        ok = false;
    } else if (isNaN(price) || Number(price) <= 0) {
        document.getElementById("priceError").textContent = "Price must be a positive number.";
        ok = false;
    }
    return ok;
}

function getFormData() {
    return {
        id: document.getElementById("productID").value.trim(),
        description: document.getElementById("title").value.trim(),
        category: document.getElementById("category").value.trim(),
        unit: document.getElementById("type").value.trim(),
        price: parseFloat(document.getElementById("price").value.trim()),
        weight: document.getElementById("extra").value.trim()
        image: document.getElementById("imageURL).value.trim()
    };
}

function loadItemIntoForm(id) {
    var item = productsData.find(function (p) { return p.id === id; });
    if (!item) return;
    document.getElementById("productId").value = item.id;
    document.getElementById("productDescription").value = item.description;
    document.getElementById("productCategory").value = item.category;
    document.getElementById("productUnit").value = item.unit;
    document.getElementById("productPrice").value = item.price;
    document.getElementById("productWeight").value = item.weight || "";
}

function addProduct() {
    if (!validateForm()) return;
    var newItem = getFormData();
    if (productsData.find(function (p) { return p.id === newItem.id; })) {
        alert("An item with this ID already exists. Use Update instead.");
        return;
    }
    productsData.push(newItem);
    renderTable(productsData);
    alert("Product added.");
}

function updateProduct() {
    if (!validateForm()) return;
    var updatedItem = getFormData();
    var index = productsData.findIndex(function (p) { return p.id === updatedItem.id; });
    if (index === -1) {
        alert("No product found with that ID to update.");
        return;
    }
    productsData[index] = updatedItem;
    renderTable(productsData);
    console.log("Updated JSON:", JSON.stringify(productsData, null, 2)); // for screenshot
    alert("Product updated.");
}

function deleteProduct() {
    var id = document.getElementById("productId").value.trim();
    if (id === "") { alert("Enter a Product ID to delete."); return; }
    var index = productsData.findIndex(function (p) { return p.id === id; });
    if (index === -1) { alert("No product found with that ID."); return; }
    if (confirm("Are you sure you want to delete this product?")) {
        productsData.splice(index, 1);
        renderTable(productsData);
        document.getElementById("productForm").reset();
        alert("Product deleted.");
    }
}

// ----- DOM ready: wire events + jQuery search -----
document.addEventListener("DOMContentLoaded", function () {
    renderTable(productsData);

    document.getElementById("addButton").addEventListener("click", addProduct);
    document.getElementById("updateButton").addEventListener("click", updateProduct);
    document.getElementById("deleteButton").addEventListener("click", deleteProduct);

    // jQuery search/filter
    $("#searchInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#productTableBody tr").each(function () {
            var rowText = $(this).text().toLowerCase();
            $(this).toggle(rowText.indexOf(value) > -1);
        });
    });
});
