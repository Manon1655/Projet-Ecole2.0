const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const app = express();
const PORT = 8080;
const SECRET = "SECRET_KEY";

/* ===============================
   MIDDLEWARE
================================= */

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ===============================
   MYSQL CONNECTION
================================= */

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "projet_ecole_final"
});

/* ===============================
   REGISTER
================================= */

app.post("/auth/register", async (req, res) => {

  const { email, password, firstName, lastName, username } = req.body;

  try {

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(`
      INSERT INTO users
      (email, password, first_name, last_name, username, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [email, hashedPassword, firstName, lastName, username]);

    const token = jwt.sign(
      {
        id: result.insertId,
        email,
        role: "USER"
      },
      SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

/* ===============================
   LOGIN
================================= */

app.post("/auth/login", async (req, res) => {

  const { username, password } = req.body;

  try {

    const [results] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [username]
    );

    if (results.length === 0) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    const user = results[0];

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token: token,
      role: user.role
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

/* ===============================
   USER PROFILE
================================= */

app.get("/auth/user/:id", async (req, res) => {

  try {

    const [results] = await db.query(`
      SELECT
        id,
        username,
        email,
        first_name,
        last_name,
        bio,
        phone_number,
        profile_picture
      FROM users
      WHERE id = ?
    `, [req.params.id]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.json(results[0]);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

/* ===============================
   UPDATE BIO
================================= */

app.put("/auth/user/:id/bio", async (req, res) => {

  try {

    await db.query(
      "UPDATE users SET bio = ? WHERE id = ?",
      [req.body.bio, req.params.id]
    );

    res.json({ success: true });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

/* ===============================
   GET BOOKS
================================= */

app.get("/books", async (req, res) => {

  try {

    const [rows] = await db.query("SELECT * FROM books");

    res.json(rows);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

/* ===============================
   USER BOOKS
================================= */

app.get("/auth/user/:id/books", async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT b.*, ub.progress
      FROM user_books ub
      JOIN books b ON ub.book_id = b.id
      WHERE ub.user_id = ?
    `, [req.params.id]);

    res.json(rows);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

/* ===============================
   FAVORITES
================================= */

app.get("/auth/user/:id/favorites", async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT b.*
      FROM favorites f
      JOIN books b ON f.book_id = b.id
      WHERE f.user_id = ?
    `, [req.params.id]);

    res.json(rows);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

app.post("/auth/user/:id/favorites", async (req, res) => {

  try {

    await db.query(
      "INSERT INTO favorites (user_id, book_id) VALUES (?, ?)",
      [req.params.id, req.body.bookId]
    );

    res.json({ success: true });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

app.delete("/auth/user/:id/favorites/:bookId", async (req, res) => {

  try {

    await db.query(
      "DELETE FROM favorites WHERE user_id = ? AND book_id = ?",
      [req.params.id, req.params.bookId]
    );

    res.json({ success: true });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

/* ===============================
   CART
================================= */

app.get("/auth/user/:id/cart", async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT
        b.id,
        b.title,
        b.price
      FROM cart c
      JOIN books b ON c.book_id = b.id
      WHERE c.user_id = ?
    `, [req.params.id]);

    res.json(rows);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

/* ===============================
   GET ORDERS
================================= */

app.get("/auth/user/:id/orders", async (req, res) => {

  try {

    const [orders] = await db.query(`
      SELECT *
      FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
    `, [req.params.id]);

    for (let order of orders) {

      const [items] = await db.query(`
        SELECT b.title, b.price
        FROM order_items oi
        JOIN books b ON oi.book_id = b.id
        WHERE oi.order_id = ?
      `, [order.id]);

      order.items = items;

    }

    res.json(orders);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

/* ===============================
   CREATE ORDER
================================= */

app.post("/orders", async (req, res) => {

  const { userId, total } = req.body;

  try {

    const [result] = await db.query(`
      INSERT INTO orders (user_id, total, created_at)
      VALUES (?, ?, NOW())
    `, [userId, total]);

    // vider le panier après commande
    await db.query(
      "DELETE FROM cart WHERE user_id = ?",
      [userId]
    );

    res.json({
      success: true,
      orderId: result.insertId
    });

  } catch (error) {

    console.error("Erreur création commande:", error);
    res.status(500).json({ error: error.message });

  }

});

/* ===============================
   UPLOAD PHOTO
================================= */

const storage = multer.diskStorage({

  destination: "./uploads/",

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }

});

const upload = multer({ storage });

app.post("/auth/user/:id/photo", upload.single("photo"), async (req, res) => {

  try {

    const photoPath = `/uploads/${req.file.filename}`;

    await db.query(
      "UPDATE users SET profile_picture = ? WHERE id = ?",
      [photoPath, req.params.id]
    );

    res.json({ photo: photoPath });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});


/* ===============================
   ADD TO CART
================================= */

app.post("/cart", async (req, res) => {

  const { userId, bookId } = req.body;

  try {

    await db.query(
      "INSERT INTO cart (user_id, book_id) VALUES (?, ?)",
      [userId, bookId]
    );

    res.json({ success: true });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

/* ===============================
   START SERVER
================================= */

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});