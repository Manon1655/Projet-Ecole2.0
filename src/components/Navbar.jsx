import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import books from "../data/books";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuth();
  const { cart, favorites } = useCart();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userMenuOpen,   setUserMenuOpen]   = useState(false);

  const userMenuRef = useRef(null);
  const categories  = [...new Set(books.map(b => b.category))].sort();

  const isActive = (path) => location.pathname === path;

  /* close user menu on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* ── LOGO ── */}
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">O</span>
            <span className="logo-text">Ombrelune</span>
          </Link>
        </div>

        {/* ── CENTRE ── */}
        <div className="navbar-center">
          <Link to="/home" className={`nav-item ${isActive("/home") ? "active" : ""}`}>
            Accueil
          </Link>

          <Link to="/library" className={`nav-item ${isActive("/library") ? "active" : ""}`}>
            Bibliothèque
          </Link>

          {/* Catégories dropdown */}
          <div
            className="nav-item-dropdown"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div className="nav-item">
              Catégories
              <span className="chevron">▾</span>
            </div>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                {categories.map(cat => (
                  <Link
                    key={cat}
                    to={`/library?category=${cat}`}
                    className="dropdown-item"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/subscription" className={`nav-item ${isActive("/subscription") ? "active" : ""}`}>
            Abonnements
          </Link>

          {!user && (
            <Link to="/login" className="nav-item">
              Connexion
            </Link>
          )}
        </div>

        {/* ── DROITE ── */}
        <div className="navbar-right">

          {/* Favoris */}
          <div className="nav-icon-wrapper" onClick={() => navigate("/favorites")} title="Mes favoris">
            <svg width="18" height="18" viewBox="0 0 24 24" fill={favorites.length > 0 ? "#c0392b" : "none"} stroke={favorites.length > 0 ? "#c0392b" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {favorites.length > 0 && (
              <span className="icon-badge">{favorites.length}</span>
            )}
          </div>

          {/* Panier */}
          <div className="nav-icon-wrapper" onClick={() => navigate("/cart")} title="Mon panier">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cart.length > 0 && (
              <span className="icon-badge">{cart.length}</span>
            )}
          </div>

          <div className="nav-divider" />

          {/* Avatar + menu utilisateur */}
          {user && (
            <div className="user-menu" ref={userMenuRef}>
              <div
                className="user-avatar"
                onClick={() => setUserMenuOpen(prev => !prev)}
                title="Mon compte"
              >
                {user.email?.charAt(0).toUpperCase()}
              </div>

              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <strong>{user.email}</strong>
                    <span>Mon compte</span>
                  </div>

                  <button onClick={() => { navigate("/profile"); setUserMenuOpen(false); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Mon profil
                  </button>

                  <button onClick={() => { navigate("/profile?tab=orders"); setUserMenuOpen(false); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    Mes commandes
                  </button>

                  <button onClick={() => { navigate("/favorites"); setUserMenuOpen(false); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    Mes favoris
                    {favorites.length > 0 && <span className="icon-badge" style={{position:"static",marginLeft:"auto"}}>{favorites.length}</span>}
                  </button>

                  <button className="logout-btn" onClick={handleLogout}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}