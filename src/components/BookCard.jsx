import { Link } from "react-router-dom";
import "../styles/bookcard.css";

export default function BookCard({ book }) {
  return (
    <Link to={`/book/${book.id}`} className="book-card">
      <img src={book.cover} alt={book.title} className="book-card-image" />
      <h3>{book.title}</h3>
      <p className="author">{book.author}</p>
      <p className="price">{book.price}€</p>
    </Link>
  );
}