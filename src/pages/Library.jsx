import { useState } from "react";
import BookCard from "../components/BookCard";
import books from "../data/books";
import "../styles/library.css";

export default function Library() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="library-container">
      <h1>Bibliothèque</h1>
      <input
        type="text"
        placeholder="Rechercher un livre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="books-grid">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}