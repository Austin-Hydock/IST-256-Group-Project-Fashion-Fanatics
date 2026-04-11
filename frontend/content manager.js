async function loadArticles() {
    const res = await fetch("http://localhost:3000/articles");
    const articles = await res.json();

    const container = document.getElementById("articlesList");
    container.innerHTML = "";

    articles.forEach(a => {
        container.innerHTML += `
            <h3>${a.title}</h3>
            <p>${a.author}</p>

            <button onclick="approve('${a.id}')">Approve</button>
            <button onclick="reject('${a.id}')">Reject</button>
            <hr>
        `;
    });
}

// APPROVE
async function approve(id) {
    await fetch(`http://localhost:3000/articles/${id}/approve`, {
        method: "PUT"
    });
    loadArticles();
}

// REJECT
async function reject(id) {
    await fetch(`http://localhost:3000/articles/${id}/reject`, {
        method: "PUT"
    });
    loadArticles();
}

loadArticles();
