import { useParams, useNavigate } from "react-router-dom";
import books from "../data/books";
import "../styles/book.css";

export default function Book() {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find((b) => b.id === parseInt(id));

  if (!book) {
    return (
      <div className="book-container">
        <h1>Livre non trouvé</h1>
        <button onClick={() => navigate("/library")}>Retour à la bibliothèque</button>
      </div>
    );
  }

  return (
    <div className="book-container">
      <button onClick={() => navigate("/library")} className="back-btn">
        ← Retour
      </button>
      <div className="book-content">
        <img src={book.cover} alt={book.title} className="book-cover" />
        <div className="book-info">
          <h1>{book.title}</h1>
          <p className="author">Par {book.author}</p>
          <p className="description">{book.description}</p>
          <p className="price">{book.price}€</p>
          <button className="btn-primary">Lire le livre</button>
        </div>
      </div>
    </div>
  );
}