const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors({
origin: ["http://localhost:3306", 
],
credentials: true
})); 

const PORT = 8080;

app.use(cookieParser());

app.use(express.json());

/* ===============================
   CONNEXION SQLITE
================================= */

const dbPath = path.join(__dirname, "projet_ecole_final");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error(err.message);    
    else console.log("Connecté à la base de données SQLite :", dbPath);
});

/* ===============================
   CREATION DES TABLES
================================= */

db.serialize(() => {
  // TABLE Auteur
  db.run(`
    CREATE TABLE Auteur (
    id_auteur INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100),
    biographie TEXT,
    date_naissance DATE,
    nationalite VARCHAR(100)
);
  `);

  // TABLE Categorie
  db.run(`
    CREATE TABLE Categorie (
    id_categorie INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT
);
  `);

  // TABLE Livre
  db.run(`
    CREATE TABLE Livre (
    id_livre INT AUTO_INCREMENT PRIMARY KEY,
    isbn VARCHAR(20) UNIQUE,
    titre VARCHAR(255) NOT NULL,
    resume TEXT,
    langue VARCHAR(50),
    date_publication DATE,
    nombre_pages INT,
    couverture_url VARCHAR(255)
);
  `);

  db.run(`
  CREATE TABLE Utilisateur (
    id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    photo_profil_url VARCHAR(255),
    date_naissance DATE,
    date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP,
    langue VARCHAR(50)
);
`);

db.run(`
  CREATE TABLE Commentaire (
    id_commentaire INT AUTO_INCREMENT PRIMARY KEY,
    contenu TEXT NOT NULL,
    date_commentaire DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_livre INT,
    id_utilisateur INT,
    FOREIGN KEY (id_livre) REFERENCES Livre(id_livre) ON DELETE CASCADE,
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE
);
`);

db.run(`
  CREATE TABLE Avis (
    id_avis INT AUTO_INCREMENT PRIMARY KEY,
    note INT CHECK (note BETWEEN 1 AND 5),
    titre VARCHAR(255),
    commentaire_avis TEXT,
    date_avis DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_livre INT,
    id_utilisateur INT,
    FOREIGN KEY (id_livre) REFERENCES Livre(id_livre) ON DELETE CASCADE,
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE
);
`);

db.run(`
  CREATE TABLE Favoris (
    id_favoris INT AUTO_INCREMENT PRIMARY KEY,
    date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_utilisateur INT,
    id_livre INT,
    UNIQUE (id_utilisateur, id_livre),
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_livre) REFERENCES Livre(id_livre) ON DELETE CASCADE
);
`);

db.run(`
  CREATE TABLE Historique (
    id_historique INT AUTO_INCREMENT PRIMARY KEY,
    date_debut_lecture DATETIME,
    date_derniere_lecture DATETIME,
    progression_pourcentage INT CHECK (progression_pourcentage BETWEEN 0 AND 100),
    statut_lecture VARCHAR(50),
    id_utilisateur INT UNIQUE,
    id_livre INT,
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_livre) REFERENCES Livre(id_livre) ON DELETE CASCADE
);
`);

db.run(`
  CREATE TABLE Offre_Abonnement (
    id_offre_abonnement INT AUTO_INCREMENT PRIMARY KEY,
    nom_offre VARCHAR(100),
    description TEXT,
    prix DECIMAL(10,2),
    duree_mois INT,
    acces_illimite BOOLEAN,
    nombre_livres_max INT,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

db.run(`
  CREATE TABLE Abonnement (
    id_abonnement INT AUTO_INCREMENT PRIMARY KEY,
    date_debut DATE,
    date_fin DATE,
    renouvellement_auto BOOLEAN,
    statut VARCHAR(50),
    id_utilisateur INT,
    id_offre_abonnement INT,
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_offre_abonnement) REFERENCES Offre_Abonnement(id_offre_abonnement)
);
`);

db.run(`
  CREATE TABLE Paiement (
    id_paiement INT AUTO_INCREMENT PRIMARY KEY,
    montant DECIMAL(10,2),
    devise VARCHAR(10),
    date_paiement DATETIME DEFAULT CURRENT_TIMESTAMP,
    mode_paiement VARCHAR(50),
    statut VARCHAR(50),
    id_abonnement INT,
    FOREIGN KEY (id_abonnement) REFERENCES Abonnement(id_abonnement) ON DELETE CASCADE
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Panier (
    id_panier INTEGER PRIMARY KEY AUTOINCREMENT,
    id_utilisateur INTEGER,
    id_livre INTEGER,
    quantite INTEGER DEFAULT 1,
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (id_livre) REFERENCES Livre(id_livre) ON DELETE CASCADE
  )`);

  console.log("✅ Toutes les tables sont créées");
});

/* ===============================
   ROUTES UTILISATEUR
================================= */

app.get("/Utilisateur", (req, res) => {
    db.all("SELECT * FROM Utilisateur", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Créer client
app.post("/Utilisateur", (req, res) => {
  const { email, mot_de_passe, nom, prenom,photo_profil_url,date_naissance,date_inscription,langue } = req.body;

  db.run(`
  INSERT INTO Utilisateur (email, mot_de_passe, nom, prenom, photo_profil_url, date_naissance, date_inscription, langue)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`,
[email, mot_de_passe, nom, prenom, photo_profil_url, date_naissance, date_inscription, langue],
function (err) {
  if (err) return res.status(500).json({ error: err.message });
  res.json({ id: this.lastID });
});

app.put("/Utilisateur/:id", (req, res) => {
    const { id } = req.params; 
    const { email, mot_de_passe, nom, prenom,photo_profil_url,date_naissance,date_inscription,langue } = req.body;

    db.run(` UPDATE Utilisateur
         SET email = ?, mot_de_passe = ?, nom = ?, prenom = ?, photo_profil_url = ?, date_naissance = ?, date_inscription = ?, langue = ? WHERE id_utilisateur = ? `,
        [email, mot_de_passe, nom, prenom, photo_profil_url, date_naissance, date_inscription, langue, id],
         function (err) { 
    if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) 
                return res.status(404).json({ error: "Utilisateur non trouvé" });

res.json({ success: true });
         }
        );
});

app.delete("/Utilisateur/:id", (req, res) => {
db.run(
    `DELETE FROM Utilisateur WHERE id_utilisateur = ?`,
     [req.params.id],
      function (err) {
    if (err) return res.status(500).json({ error: err.message });
          if (this.changes === 0)
             return res.status(404).json({ error: "Utilisateur non trouvé" });
             res.json({ success: true }); });
}
);


/* ===============================
   ROUTES LIVRE
================================= */

app.get("/livres", (req, res) => {
  db.all("SELECT * FROM Livre", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/livres", (req, res) => {
  const { isbn, titre, resume, langue, date_publication, nombre_pages, couverture_url } = req.body;

  const sql = `
    INSERT INTO Livre (isbn, titre, resume, langue, date_publication, nombre_pages, couverture_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [isbn, titre, resume, langue, date_publication, nombre_pages, couverture_url], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.delete("/livres/:id", (req, res) => {
  db.run("DELETE FROM Livre WHERE id_livre = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Livre supprimé" });
  });
});

/* ===============================
   ROUTES PANIER
================================= */

app.post("/panier", (req, res) => {
  const { id_utilisateur, id_livre, quantite } = req.body;

  const sql = `
    INSERT INTO Panier (id_utilisateur, id_livre, quantite)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [id_utilisateur, id_livre, quantite], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

app.get("/panier/:id_utilisateur", (req, res) => {
  const sql = `
    SELECT Panier.id_panier, Livre.titre, Livre.nombre_pages, Panier.quantite
    FROM Panier
    JOIN Livre ON Panier.id_livre = Livre.id_livre
    WHERE Panier.id_utilisateur = ?
  `;

  db.all(sql, [req.params.id_utilisateur], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.delete("/panier/:id", (req, res) => {
  db.run("DELETE FROM Panier WHERE id_panier = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Article supprimé du panier" });
  });
}
);
