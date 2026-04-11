document.getElementById("subscribeBtn").onclick = async () => {

    const email = document.getElementById("email").value;

    await fetch("http://localhost:3000/subscribe", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email })
    });

    alert("Subscribed!");
};
