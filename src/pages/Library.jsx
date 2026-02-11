import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import booksData from "../data/books";
import "../styles/library.css";

const API_BASE = "http://localhost:8080/api";

/* ===============================
   LISTE DES GENRES
================================= */
const GENRES = [
  "Fiction",
  "Science-Fiction",
  "Fantasy",
  "Thriller",
  "Romance",
  "Historique",
  "Biographie",
  "Développement personnel",
  "Philosophie",
  "Jeunesse",
  "Manga",
  "Poésie",
  "Autre"
];

export default function Library() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const [filteredBooks, setFilteredBooks] = useState(booksData);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    price: 0,
    rating: 5,
    publicationDate: null,
    coverImage: "",
  });

  const categoryFilter = searchParams.get("category");

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const filtered = booksData.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !categoryFilter || book.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });

    setFilteredBooks(filtered);
  }, [searchTerm, categoryFilter]);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_BASE}/books`);
      if (response.ok) {
        const data = await response.json();
        console.log("Livres depuis API:", data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des livres:", error);
    }
  };

  const handleImportBooks = async () => {
    setLoading(true);
    try {
      const booksToImport = booksData.map((book) => ({
        title: book.title,
        author: book.author,
        description: book.description,
        genre: book.category,
        price: book.price,
        rating: Math.round(book.rating),
        publicationDate: new Date().toISOString().split("T")[0],
        coverImage: book.cover,
      }));

      const response = await fetch(`${API_BASE}/books/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booksToImport),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`✅ ${result.count} livres importés avec succès !`);
        setShowSettings(false);
      } else {
        alert("❌ Erreur lors de l'import");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("❌ Erreur lors de l'import");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBookChange = (e) => {
    const { name, value } = e.target;

    setNewBook((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "rating"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleAddBookSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        const savedBook = await response.json();

        setFilteredBooks((prev) => [
          ...prev,
          { ...savedBook, category: newBook.genre },
        ]);

        setShowAddBookModal(false);

        setNewBook({
          title: "",
          author: "",
          description: "",
          genre: "",
          price: 0,
          rating: 5,
          publicationDate: null,
          coverImage: "",
        });

        alert("✅ Livre ajouté avec succès !");
      } else {
        alert("❌ Erreur lors de l'ajout");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("❌ Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="library-container">
      <div className="library-header">
        <h1>{categoryFilter ? categoryFilter : "Bibliothèque"}</h1>

        <div className="header-buttons">
          <button
            onClick={() => setShowAddBookModal(true)}
            className="btn-add-book"
          >
            + Ajouter un livre
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="btn-settings"
            title="Paramètres"
          >
            ⚙️
          </button>
        </div>
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

      {/* ===============================
         MODAL AJOUT LIVRE
      ================================= */}

      {showAddBookModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAddBookModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
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
                    placeholder="Entrez le titre"
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
                  <select
                    name="genre"
                    value={newBook.genre}
                    onChange={handleAddBookChange}
                    required
                  >
                    <option value="">-- Sélectionnez un genre --</option>
                    {GENRES.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
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
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={newBook.description}
                  onChange={handleAddBookChange}
                  rows="4"
                  placeholder="Décrivez le livre..."
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
