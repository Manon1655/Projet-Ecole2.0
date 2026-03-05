import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useSubscription } from "../context/SubscriptionContext";
import "../styles/navbar.css";

const PLAN_BADGE = {
  decouverte: { label: "🌱 Découverte", cls: "badge--decouverte" },
  premium:    { label: "⭐ Premium",    cls: "badge--premium"    },
  illimite:   { label: "♾️ Illimité",   cls: "badge--illimite"   },
};

/* ── SVG Icons ── */
const IconSearch = () => <span style={{fontSize:"20px", lineHeight:1}}>🔍</span>;
const IconHeart  = ({ filled }) => <span style={{fontSize:"22px", lineHeight:1}}>{filled ? "❤️" : "🤍"}</span>;
const IconCart   = ({ hasItems }) => <span style={{fontSize:"22px", lineHeight:1}}>{hasItems ? "🛒" : "🛒"}</span>;
const IconBell   = ({ hasNew }) => <span style={{fontSize:"20px", lineHeight:1}}>{hasNew ? "🔔" : "🔕"}</span>;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout }    = useAuth();
  const { cart, favorites } = useCart();
  const { subscription }    = useSubscription();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchTerm,   setSearchTerm]   = useState("");
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [scrolled,     setScrolled]     = useState(false);

  const userMenuRef = useRef(null);
  const searchRef   = useRef(null);
  const notifRef    = useRef(null);

  const isActive = (path) => location.pathname === path;
  const plan = subscription ? PLAN_BADGE[subscription.id] : null;

  /* scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* outside click */
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (searchRef.current   && !searchRef.current.contains(e.target))   setSearchOpen(false);
      if (notifRef.current    && !notifRef.current.contains(e.target))     setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/library?search=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm(""); setSearchOpen(false);
  };

  const handleLogout = () => { logout(); setUserMenuOpen(false); navigate("/login"); };

  const notifications = subscription
    ? [{ id:1, icon:"⭐", text:`Plan ${subscription.name} actif`, sub:"Votre abonnement est en cours", time:"Actif", link:"/profile?tab=subscription" }]
    : [{ id:1, icon:"📚", text:"Découvrez nos abonnements", sub:"Accès illimité à toute la bibliothèque", time:"Nouveau", link:"/subscription" }];

  const cartTotal = cart.reduce((s, i) => s + Number(i.price), 0)
    .toLocaleString("fr-FR", { style:"currency", currency:"EUR" });

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar-inner">

        {/* ── LOGO ── */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">O</span>
          <span className="logo-text">Ombrelune</span>
        </Link>

        {/* ── CENTER NAV ── */}
        <div className="navbar-center">
          <Link to="/home"         className={`nav-item ${isActive("/home")         ? "active":""}`}>Accueil</Link>
          <Link to="/library"      className={`nav-item ${isActive("/library")      ? "active":""}`}>Bibliothèque</Link>
          <Link to="/subscription" className={`nav-item ${isActive("/subscription") ? "active":""}`}>
            Abonnements
            {!subscription && <span className="nav-item__dot"/>}
          </Link>
          {!user && <Link to="/login" className="nav-item">Connexion</Link>}
        </div>

        {/* ── RIGHT ZONE ── */}
        <div className="navbar-right">

          {/* Search */}
          <div className={`nav-search ${searchOpen ? "nav-search--open":""}`} ref={searchRef}>
            <button className="nav-icon-btn" title="Rechercher" onClick={() => setSearchOpen(p=>!p)}>
              <IconSearch/>
            </button>
            {searchOpen && (
              <form onSubmit={handleSearch} className="nav-search__form">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7a7a60" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input autoFocus value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Titre, auteur, genre…"/>
                {searchTerm && (
                  <button type="button" className="nav-search__clear" onClick={()=>setSearchTerm("")}>✕</button>
                )}
                <button type="submit" className="nav-search__go">→</button>
              </form>
            )}
          </div>

          {/* Notifications */}
          <div className="nav-notif" ref={notifRef}>
            <button
              className={`nav-icon-btn ${notifOpen ? "active":""}`}
              title="Notifications"
              onClick={() => setNotifOpen(p=>!p)}
            >
              <IconBell hasNew={true}/>
              <span className="icon-badge icon-badge--amber">!</span>
            </button>
            {notifOpen && (
              <div className="nav-notif__panel">
                <div className="nav-notif__head">
                  <strong>Notifications</strong>
                  <span>{notifications.length} nouvelle{notifications.length > 1 ? "s":""}</span>
                </div>
                {notifications.map(n => (
                  <button key={n.id} className="nav-notif__item" onClick={()=>{ navigate(n.link); setNotifOpen(false); }}>
                    <span className="nav-notif__icon">{n.icon}</span>
                    <div>
                      <p>{n.text}</p>
                      <span>{n.sub}</span>
                    </div>
                    <span className="nav-notif__time">{n.time}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Favoris */}
          <button
            className={`nav-icon-btn ${favorites.length > 0 ? "nav-icon-btn--heart":""}`}
            onClick={() => navigate("/favorites")}
            title={`Favoris (${favorites.length})`}
          >
            <IconHeart filled={favorites.length > 0}/>
            {favorites.length > 0 && (
              <span className="icon-badge icon-badge--red">{favorites.length}</span>
            )}
          </button>

          {/* Panier avec mini total */}
          <button
            className={`nav-icon-btn nav-cart-btn ${cart.length > 0 ? "nav-icon-btn--cart":""}`}
            onClick={() => navigate("/cart")}
            title={`Panier (${cart.length} article${cart.length > 1 ? "s":""})`}
          >
            <IconCart hasItems={cart.length > 0}/>
            {cart.length > 0 && (
              <>
                <span className="icon-badge icon-badge--green">{cart.length}</span>
                <span className="nav-cart__total">{cartTotal}</span>
              </>
            )}
          </button>

          <div className="nav-divider"/>

          {/* Avatar */}
          {user ? (
            <div className="user-menu" ref={userMenuRef}>
              <button className={`user-avatar ${userMenuOpen ? "user-avatar--open":""}`} onClick={() => setUserMenuOpen(p=>!p)}>
                <span className="user-avatar__letter">
                  {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                </span>
                {plan && <span className="user-avatar__ring" title={plan.label}/>}
              </button>

              {userMenuOpen && (
                <div className="user-dropdown">

                  {/* Header */}
                  <div className="udrop-header">
                    <div className="udrop-avatar">
                      {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="udrop-info">
                      <strong>{user.firstName ? `${user.firstName} ${user.lastName||""}`.trim() : user.email}</strong>
                      <span>{user.email}</span>
                    </div>
                  </div>

                  {plan
                    ? <div className={`udrop-plan ${plan.cls}`}>{plan.label} — abonnement actif</div>
                    : <div className="udrop-plan badge--none">Aucun abonnement actif</div>
                  }

                  {/* Stats */}
                  <div className="udrop-stats">
                    <div className="udrop-stat" onClick={()=>{ navigate("/favorites"); setUserMenuOpen(false); }}>
                      <span>❤️</span>
                      <strong>{favorites.length}</strong>
                      <p>Favoris</p>
                    </div>
                    <div className="udrop-stat" onClick={()=>{ navigate("/cart"); setUserMenuOpen(false); }}>
                      <span>🛍️</span>
                      <strong>{cart.length}</strong>
                      <p>Panier</p>
                    </div>
                    <div className="udrop-stat" onClick={()=>{ navigate("/profile?tab=orders"); setUserMenuOpen(false); }}>
                      <span>📦</span>
                      <strong>—</strong>
                      <p>Commandes</p>
                    </div>
                  </div>

                  {/* Nav links */}
                  <div className="udrop-links">
                    {[
                      { icon:"👤", label:"Mon profil",      path:"/profile" },
                      { icon:"❤️", label:"Mes favoris",     path:"/favorites",            count: favorites.length || null },
                      { icon:"🛍️", label:"Mon panier",      path:"/cart",                 count: cart.length || null },
                      { icon:"📦", label:"Mes commandes",   path:"/profile?tab=orders" },
                      { icon:"⭐", label: subscription ? "Mon abonnement" : "Prendre un abonnement", path: subscription ? "/profile?tab=subscription" : "/subscription" },
                    ].map(item => (
                      <button key={item.path} className="udrop-link" onClick={()=>{ navigate(item.path); setUserMenuOpen(false); }}>
                        <span className="udrop-link__icon">{item.icon}</span>
                        {item.label}
                        {item.count && <span className="udrop-link__count">{item.count}</span>}
                        <svg className="udrop-link__arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
                      </button>
                    ))}
                  </div>

                  {/* Logout */}
                  <button className="udrop-logout" onClick={handleLogout}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="nav-login-btn">Se connecter</Link>
          )}

        </div>
      </div>
    </nav>
  );
}