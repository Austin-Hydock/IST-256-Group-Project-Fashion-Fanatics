$(document).ready(function() {

    $("#finalForm").on("submit", function(e) {
        e.preventDefault();

        $("#errorMsg").text(""); // clear previous errors

        // Collect form values
        const title = $("#title").val().trim();
        const author = $("#author").val().trim();
        const pubDate = $("#pubDate").val();
        const reviewStatus = $("#reviewStatus").val();
        const category = $("#category").val();
        const notes = $("#notes").val().trim();
        const channels = $("input[name='channels']:checked").map(function(){ return $(this).val(); }).get();

        // Validation
        if (!title || !author || !pubDate || !reviewStatus || !category) {
            $("#errorMsg").text("Please fill in all required fields.");
            return;
        }

        if (channels.length === 0) {
            $("#errorMsg").text("Please select at least one distribution channel.");
            return;
        }

        // Build JSON object
        const articleData = {
            title: title,
            author: author,
            publicationDate: pubDate,
            channels: channels,
            reviewStatus: reviewStatus,
            category: category,
            notes: notes
        };

        console.log("Generated JSON:", articleData);

        // Save locally
        localStorage.setItem("finalizedArticle", JSON.stringify(articleData));

        // AJAX POST to mock API
        $.ajax({
            url: "https://jsonplaceholder.typicode.com/posts",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(articleData),
            success: function(response) {
        console.log("Server Response:", response);
        $("#errorMsg")
            .removeClass("text-danger")
            .addClass("text-success fw-bold") 
            .html("&#10004; Article submitted successfully!");
        $("#finalForm")[0].reset();
    },
    error: function() {
        alert("Error submitting article.");
    }
        });

    });

});
