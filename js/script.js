let users = []; //array for users
let editIndex = null; //indexin case of edits. if null user is added, if not we will edit the user

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

    //validating that something was inputted, alr required in HTML, but adding it here to double check
    if (!name || !age || !email || !address) {
        alert("Please fill in all required fields.");
        return;
    }

    //calling email validation function
    if (validateEmail(email)) {
        alert("Please enter a valid email address.")
        return;
    }
} 

//function for email 
function emailValidation(email) {
    // pattern must be something@something.something
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

