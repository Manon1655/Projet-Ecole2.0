import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
import "../styles/library.css";

export default function Favorites() {
  const { favorites } = useCart();
  const navigate = useNavigate();

  if (favorites.length === 0) {
    return (
      <div className="library-container empty-state">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          className="empty-icon"
        >
          <path
            fill="#A8DDB5"
            d="M16 18h32l-4 24H20z"
          />
          <circle cx="23" cy="50" r="4" fill="#1F4037" />
          <circle cx="41" cy="50" r="4" fill="#1F4037" />
        </svg>
        <h1>Mes Favoris</h1>
        <p>Vous n'avez aucun livre en favoris</p>
        <button onClick={() => navigate("/library")} className="btn-primary">
          Découvrir la bibliothèque
        </button>
      </div>
    );
  }

  return (
    <div className="library-container">
      <h1>Mes Favoris ({favorites.length} livre{favorites.length > 1 ? 's' : ''})</h1>
      
      <div className="books-grid">
        {favorites.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
