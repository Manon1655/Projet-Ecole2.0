import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import books from "../data/books";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, favorites } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Extraire les catégories uniques
  const categories = [...new Set(books.map(b => b.category))].sort();

  const handleUserIconClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleFavoritesClick = () => {
    navigate("/favorites");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleCategoryClick = () => {
    setIsDropdownOpen(false);
  };

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
          <Link to="/home" className="nav-item">Accueil</Link>
          <Link to="/library" className="nav-item">Bibliothèque</Link>
          
          {/* Catégories Dropdown */}
          <div 
            className="nav-item-dropdown"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div className="nav-item">
              Catégories <span className="chevron">▾</span>
            </div>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {categories.map(cat => (
                  <Link 
                    key={cat} 
                    to={`/library?category=${cat}`}
                    className="dropdown-item"
                    onClick={handleCategoryClick}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/subscription" className="nav-item">Abonnements</Link>
          <Link to="/login" className="nav-item">Connexion</Link>
        </div>

        {/* Icônes */}
        <div className="navbar-right">
          <div 
            className="nav-icon-wrapper"
            onClick={handleFavoritesClick}
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
            aria-label="Voir les favoris"
          >
            <span className="nav-icon">♡</span>
            {favorites.length > 0 && (
              <span className="icon-badge">{favorites.length}</span>
            )}
          </div>

          <div 
            className="nav-icon-wrapper"
            onClick={handleCartClick}
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
            aria-label="Voir le panier"
          >
            <span className="nav-icon">👜</span>
            {cart.length > 0 && (
              <span className="icon-badge">{cart.length}</span>
            )}
          </div>

          <span 
            className="nav-icon" 
            onClick={handleUserIconClick}
            style={{ cursor: "pointer" }}
            role="button"
            tabIndex={0}
            aria-label={user ? "Aller au profil" : "Aller à la connexion"}
          >
            👤
          </span>
        </div>

      </div>
    </nav>
  );
}
