import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import { useCart } from "../context/CartContext";
import { useSubscription } from "../context/SubscriptionContext";
import Comments from "../components/Comments";
import books from "../data/books";
import "../styles/book.css";

export default function Book() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { subscription } = useSubscription();
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  
  const book = books.find((b) => b.id === parseInt(id));

  if (!book) {
    return (
      <div className="book-container">
        <h1>Livre non trouvé</h1>
        <button onClick={() => navigate("/library")}>Retour à la bibliothèque</button>
      </div>
    );
  }

  const previewPages = book.preview || [];
  const canReadMore = subscription && subscription.plan;

  const handleNextPage = () => {
    if (currentPageIndex < previewPages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const renderStars = (rating) => {
    return "★".repeat(Math.floor(rating)) + (rating % 1 !== 0 ? "½" : "");
  };

  return (
    <div className="book-container">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Retour
      </button>
      
      <div className="book-detail-content">
        <div className="book-detail-left">
          <img src={book.cover} alt={book.title} className="book-cover" />
          <button 
            className="btn-add-cart"
            onClick={() => addToCart(book)}
          >
            🛒 Ajouter au panier
          </button>
        </div>

        <div className="book-detail-right">
          <h1>{book.title}</h1>
          <p className="author">Par {book.author}</p>
          
          <div className="rating-detail">
            <span className="stars">{renderStars(book.rating)}</span>
            <span className="rating-text">({book.reviews.toLocaleString()} avis)</span>
          </div>

          <div className="price-detail">
            {book.originalPrice > book.price && (
              <span className="original-price">{book.originalPrice.toFixed(2)}€</span>
            )}
            <span className="price-large">{book.price.toFixed(2)}€</span>
          </div>

          <div className="book-meta">
            <div className="meta-item">
              <strong>Catégorie:</strong> {book.category}
            </div>
            <div className="meta-item">
              <strong>Description:</strong> {book.description}
            </div>
          </div>

          <div className="subscription-cta">
            {!canReadMore && (
              <p className="subscription-note">
                💡 Pour continuer à lire après l'aperçu, vous devez souscrire à un abonnement
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Preview Pages Section */}
      <section className="preview-section">
        <h2>Aperçu du livre</h2>
        {previewPages.length > 0 ? (
          <div className="preview-container">
            <div className="page-display">
              <div className="page-header">
                <h3>{previewPages[currentPageIndex].title || `Chapitre ${currentPageIndex + 1}`}</h3>
              </div>
              <div className="page-content">
                {previewPages[currentPageIndex].content}
              </div>
              
              {!canReadMore && currentPageIndex === previewPages.length - 1 && (
                <div className="upgrade-banner">
                  <p>Vous avez atteint la fin de l'aperçu gratuit</p>
                  <button 
                    className="btn-subscribe"
                    onClick={() => navigate("/profile")}
                  >
                    S'abonner pour continuer la lecture
                  </button>
                </div>
              )}
            </div>

            <div className="page-controls">
              <button 
                className="btn-page-nav"
                onClick={handlePrevPage}
                disabled={currentPageIndex === 0}
              >
                ← Précédent
              </button>
              
              <span className="page-indicator">
                Chapitre {currentPageIndex + 1} / {previewPages.length}
              </span>
              
              <button 
                className="btn-page-nav"
                onClick={handleNextPage}
                disabled={currentPageIndex === previewPages.length - 1}
              >
                Suivant →
              </button>
            </div>
          </div>
        ) : (
          <p className="no-preview">Aucun aperçu disponible pour ce livre</p>
        )}
      </section>

      {/* Comments Section */}
      <Comments bookId={book.id} />
    </div>
  );
}