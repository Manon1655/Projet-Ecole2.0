import { Link } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">O</span>
            <span className="logo-text">Ombrelune</span>
          </Link>
        </div>

        {/* Menu central */}
        <div className="navbar-center">
          <Link to="/" className="nav-item">Accueil</Link>
          <span className="nav-item">
            Catégories <span className="chevron">▾</span>
          </span>
          <Link to="/new" className="nav-item">Nouveautés</Link>
          <Link to="/best" className="nav-item">Best-sellers</Link>
        </div>

        {/* Icônes */}
        <div className="navbar-right">
          <span className="nav-icon">♡</span>
          <span className="nav-icon">👜</span>
          <span className="nav-icon">👤</span>
        </div>

      </div>
    </nav>
  );
}
