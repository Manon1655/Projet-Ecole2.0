import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

const NAV_LINKS = [
  { label: "Accueil",       to: "/home" },
  { label: "Bibliothèque",  to: "/library" },
  { label: "Abonnements",   to: "/subscription" },
  { label: "Mon profil",    to: "/profile" },
  { label: "Mes favoris",   to: "/favorites" },
];

const LEGAL_LINKS = [
  "Mentions légales",
  "Politique de confidentialité",
  "Conditions d'utilisation",
  "Cookies",
];

const GENRES = [
  "Fiction", "Science-Fiction", "Fantasy", "Thriller",
  "Romance", "Historique", "Biographie", "Philosophie",
];

export default function Footer() {
  const [email,      setEmail]      = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="ft-shell">

      {/* ══ NEWSLETTER CTA BAND ══ */}
      <div className="ft-cta">
        <div className="ft-cta__inner">
          <div className="ft-cta__text">
            <h3>Restez dans l'univers Ombrelune</h3>
            <p>Nouvelles parutions, sélections de la semaine et offres exclusives — directement dans votre boîte mail.</p>
          </div>
          {subscribed ? (
            <div className="ft-cta__success">
              <span>✓</span> Merci ! Vous êtes bien inscrit·e.
            </div>
          ) : (
            <form className="ft-cta__form" onSubmit={handleNewsletter}>
              <input
                type="email" required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.fr"
              />
              <button type="submit">S'inscrire →</button>
            </form>
          )}
        </div>
      </div>

      {/* ══ MAIN COLUMNS ══ */}
      <div className="ft-main">
        <div className="ft-main__inner">

          {/* ── Brand ── */}
          <div className="ft-col ft-col--brand">
            <div className="ft-logo">
              <span className="ft-logo__icon">O</span>
              <span className="ft-logo__name">Ombrelune</span>
            </div>
            <p className="ft-brand__tagline">
              Une bibliothèque vivante, nichée entre nature et poésie.
              Découvrez des histoires qui transforment.
            </p>
            <div className="ft-socials">
              {[
                { label:"Facebook",  char:"f",  href:"#" },
                { label:"Twitter/X", char:"𝕏",  href:"#" },
                { label:"Instagram", char:"◎",  href:"#" },
                { label:"TikTok",    char:"♪",  href:"#" },
              ].map(s => (
                <a key={s.label} href={s.href} className="ft-social" title={s.label}>
                  {s.char}
                </a>
              ))}
            </div>
            <div className="ft-trust">
              <span>🔒 Paiement sécurisé</span>
              <span>↩ Retour 30j</span>
              <span>📦 Livraison 48h</span>
            </div>
          </div>

          {/* ── Navigation ── */}
          <div className="ft-col">
            <h4 className="ft-col__title">Navigation</h4>
            <ul className="ft-links">
              {NAV_LINKS.map(l => (
                <li key={l.to}><Link to={l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* ── Genres ── */}
          <div className="ft-col">
            <h4 className="ft-col__title">Genres</h4>
            <ul className="ft-links">
              {GENRES.map(g => (
                <li key={g}><Link to={`/library?category=${g}`}>{g}</Link></li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div className="ft-col">
            <h4 className="ft-col__title">Contact</h4>
            <ul className="ft-contact">
              <li><span>✉️</span><a href="mailto:contact@ombrelune.fr">contact@ombrelune.fr</a></li>
              <li><span>📞</span><a href="tel:+33123456789">+33 1 23 45 67 89</a></li>
              <li><span>📍</span><span>12 rue des Lilas, Paris 75011</span></li>
              <li><span>🕐</span><span>Lun–Ven, 9h – 18h</span></li>
            </ul>

            <div className="ft-app">
              <p>Application mobile</p>
              <div className="ft-app__btns">
                <a href="#" className="ft-app__btn"><span>🍎</span> App Store</a>
                <a href="#" className="ft-app__btn"><span>▶</span> Google Play</a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ══ BOTTOM BAR ══ */}
      <div className="ft-bottom">
        <div className="ft-bottom__inner">
          <p>© {new Date().getFullYear()} Ombrelune — Tous droits réservés.</p>
          <div className="ft-legal">
            {LEGAL_LINKS.map((l, i) => (
              <span key={l}>
                <a href="#">{l}</a>
                {i < LEGAL_LINKS.length - 1 && <span className="ft-dot">·</span>}
              </span>
            ))}
          </div>
          <p className="ft-made">Fait avec ❤️ pour les lecteurs</p>
        </div>
      </div>

    </footer>
  );
}