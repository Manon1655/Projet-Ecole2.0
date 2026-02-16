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
   CONNEXION MYSQL
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
        firstName,
        lastName,
        username
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
  const { email, password } = req.body;

  try {
    const [results] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
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
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username
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
   GET PROFIL
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
        profile_picture,
        subscription_id
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
   GET BOOKS (ALL)
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
   GET USER BOOKS
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
   GET ORDERS
================================= */

app.get("/auth/user/:id/orders", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [req.params.id]
    );

    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ===============================
   GET FAVORITES
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

/* ===============================
   ADD FAVORITE
================================= */

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

/* ===============================
   DELETE FAVORITE
================================= */

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


app.get("/auth/user/:id/cart", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM cart WHERE user_id = ?",
      [req.params.id]
    );
    res.json(rows);
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
