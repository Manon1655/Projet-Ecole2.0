import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
import "../styles/library.css";

export default function Favorites() {
  const { favorites } = useCart();
  const navigate = useNavigate();

  if (favorites.length === 0) {
    return (
      <div className="library-container">
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
