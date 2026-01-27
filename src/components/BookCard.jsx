import { Link } from "react-router-dom";
import "../styles/bookcard.css";

export default function BookCard({ book }) {
  const renderStars = (rating) => {
    return "★".repeat(Math.floor(rating)) + (rating % 1 !== 0 ? "½" : "");
  };

  return (
    <Link to={`/book/${book.id}`} className="book-card">
      <div className="card-image-container">
        <img src={book.cover} alt={book.title} className="book-card-image" />
        {book.isBestseller && <span className="badge-bestseller">Bestseller</span>}
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{book.title}</h3>
        <p className="card-author">{book.author}</p>
        
        <div className="card-rating">
          <span className="stars">{renderStars(book.rating)}</span>
          <span className="review-count">({book.reviews})</span>
        </div>

        <p className="card-category">{book.category}</p>

        <div className="card-footer">
          <span className="card-price">{book.price.toFixed(2)}€</span>
          <button className="card-btn">Consulter</button>
        </div>
      </div>
    </Link>
  );
}