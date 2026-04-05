const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

//fake “database”
let articles = [
    { id: 1, title: "Fall Fashion Trends", author: "Jane Doe", category: "Fashion", summary: "Latest trends for fall", status: "Pending" },
    { id: 2, title: "Celebrity Street Style", author: "John Smith", category: "Culture", summary: "Top celebrity outfits", status: "Pending" }
];

//get all articles
app.get("/articles", (req, res) => {
    res.json(articles);
});

//approve
app.post("/articles/:id/approve", (req, res) => {
    let article = articles.find(a => a.id == req.params.id);
    if (article) article.status = "Approved";
    res.json(article);
});

//reject
app.post("/articles/:id/reject", (req, res) => {
    let article = articles.find(a => a.id == req.params.id);
    if (article) article.status = "Rejected";
    res.json(article);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
