const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

//connecting to mysql
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root1234",
    database: "fashion_fanatics"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL");
});


//get all articles
app.get("/articles", (req, res) => {
    db.query("SELECT * FROM articles", (err, results) => {
        if (err) res.status(500).send(err);
        else res.json(results);
    });
});

//approve article
app.put("/articles/:id/approve", (req, res) => {
     db.query(
        "UPDATE articles SET review_status='Approved for Publication' WHERE article_id=?",
         [req.params.id],
        (err) => {
            if (err) res.status(500).send(err);
            else res.send("Approved");
        }
    );
});

//reject the article
app.put("/articles/:id/reject", (req, res) => {
    db.query(
        "UPDATE articles SET review_status='Draft' WHERE article_id=?",
        [req.params.id],
        (err) => {
            if (err) res.status(500).send(err);
            else res.send("Rejected");
        }
    );
});

//get products
app.get("/products", (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) res.status(500).send(err);
        else res.json(results);
    });
});

//get cart items
app.get("/cart", (req, res) => {
    db.query("SELECT * FROM cart", (err, results) => {
        if (err) res.status(500).send(err);
        else res.json(results);
    });
});

//add to cart
app.post("/cart", (req, res) => {
    const { productId } = req.body;

    db.query(
        "INSERT INTO cart (product_id, description, category, unit, price) VALUES (?, ?, ?, ?, ?)",
        [productId, "Item", "Category", "Each", 0],
        (err) => {
            if (err) res.status(500).send(err);
            else res.send("Added to cart");
        }
    );
});

//for creating a user
app.post("/users", (req, res) => {
    const { username, password } = req.body;
    res.send("User created");
});

//subscriptions
app.post("/subscribe", (req, res) => {
    const { email } = req.body;

    db.query(
        "INSERT INTO members (full_name, age, email, address) VALUES (?, ?, ?, ?)",
        ["Subscriber", 18, email, "N/A"],
        (err) => {
            if (err) res.status(500).send(err);
            else res.send("Subscribed");
        }
    );

});

//starting the server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
