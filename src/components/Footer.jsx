import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>À propos</h3>
          <p>ProjetEcole - Plateforme de lecture numérique pour les étudiants</p>
        </div>

        <div className="footer-section">
          <h3>Liens rapides</h3>
          <ul>
            <li><a href="/">Accueil</a></li>
            <li><a href="/library">Bibliothèque</a></li>
            <li><a href="/login">Connexion</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: contact@projetecole.fr</p>
          <p>Tel: +33 1 23 45 67 89</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 ProjetEcole. Tous droits réservés.</p>
      </div>
    </footer>
  );
}