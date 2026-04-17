// ── Form submit listener ─────────────────────────────────────────────────────
document.getElementById("memberForm").addEventListener("submit", function (event) {
    event.preventDefault();
    handleFormSubmit();
});
 
// ── Collect, validate, and submit ────────────────────────────────────────────
function handleFormSubmit() {
    const name    = document.getElementById("name").value.trim();
    const age     = document.getElementById("age").value.trim();
    const email   = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const phone   = document.getElementById("phone").value.trim();
 
    // Client-side validation
    if (!name || !age || !email || !address) {
        showError("Please fill in all required fields.");
        return;
    }
 
    if (!emailValidation(email)) {
        showError("Please enter a valid email address.");
        return;
    }
 
    // Build JSON object
    const user = {
        full_name: name,
        age: parseInt(age),
        email: email,
        address: address,
        phone: phone || null
    };
 
    console.log("Submitting user:", user);
 
    // AJAX POST to Express server (/subscribe endpoint)
    $.ajax({
        url: "http://localhost:3000/subscribe",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(user),
        success: function (response) {
            console.log("Server response:", response);
 
            // Also save locally as a backup
            let users = JSON.parse(localStorage.getItem("users")) || [];
            users.push(user);
            localStorage.setItem("users", JSON.stringify(users));
 
            document.getElementById("memberForm").reset();
 
            $("#errorMsg")
                .removeClass("text-danger")
                .addClass("text-success fw-bold")
                .html("&#10004; Successfully signed up!")
                .fadeIn();
 
            setTimeout(() => {
                $("#errorMsg").fadeOut();
            }, 5000);
        },
        error: function (xhr) {
            showError("Error submitting sign-up. Please try again. (" + xhr.responseText + ")");
        }
    });
}
 
// ── Email validation ─────────────────────────────────────────────────────────
function emailValidation(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
 
// ── Show error message ───────────────────────────────────────────────────────
function showError(msg) {
    $("#errorMsg")
        .removeClass("text-success fw-bold")
        .addClass("text-danger")
        .text(msg)
        .show();
}
 
// ── Render user list (optional UI helper) ────────────────────────────────────
function renderUserList(users) {
    const list = document.getElementById("userList");
    if (!list) return;
    list.innerHTML = "";
 
    users.forEach(user => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = `${user.full_name} (${user.email}) - Age: ${user.age}`;
        list.appendChild(li);
    });
}
