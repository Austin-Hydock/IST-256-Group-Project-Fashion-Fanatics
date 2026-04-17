$(document).ready(function () {
 
    // ── Login ────────────────────────────────────────────────────────────────
    $("#loginBtn").click(function () {
        const username = $("#username").val();
        const password = $("#password").val();
 
        if (username === "admin" && password === "1234") {
            $("#loginSection").hide();
            $("#adminSection").show();
            loadArticles();
        } else {
            alert("Invalid login");
        }
    });
 
});
 
// ── Load articles from server ────────────────────────────────────────────────
function loadArticles() {
    $.ajax({
        url: "http://localhost:3000/articles",
        method: "GET",
        success: function (data) {
            displayArticles(data);
        },
        error: function () {
            alert("Could not load articles from server");
        }
    });
}
 
// ── Display articles on page ─────────────────────────────────────────────────
function displayArticles(articles) {
    $("#articlesList").empty();
 
    if (articles.length === 0) {
        $("#articlesList").append("<p>No articles found.</p>");
        return;
    }
 
    articles.forEach(function (article) {
        let html = `
            <section>
                <h4>${article.title}</h4>
                <p><strong>Author ID:</strong> ${article.author_id}</p>
                <p><strong>Category:</strong> ${article.category}</p>
                <p><strong>Status:</strong> ${article.review_status}</p>
                <p><strong>Publication Date:</strong> ${article.pub_date}</p>
                <p><strong>Editorial Notes:</strong><br>${article.editorial_notes || "None"}</p>
                <button class="approve-btn" onclick="approveArticle(${article.article_id})">Approve</button>
                <button class="reject-btn"  onclick="rejectArticle(${article.article_id})">Reject</button>
            </section>
            <hr>
        `;
        $("#articlesList").append(html);
    });
}
 
// ── Approve article (PUT — matches server.js) ────────────────────────────────
function approveArticle(id) {
    $.ajax({
        url: `http://localhost:3000/articles/${id}/approve`,
        method: "PUT",                          // was POST — fixed to PUT
        success: function () {
            loadArticles();
        },
        error: function () {
            alert("Error approving article");
        }
    });
}
 
// ── Reject article (PUT — matches server.js) ─────────────────────────────────
function rejectArticle(id) {
    $.ajax({
        url: `http://localhost:3000/articles/${id}/reject`,
        method: "PUT",                          // was POST — fixed to PUT
        success: function () {
            loadArticles();
        },
        error: function () {
            alert("Error rejecting article");
        }
    });
}
