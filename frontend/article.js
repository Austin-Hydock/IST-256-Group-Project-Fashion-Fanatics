async function loadArticles() {
    const res = await fetch("http://localhost:3000/articles");
    const articles = await res.json();

    const container = document.getElementById("articleList");
    container.innerHTML = "";

    articles.forEach(a => {
        container.innerHTML += `
            <h2>${a.title}</h2>
            <p>${a.content}</p>
            <hr>
        `;
    });
}

loadArticles();
