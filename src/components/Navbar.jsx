import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useSubscription } from "../context/SubscriptionContext";

const PLAN_BADGE = {
  decouverte: { label: "Découverte", color: "#5a8f52", bg: "rgba(90,143,82,.12)" },
  premium:    { label: "Premium",    color: "#9a7a32", bg: "rgba(154,122,50,.12)" },
  illimite:   { label: "Illimité",   color: "#7c5cbf", bg: "rgba(124,92,191,.12)" },
};

const MEGA = {
  "Bibliothèque": {
    cols: [
      { head: "Par genre", items: [
        { label: "Romans & Littérature", path: "/library?genre=roman",    hint: "2 400 titres" },
        { label: "Fantasy & Sci-Fi",     path: "/library?genre=fantasy",  hint: "980 titres"   },
        { label: "Policier & Thriller",  path: "/library?genre=polar",    hint: "1 200 titres" },
        { label: "Biographies",          path: "/library?genre=bio",      hint: "540 titres"   },
        { label: "Jeunesse & Manga",     path: "/library?genre=jeunesse", hint: "760 titres"   },
        { label: "Poésie & Essais",      path: "/library?genre=poesie",   hint: "320 titres"   },
      ]},
      { head: "Explorer", items: [
        { label: "Nouveautés",       path: "/nouveautes",            hint: "Cette semaine"        },
        { label: "Coups de cœur",    path: "/selections",            hint: "Nos éditeurs adorent" },
        { label: "Les plus lus",     path: "/library?sort=popular",  hint: "Top 100"              },
        { label: "Séries complètes", path: "/library?filter=series", hint: "Collections entières" },
        { label: "Lecture rapide",   path: "/library?filter=short",  hint: "< 200 pages"          },
        { label: "Prix littéraires", path: "/library?filter=awards", hint: "Goncourt, Renaudot…"  },
      ]},
    ],
    card: {
      title: "Sélection de mars",
      sub: "10 romans incontournables sélectionnés par nos éditeurs",
      path: "/selections/mars",
      bg: "linear-gradient(145deg,#1e3a1e 0%,#2d5c2a 60%,#3d7535 100%)",
      label: "Découvrir",
    },
  },
  "Abonnements": {
    cols: [
      { head: "Formules", items: [
        { label: "Découverte — Gratuit",     path: "/subscription#decouverte", hint: "5 livres / mois"  },
        { label: "Premium — 9,99 €/mois",   path: "/subscription#premium",    hint: "30 livres / mois" },
        { label: "Illimité — 14,99 €/mois", path: "/subscription#illimite",   hint: "Accès total"      },
      ]},
      { head: "Avantages", items: [
        { label: "Lecture hors-ligne",  path: "/subscription", hint: "Partout, tout le temps" },
        { label: "Recommandations IA",  path: "/subscription", hint: "Sur-mesure pour vous"   },
        { label: "Accès anticipé",      path: "/subscription", hint: "Avant tout le monde"    },
        { label: "Sans publicité",      path: "/subscription", hint: "100% immersif"           },
        { label: "Ebook + Audio",       path: "/subscription", hint: "2 formats au choix"      },
      ]},
    ],
    card: {
      title: "1 mois offert",
      sub: "Sur le plan Premium avec le code LUNE — offre limitée",
      path: "/subscription",
      bg: "linear-gradient(145deg,#2a1a08 0%,#5c3810 60%,#8a5028 100%)",
      label: "En profiter",
    },
  },
};

const GENRES = ["Roman", "Fantasy", "Policier", "SF", "Biographie", "Jeunesse", "Manga", "Poésie"];

/* ── SVG icons ── */
const IcSearch  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const IcBell    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const IcHeart   = ({ filled }) => <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IcCart    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
const IcChev    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>;
const IcLogout  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IcLogin   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>;
const IcArrow   = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>;
const IcClock   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout }    = useAuth();
  const { cart, favorites } = useCart();
  const { subscription }    = useSubscription();

  const [mega,       setMega]       = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifOpen,  setNotifOpen]  = useState(false);
  const [cartOpen,   setCartOpen]   = useState(false);
  const [userOpen,   setUserOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [scrollPct,  setScrollPct]  = useState(0);
  const [recent,     setRecent]     = useState(["Amélie Nothomb", "Dune", "Molière"]);

  const navRef    = useRef(null);
  const searchRef = useRef(null);
  const megaTimer = useRef(null);

  const isActive = p => location.pathname === p;
  const plan = subscription ? PLAN_BADGE[subscription.id] : null;

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 20);
      const el = document.documentElement;
      setScrollPct((window.scrollY / (el.scrollHeight - el.clientHeight)) * 100 || 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = e => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMega(null); setSearchOpen(false); setNotifOpen(false); setCartOpen(false); setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    const fn = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") { setSearchOpen(false); setMega(null); setNotifOpen(false); setCartOpen(false); setUserOpen(false); }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const openMega  = k => { clearTimeout(megaTimer.current); if (MEGA[k]) setMega(k); };
  const closeMega = ()  => { megaTimer.current = setTimeout(() => setMega(null), 140); };

  const handleSearch = useCallback(e => {
    e.preventDefault();
    const t = searchTerm.trim();
    if (!t) return;
    setRecent(p => [t, ...p.filter(s => s !== t)].slice(0, 5));
    navigate(`/library?search=${encodeURIComponent(t)}`);
    setSearchTerm(""); setSearchOpen(false);
  }, [searchTerm, navigate]);

  const cartTotal = cart.reduce((s, i) => s + Number(i.price), 0)
    .toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

  const notifs = [
    { id:1, icon:"🌕", text:"Sélection de mars disponible",  sub:"10 nouvelles pépites vous attendent", time:"1h",  unread:true,  link:"/selections" },
    { id:2, icon:"💎", text:"Offre spéciale abonné",          sub:"-20% ce weekend uniquement",          time:"3h",  unread:true,  link:"/subscription" },
    { id:3, icon:"📖", text:"Reprenez votre lecture",         sub:"Dune — Chapitre 12",                  time:"2j",  unread:false, link:"/library" },
    { id:4, icon:"⭐", text:"Nouveau titre ajouté",           sub:"Les Âmes Errantes est disponible",    time:"3j",  unread:false, link:"/library" },
  ];
  const unread = notifs.filter(n => n.unread).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Jost:wght@300;400;500;600;700&display=swap');

        :root {
          --nv-bg:      #f5f1e8;
          --nv-white:   #ffffff;
          --nv-soft:    #f9f7f2;
          --nv-beige:   #ede8dc;
          --nv-beige2:  #e2dcd0;
          --nv-ink:     #1a2218;
          --nv-ink2:    #3a4a36;
          --nv-ink3:    #7a8a76;
          --nv-ink4:    #a8b8a4;
          --nv-green:   #2d5a28;
          --nv-green2:  #4a7a44;
          --nv-green3:  #6a9e64;
          --nv-green-a: rgba(45,90,40,.09);
          --nv-green-b: rgba(45,90,40,.2);
          --nv-gold:    #9a7a32;
          --nv-gold-l:  #c9a84c;
          --nv-rose:    #b05050;
          --nv-bdr:     rgba(45,90,40,.13);
          --nv-bdr2:    rgba(45,90,40,.24);
          --nv-sh0:     0 1px 6px rgba(26,34,24,.06);
          --nv-sh1:     0 4px 20px rgba(26,34,24,.10);
          --nv-sh2:     0 12px 48px rgba(26,34,24,.14);
          --nv-sh3:     0 24px 80px rgba(26,34,24,.18);
          --ease:       cubic-bezier(.4,0,.2,1);
          --spring:     cubic-bezier(.34,1.56,.64,1);
          --r:          12px;
          --r-sm:       8px;
        }

        /* ── WRAPPER ── */
        .nv { position:fixed; top:0; left:0; right:0; z-index:1000; font-family:'Jost',sans-serif; }

        /* ── ANNOUNCE BAND ── */
        .nv-band {
          height: 36px;
          background: var(--nv-green);
          color: rgba(255,255,255,.92);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          font-size: 12.5px; font-weight: 400; letter-spacing: .04em;
          overflow: hidden;
          transition: height .4s var(--ease), opacity .4s var(--ease);
        }
        .nv--scrolled .nv-band { height: 0; opacity: 0; pointer-events: none; }
        .nv-band__spark { font-size: 14px; animation: spark 3s ease-in-out infinite; }
        @keyframes spark { 0%,100%{transform:scale(1) rotate(0deg)} 50%{transform:scale(1.3) rotate(15deg)} }
        .nv-band__code {
          font-weight: 800; letter-spacing: .14em; color: #fff;
          background: rgba(255,255,255,.16); padding: 2px 10px; border-radius: 6px;
        }
        .nv-band__cta {
          color: #fff; font-weight: 700; text-decoration: none; cursor: pointer;
          border-bottom: 1.5px solid rgba(255,255,255,.5);
          transition: border-color .2s;
        }
        .nv-band__cta:hover { border-color: #fff; }

        /* ── MAIN BAR ── */
        .nv-bar {
          height: 70px;
          background: var(--nv-bg);
          border-bottom: 1.5px solid var(--nv-bdr);
          display: flex; align-items: center;
          padding: 0 32px; gap: 0;
          position: relative;
          transition: height .35s var(--ease), box-shadow .35s var(--ease), background .35s var(--ease);
        }
        .nv--scrolled .nv-bar {
          height: 62px;
          background: rgba(245,241,232,.96);
          backdrop-filter: blur(20px) saturate(1.6);
          box-shadow: var(--nv-sh2);
          border-bottom-color: var(--nv-bdr2);
        }

        /* Progress bar */
        .nv-prog {
          position: absolute; bottom: 0; left: 0;
          height: 2px; border-radius: 0 2px 2px 0;
          background: linear-gradient(90deg, var(--nv-green), var(--nv-green3), var(--nv-gold-l));
          transition: width .1s linear;
          pointer-events: none;
        }

        /* ── LOGO ── */
        .nv-logo {
          display: flex; align-items: center; gap: 12px;
          text-decoration: none; flex-shrink: 0; margin-right: 36px;
        }
        .nv-logo__mark {
          width: 42px; height: 42px; border-radius: 50%;
          border: 2px solid var(--nv-green);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 21px; font-weight: 600; color: var(--nv-green);
          transition: all .3s var(--spring); position: relative;
          background: transparent;
        }
        .nv-logo__mark::before {
          content: '';
          position: absolute; inset: 4px; border-radius: 50%;
          border: 1px solid rgba(45,90,40,.18);
          transition: opacity .3s;
        }
        .nv-logo:hover .nv-logo__mark {
          background: var(--nv-green); color: #fff;
          transform: rotate(-5deg) scale(1.05);
          box-shadow: 0 0 0 5px rgba(45,90,40,.1);
        }
        .nv-logo:hover .nv-logo__mark::before { opacity: 0; }
        .nv-logo__name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 23px; font-weight: 500; color: var(--nv-ink);
          letter-spacing: .01em; line-height: 1;
        }
        .nv-logo__tag {
          font-size: 9px; font-weight: 500; color: var(--nv-green2);
          letter-spacing: .22em; text-transform: uppercase; margin-top: 3px;
        }

        /* ── NAV LINKS ── */
        .nv-nav { display: flex; align-items: center; gap: 2px; flex: 1; }

        .nv-link {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 9px 14px; border-radius: 30px;
          font-size: 13.5px; font-weight: 400; color: var(--nv-ink2);
          text-decoration: none; background: none; border: none; cursor: pointer;
          font-family: 'Jost', sans-serif; letter-spacing: .01em;
          transition: all .2s var(--ease); white-space: nowrap;
          position: relative;
        }
        .nv-link:hover { color: var(--nv-green); background: var(--nv-green-a); }
        .nv-link--active {
          background: var(--nv-green) !important; color: #fff !important; font-weight: 600;
        }
        .nv-link--active:hover { background: var(--nv-green2) !important; }
        .nv-link__dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--nv-gold-l);
          box-shadow: 0 0 6px var(--nv-gold-l);
          animation: dot-pulse 2.4s ease-in-out infinite;
        }
        @keyframes dot-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.35; transform:scale(.6); }
        }
        .nv-link__chev {
          opacity: .45; transition: transform .22s var(--ease), opacity .22s;
          color: currentColor;
        }
        .nv-link--open .nv-link__chev,
        .nv-link:hover  .nv-link__chev { transform: rotate(180deg); opacity: .9; }

        /* ── RIGHT ZONE ── */
        .nv-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
        .nv-sep   { width: 1px; height: 28px; background: var(--nv-bdr2); margin: 0 4px; }

        /* ── ICON BUTTON ── */
        .nv-icon-btn {
          position: relative;
          width: 42px; height: 42px; border-radius: 50%;
          border: 1.5px solid var(--nv-bdr2);
          background: var(--nv-white);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--nv-ink2);
          box-shadow: var(--nv-sh0);
          transition: all .22s var(--ease);
        }
        .nv-icon-btn:hover {
          background: var(--nv-green); color: #fff;
          border-color: var(--nv-green);
          box-shadow: 0 4px 18px rgba(45,90,40,.28);
          transform: translateY(-1px);
        }
        .nv-icon-btn--active {
          background: var(--nv-green); color: #fff; border-color: var(--nv-green);
        }

        /* ── BADGE ── */
        .nv-badge {
          position: absolute; top: -3px; right: -3px;
          min-width: 18px; height: 18px; padding: 0 4px;
          border-radius: 20px; font-size: 10px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid var(--nv-bg); color: #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,.2);
          font-family: 'Jost', sans-serif;
        }
        .nv-badge--green { background: var(--nv-green); }
        .nv-badge--rose  { background: var(--nv-rose); }
        .nv-badge--gold  { background: var(--nv-gold); }

        /* ── CART BUTTON ── */
        .nv-cart-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 16px; border-radius: 30px;
          border: 1.5px solid var(--nv-bdr2);
          background: var(--nv-white); cursor: pointer;
          box-shadow: var(--nv-sh0);
          transition: all .22s var(--ease);
          font-family: 'Jost', sans-serif;
          color: var(--nv-ink2);
          position: relative;
        }
        .nv-cart-btn:hover {
          background: var(--nv-green); color: #fff;
          border-color: var(--nv-green);
          box-shadow: 0 4px 18px rgba(45,90,40,.28);
          transform: translateY(-1px);
        }
        .nv-cart-btn:hover .nv-cart-pill { background: rgba(255,255,255,.2); color: #fff; }
        .nv-cart-btn:hover .nv-cart-total { color: #fff; }
        .nv-cart-pill {
          font-size: 11.5px; font-weight: 700; color: var(--nv-green);
          background: var(--nv-green-a); padding: 2px 8px; border-radius: 20px;
          transition: all .22s;
        }
        .nv-cart-total {
          font-size: 13.5px; font-weight: 600; color: var(--nv-ink);
          transition: color .22s;
        }
        .nv-cart-empty { font-size: 12.5px; color: var(--nv-ink3); }

        /* ── LOGIN BUTTON ── */
        .nv-login {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 22px; border-radius: 30px;
          background: var(--nv-green); color: #fff;
          text-decoration: none; font-weight: 600; font-size: 13.5px;
          border: 2px solid var(--nv-green);
          box-shadow: 0 4px 16px rgba(45,90,40,.28);
          transition: all .22s var(--ease); white-space: nowrap;
        }
        .nv-login:hover {
          background: transparent; color: var(--nv-green);
          box-shadow: 0 4px 18px rgba(45,90,40,.12); transform: translateY(-1px);
        }

        /* ── AVATAR ── */
        .nv-ava-wrap { position: relative; }
        .nv-ava {
          width: 42px; height: 42px; border-radius: 50%;
          background: linear-gradient(135deg, var(--nv-green) 0%, var(--nv-green2) 100%);
          border: 2.5px solid var(--nv-green);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 19px; font-weight: 600; color: #fff;
          cursor: pointer; box-shadow: var(--nv-sh0);
          transition: all .25s var(--spring);
        }
        .nv-ava:hover, .nv-ava--open {
          box-shadow: 0 0 0 4px rgba(45,90,40,.18), var(--nv-sh0);
          transform: scale(1.06);
        }
        .nv-ava-ring {
          position: absolute; inset: -5px; border-radius: 50%;
          border: 1.5px dashed rgba(45,90,40,.35);
          animation: ring-spin 10s linear infinite;
          pointer-events: none;
        }
        @keyframes ring-spin { to { transform: rotate(360deg); } }

        /* ══ PANELS ══ */
        .nv-panel {
          position: absolute; top: calc(100% + 12px); right: 0;
          background: var(--nv-white);
          border: 1.5px solid var(--nv-bdr2);
          border-radius: var(--r);
          box-shadow: var(--nv-sh3);
          overflow: hidden;
          animation: panel-in .2s var(--ease) both;
          z-index: 999; min-width: 240px;
        }
        @keyframes panel-in {
          from { opacity:0; transform:translateY(-8px) scale(.97); }
          to   { opacity:1; transform:none; }
        }

        /* Panel header */
        .nv-ph {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px;
          background: var(--nv-soft);
          border-bottom: 1.5px solid var(--nv-bdr);
        }
        .nv-ph__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px; font-weight: 700; color: var(--nv-ink);
        }
        .nv-ph__badge {
          font-size: 11px; font-weight: 600; color: var(--nv-green);
          background: var(--nv-green-a); border: 1px solid var(--nv-green-b);
          padding: 3px 10px; border-radius: 20px;
        }

        /* ── SEARCH PANEL ── */
        .nv-search-wrap { width: 440px; }
        .nv-search-row {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 16px;
          border-bottom: 1.5px solid var(--nv-bdr);
        }
        .nv-search-row svg { color: var(--nv-green2); flex-shrink: 0; }
        .nv-search-input {
          flex: 1; border: none; background: transparent;
          font-family: 'Jost', sans-serif; font-size: 14px; color: var(--nv-ink);
          outline: none;
        }
        .nv-search-input::placeholder { color: var(--nv-ink4); }
        .nv-search-kbd {
          font-size: 10px; color: var(--nv-ink4);
          border: 1px solid var(--nv-bdr2); border-radius: 5px;
          padding: 2px 7px; flex-shrink: 0;
        }
        .nv-search-go {
          background: var(--nv-green); color: #fff; border: none; cursor: pointer;
          border-radius: var(--r-sm); padding: 8px 15px;
          font-family: 'Jost', sans-serif; font-size: 13px; font-weight: 600;
          transition: background .2s; flex-shrink: 0;
        }
        .nv-search-go:hover { background: var(--nv-green2); }
        .nv-search-sec { padding: 13px 16px; }
        .nv-search-sec + .nv-search-sec { border-top: 1px solid var(--nv-bdr); padding-top: 13px; }
        .nv-search-lbl {
          font-size: 9.5px; font-weight: 700; color: var(--nv-green2);
          letter-spacing: .18em; text-transform: uppercase; margin-bottom: 9px;
        }
        .nv-search-item {
          display: flex; align-items: center; gap: 9px;
          padding: 8px 10px; border-radius: var(--r-sm);
          background: none; border: none; cursor: pointer; text-align: left; width: 100%;
          font-family: 'Jost', sans-serif; font-size: 13.5px; color: var(--nv-ink2);
          transition: all .15s;
        }
        .nv-search-item svg { color: var(--nv-ink4); flex-shrink: 0; }
        .nv-search-item:hover { background: var(--nv-beige); color: var(--nv-green); }
        .nv-search-item:hover svg { color: var(--nv-green); }
        .nv-search-genres { display: flex; flex-wrap: wrap; gap: 6px; }
        .nv-search-genre {
          padding: 5px 13px; border-radius: 20px;
          background: var(--nv-beige); border: 1.5px solid var(--nv-bdr);
          font-size: 12.5px; color: var(--nv-ink2);
          cursor: pointer; font-family: 'Jost', sans-serif;
          transition: all .18s;
        }
        .nv-search-genre:hover { border-color: var(--nv-green); color: var(--nv-green); background: var(--nv-green-a); }

        /* ── NOTIF PANEL ── */
        .nv-notif-wrap { width: 360px; }
        .nv-notif-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 13px 18px; border: none;
          border-bottom: 1px solid var(--nv-bdr);
          width: 100%; cursor: pointer; text-align: left;
          font-family: 'Jost', sans-serif; transition: background .15s;
          background: none;
        }
        .nv-notif-item:hover { background: var(--nv-beige); }
        .nv-notif-item--u    { background: rgba(45,90,40,.04); }
        .nv-notif-ico {
          width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
          background: var(--nv-beige); border: 1.5px solid var(--nv-bdr);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; line-height: 1;
        }
        .nv-notif-text  { font-size: 13px; font-weight: 600; color: var(--nv-ink); margin: 0 0 2px; }
        .nv-notif-sub   { font-size: 11.5px; color: var(--nv-ink3); }
        .nv-notif-time  { font-size: 10.5px; color: var(--nv-ink4); margin-left: auto; flex-shrink: 0; }
        .nv-notif-dot   { width: 7px; height: 7px; border-radius: 50%; background: var(--nv-green); margin-top: 7px; flex-shrink: 0; box-shadow: 0 0 5px rgba(45,90,40,.4); }
        .nv-panel-foot  { padding: 12px 18px; text-align: center; background: var(--nv-soft); border-top: 1px solid var(--nv-bdr); }
        .nv-panel-foot-btn {
          font-size: 12.5px; color: var(--nv-green); background: none; border: none; cursor: pointer;
          font-family: 'Jost', sans-serif; font-weight: 600; transition: color .15s;
        }
        .nv-panel-foot-btn:hover { color: var(--nv-green2); text-decoration: underline; }

        /* ── CART PANEL ── */
        .nv-cart-wrap { width: 380px; }
        .nv-cart-item {
          display: flex; align-items: center; gap: 12px;
          padding: 13px 18px; border-bottom: 1px solid var(--nv-bdr);
        }
        .nv-cart-cover {
          width: 40px; height: 54px; border-radius: 4px 8px 8px 4px; flex-shrink: 0;
          background: linear-gradient(135deg, var(--nv-green), var(--nv-green2));
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          box-shadow: 3px 3px 12px rgba(45,90,40,.25);
        }
        .nv-cart-t  { font-size: 13px; font-weight: 600; color: var(--nv-ink); }
        .nv-cart-a  { font-size: 11.5px; color: var(--nv-ink3); margin-top: 1px; }
        .nv-cart-p  { font-size: 14px; font-weight: 700; color: var(--nv-green); margin-top: 3px; }
        .nv-cart-empty { padding: 36px 18px; text-align: center; color: var(--nv-ink3); font-size: 13.5px; }
        .nv-cart-foot { padding: 16px 18px; background: var(--nv-soft); border-top: 1.5px solid var(--nv-bdr2); }
        .nv-cart-foot-row {
          display: flex; justify-content: space-between; align-items: baseline;
          margin-bottom: 12px;
        }
        .nv-cart-foot-row span { font-size: 12.5px; color: var(--nv-ink3); }
        .nv-cart-foot-row strong { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 700; color: var(--nv-ink); }
        .nv-cart-cta {
          width: 100%; padding: 13px;
          background: var(--nv-green); color: #fff; border: none; border-radius: var(--r-sm);
          font-family: 'Jost', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; letter-spacing: .02em;
          box-shadow: 0 4px 16px rgba(45,90,40,.3);
          transition: all .22s;
        }
        .nv-cart-cta:hover { background: var(--nv-green2); transform: translateY(-1px); box-shadow: 0 6px 24px rgba(45,90,40,.4); }

        /* ── USER DROPDOWN ── */
        .nv-udrop-wrap { width: 300px; }
        .nv-udrop-head {
          padding: 20px 20px 16px;
          background: linear-gradient(135deg, #1a3a18 0%, #2d5c2a 100%);
          display: flex; align-items: center; gap: 13px;
        }
        .nv-udrop-ava {
          width: 48px; height: 48px; border-radius: 50%;
          background: rgba(255,255,255,.18); border: 2px solid rgba(255,255,255,.3);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px; font-weight: 700; color: #fff; flex-shrink: 0;
        }
        .nv-udrop-name  { font-size: 14px; font-weight: 700; color: #fff; }
        .nv-udrop-email { font-size: 11px; color: rgba(255,255,255,.65); margin-top: 2px; }
        .nv-udrop-plan-row {
          display: flex; align-items: center; gap: 9px;
          padding: 10px 18px; border-bottom: 1px solid var(--nv-bdr);
        }
        .nv-udrop-plan-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .nv-udrop-plan-txt { font-size: 12.5px; font-weight: 600; color: var(--nv-ink2); }
        .nv-udrop-plan-act { margin-left: auto; font-size: 11px; color: var(--nv-ink3); }

        .nv-udrop-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          border-bottom: 1px solid var(--nv-bdr);
        }
        .nv-udrop-stat {
          display: flex; flex-direction: column; align-items: center;
          padding: 12px 6px; cursor: pointer; background: none; border: none;
          font-family: 'Jost', sans-serif; transition: background .15s;
        }
        .nv-udrop-stat:hover { background: var(--nv-beige); }
        .nv-udrop-stat + .nv-udrop-stat { border-left: 1px solid var(--nv-bdr); }
        .nv-udrop-stat__ico { font-size: 17px; margin-bottom: 3px; line-height: 1; }
        .nv-udrop-stat__n   { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 700; color: var(--nv-green); line-height: 1; }
        .nv-udrop-stat__l   { font-size: 10px; color: var(--nv-ink3); margin-top: 2px; }

        .nv-udrop-links { padding: 5px 0; }
        .nv-udrop-link {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 18px; background: none; border: none; width: 100%;
          cursor: pointer; text-align: left;
          font-family: 'Jost', sans-serif; font-size: 13.5px; color: var(--nv-ink2);
          transition: all .15s;
        }
        .nv-udrop-link:hover { background: var(--nv-beige); color: var(--nv-green); padding-left: 22px; }
        .nv-udrop-link__ico { font-size: 15px; width: 20px; text-align: center; flex-shrink: 0; line-height: 1; }
        .nv-udrop-link__cnt {
          margin-left: auto; background: var(--nv-green); color: #fff;
          font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 20px;
        }
        .nv-udrop-div { height: 1px; background: var(--nv-bdr); margin: 2px 0; }
        .nv-udrop-logout {
          display: flex; align-items: center; gap: 10px; width: 100%;
          padding: 11px 18px; background: none; border: none; cursor: pointer;
          font-family: 'Jost', sans-serif; font-size: 13px; color: var(--nv-rose);
          transition: background .15s;
        }
        .nv-udrop-logout:hover { background: rgba(176,80,80,.07); }

        /* ══ MEGA MENU ══ */
        .nv-mega {
          position: fixed; left: 0; right: 0;
          background: var(--nv-white);
          border-bottom: 1.5px solid var(--nv-bdr2);
          box-shadow: var(--nv-sh3);
          display: flex; justify-content: center;
          animation: mega-in .22s var(--ease) both;
          z-index: 998;
        }
        @keyframes mega-in {
          from { opacity:0; transform:translateY(-12px); }
          to   { opacity:1; transform:none; }
        }
        .nv-mega-inner {
          display: flex; width: 100%; max-width: 1100px;
          padding: 36px 44px; gap: 0; align-items: flex-start;
        }
        .nv-mega-col {
          flex: 1; padding: 0 28px;
          border-right: 1.5px solid var(--nv-bdr);
        }
        .nv-mega-col:first-child { padding-left: 0; }
        .nv-mega-col:last-of-type { border-right: none; }
        .nv-mega-col-head {
          font-size: 9.5px; font-weight: 700; color: var(--nv-green2);
          letter-spacing: .2em; text-transform: uppercase; margin-bottom: 16px;
        }
        .nv-mega-link {
          display: flex; flex-direction: column;
          padding: 9px 10px; margin-bottom: 2px; border-radius: var(--r-sm);
          text-decoration: none; background: none; border: none; cursor: pointer;
          text-align: left; width: 100%; font-family: 'Jost', sans-serif;
          transition: all .18s var(--ease);
        }
        .nv-mega-link:hover { background: var(--nv-green-a); transform: translateX(4px); }
        .nv-mega-link__lbl  { font-size: 13.5px; font-weight: 500; color: var(--nv-ink); transition: color .18s; }
        .nv-mega-link:hover .nv-mega-link__lbl { color: var(--nv-green); }
        .nv-mega-link__hint { font-size: 11px; color: var(--nv-ink3); margin-top: 1px; }

        .nv-mega-card {
          width: 210px; flex-shrink: 0; border-radius: var(--r); overflow: hidden;
          cursor: pointer; display: flex; flex-direction: column;
          text-decoration: none; margin-left: 28px;
          box-shadow: 0 8px 32px rgba(0,0,0,.25);
          transition: transform .28s var(--spring), box-shadow .28s var(--ease);
        }
        .nv-mega-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 20px 56px rgba(0,0,0,.32); }
        .nv-mega-card__top  { height: 100px; display: flex; align-items: center; justify-content: center; }
        .nv-mega-card__leaf {
          width: 52px; height: 52px; border-radius: 50%;
          background: rgba(255,255,255,.12); border: 1.5px solid rgba(255,255,255,.2);
          display: flex; align-items: center; justify-content: center; font-size: 24px;
        }
        .nv-mega-card__body { padding: 16px 18px 20px; background: rgba(0,0,0,.28); flex: 1; }
        .nv-mega-card__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px; font-weight: 700; color: #fff; line-height: 1.2; margin-bottom: 6px;
        }
        .nv-mega-card__sub  { font-size: 11px; color: rgba(255,255,255,.68); line-height: 1.5; margin-bottom: 12px; }
        .nv-mega-card__cta  {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11.5px; font-weight: 700; color: #fff;
          letter-spacing: .08em; text-transform: uppercase;
          font-family: 'Jost', sans-serif;
          border-bottom: 1.5px solid rgba(255,255,255,.4);
          padding-bottom: 1px;
        }
      `}</style>

      <nav className={`nv${scrolled ? " nv--scrolled" : ""}`} ref={navRef}>
        {/* ── MAIN BAR ── */}
        <div className="nv-bar">
          <div className="nv-prog" style={{ width: `${scrollPct}%` }} />

          {/* LOGO */}
          <Link to="/" className="nv-logo">
            <div className="nv-logo__mark">O</div>
            <div>
              <div className="nv-logo__name">Ombrelune</div>
              <div className="nv-logo__tag">Librairie numérique</div>
            </div>
          </Link>

          {/* NAV */}
          <nav className="nv-nav">
            <Link to="/home" className={`nv-link${isActive("/home") ? " nv-link--active" : ""}`}>Accueil</Link>

            <button
              className={`nv-link${mega === "Bibliothèque" ? " nv-link--open" : ""}${isActive("/library") ? " nv-link--active" : ""}`}
              onMouseEnter={() => openMega("Bibliothèque")}
              onMouseLeave={closeMega}
              onClick={() => navigate("/library")}
            >
              Bibliothèque
              <span className="nv-link__chev"><IcChev /></span>
            </button>

            <button
              className={`nv-link${mega === "Abonnements" ? " nv-link--open" : ""}${isActive("/subscription") ? " nv-link--active" : ""}`}
              onMouseEnter={() => openMega("Abonnements")}
              onMouseLeave={closeMega}
              onClick={() => navigate("/subscription")}
            >
              Abonnements
              {!subscription && <span className="nv-link__dot" />}
              <span className="nv-link__chev"><IcChev /></span>
            </button>

            <Link to="/nouveautes" className={`nv-link${isActive("/nouveautes") ? " nv-link--active" : ""}`}>Nouveautés</Link>
            <Link to="/selections"  className={`nv-link${isActive("/selections")  ? " nv-link--active" : ""}`}>Sélections</Link>
            <Link to="/auteurs"     className={`nv-link${isActive("/auteurs")     ? " nv-link--active" : ""}`}>Auteurs</Link>
          </nav>

          {/* RIGHT */}
          <div className="nv-right">

            {/* Search */}
            <div style={{ position: "relative" }} ref={searchRef}>
              <button
                className={`nv-icon-btn${searchOpen ? " nv-icon-btn--active" : ""}`}
                onClick={() => setSearchOpen(p => !p)}
                title="Rechercher (⌘K)"
              >
                <IcSearch />
              </button>
              {searchOpen && (
                <div className="nv-panel nv-search-wrap" style={{ right: 0 }}>
                  <form onSubmit={handleSearch} className="nv-search-row">
                    <IcSearch />
                    <input
                      autoFocus className="nv-search-input"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Titre, auteur, genre…"
                    />
                    {!searchTerm && <span className="nv-search-kbd">⌘K</span>}
                    {searchTerm && (
                      <button type="button"
                        onClick={() => setSearchTerm("")}
                        style={{ background:"none",border:"none",cursor:"pointer",color:"var(--nv-ink4)",fontSize:"16px",lineHeight:1 }}>
                        ✕
                      </button>
                    )}
                    <button type="submit" className="nv-search-go">Chercher</button>
                  </form>
                  {recent.length > 0 && (
                    <div className="nv-search-sec" style={{ borderBottom:"1px solid var(--nv-bdr)" }}>
                      <div className="nv-search-lbl">Récents</div>
                      {recent.map(s => (
                        <button key={s} className="nv-search-item" onClick={() => setSearchTerm(s)}>
                          <IcClock /> {s}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="nv-search-sec">
                    <div className="nv-search-lbl">Genres</div>
                    <div className="nv-search-genres">
                      {GENRES.map(g => (
                        <button key={g} className="nv-search-genre"
                          onClick={() => { navigate(`/library?genre=${encodeURIComponent(g)}`); setSearchOpen(false); }}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div style={{ position: "relative" }}>
              <button
                className={`nv-icon-btn${notifOpen ? " nv-icon-btn--active" : ""}`}
                onClick={() => { setNotifOpen(p => !p); setCartOpen(false); setUserOpen(false); }}
                title="Notifications"
              >
                <IcBell />
                {unread > 0 && <span className="nv-badge nv-badge--gold">{unread}</span>}
              </button>
              {notifOpen && (
                <div className="nv-panel nv-notif-wrap">
                  <div className="nv-ph">
                    <span className="nv-ph__title">Notifications</span>
                    <span className="nv-ph__badge">{unread} nouvelle{unread !== 1 ? "s" : ""}</span>
                  </div>
                  {notifs.map(n => (
                    <button key={n.id}
                      className={`nv-notif-item${n.unread ? " nv-notif-item--u" : ""}`}
                      onClick={() => { navigate(n.link); setNotifOpen(false); }}>
                      <div className="nv-notif-ico">{n.icon}</div>
                      <div style={{ flex: 1 }}>
                        <p className="nv-notif-text">{n.text}</p>
                        <span className="nv-notif-sub">{n.sub}</span>
                      </div>
                      <span className="nv-notif-time">{n.time}</span>
                      {n.unread && <div className="nv-notif-dot" />}
                    </button>
                  ))}
                  <div className="nv-panel-foot">
                    <button className="nv-panel-foot-btn" onClick={() => { navigate("/notifications"); setNotifOpen(false); }}>
                      Voir toutes les notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Favoris */}
            <button
              className="nv-icon-btn"
              onClick={() => navigate("/favorites")}
              title={`Favoris (${favorites.length})`}
              style={favorites.length > 0 ? { color: "var(--nv-rose)" } : {}}
            >
              <IcHeart filled={favorites.length > 0} />
              {favorites.length > 0 && <span className="nv-badge nv-badge--rose">{favorites.length}</span>}
            </button>

            {/* Panier */}
            <div style={{ position: "relative" }}>
              <button
                className="nv-cart-btn"
                onClick={() => { cart.length > 0 ? setCartOpen(p => !p) : navigate("/cart"); setNotifOpen(false); setUserOpen(false); }}
              >
                <IcCart />
                {cart.length > 0 ? (
                  <>
                    <span className="nv-cart-pill">{cart.length}</span>
                    <span className="nv-cart-total">{cartTotal}</span>
                  </>
                ) : (
                  <span className="nv-cart-empty">Panier</span>
                )}
              </button>
              {cartOpen && (
                <div className="nv-panel nv-cart-wrap">
                  <div className="nv-ph">
                    <span className="nv-ph__title">Mon panier</span>
                    <span className="nv-ph__badge">{cart.length} article{cart.length !== 1 ? "s" : ""}</span>
                  </div>
                  {cart.length === 0 ? (
                    <div className="nv-cart-empty">Votre panier est vide</div>
                  ) : (
                    <>
                      {cart.slice(0, 4).map((item, i) => (
                        <div key={i} className="nv-cart-item">
                          <div className="nv-cart-cover">📚</div>
                          <div style={{ flex: 1 }}>
                            <div className="nv-cart-t">{item.title || "Livre"}</div>
                            <div className="nv-cart-a">{item.author || ""}</div>
                            <div className="nv-cart-p">{Number(item.price).toLocaleString("fr-FR", { style:"currency", currency:"EUR" })}</div>
                          </div>
                        </div>
                      ))}
                      {cart.length > 4 && (
                        <div style={{ padding:"9px 18px",fontSize:"12px",color:"var(--nv-ink3)",textAlign:"center" }}>
                          +{cart.length - 4} autre{cart.length - 4 > 1 ? "s" : ""} article{cart.length - 4 > 1 ? "s" : ""}
                        </div>
                      )}
                      <div className="nv-cart-foot">
                        <div className="nv-cart-foot-row">
                          <span>Total estimé</span>
                          <strong>{cartTotal}</strong>
                        </div>
                        <button className="nv-cart-cta" onClick={() => { navigate("/cart"); setCartOpen(false); }}>
                          Commander →
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="nv-sep" />

            {/* Avatar / Login */}
            {user ? (
              <div className="nv-ava-wrap">
                <button
                  className={`nv-ava${userOpen ? " nv-ava--open" : ""}`}
                  onClick={() => { setUserOpen(p => !p); setNotifOpen(false); setCartOpen(false); }}
                >
                  {user.firstName ? user.firstName[0].toUpperCase() : user.email?.[0].toUpperCase()}
                </button>
                {plan && <div className="nv-ava-ring" />}
                {userOpen && (
                  <div className="nv-panel nv-udrop-wrap">
                    <div className="nv-udrop-head">
                      <div className="nv-udrop-ava">
                        {user.firstName ? user.firstName[0].toUpperCase() : user.email?.[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="nv-udrop-name">
                          {user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.email}
                        </div>
                        <div className="nv-udrop-email">{user.email}</div>
                      </div>
                    </div>

                    {plan && (
                      <div className="nv-udrop-plan-row">
                        <div className="nv-udrop-plan-dot" style={{ background: plan.color }} />
                        <span className="nv-udrop-plan-txt">{plan.label}</span>
                        <span className="nv-udrop-plan-act">actif</span>
                      </div>
                    )}

                    <div className="nv-udrop-stats">
                      {[
                        { ico:"❤️", val: favorites.length, lbl:"Favoris",   path:"/favorites" },
                        { ico:"🛍️", val: cart.length,      lbl:"Panier",    path:"/cart"      },
                        { ico:"📦", val: "—",              lbl:"Commandes", path:"/profile?tab=orders" },
                      ].map(s => (
                        <button key={s.lbl} className="nv-udrop-stat"
                          onClick={() => { navigate(s.path); setUserOpen(false); }}>
                          <span className="nv-udrop-stat__ico">{s.ico}</span>
                          <span className="nv-udrop-stat__n">{s.val}</span>
                          <span className="nv-udrop-stat__l">{s.lbl}</span>
                        </button>
                      ))}
                    </div>

                    <div className="nv-udrop-links">
                      {[
                        { ico:"👤", lbl:"Mon profil",      path:"/profile"                   },
                        { ico:"❤️", lbl:"Mes favoris",     path:"/favorites",   cnt:favorites.length || null },
                        { ico:"🛍️", lbl:"Mon panier",      path:"/cart",        cnt:cart.length || null      },
                        { ico:"📦", lbl:"Mes commandes",   path:"/profile?tab=orders"        },
                        { ico:"⭐", lbl:subscription ? "Mon abonnement" : "S'abonner", path:subscription ? "/profile?tab=subscription" : "/subscription" },
                        { ico:"⚙️", lbl:"Paramètres",      path:"/settings"                  },
                      ].map(item => (
                        <button key={item.path} className="nv-udrop-link"
                          onClick={() => { navigate(item.path); setUserOpen(false); }}>
                          <span className="nv-udrop-link__ico">{item.ico}</span>
                          {item.lbl}
                          {item.cnt
                            ? <span className="nv-udrop-link__cnt">{item.cnt}</span>
                            : <span style={{ marginLeft:"auto", opacity:.25 }}><IcArrow /></span>
                          }
                        </button>
                      ))}
                    </div>

                    <div className="nv-udrop-div" />
                    <button className="nv-udrop-logout"
                      onClick={() => { logout(); setUserOpen(false); navigate("/login"); }}>
                      <IcLogout /> Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nv-login">
                <IcLogin /> Se connecter
              </Link>
            )}
          </div>
        </div>

        {/* ══ MEGA MENUS ══ */}
        {mega && MEGA[mega] && (
          <div
            className="nv-mega"
            style={{ top: scrolled ? "62px" : "70px" }}
            onMouseEnter={() => clearTimeout(megaTimer.current)}
            onMouseLeave={closeMega}
          >
            <div className="nv-mega-inner">
              {MEGA[mega].cols.map(col => (
                <div key={col.head} className="nv-mega-col">
                  <div className="nv-mega-col-head">{col.head}</div>
                  {col.items.map(item => (
                    <button key={item.label} className="nv-mega-link"
                      onClick={() => { navigate(item.path); setMega(null); }}>
                      <span className="nv-mega-link__lbl">{item.label}</span>
                      <span className="nv-mega-link__hint">{item.hint}</span>
                    </button>
                  ))}
                </div>
              ))}

              {/* Featured card */}
              {(() => {
                const c = MEGA[mega].card;
                return (
                  <div className="nv-mega-card" style={{ background: c.bg }}
                    onClick={() => { navigate(c.path); setMega(null); }}>
                    <div className="nv-mega-card__top">
                      <div className="nv-mega-card__leaf">🌿</div>
                    </div>
                    <div className="nv-mega-card__body">
                      <div className="nv-mega-card__title">{c.title}</div>
                      <div className="nv-mega-card__sub">{c.sub}</div>
                      <div className="nv-mega-card__cta">
                        {c.label} <IcArrow />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}