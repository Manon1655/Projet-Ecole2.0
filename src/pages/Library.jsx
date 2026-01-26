import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import books from "../data/books";
import "../styles/library.css";

export default function Library() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="library-container">
      <h1>
        {categoryFilter ? `${categoryFilter}` : "Bibliothèque"}
      </h1>
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