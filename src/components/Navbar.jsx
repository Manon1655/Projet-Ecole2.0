import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useSubscription } from "../context/SubscriptionContext";

/* ─── DATA ────────────────────────────────────────────── */
const PLAN_BADGE = {
  decouverte: { label: "Découverte", color: "#5c8c50" },
  premium:    { label: "Premium",    color: "#b8962e" },
  illimite:   { label: "Illimité",   color: "#9070c8" },
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
    featured: { title: "Sélection de mars", sub: "10 romans curatés par nos éditeurs", path: "/selections/mars" },
  },
  "Abonnements": {
    cols: [
      { head: "Formules", items: [
        { label: "Découverte — Gratuit",     path: "/subscription#decouverte", hint: "5 livres / mois"  },
        { label: "Premium — 9,99 €/mois",   path: "/subscription#premium",    hint: "30 livres / mois" },
        { label: "Illimité — 14,99 €/mois", path: "/subscription#illimite",   hint: "Accès total"      },
      ]},
      { head: "Inclus dans chaque formule", items: [
        { label: "Lecture hors-ligne",  path: "/subscription", hint: "Partout, tout le temps" },
        { label: "Recommandations IA",  path: "/subscription", hint: "Sur-mesure pour vous"   },
        { label: "Accès anticipé",      path: "/subscription", hint: "Avant tout le monde"    },
        { label: "Sans publicité",      path: "/subscription", hint: "100% immersif"           },
        { label: "Ebook + Audio",       path: "/subscription", hint: "2 formats"               },
      ]},
    ],
    featured: { title: "1 mois offert", sub: "Code LUNE — offre limitée", path: "/subscription" },
  },
};

const GENRES = ["Roman", "Fantasy", "Policier", "SF", "Biographie", "Jeunesse", "Manga", "Poésie"];

/* ─── ICÔNES SVG ──────────────────────────────────────── */
const Ic = {
  Search:  () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Bell:    () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Heart:   ({ on }) => <svg width="17" height="17" viewBox="0 0 24 24" fill={on?"currentColor":"none"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Bag:     () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  User:    () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Chev:    () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>,
  Arrow:   () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m5 12h14M12 5l7 7-7 7"/></svg>,
  Logout:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Login:   () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>,
  Clock:   () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  X:       () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
};

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
  const [bagOpen,    setBagOpen]    = useState(false);
  const [userOpen,   setUserOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [scrollPct,  setScrollPct]  = useState(0);
  const [recent,     setRecent]     = useState(["Amélie Nothomb", "Dune", "Molière"]);

  const navRef    = useRef(null);
  const megaTimer = useRef(null);
  const isActive  = p => location.pathname === p;
  const plan      = subscription ? PLAN_BADGE[subscription.id] : null;

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 8);
      const el = document.documentElement;
      setScrollPct((window.scrollY / (el.scrollHeight - el.clientHeight)) * 100 || 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = e => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMega(null); setSearchOpen(false); setNotifOpen(false); setBagOpen(false); setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    const fn = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") { setMega(null); setSearchOpen(false); setNotifOpen(false); setBagOpen(false); setUserOpen(false); }
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const openMega  = k => { clearTimeout(megaTimer.current); if (MEGA[k]) setMega(k); };
  const closeMega = ()  => { megaTimer.current = setTimeout(() => setMega(null), 150); };
  const closeAll  = ()  => { setNotifOpen(false); setBagOpen(false); setUserOpen(false); setSearchOpen(false); };

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
    { id:1, icon:"🌕", text:"Sélection de mars disponible",  sub:"10 nouvelles pépites",             time:"1h",  u:true,  link:"/selections"   },
    { id:2, icon:"💎", text:"Offre spéciale abonné",          sub:"-20% ce weekend uniquement",       time:"3h",  u:true,  link:"/subscription" },
    { id:3, icon:"📖", text:"Reprenez votre lecture",         sub:"Dune — Chapitre 12",               time:"2j",  u:false, link:"/library"      },
    { id:4, icon:"⭐", text:"Nouveau titre ajouté",           sub:"Les Âmes Errantes est disponible", time:"3j",  u:false, link:"/library"      },
  ];
  const unread = notifs.filter(n => n.u).length;

  // Hauteur totale : bande annonce 30px + barre titre 64px + barre nav 44px = 138px
  // scrolled : bande disparaît, barre titre réduite 52px + barre nav 40px = 92px
  const megaTop = scrolled ? "92px" : "138px";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,600&family=Libre+Franklin:wght@300;400;500;600&display=swap');

        /* ══ TOKENS ══════════════════════════════════════ */
        :root {
          --p-ivory:   #f7f3ea;
          --p-ivory2:  #efe9da;
          --p-ivory3:  #e6dece;
          --p-white:   #fdfbf7;
          --p-ink:     #1c1a14;
          --p-ink2:    #3e3a2e;
          --p-ink3:    #7a7462;
          --p-ink4:    #b0aa98;
          --p-forest:  #2e5c30;
          --p-forest2: #4a8050;
          --p-forest3: #6aa870;
          --p-gold:    #9a7e2c;
          --p-gold2:   #c8a848;
          --p-rose:    #b84848;
          --p-bdr:     rgba(60,56,40,.12);
          --p-bdr2:    rgba(60,56,40,.22);
          --p-bdr3:    rgba(60,56,40,.08);
          --ease:      cubic-bezier(.4,0,.2,1);
          --spring:    cubic-bezier(.34,1.56,.64,1);
        }

        /* ══ WRAPPER ════════════════════════════════════ */
        .p-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          font-family: 'Libre Franklin', sans-serif;
        }

        /* ══ BANDE ANNONCE ══════════════════════════════ */
        .p-band {
          height: 30px; overflow: hidden;
          background: var(--p-forest);
          display: flex; align-items: center; justify-content: center; gap: 16px;
          font-size: 11px; font-weight: 400; letter-spacing: .08em;
          color: rgba(255,255,255,.85);
          transition: height .38s var(--ease), opacity .38s var(--ease);
        }
        .p-nav--scrolled .p-band { height: 0; opacity: 0; pointer-events: none; }
        .p-band__orn  { color: var(--p-gold2); font-size: 10px; opacity: .7; }
        .p-band__code { color: #fff; font-weight: 600; letter-spacing: .12em; }
        .p-band__sep  { color: rgba(255,255,255,.3); }
        .p-band__cta  { color: rgba(255,255,255,.9); cursor: pointer; letter-spacing: .06em; border-bottom: 1px solid rgba(255,255,255,.35); transition: border-color .2s; }
        .p-band__cta:hover { border-color: rgba(255,255,255,.8); }

        /* ══ BARRE TITRE ════════════════════════════════ */
        .p-head {
          height: 64px; overflow: hidden;
          background: var(--p-white);
          border-bottom: 1px solid var(--p-bdr2);
          display: grid; grid-template-columns: 1fr auto 1fr;
          align-items: center; padding: 0 36px;
          transition: height .35s var(--ease);
          position: relative;
        }
        .p-nav--scrolled .p-head { height: 52px; }

        /* Barre de progression dans p-head */
        .p-prog {
          position: absolute; bottom: 0; left: 0;
          height: 1.5px;
          background: linear-gradient(90deg, var(--p-forest), var(--p-forest3), var(--p-gold2));
          pointer-events: none; transition: width .1s linear;
        }

        /* Logo central */
        .p-logo {
          grid-column: 2; text-decoration: none;
          display: flex; flex-direction: column; align-items: center; gap: 0;
          transition: opacity .2s;
        }
        .p-logo:hover { opacity: .75; }
        .p-logo__name {
          font-family: 'Playfair Display', serif;
          font-size: 28px; font-weight: 400; font-style: italic;
          color: var(--p-ink); letter-spacing: .01em; line-height: 1;
          transition: font-size .35s var(--ease);
        }
        .p-nav--scrolled .p-logo__name { font-size: 23px; }
        .p-logo__rule {
          width: 40px; height: 1px;
          background: linear-gradient(90deg, transparent, var(--p-forest), transparent);
          margin: 3px 0 2px;
          transition: width .3s var(--ease);
        }
        .p-logo:hover .p-logo__rule { width: 60px; }
        .p-logo__tag {
          font-size: 8px; font-weight: 500;
          color: var(--p-forest); letter-spacing: .32em;
          text-transform: uppercase;
        }

        /* Zone gauche : date/édition */
        .p-head-left {
          grid-column: 1; display: flex; align-items: center; gap: 0;
        }
        .p-edition {
          font-size: 10px; font-weight: 400; color: var(--p-ink3);
          letter-spacing: .06em; line-height: 1.5;
        }
        .p-edition strong { color: var(--p-ink2); font-weight: 600; }

        /* Zone droite : actions */
        .p-head-right {
          grid-column: 3; display: flex; align-items: center; justify-content: flex-end; gap: 4px;
        }

        /* ── Bouton icône minimaliste ── */
        .p-ico-btn {
          position: relative;
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border: none; background: none; cursor: pointer;
          color: var(--p-ink3); border-radius: 8px;
          transition: all .18s var(--ease);
        }
        .p-ico-btn:hover { color: var(--p-ink); background: var(--p-ivory2); }
        .p-ico-btn--on   { color: var(--p-forest); background: rgba(46,92,48,.08); }

        /* Badge */
        .p-bdg {
          position: absolute; top: 3px; right: 3px;
          min-width: 15px; height: 15px; padding: 0 3px;
          border-radius: 20px; font-size: 8.5px; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          color: #fff; line-height: 1;
          font-family: 'Libre Franklin', sans-serif;
        }
        .p-bdg--g { background: var(--p-forest2); }
        .p-bdg--r { background: var(--p-rose); }
        .p-bdg--o { background: var(--p-gold); }

        /* ── Séparateur vertical ── */
        .p-vbar { width: 1px; height: 20px; background: var(--p-bdr2); margin: 0 6px; }

        /* ── Bouton Panier ── */
        .p-bag-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 7px 13px; border-radius: 8px;
          border: 1px solid var(--p-bdr2);
          background: var(--p-ivory2); cursor: pointer;
          font-family: 'Libre Franklin', sans-serif;
          color: var(--p-ink2); transition: all .18s var(--ease);
          position: relative;
        }
        .p-bag-btn:hover { background: var(--p-ivory3); border-color: var(--p-bdr); color: var(--p-ink); }
        .p-bag-num   { font-size: 11.5px; font-weight: 600; color: var(--p-forest); }
        .p-bag-total { font-size: 12px; font-weight: 500; color: var(--p-ink2); }
        .p-bag-empty { font-size: 11px; color: var(--p-ink4); }

        /* ── Bouton login ── */
        .p-login-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 16px; border-radius: 8px;
          border: 1.5px solid var(--p-forest);
          background: transparent; color: var(--p-forest);
          font-family: 'Libre Franklin', sans-serif;
          font-size: 12px; font-weight: 600; letter-spacing: .04em;
          cursor: pointer; text-decoration: none;
          transition: all .2s var(--ease);
        }
        .p-login-btn:hover { background: var(--p-forest); color: #fff; }

        /* ── Avatar ── */
        .p-ava-wrap { position: relative; }
        .p-ava {
          width: 34px; height: 34px; border-radius: 50%;
          background: var(--p-forest);
          border: 2px solid var(--p-forest2);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif; font-style: italic;
          font-size: 16px; color: #fff; cursor: pointer;
          transition: all .2s var(--spring);
        }
        .p-ava:hover, .p-ava--on {
          box-shadow: 0 0 0 3px rgba(46,92,48,.18);
          transform: scale(1.05);
        }

        /* ══ BARRE NAV ══════════════════════════════════ */
        .p-nav-bar {
          height: 44px; overflow: visible;
          background: var(--p-ivory);
          border-bottom: 1px solid var(--p-bdr2);
          display: flex; align-items: center; justify-content: center;
          gap: 0; position: relative;
          transition: height .35s var(--ease);
        }
        .p-nav--scrolled .p-nav-bar { height: 40px; }

        /* Filet décoratif tout en bas */
        .p-nav-bar::after {
          content: '';
          position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 80px; height: 2px;
          background: var(--p-forest2);
          border-radius: 2px 2px 0 0;
          opacity: 0; transition: opacity .3s;
          pointer-events: none;
        }

        .p-nl {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 0 18px; height: 100%;
          font-size: 12.5px; font-weight: 400; letter-spacing: .04em;
          color: var(--p-ink2); white-space: nowrap;
          text-decoration: none; background: none; border: none; cursor: pointer;
          font-family: 'Libre Franklin', sans-serif;
          position: relative; transition: color .18s;
        }
        /* Séparateur entre liens façon presse */
        .p-nl + .p-nl::before {
          content: '·';
          position: absolute; left: 0;
          color: var(--p-ink4); font-size: 14px;
          pointer-events: none;
        }
        .p-nl:hover { color: var(--p-forest); }
        /* Soulignement actif */
        .p-nl::after {
          content: '';
          position: absolute; bottom: 0; left: 14px; right: 14px;
          height: 2px; background: var(--p-forest);
          transform: scaleX(0); transform-origin: center;
          transition: transform .24s var(--ease);
          border-radius: 2px 2px 0 0;
        }
        .p-nl:hover::after, .p-nl--on::after { transform: scaleX(1); }
        .p-nl--on { color: var(--p-forest); font-weight: 500; }

        /* Dot "nouveauté" */
        .p-nl__dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--p-gold2); box-shadow: 0 0 4px var(--p-gold2);
          animation: pdot 2.5s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes pdot { 0%,100%{opacity:1} 50%{opacity:.2} }
        .p-nl__chev {
          opacity: .4; transition: transform .2s var(--ease), opacity .2s; color: currentColor;
        }
        .p-nl--open .p-nl__chev, .p-nl:hover .p-nl__chev { transform: rotate(180deg); opacity: .9; }

        /* ══ PANELS DROP ════════════════════════════════ */
        .p-panel {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: var(--p-white);
          border: 1px solid var(--p-bdr2);
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(28,26,20,.04), 0 16px 56px rgba(28,26,20,.14);
          overflow: hidden;
          animation: pdrop .18s var(--ease) both;
          z-index: 999;
        }
        @keyframes pdrop {
          from { opacity:0; transform: translateY(-6px) scale(.98); }
          to   { opacity:1; transform: none; }
        }

        .p-phead {
          padding: 13px 18px;
          background: var(--p-ivory);
          border-bottom: 1px solid var(--p-bdr2);
          display: flex; align-items: baseline; justify-content: space-between; gap: 12px;
        }
        .p-phead__title {
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 400; font-style: italic; color: var(--p-ink);
        }
        .p-phead__chip {
          font-size: 10px; font-weight: 600; color: var(--p-forest);
          background: rgba(46,92,48,.08);
          padding: 2px 9px; border-radius: 20px;
          letter-spacing: .04em;
        }
        .p-pfooter {
          padding: 10px 18px; text-align: center;
          background: var(--p-ivory); border-top: 1px solid var(--p-bdr);
        }
        .p-pfooter-btn {
          font-size: 11.5px; color: var(--p-forest); background: none; border: none; cursor: pointer;
          font-family: 'Libre Franklin', sans-serif; font-weight: 500;
          letter-spacing: .04em; transition: color .15s;
        }
        .p-pfooter-btn:hover { color: var(--p-ink); }

        /* ── Search ── */
        .p-search-panel { width: 420px; }
        .p-search-row {
          display: flex; align-items: center; gap: 10px;
          padding: 13px 16px; border-bottom: 1px solid var(--p-bdr2);
          background: var(--p-ivory);
        }
        .p-search-row svg { color: var(--p-ink3); flex-shrink: 0; }
        .p-search-inp {
          flex: 1; border: none; background: transparent;
          font-family: 'Libre Franklin', sans-serif; font-size: 14px; color: var(--p-ink);
          outline: none;
        }
        .p-search-inp::placeholder { color: var(--p-ink4); }
        .p-search-kbd { font-size: 9.5px; color: var(--p-ink4); border: 1px solid var(--p-bdr2); border-radius: 4px; padding: 2px 6px; }
        .p-search-go {
          background: var(--p-forest); color: #fff; border: none; cursor: pointer;
          border-radius: 7px; padding: 7px 14px;
          font-family: 'Libre Franklin', sans-serif; font-size: 12px; font-weight: 600;
          transition: background .2s;
        }
        .p-search-go:hover { background: var(--p-forest2); }
        .p-search-sec { padding: 12px 16px; }
        .p-search-sec + .p-search-sec { border-top: 1px solid var(--p-bdr); }
        .p-search-lbl {
          font-size: 9px; font-weight: 600; color: var(--p-forest);
          letter-spacing: .24em; text-transform: uppercase; margin-bottom: 8px;
        }
        .p-search-item {
          display: flex; align-items: center; gap: 9px;
          padding: 7px 8px; border-radius: 7px;
          background: none; border: none; cursor: pointer; width: 100%; text-align: left;
          font-family: 'Libre Franklin', sans-serif; font-size: 13px; color: var(--p-ink2);
          transition: all .14s;
        }
        .p-search-item svg { color: var(--p-ink4); flex-shrink: 0; }
        .p-search-item:hover { background: var(--p-ivory2); color: var(--p-forest); }
        .p-genres { display: flex; flex-wrap: wrap; gap: 5px; }
        .p-genre {
          padding: 4px 12px; border-radius: 20px;
          background: var(--p-ivory2); border: 1px solid var(--p-bdr2);
          font-size: 11.5px; color: var(--p-ink2); cursor: pointer;
          font-family: 'Libre Franklin', sans-serif; transition: all .15s;
        }
        .p-genre:hover { border-color: var(--p-forest); color: var(--p-forest); background: rgba(46,92,48,.06); }

        /* ── Notifs ── */
        .p-notif-panel { width: 340px; }
        .p-nitem {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 12px 18px; border: none; border-bottom: 1px solid var(--p-bdr);
          width: 100%; cursor: pointer; text-align: left;
          font-family: 'Libre Franklin', sans-serif; background: none; transition: background .14s;
        }
        .p-nitem:hover { background: var(--p-ivory); }
        .p-nitem--u    { background: rgba(46,92,48,.03); }
        .p-nitem__ico  {
          width: 36px; height: 36px; border-radius: 8px; flex-shrink: 0;
          background: var(--p-ivory2); border: 1px solid var(--p-bdr);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; line-height: 1;
        }
        .p-nitem__t    { font-size: 12.5px; font-weight: 600; color: var(--p-ink); margin: 0 0 2px; }
        .p-nitem__s    { font-size: 11px; color: var(--p-ink3); }
        .p-nitem__time { font-size: 10px; color: var(--p-ink4); margin-left: auto; flex-shrink: 0; padding-top: 1px; }
        .p-nitem__dot  { width: 6px; height: 6px; border-radius: 50%; background: var(--p-forest2); margin-top: 9px; flex-shrink: 0; }

        /* ── Panier panel ── */
        .p-bag-panel { width: 360px; }
        .p-bitem {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 18px; border-bottom: 1px solid var(--p-bdr);
        }
        .p-bcover {
          width: 38px; height: 52px; border-radius: 3px 8px 8px 3px; flex-shrink: 0;
          background: linear-gradient(160deg, var(--p-forest), #1a3c1c);
          display: flex; align-items: center; justify-content: center; font-size: 18px;
          box-shadow: 2px 3px 10px rgba(0,0,0,.18);
        }
        .p-bt  { font-size: 12.5px; font-weight: 600; color: var(--p-ink); }
        .p-ba  { font-size: 11px; color: var(--p-ink3); margin-top: 1px; }
        .p-bp  { font-size: 13px; font-weight: 700; color: var(--p-forest); margin-top: 3px; }
        .p-bempty { padding: 30px 18px; text-align: center; color: var(--p-ink3); font-size: 12.5px; }
        .p-bfoot   { padding: 14px 18px; background: var(--p-ivory); border-top: 1px solid var(--p-bdr2); }
        .p-brow    { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
        .p-brow span { font-size: 11.5px; color: var(--p-ink3); }
        .p-brow strong { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 400; color: var(--p-ink); }
        .p-bcta {
          width: 100%; padding: 11px; border-radius: 8px;
          background: var(--p-forest); color: #fff; border: none;
          font-family: 'Libre Franklin', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; letter-spacing: .03em;
          transition: background .2s, transform .2s;
        }
        .p-bcta:hover { background: var(--p-forest2); transform: translateY(-1px); }

        /* ── User dropdown ── */
        .p-udrop { width: 280px; }
        .p-udrop-head {
          padding: 18px 18px 14px;
          background: linear-gradient(160deg, #1a3c1c 0%, var(--p-forest) 100%);
          display: flex; align-items: center; gap: 13px;
        }
        .p-udrop-ava {
          width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
          background: rgba(255,255,255,.14); border: 1.5px solid rgba(255,255,255,.24);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif; font-style: italic;
          font-size: 21px; color: #fff;
        }
        .p-udrop-name  { font-size: 13.5px; font-weight: 600; color: #fff; }
        .p-udrop-email { font-size: 10.5px; color: rgba(255,255,255,.6); margin-top: 2px; }
        .p-udrop-plan  {
          display: flex; align-items: center; gap: 8px;
          padding: 9px 18px; border-bottom: 1px solid var(--p-bdr);
          background: var(--p-ivory);
        }
        .p-udrop-pdot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .p-udrop-ptxt { font-size: 11.5px; font-weight: 600; color: var(--p-ink2); }
        .p-udrop-pst  { margin-left: auto; font-size: 10px; color: var(--p-ink4); }

        .p-ustats {
          display: grid; grid-template-columns: repeat(3,1fr);
          border-bottom: 1px solid var(--p-bdr);
        }
        .p-ustat {
          display: flex; flex-direction: column; align-items: center;
          padding: 11px 4px; cursor: pointer; background: none; border: none;
          font-family: 'Libre Franklin', sans-serif; transition: background .14s;
        }
        .p-ustat:hover { background: var(--p-ivory2); }
        .p-ustat + .p-ustat { border-left: 1px solid var(--p-bdr); }
        .p-ustat__ico { font-size: 15px; line-height: 1; margin-bottom: 3px; }
        .p-ustat__n   { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--p-forest); line-height: 1; }
        .p-ustat__l   { font-size: 9px; color: var(--p-ink4); margin-top: 2px; letter-spacing: .04em; }

        .p-ulinks { padding: 4px 0; }
        .p-ulink {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 18px; background: none; border: none; width: 100%;
          cursor: pointer; text-align: left;
          font-family: 'Libre Franklin', sans-serif; font-size: 12.5px; color: var(--p-ink2);
          transition: all .13s;
        }
        .p-ulink:hover { background: var(--p-ivory2); color: var(--p-ink); padding-left: 22px; }
        .p-ulink__ico { font-size: 13px; width: 18px; text-align: center; flex-shrink: 0; line-height: 1; }
        .p-ulink__cnt {
          margin-left: auto; background: var(--p-forest); color: #fff;
          font-size: 9.5px; font-weight: 700; padding: 2px 7px; border-radius: 20px;
        }
        .p-udiv   { height: 1px; background: var(--p-bdr); margin: 2px 0; }
        .p-ulogout {
          display: flex; align-items: center; gap: 9px; width: 100%;
          padding: 10px 18px; background: none; border: none; cursor: pointer;
          font-family: 'Libre Franklin', sans-serif; font-size: 12px; color: var(--p-rose);
          transition: background .13s;
        }
        .p-ulogout:hover { background: rgba(184,72,72,.07); }

        /* ══ MEGA MENU ══════════════════════════════════ */
        .p-mega {
          position: fixed; left: 0; right: 0;
          background: var(--p-white);
          border-bottom: 1px solid var(--p-bdr2);
          box-shadow: 0 20px 60px rgba(28,26,20,.12);
          display: flex; justify-content: center;
          animation: pmega .2s var(--ease) both;
          z-index: 998;
        }
        @keyframes pmega {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:none; }
        }
        .p-mega-inner {
          display: flex; width: 100%; max-width: 1060px;
          padding: 40px 52px; gap: 0; align-items: flex-start;
        }
        .p-mega-col {
          flex: 1; padding: 0 32px;
          border-right: 1px solid var(--p-bdr2);
        }
        .p-mega-col:first-child { padding-left: 0; }
        .p-mega-col:last-of-type { border-right: none; }
        .p-mega-head {
          font-size: 9px; font-weight: 600; color: var(--p-forest);
          letter-spacing: .28em; text-transform: uppercase;
          margin-bottom: 18px; padding-bottom: 10px;
          border-bottom: 1px solid var(--p-bdr);
          display: flex; align-items: center; gap: 8px;
        }
        .p-mega-head::before {
          content: ''; width: 12px; height: 1px; background: var(--p-forest2);
        }
        .p-mega-link {
          display: flex; justify-content: space-between; align-items: baseline;
          padding: 8px 8px; margin-bottom: 1px; border-radius: 6px;
          background: none; border: none; cursor: pointer; width: 100%;
          font-family: 'Libre Franklin', sans-serif; transition: all .15s;
          text-decoration: none;
        }
        .p-mega-link:hover { background: rgba(46,92,48,.06); }
        .p-mega-link__l    {
          font-size: 13px; font-weight: 400; color: var(--p-ink);
          transition: color .15s;
        }
        .p-mega-link:hover .p-mega-link__l { color: var(--p-forest); }
        .p-mega-link__r    { font-size: 10.5px; color: var(--p-ink4); }

        /* Carte featured — style encart presse */
        .p-mega-feat {
          width: 195px; flex-shrink: 0; margin-left: 32px;
          border: 1px solid var(--p-bdr2); border-radius: 10px; overflow: hidden;
          cursor: pointer; display: flex; flex-direction: column;
          transition: transform .24s var(--spring), box-shadow .24s;
          box-shadow: 0 4px 20px rgba(28,26,20,.1);
          text-decoration: none;
        }
        .p-mega-feat:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(28,26,20,.16); }
        .p-mega-feat__img {
          height: 80px; background: linear-gradient(145deg, #1a3c1c 0%, #2e5c30 60%, #3a7040 100%);
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        /* Motif typographique décoratif */
        .p-mega-feat__img::before {
          content: '❧';
          font-size: 60px; color: rgba(255,255,255,.07);
          position: absolute; right: -8px; bottom: -12px; line-height: 1;
        }
        .p-mega-feat__label {
          font-family: 'Playfair Display', serif; font-style: italic;
          font-size: 22px; font-weight: 400; color: rgba(255,255,255,.92); position: relative; z-index: 1;
        }
        .p-mega-feat__body { padding: 14px 16px 16px; background: var(--p-white); flex: 1; }
        .p-mega-feat__t    { font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 400; color: var(--p-ink); margin-bottom: 4px; }
        .p-mega-feat__s    { font-size: 10.5px; color: var(--p-ink3); line-height: 1.5; margin-bottom: 10px; }
        .p-mega-feat__cta  {
          font-size: 10px; font-weight: 600; color: var(--p-forest);
          letter-spacing: .12em; text-transform: uppercase;
          display: flex; align-items: center; gap: 5px;
        }
      `}</style>

      <nav className={`p-nav${scrolled ? " p-nav--scrolled" : ""}`} ref={navRef}>

        {/* ── BARRE TITRE ── */}
        <div className="p-head">
          <div className="p-prog" style={{ width: `${scrollPct}%` }} />

          {/* Gauche : édition */}
          <div className="p-head-left">
            <div className="p-edition">
              <strong>Ombrelune</strong><br />
              Librairie numérique
            </div>
          </div>

          {/* Centre : logo typographique */}
          <Link to="/" className="p-logo">
            <span className="p-logo__name">Ombrelune</span>
            <div className="p-logo__rule" />
            <span className="p-logo__tag">Librairie numérique</span>
          </Link>

          {/* Droite : actions */}
          <div className="p-head-right">

            {/* Recherche */}
            <div style={{ position:"relative" }}>
              <button
                className={`p-ico-btn${searchOpen ? " p-ico-btn--on" : ""}`}
                onClick={() => { setSearchOpen(p=>!p); closeAll(); setSearchOpen(p=>p); }}
                title="Rechercher"
              >
                <Ic.Search />
              </button>
              {searchOpen && (
                <div className="p-panel p-search-panel">
                  <form onSubmit={handleSearch} className="p-search-row">
                    <Ic.Search />
                    <input autoFocus className="p-search-inp" value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)} placeholder="Titre, auteur, genre…" />
                    {!searchTerm && <span className="p-search-kbd">⌘K</span>}
                    {searchTerm && (
                      <button type="button" onClick={() => setSearchTerm("")}
                        style={{background:"none",border:"none",cursor:"pointer",color:"var(--p-ink4)"}}>
                        <Ic.X />
                      </button>
                    )}
                    <button type="submit" className="p-search-go">Chercher</button>
                  </form>
                  {recent.length > 0 && (
                    <div className="p-search-sec" style={{borderBottom:"1px solid var(--p-bdr)"}}>
                      <div className="p-search-lbl">Récents</div>
                      {recent.map(s => (
                        <button key={s} className="p-search-item" onClick={() => setSearchTerm(s)}>
                          <Ic.Clock /> {s}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="p-search-sec">
                    <div className="p-search-lbl">Genres</div>
                    <div className="p-genres">
                      {GENRES.map(g => (
                        <button key={g} className="p-genre"
                          onClick={() => { navigate(`/library?genre=${encodeURIComponent(g)}`); setSearchOpen(false); }}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notifs */}
            <div style={{ position:"relative" }}>
              <button
                className={`p-ico-btn${notifOpen ? " p-ico-btn--on" : ""}`}
                onClick={() => { setNotifOpen(p=>!p); setBagOpen(false); setUserOpen(false); setSearchOpen(false); }}
                title="Notifications"
              >
                <Ic.Bell />
                {unread > 0 && <span className="p-bdg p-bdg--o">{unread}</span>}
              </button>
              {notifOpen && (
                <div className="p-panel p-notif-panel">
                  <div className="p-phead">
                    <span className="p-phead__title">Notifications</span>
                    <span className="p-phead__chip">{unread} nouvelles</span>
                  </div>
                  {notifs.map(n => (
                    <button key={n.id}
                      className={`p-nitem${n.u ? " p-nitem--u" : ""}`}
                      onClick={() => { navigate(n.link); setNotifOpen(false); }}>
                      <div className="p-nitem__ico">{n.icon}</div>
                      <div style={{flex:1}}>
                        <p className="p-nitem__t">{n.text}</p>
                        <span className="p-nitem__s">{n.sub}</span>
                      </div>
                      <span className="p-nitem__time">{n.time}</span>
                      {n.u && <div className="p-nitem__dot"/>}
                    </button>
                  ))}
                  <div className="p-pfooter">
                    <button className="p-pfooter-btn"
                      onClick={() => { navigate("/notifications"); setNotifOpen(false); }}>
                      Voir toutes les notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Favoris */}
            <button
              className="p-ico-btn"
              style={favorites.length > 0 ? { color:"var(--p-rose)" } : {}}
              onClick={() => navigate("/favorites")}
              title={`Favoris (${favorites.length})`}
            >
              <Ic.Heart on={favorites.length > 0} />
              {favorites.length > 0 && <span className="p-bdg p-bdg--r">{favorites.length}</span>}
            </button>

            <div className="p-vbar" />

            {/* Panier */}
            <div style={{ position:"relative" }}>
              <button
                className="p-bag-btn"
                onClick={() => { cart.length > 0 ? setBagOpen(p=>!p) : navigate("/cart"); setNotifOpen(false); setUserOpen(false); }}
              >
                <Ic.Bag />
                {cart.length > 0 ? (
                  <>
                    <span className="p-bag-num">{cart.length}</span>
                    <span className="p-bag-total">{cartTotal}</span>
                  </>
                ) : (
                  <span className="p-bag-empty">Panier</span>
                )}
              </button>
              {bagOpen && (
                <div className="p-panel p-bag-panel">
                  <div className="p-phead">
                    <span className="p-phead__title">Mon panier</span>
                    <span className="p-phead__chip">{cart.length} article{cart.length!==1?"s":""}</span>
                  </div>
                  {cart.length === 0 ? (
                    <div className="p-bempty">Votre panier est vide</div>
                  ) : (
                    <>
                      {cart.slice(0,4).map((item,i) => (
                        <div key={i} className="p-bitem">
                          <div className="p-bcover">📚</div>
                          <div style={{flex:1}}>
                            <div className="p-bt">{item.title||"Livre"}</div>
                            <div className="p-ba">{item.author||""}</div>
                            <div className="p-bp">{Number(item.price).toLocaleString("fr-FR",{style:"currency",currency:"EUR"})}</div>
                          </div>
                        </div>
                      ))}
                      {cart.length > 4 && (
                        <div style={{padding:"8px 18px",fontSize:"11.5px",color:"var(--p-ink4)",textAlign:"center"}}>
                          +{cart.length-4} autre{cart.length-4>1?"s":""} article{cart.length-4>1?"s":""}
                        </div>
                      )}
                      <div className="p-bfoot">
                        <div className="p-brow">
                          <span>Total estimé</span>
                          <strong>{cartTotal}</strong>
                        </div>
                        <button className="p-bcta" onClick={()=>{navigate("/cart");setBagOpen(false);}}>
                          Passer commande →
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="p-vbar" />

            {/* Avatar / Login */}
            {user ? (
              <div className="p-ava-wrap">
                <button
                  className={`p-ava${userOpen ? " p-ava--on" : ""}`}
                  onClick={() => { setUserOpen(p=>!p); setNotifOpen(false); setBagOpen(false); setSearchOpen(false); }}
                >
                  {user.firstName ? user.firstName[0].toUpperCase() : user.email?.[0].toUpperCase()}
                </button>
                {userOpen && (
                  <div className="p-panel p-udrop" style={{minWidth:"unset"}}>
                    <div className="p-udrop-head">
                      <div className="p-udrop-ava">
                        {user.firstName ? user.firstName[0].toUpperCase() : user.email?.[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="p-udrop-name">
                          {user.firstName ? `${user.firstName} ${user.lastName||""}`.trim() : user.email}
                        </div>
                        <div className="p-udrop-email">{user.email}</div>
                      </div>
                    </div>
                    {plan && (
                      <div className="p-udrop-plan">
                        <div className="p-udrop-pdot" style={{background:plan.color}}/>
                        <span className="p-udrop-ptxt">{plan.label}</span>
                        <span className="p-udrop-pst">actif</span>
                      </div>
                    )}
                    <div className="p-ustats">
                      {[
                        {ico:"❤️", val:favorites.length, lbl:"Favoris",   path:"/favorites"},
                        {ico:"🛍️", val:cart.length,      lbl:"Panier",    path:"/cart"},
                        {ico:"📦", val:"—",              lbl:"Commandes", path:"/profile?tab=orders"},
                      ].map(s => (
                        <button key={s.lbl} className="p-ustat"
                          onClick={() => { navigate(s.path); setUserOpen(false); }}>
                          <span className="p-ustat__ico">{s.ico}</span>
                          <span className="p-ustat__n">{s.val}</span>
                          <span className="p-ustat__l">{s.lbl}</span>
                        </button>
                      ))}
                    </div>
                    <div className="p-ulinks">
                      {[
                        {ico:"👤", lbl:"Mon profil",    path:"/profile"},
                        {ico:"❤️", lbl:"Mes favoris",   path:"/favorites",  cnt:favorites.length||null},
                        {ico:"🛍️", lbl:"Mon panier",    path:"/cart",       cnt:cart.length||null},
                        {ico:"📦", lbl:"Mes commandes", path:"/profile?tab=orders"},
                        {ico:"⭐", lbl:subscription?"Mon abonnement":"S'abonner", path:subscription?"/profile?tab=subscription":"/subscription"},
                        {ico:"⚙️", lbl:"Paramètres",    path:"/settings"},
                      ].map(item => (
                        <button key={item.path} className="p-ulink"
                          onClick={() => { navigate(item.path); setUserOpen(false); }}>
                          <span className="p-ulink__ico">{item.ico}</span>
                          {item.lbl}
                          {item.cnt
                            ? <span className="p-ulink__cnt">{item.cnt}</span>
                            : <span style={{marginLeft:"auto",opacity:.2,display:"flex"}}><Ic.Arrow /></span>
                          }
                        </button>
                      ))}
                    </div>
                    <div className="p-udiv"/>
                    <button className="p-ulogout"
                      onClick={() => { logout(); setUserOpen(false); navigate("/login"); }}>
                      <Ic.Logout /> Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-login-btn">
                <Ic.Login /> Connexion
              </Link>
            )}
          </div>
        </div>

        {/* ── BARRE NAV ── */}
        <div className="p-nav-bar">
          <Link to="/home" className={`p-nl${isActive("/home") ? " p-nl--on" : ""}`}>Accueil</Link>

          <button
            className={`p-nl${mega==="Bibliothèque" ? " p-nl--open" : ""}${isActive("/library") ? " p-nl--on" : ""}`}
            onMouseEnter={() => openMega("Bibliothèque")}
            onMouseLeave={closeMega}
            onClick={() => navigate("/library")}
          >
            Bibliothèque
            <span className="p-nl__chev"><Ic.Chev /></span>
          </button>

          <button
            className={`p-nl${mega==="Abonnements" ? " p-nl--open" : ""}${isActive("/subscription") ? " p-nl--on" : ""}`}
            onMouseEnter={() => openMega("Abonnements")}
            onMouseLeave={closeMega}
            onClick={() => navigate("/subscription")}
          >
            Abonnements
            {!subscription && <span className="p-nl__dot"/>}
            <span className="p-nl__chev"><Ic.Chev /></span>
          </button>
        </div>

        {/* ── MEGA MENUS ── */}
        {mega && MEGA[mega] && (
          <div
            className="p-mega"
            style={{ top: megaTop }}
            onMouseEnter={() => clearTimeout(megaTimer.current)}
            onMouseLeave={closeMega}
          >
            <div className="p-mega-inner">
              {MEGA[mega].cols.map(col => (
                <div key={col.head} className="p-mega-col">
                  <div className="p-mega-head">{col.head}</div>
                  {col.items.map(item => (
                    <button key={item.label} className="p-mega-link"
                      onClick={() => { navigate(item.path); setMega(null); }}>
                      <span className="p-mega-link__l">{item.label}</span>
                      <span className="p-mega-link__r">{item.hint}</span>
                    </button>
                  ))}
                </div>
              ))}

              {/* Encart featured */}
              {(() => {
                const f = MEGA[mega].featured;
                return (
                  <div className="p-mega-feat" onClick={() => { navigate(f.path); setMega(null); }}>
                    <div className="p-mega-feat__img">
                      <span className="p-mega-feat__label">❧</span>
                    </div>
                    <div className="p-mega-feat__body">
                      <div className="p-mega-feat__t">{f.title}</div>
                      <div className="p-mega-feat__s">{f.sub}</div>
                      <div className="p-mega-feat__cta">Découvrir <Ic.Arrow /></div>
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