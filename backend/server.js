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
        id: user.id_users,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom
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
  const sql = `
    SELECT id_users, email, nom, prenom
    FROM users
    WHERE id_users = ?
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: "Utilisateur non trouvé" });

    res.json(result[0]);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
