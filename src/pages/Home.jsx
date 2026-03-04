import { useNavigate } from "react-router-dom";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import books from "../data/books";
import "../styles/home.css";

/* ─── helpers ─── */
const renderStars = (r = 0) =>
  "★".repeat(Math.floor(r)) + (r % 1 !== 0 ? "½" : "");

const formatPrice = (n) =>
  Number(n).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

/* ─── Mood filters ─── */
const MOODS = [
  { id: "all",       label: "Tout",         icon: "✦" },
  { id: "aventure",  label: "Aventure",     icon: "🧭" },
  { id: "emotion",   label: "Émotion",      icon: "🌧" },
  { id: "evasion",   label: "Évasion",      icon: "🌿" },
  { id: "reflexion", label: "Réflexion",    icon: "🦉" },
  { id: "frisson",   label: "Frissons",     icon: "🌙" },
];

/* Map categories → moods (adapt to your real categories) */
const MOOD_MAP = {
  aventure:  ["Aventure", "Action", "Science-Fiction", "Fantasy"],
  emotion:   ["Roman", "Romance", "Drame", "Jeunesse"],
  evasion:   ["Voyage", "Nature", "BD", "Manga"],
  reflexion: ["Philosophie", "Histoire", "Essai", "Biographie"],
  frisson:   ["Policier", "Thriller", "Horreur", "Mystère"],
};

const getMoodBooks = (mood, bookList) => {
  if (mood === "all") return bookList;
  const cats = MOOD_MAP[mood] || [];
  const filtered = bookList.filter(b => cats.includes(b.category));
  return filtered.length > 0 ? filtered : bookList;
};

/* ─── Testimonials ─── */
const TESTIMONIALS = [
  { name: "Camille R.", text: "Une sélection vraiment soignée, je trouve toujours ma prochaine lecture ici.", stars: 5 },
  { name: "Thomas M.", text: "Interface magnifique, livraison rapide. Ma librairie en ligne préférée.", stars: 5 },
  { name: "Sophie L.", text: "Les coups de cœur sont toujours excellents. Je fais confiance aux recommandations.", stars: 5 },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite } = useCart();

  const [searchQuery, setSearchQuery]   = React.useState("");
  const [activeMood, setActiveMood]     = React.useState("all");
  const [carouselIdx, setCarouselIdx]   = React.useState(0);
  const [addedCart, setAddedCart]       = React.useState({});
  const [testimonialIdx, setTestimonialIdx] = React.useState(0);

  /* ─ derived data ─ */
  const bestsellers  = books.filter(b => b.isBestseller).slice(0, 4);
  const nouveautes   = [...books].reverse().slice(0, 6);          // last added = newest
  const moodBooks    = getMoodBooks(activeMood, books).slice(0, 8);
  const carouselAll  = books;
  const VISIBLE      = 4;
  const pages        = Math.ceil(carouselAll.length / VISIBLE);
  const pageBooks    = carouselAll.slice(carouselIdx * VISIBLE, (carouselIdx + 1) * VISIBLE);
  const categories   = [...new Set(books.map(b => b.category))].sort().slice(0, 8);

  /* ─ handlers ─ */
  const handleSearch = () => {
    if (searchQuery.trim()) navigate(`/library?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const toggleFav = (e, book) => {
    e.stopPropagation();
    isFavorite(book.id) ? removeFromFavorites(book.id) : addToFavorites(book);
  };

  const handleCart = (e, book) => {
    e.stopPropagation();
    addToCart(book);
    setAddedCart(p => ({ ...p, [book.id]: true }));
    setTimeout(() => setAddedCart(p => ({ ...p, [book.id]: false })), 1800);
  };

  /* ─ auto-rotate testimonials ─ */
  React.useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  /* ─ Book card ─ */
  const BookCard = ({ book, size = "normal" }) => (
    <article
      className={`bc ${size === "large" ? "bc--large" : ""}`}
      onClick={() => navigate(`/book/${book.id}`)}
    >
      <div className="bc__img">
        {book.isBestseller && <span className="bc__ribbon">Best-seller</span>}
        <button
          className={`bc__heart ${isFavorite(book.id) ? "bc__heart--on" : ""}`}
          onClick={(e) => toggleFav(e, book)}
          title={isFavorite(book.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          {isFavorite(book.id) ? "❤️" : "🤍"}
        </button>
        <img src={book.cover} alt={book.title} loading="lazy" />
        <div className="bc__shine" />
      </div>

      <div className="bc__body">
        <span className="bc__cat">{book.category}</span>
        <h3 className="bc__title">{book.title}</h3>
        <p  className="bc__author">{book.author}</p>

        {book.rating && (
          <div className="bc__rating">
            <span className="bc__stars">{renderStars(book.rating)}</span>
            <span className="bc__rev">({book.reviews?.toLocaleString()})</span>
          </div>
        )}

        <div className="bc__footer">
          <div className="bc__prices">
            {book.originalPrice > book.price && (
              <s className="bc__old">{formatPrice(book.originalPrice)}</s>
            )}
            <span className="bc__price">{formatPrice(book.price)}</span>
          </div>
          <button
            className={`bc__cart ${addedCart[book.id] ? "bc__cart--ok" : ""}`}
            onClick={(e) => handleCart(e, book)}
            title="Ajouter au panier"
          >
            {addedCart[book.id] ? "✓" : "+"}
          </button>
        </div>
      </div>
    </article>
  );

  return (
    <div className="home">

      {/* ══════════════════════════════════════
          HERO — editorial split
      ══════════════════════════════════════ */}
      <section className="hero">

        {/* left — text */}
        <div className="hero__left">
          <div className="hero__tag">✦ Librairie Ombrelune</div>
          <h1 className="hero__title">
            Des livres choisis<br/>
            <em>avec soin,</em><br/>
            pour vous.
          </h1>
          <p className="hero__sub">
            Chaque titre de notre collection a été sélectionné par des passionnés.
            Trouvez votre prochaine lecture préférée.
          </p>

          <div className="hero__search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Titre, auteur, genre…"
            />
            <button onClick={handleSearch}>Chercher</button>
          </div>

          <div className="hero__chips">
            {categories.slice(0, 5).map(cat => (
              <button key={cat} className="hero__chip" onClick={() => navigate(`/library?category=${cat}`)}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* right — featured book stack */}
        <div className="hero__right">
          <div className="hero__stack">
            {bestsellers.slice(0, 3).map((book, i) => (
              <div
                key={book.id}
                className="hero__stack-book"
                style={{"--i": i}}
                onClick={() => navigate(`/book/${book.id}`)}
              >
                <img src={book.cover} alt={book.title} />
                {i === 0 && (
                  <div className="hero__stack-label">
                    <span>Coup de cœur</span>
                    <strong>{book.title}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hero__stats">
            <div className="hero__stat"><b>{books.length}</b><span>livres</span></div>
            <div className="hero__stat-sep"/>
            <div className="hero__stat"><b>{categories.length}</b><span>genres</span></div>
            <div className="hero__stat-sep"/>
            <div className="hero__stat"><b>4.8★</b><span>moyenne</span></div>
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════
          BANNIÈRE OFFRE ABONNÉ
      ══════════════════════════════════════ */}
      <div className="promo-banner" onClick={() => navigate("/subscription")}>
        <span className="promo-banner__tag">Nouveau</span>
        <p>
          <strong>Abonnement Ombrelune Premium</strong> — Accès illimité, livraison offerte, et -10% sur tous les achats.
        </p>
        <span className="promo-banner__cta">Découvrir →</span>
      </div>

      {/* ══════════════════════════════════════
          NOUVEAUTÉS
      ══════════════════════════════════════ */}
      <section className="section">
        <div className="section__head">
          <div>
            <p className="section__eyebrow">Vient de paraître</p>
            <h2 className="section__title">Nouveautés</h2>
          </div>
          <button className="section__more" onClick={() => navigate("/library")}>Tout voir →</button>
        </div>

        <div className="nouveautes-row">
          {/* Featured — first book large */}
          <div className="nouveaute-featured" onClick={() => navigate(`/book/${nouveautes[0]?.id}`)}>
            <div className="nf__img">
              <img src={nouveautes[0]?.cover} alt={nouveautes[0]?.title} />
              <span className="nf__badge">Nouveau</span>
            </div>
            <div className="nf__body">
              <span className="nf__cat">{nouveautes[0]?.category}</span>
              <h3>{nouveautes[0]?.title}</h3>
              <p>{nouveautes[0]?.author}</p>
              <div className="nf__stars">{renderStars(nouveautes[0]?.rating)}</div>
              <p className="nf__desc">{nouveautes[0]?.description?.slice(0, 140) || "Une nouvelle parution à ne pas manquer dans notre sélection du moment."}…</p>
              <div className="nf__row">
                <span className="nf__price">{formatPrice(nouveautes[0]?.price)}</span>
                <button className="nf__btn" onClick={e => handleCart(e, nouveautes[0])}>
                  Ajouter au panier
                </button>
              </div>
            </div>
          </div>

          {/* Side list */}
          <div className="nouveautes-list">
            {nouveautes.slice(1, 5).map(book => (
              <div key={book.id} className="nl-item" onClick={() => navigate(`/book/${book.id}`)}>
                <img src={book.cover} alt={book.title} className="nl-item__img" />
                <div className="nl-item__info">
                  <span className="nl-item__cat">{book.category}</span>
                  <h4>{book.title}</h4>
                  <p>{book.author}</p>
                  <span className="nl-item__price">{formatPrice(book.price)}</span>
                </div>
                <button
                  className={`nl-item__heart ${isFavorite(book.id) ? "on" : ""}`}
                  onClick={e => toggleFav(e, book)}
                >
                  {isFavorite(book.id) ? "❤️" : "🤍"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HUMEUR DU MOMENT
      ══════════════════════════════════════ */}
      <section className="section section--tinted">
        <div className="section__head">
          <div>
            <p className="section__eyebrow">Sélection personnalisée</p>
            <h2 className="section__title">Quelle est votre humeur ?</h2>
          </div>
        </div>

        <div className="mood-filters">
          {MOODS.map(m => (
            <button
              key={m.id}
              className={`mood-btn ${activeMood === m.id ? "mood-btn--active" : ""}`}
              onClick={() => setActiveMood(m.id)}
            >
              <span>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>

        <div className="mood-grid">
          {moodBooks.slice(0, 4).map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          COUPS DE CŒUR
      ══════════════════════════════════════ */}
      <section className="section">
        <div className="section__head">
          <div>
            <p className="section__eyebrow">Notre sélection</p>
            <h2 className="section__title">Coups de cœur</h2>
          </div>
          <button className="section__more" onClick={() => navigate("/library")}>Tout voir →</button>
        </div>
        <div className="books-grid-4">
          {bestsellers.map(book => <BookCard key={book.id} book={book} />)}
        </div>
      </section>

      {/* ══════════════════════════════════════
          TOUTE LA COLLECTION — carousel
      ══════════════════════════════════════ */}
      <section className="section section--tinted">
        <div className="section__head">
          <div>
            <p className="section__eyebrow">{books.length} titres disponibles</p>
            <h2 className="section__title">Notre collection</h2>
          </div>
          <div className="carousel-controls">
            <button className="carousel-arrow" onClick={() => setCarouselIdx(i => Math.max(0, i - 1))} disabled={carouselIdx === 0}>‹</button>
            <span className="carousel-page">{carouselIdx + 1} / {pages}</span>
            <button className="carousel-arrow" onClick={() => setCarouselIdx(i => i + 1 >= pages ? 0 : i + 1)}>›</button>
          </div>
        </div>

        <div className="books-grid-4">
          {pageBooks.map(book => <BookCard key={book.id} book={book} />)}
        </div>

        <div className="carousel-dots">
          {Array.from({ length: pages }).map((_, i) => (
            <button key={i} className={`cdot ${i === carouselIdx ? "cdot--on" : ""}`} onClick={() => setCarouselIdx(i)} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          TÉMOIGNAGES
      ══════════════════════════════════════ */}
      <section className="section testimonials-section">
        <div className="section__head centered">
          <p className="section__eyebrow">Ils nous font confiance</p>
          <h2 className="section__title">Ce que disent nos lecteurs</h2>
        </div>

        <div className="testimonials-track">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`testimonial-card ${i === testimonialIdx ? "testimonial-card--active" : ""}`}
            >
              <div className="tc__stars">{"★".repeat(t.stars)}</div>
              <p className="tc__text">"{t.text}"</p>
              <span className="tc__name">— {t.name}</span>
            </div>
          ))}
        </div>

        <div className="testimonial-dots">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} className={`cdot ${i === testimonialIdx ? "cdot--on" : ""}`} onClick={() => setTestimonialIdx(i)} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════ */}
      <section className="cta-section">
        <div className="cta-section__inner">
          <p className="section__eyebrow" style={{color:"rgba(255,255,255,0.6)"}}>Rejoignez la communauté</p>
          <h2>Votre prochaine lecture vous attend.</h2>
          <p>Des milliers de titres soigneusement sélectionnés, livrés chez vous en 48h.</p>
          <div className="cta-btns">
            <button onClick={() => navigate("/library")}>Explorer la bibliothèque</button>
            {!user && <button className="cta-outline" onClick={() => navigate("/register")}>Créer un compte gratuit</button>}
          </div>
        </div>
      </section>

    </div>
  );
}