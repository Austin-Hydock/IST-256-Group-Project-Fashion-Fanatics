document.getElementById("signupBtn").onclick = async () => {

    const user = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    };

    await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(user)
    });

    alert("Account created!");
};
