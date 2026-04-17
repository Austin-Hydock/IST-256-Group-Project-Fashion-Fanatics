const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
 
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serves all HTML/CSS/JS from /public folder
 
// ── Database connection ──────────────────────────────────────────────────────
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
 
 
// ════════════════════════════════════════════════════════════════════════════
//  ARTICLES
// ════════════════════════════════════════════════════════════════════════════
 
// GET all articles
app.get("/articles", (req, res) => {
    db.query("SELECT * FROM articles", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});
 
// POST — submit a new article
app.post("/articles", (req, res) => {
    const { author_id, title, category, pub_date, review_status, editorial_notes } = req.body;
 
    if (!author_id || !title || !category || !pub_date) {
        return res.status(400).send("Missing required fields.");
    }
 
    db.query(
        `INSERT INTO articles (author_id, title, category, pub_date, review_status, editorial_notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [author_id, title, category, pub_date, review_status || "Draft", editorial_notes || null],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Article submitted", article_id: result.insertId });
        }
    );
});
 
// PUT — approve an article
app.put("/articles/:id/approve", (req, res) => {
    db.query(
        "UPDATE articles SET review_status='Approved for Publication' WHERE article_id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Approved");
        }
    );
});
 
// PUT — reject an article (resets to Draft)
app.put("/articles/:id/reject", (req, res) => {
    db.query(
        "UPDATE articles SET review_status='Draft' WHERE article_id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Rejected");
        }
    );
});
 
// DELETE — remove an article
app.delete("/articles/:id", (req, res) => {
    db.query(
        "DELETE FROM articles WHERE article_id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Article deleted");
        }
    );
});
 
 
// ════════════════════════════════════════════════════════════════════════════
//  PRODUCTS
// ════════════════════════════════════════════════════════════════════════════
 
// GET all products
app.get("/products", (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});
 
// POST — add a new product
app.post("/products", (req, res) => {
    const { product_id, title, type, category, price, image_url, extra_info } = req.body;
 
    if (!product_id || !title || !type || !category || !price) {
        return res.status(400).send("Missing required fields.");
    }
 
    db.query(
        `INSERT INTO products (product_id, title, type, category, price, image_url, extra_info)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [product_id, title, type, category, price, image_url || null, extra_info || null],
        (err) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Product added", product_id });
        }
    );
});
 
// PUT — update an existing product
app.put("/products/:id", (req, res) => {
    const { title, type, category, price, image_url, extra_info } = req.body;
 
    db.query(
        `UPDATE products SET title=?, type=?, category=?, price=?, image_url=?, extra_info=?
         WHERE product_id=?`,
        [title, type, category, price, image_url || null, extra_info || null, req.params.id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Product updated");
        }
    );
});
 
// DELETE — remove a product
app.delete("/products/:id", (req, res) => {
    db.query(
        "DELETE FROM products WHERE product_id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Product deleted");
        }
    );
});
 
 
// ════════════════════════════════════════════════════════════════════════════
//  CART
// ════════════════════════════════════════════════════════════════════════════
 
// GET all cart items
app.get("/cart", (req, res) => {
    db.query("SELECT * FROM cart", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});
 
// POST — add a product to the cart
app.post("/cart", (req, res) => {
    const { product_id, description, category, unit, price, member_id } = req.body;
 
    if (!product_id || !description || !category || !unit || !price) {
        return res.status(400).send("Missing required fields.");
    }
 
    db.query(
        `INSERT INTO cart (member_id, product_id, description, category, unit, price)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [member_id || null, product_id, description, category, unit, price],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Added to cart", cart_id: result.insertId });
        }
    );
});
 
// DELETE — remove a single item from the cart
app.delete("/cart/:id", (req, res) => {
    db.query(
        "DELETE FROM cart WHERE cart_id=?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Item removed from cart");
        }
    );
});
 
 
// ════════════════════════════════════════════════════════════════════════════
//  MEMBERS (Subscribe / Sign Up)
// ════════════════════════════════════════════════════════════════════════════
 
// GET all members
app.get("/members", (req, res) => {
    db.query("SELECT * FROM members", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});
 
// POST — register a new member (full subscribe.html form)
app.post("/subscribe", (req, res) => {
    const { full_name, age, email, address, phone } = req.body;
 
    if (!full_name || !age || !email || !address) {
        return res.status(400).send("Missing required fields.");
    }
 
    db.query(
        `INSERT INTO members (full_name, age, email, address, phone)
         VALUES (?, ?, ?, ?, ?)`,
        [full_name, age, email, address, phone || null],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Subscribed successfully", member_id: result.insertId });
        }
    );
});
 
 
// ── Start server ─────────────────────────────────────────────────────────────
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
