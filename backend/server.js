const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    const sql = `
      INSERT INTO users 
      (email, password, first_name, last_name, username, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    db.query(
      sql,
      [email, hashedPassword, firstName, lastName, username],
      (err, result) => {
        if (err) {
          console.log("ERREUR SQL :", err);
          return res.status(500).json({ error: err.message });
        }

        const token = jwt.sign(
          {
            id: result.insertId,
            email,
            firstName,
            lastName,
            username
          },
          "SECRET_KEY",
          { expiresIn: "2h" }
        );

        res.json({ token });
      }
    );

  } catch (error) {
    console.log("ERREUR SERVEUR :", error);
    res.status(500).json({ error: error.message });
  }
});

/* ===============================
   LOGIN
================================= */

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(401).json({ error: "Utilisateur non trouvé" });

    const user = result[0];

    const valid = await bcrypt.compare(password, user.mot_de_passe);
    if (!valid) return res.status(401).json({ error: "Mot de passe incorrect" });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        nom: user.last_name,
        prenom: user.first_name
      },
      SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });
  });
});

/* ===============================
   GET PROFIL
================================= */

app.get("/auth/user/:id", (req, res) => {
  const userId = req.params.id;

  console.log("ID reçu :", userId);

  const sql = `
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
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Erreur SQL complète :", err);
      return res.status(500).json({ error: err.message });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    console.log("Utilisateur trouvé :", results[0]);
    res.json(results[0]);
  });
});

/* ===============================
    UPDATE BIO  
================================= */

app.put("/auth/user/:id/bio", (req, res) => {
  const { bio } = req.body;

  db.query(
    "UPDATE users SET bio = ? WHERE id = ?",
    [bio, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

/* ===============================
    GET BOOKS
================================= */

app.get("/auth/user/:id/books", (req, res) => {
  const sql = `
    SELECT Livre.titre, user_books.progress
    FROM user_books
    JOIN Livre ON user_books.book_id = Livre.id_livre
    WHERE user_books.user_id = ?
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


/* ===============================
    GET ORDERS
================================= */

app.get("/auth/user/:id/orders", (req, res) => {
  db.query(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});


/* ===============================
    GET if SUBSCRIPTION
================================= */

app.get("/auth/user/:id/subscription", async (req, res) => {
  const userId = req.params.id;

  try {
    const [rows] = await db.query(`
      SELECT s.*
      FROM users u
      LEFT JOIN subscriptions s 
        ON u.subscription_id = s.id
      WHERE u.id = ?
    `, [userId]);

    if (!rows.length || !rows[0]) {
      return res.json(null);
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erreur subscription :", error);
    res.status(500).json({ error: error.message });
  }
});

/* ===============================
    UPDATE SUBSCRIPTION
================================= */

app.put("/auth/user/:id/subscription", async (req, res) => {
  const userId = req.params.id;
  const { subscription_id } = req.body;

  try {
    await db.query(
      "UPDATE users SET subscription_id = ? WHERE id = ?",
      [subscription_id, userId]
    );

    res.json({ message: "Abonnement mis à jour" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


/* ===============================
    UPLOAD PHOTO
================================= */

const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

app.post("/auth/user/:id/photo", upload.single("photo"), (req, res) => {
  const userId = req.params.id;
  const photoPath = `/uploads/${req.file.filename}`;

  db.query(
    "UPDATE users SET profile_picture = ? WHERE id = ?",
    [photoPath, userId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ photo: photoPath });
    }
  );
});



app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
