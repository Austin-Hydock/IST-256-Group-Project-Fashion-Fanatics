//calling submitted user info
document.getElementById("memberForm").addEventListener("submit", function(event) {
    event.preventDefault(); //no auto refresh
    handleFormSubmit(); //we run this function instead
});

//function for handling adding or updating user
function handleFormSubmit() {
    // grab values from form
    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    let phone = document.getElementById("phone").value.trim();

    //validating that something was inputted, alr required in HTML, but adding it here to double check
    if (!name || !age || !email || !address) {
        alert("Please fill in all required fields.");
        return;
    }

    //calling email validation function
    if (!emailValidation(email)) {
        alert("Please enter a valid email address.")
        return;
    }

    //placeholder
    processUserData(name, age, email, address, phone);
} 

//function for email 
function emailValidation(email) {
    // pattern must be something@something.something
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

//creating JSON object + saving locally + rendering user list
function processUserData(name, age, email, address, phone) {
    
}

