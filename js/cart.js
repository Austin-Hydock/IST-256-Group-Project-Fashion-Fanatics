// temporary products, replace when doing JSON
let products = [
  { id: "P1", description: "Fashion Fanatics Magazine", category: "Magazine", unit: "Each", price: 12 },
  { id: "P2", description: "Fashion Fanatics Poster",   category: "Merch",    unit: "Each", price: 8  },
  { id: "P3", description: "Limited Edition T-Shirt",    category: "Merch",    unit: "Each", price: 25 }
];

// cart (memory only)
let cart = [];

// form validation + add to products
document.getElementById("productForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const id    = document.getElementById("productId").value.trim();
  const desc  = document.getElementById("description").value.trim();
  const cat   = document.getElementById("category").value.trim();
  const unit  = document.getElementById("unit").value.trim();
  const price = document.getElementById("price").value.trim();
  const priceNum = parseFloat(price);

  if (!id || !desc || !cat || !unit || isNaN(priceNum)) {
    alert("Please fill in all fields correctly.");
    return;
  }

  // store new product in JSON collection
  products.push({
    id: id,
    description: desc,
    category: cat,
    unit: unit,
    price: priceNum
  });

  alert("Validation successful! Product added.");
  this.reset();
});

  // save JSON
  localStorage.setItem("products", JSON.stringify(products));
  console.log("JSON Data:", products);

  alert("Validation successful! Product added.");
  this.reset();

  // refresh search results
  displayResults(products);
});

// jQuery search button click
$("#searchBtn").on("click", function () {
  let value = $("#searchInput").val().toLowerCase();

  let filtered = products.filter(p =>
    p.description.toLowerCase().includes(value) ||
    p.category.toLowerCase().includes(value) ||
    p.id.toLowerCase().includes(value)
  );

  displayResults(filtered);
});

// optional: trigger search on Enter
$("#searchInput").on("keyup", function (e) {
  if (e.key === "Enter") {
    $("#searchBtn").click();
  }
});

// show all products on load
$(document).ready(function () {
  displayResults(products);
});

// displaying search results
function displayResults(data) {
  let $table = $("#searchResultsTable");
  $table.empty();

  data.forEach(p => {
    let row = `
      <tr>
        <td>${p.id}</td>
        <td>${p.description}</td>
        <td>${p.category}</td>
        <td>${p.unit}</td>
        <td>${p.price}</td>
        <td><button type="button" onclick="addToCart('${p.id}')">Add</button></td>
      </tr>
    `;
    $table.append(row);
  });
}

// adding to cart
function addToCart(id) {
  let product = products.find(p => p.id === id);

  if (product) {
    cart.push(product);
    renderCart();
  }
}

// rendering cart
function renderCart() {
  let table = document.getElementById("cartTable");
  table.innerHTML = "";

  cart.forEach((item, index) => {
    let row = `
      <tr>
        <td>${item.id}</td>
        <td>${item.description}</td>
        <td>${item.category}</td>
        <td>${item.unit}</td>
        <td>${item.price}</td>
        <td><button type="button" onclick="removeFromCart(${index})">Remove</button></td>
      </tr>
    `;
    table.innerHTML += row;
  });
}

// removing from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// AJAX send
document.getElementById("sendDataBtn").addEventListener("click", function () {
  if (cart.length === 0) {
    alert("Cart is empty.");
    return;
  }

  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(cart),
    success: function (response) {
      console.log("Server response:", response);
      alert("Cart sent successfully!");
    },
    error: function () {
      alert("Error sending data.");
    }
  });
});
