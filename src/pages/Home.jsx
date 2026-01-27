import { useNavigate } from "react-router-dom";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import books from "../data/books";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite } = useCart();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [carouselIndex, setCarouselIndex] = React.useState(0);

  const recommendations = books.filter(b => b.isBestseller).slice(0, 4);
  const carouselBooks = books.slice(0, Math.max(8, books.length));
  const booksToShow = carouselBooks.slice(carouselIndex, carouselIndex + 4);

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      navigate(`/library?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  const handleFavoriteClick = (e, book) => {
    e.stopPropagation();
    if (isFavorite(book.id)) {
      removeFromFavorites(book.id);
    } else {
      addToFavorites(book);
    }
  };

  const handleCardClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleNextCarousel = () => {
    if (carouselIndex + 4 < carouselBooks.length) {
      setCarouselIndex(carouselIndex + 4);
    } else {
      navigate('/library');
    }
  };

  const renderStars = (rating) => {
    return "★".repeat(Math.floor(rating)) + (rating % 1 !== 0 ? "½" : "");
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="home-hero">
        <h1>L'univers des livres en harmonie avec la nature</h1>
        <p>Explorez notre collection de livres soigneusement cultivés comme un jardin littéraire...</p>
      </div>

      {/* Nos recommandations */}
      <section className="recommendations-section">
        <h2>Nos recommandations</h2>
        <div className="books-carousel">
          {recommendations.map((book) => (
            <div key={book.id} className="book-card-wrapper" onClick={() => handleCardClick(book.id)} style={{cursor: 'pointer'}}>
              <div className="book-card-container">
                <div className="book-image-container">
                  {book.isBestseller && <span className="bestseller-badge">Best-seller</span>}
                  <button
                    className={`heart-btn ${isFavorite(book.id) ? 'active' : ''}`}
                    onClick={(e) => handleFavoriteClick(e, book)}
                    title="Ajouter aux favoris"
                  >
                    ❤️
                  </button>
                  <img src={book.cover} alt={book.title} className="book-image" />
                </div>
                <div className="book-info">
                  <span className="category-badge">{book.category}</span>
                  <h3>{book.title}</h3>
                  <p className="author">{book.author}</p>
                  <div className="rating">
                    <span className="stars">{renderStars(book.rating)}</span>
                    <span className="reviews">({book.reviews.toLocaleString()} avis)</span>
                  </div>
                  <div className="price-section">
                    {book.originalPrice > book.price && (
                      <span className="original-price">{book.originalPrice.toFixed(2)}€</span>
                    )}
                    <span className="price">{book.price.toFixed(2)}€</span>
                  </div>
                  <button 
                    className="btn-buy"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(book);
                    }}
                  >
                    Acheter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nos livres */}
      <section className="books-section">
        <h2>Nos livres</h2>
        <p className="books-count">{books.length} livres dans notre collection</p>
        <div className="carousel-container">
          <button className="carousel-arrow carousel-arrow-left" disabled={carouselIndex === 0}></button>
          <div className="books-grid carousel-grid">
            {booksToShow.map((book) => (
              <div key={book.id} className="book-card-wrapper" onClick={() => handleCardClick(book.id)} style={{cursor: 'pointer'}}>
                <div className="book-card-container">
                  <div className="book-image-container">
                    {book.isBestseller && <span className="bestseller-badge">Best-seller</span>}
                    <button
                      className={`heart-btn ${isFavorite(book.id) ? 'active' : ''}`}
                      onClick={(e) => handleFavoriteClick(e, book)}
                      title="Ajouter aux favoris"
                    >
                      ❤️
                    </button>
                    <img src={book.cover} alt={book.title} className="book-image" />
                  </div>
                  <div className="book-info">
                    <span className="category-badge">{book.category}</span>
                    <h3>{book.title}</h3>
                    <p className="author">{book.author}</p>
                    <div className="rating">
                      <span className="stars">{renderStars(book.rating)}</span>
                      <span className="reviews">({book.reviews.toLocaleString()})</span>
                    </div>
                    <div className="price-section">
                      {book.originalPrice > book.price && (
                        <span className="original-price">{book.originalPrice.toFixed(2)}€</span>
                      )}
                      <span className="price">{book.price.toFixed(2)}€</span>
                    </div>
                    <button 
                      className="btn-buy"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(book);
                      }}
                    >
                      Acheter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="carousel-arrow carousel-arrow-right" onClick={handleNextCarousel} title={carouselIndex + 4 >= carouselBooks.length ? "Voir tous les livres" : "Voir plus"}></button>
        </div>
      </section>
    </div>
  );
}