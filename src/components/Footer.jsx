import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-section">
            <h3>OmbreLune</h3>
            <p>Une bibliothèque vivante, nichée entre nature et poésie. Découvrez des histoires qui transforment.</p>
            <div className="footer-social">
              <a href="#" className="social-icon">𝕱</a>
              <a href="#" className="social-icon">𝕿</a>
              <a href="#" className="social-icon">ⓘ</a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Contact</h3>
            <p>📧 contact@ombrelune.fr</p>
            <p>📞 +33 1 23 45 67 89</p>
            <p>📍 Paris, France</p>
          </div>

          <div className="footer-section">
            <h3>Newsletter</h3>
            <p>Recevez nos dernières nouveautés et sélections.</p>
            <div className="footer-newsletter">
              <input type="email" placeholder="Votre email..." />
              <button>S'inscrire</button>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 OmbreLune. Tous droits réservés.</p>
        <div className="footer-links">
          <a href="#">Mentions légales</a>
          <span>•</span>
          <a href="#">Politique de confidentialité</a>
          <span>•</span>
          <a href="#">Conditions d'utilisation</a>
        </div>
      </div>
    </footer>
  );
}