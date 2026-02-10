import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import books from "../data/books";
import "../styles/library.css";

const API_BASE = "http://localhost:8080/api";

export default function Library() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    price: 0,
    rating: 5,
    publicationDate: "",
    coverImage: "",
  });
  const [loading, setLoading] = useState(false);

  const categoryFilter = searchParams.get("category");

  useEffect(() => {
    // Charger les livres depuis l'API
    fetchBooks();
  }, []);

  useEffect(() => {
    // Filtrer les livres localement
    const filtered = books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || book.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
    setFilteredBooks(filtered);
  }, [searchTerm, categoryFilter]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE}/books`);
      if (response.ok) {
        const data = await response.json();
        // Fusionner avec les livres locaux si l'API retourne des données
        console.log("Livres depuis API:", data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des livres:", error);
    }
  };

  const handleAddBookChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({
      ...prev,
      [name]: name === "price" || name === "rating" ? parseFloat(value) : value,
    }));
  };

  const handleAddBookSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        const savedBook = await response.json();
        // Ajouter le livre à la liste locale
        setFilteredBooks((prev) => [
          ...prev,
          {
            ...savedBook,
            category: newBook.genre,
          },
        ]);
        setShowAddBookModal(false);
        setNewBook({
          title: "",
          author: "",
          description: "",
          genre: "",
          price: 0,
          rating: 5,
          publicationDate: "",
          coverImage: "",
        });
        alert("Livre ajouté avec succès!");
      } else {
        alert("Erreur lors de l'ajout du livre");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'ajout du livre");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="library-container">
      <div className="library-header">
        <h1>{categoryFilter ? `${categoryFilter}` : "Bibliothèque"}</h1>
        <button
          onClick={() => setShowAddBookModal(true)}
          className="btn-add-book"
        >
          + Ajouter un livre
        </button>
      </div>

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

      {/* Modal d'ajout de livre */}
      {showAddBookModal && (
        <div className="modal-overlay" onClick={() => setShowAddBookModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ajouter un nouveau livre</h2>
              <button
                className="close-btn"
                onClick={() => setShowAddBookModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBookSubmit} className="add-book-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Titre *</label>
                  <input
                    type="text"
                    name="title"
                    value={newBook.title}
                    onChange={handleAddBookChange}
                    required
                    placeholder="Entrez le titre du livre"
                  />
                </div>
                <div className="form-group">
                  <label>Auteur *</label>
                  <input
                    type="text"
                    name="author"
                    value={newBook.author}
                    onChange={handleAddBookChange}
                    required
                    placeholder="Entrez l'auteur"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Genre *</label>
                  <input
                    type="text"
                    name="genre"
                    value={newBook.genre}
                    onChange={handleAddBookChange}
                    required
                    placeholder="ex: Fiction, Sci-Fi, etc."
                  />
                </div>
                <div className="form-group">
                  <label>Date de publication</label>
                  <input
                    type="date"
                    name="publicationDate"
                    value={newBook.publicationDate}
                    onChange={handleAddBookChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Prix (€)</label>
                  <input
                    type="number"
                    name="price"
                    value={newBook.price}
                    onChange={handleAddBookChange}
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>Note (0-5)</label>
                  <input
                    type="number"
                    name="rating"
                    value={newBook.rating}
                    onChange={handleAddBookChange}
                    min="0"
                    max="5"
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={newBook.description}
                  onChange={handleAddBookChange}
                  placeholder="Décrivez le livre..."
                  rows="4"
                ></textarea>
              </div>

              <div className="form-group full-width">
                <label>URL de la couverture</label>
                <input
                  type="url"
                  name="coverImage"
                  value={newBook.coverImage}
                  onChange={handleAddBookChange}
                  placeholder="https://..."
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={loading}
                >
                  {loading ? "Ajout en cours..." : "Ajouter le livre"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddBookModal(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}