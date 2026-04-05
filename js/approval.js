$(document).ready(function () {

    //login stuff
    $("#loginBtn").click(function () {

        let username = $("#username").val();
        let password = $("#password").val();

        // Simple admin check
        if (username === "admin" && password === "1234") {
            $("#loginSection").hide();
            $("#adminSection").show();
            loadArticles();
        } else {
            alert("Invalid login");
        }
    });

});

//loading articles from server
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

//displaying articles on page
function displayArticles(articles) {
    $("#articlesList").empty();

    articles.forEach(function (article) {
        let html = `
            <section>
                <h4>${article.title}</h4>
                <p><strong>Author:</strong> ${article.author}</p>
                <p><strong>Category:</strong> ${article.category}</p>
                <p><strong>Status:</strong> ${article.status}</p>
                <p><strong>Summary:</strong><br>${article.summary}</p>

                <button onclick="approveArticle(${article.id})">Approve</button>
                <button onclick="rejectArticle(${article.id})">Reject</button>
            </section>
            <hr>
        `;
        $("#articlesList").append(html);
    });
}

//approve article
function approveArticle(id) {
    $.ajax({
        url: `http://localhost:3000/articles/${id}/approve`,
        method: "POST",
        success: function () {
            loadArticles();
        },
        error: function () {
            alert("Error approving article");
        }
    });
}

//reject article
function rejectArticle(id) {
    $.ajax({
        url: `http://localhost:3000/articles/${id}/reject`,
        method: "POST",
        success: function () {
            loadArticles();
        },
        error: function () {
            alert("Error rejecting article");
        }
    });
}
