import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/profile.css";

const API = "http://localhost:8080";

export default function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  /* =========================
     FETCH ALL DATA
  ========================= */

  const fetchAllData = useCallback(async () => {
    if (!user?.id) return;

    try {
      const [
        profileRes,
        booksRes,
        ordersRes,
        favoritesRes,
        cartRes,
      ] = await Promise.all([
        fetch(`${API}/auth/user/${user.id}`),
        fetch(`${API}/auth/user/${user.id}/books`),
        fetch(`${API}/auth/user/${user.id}/orders`),
        fetch(`${API}/auth/user/${user.id}/favorites`),
        fetch(`${API}/auth/user/${user.id}/cart`),
      ]);

      const profileData = await profileRes.json();

      setProfile(profileData);
      setBio(profileData.bio || "");
      setBooks(await booksRes.json());
      setOrders(await ordersRes.json());
      setFavorites(await favoritesRes.json());
      setCart(await cartRes.json());
    } catch (err) {
      console.error("Erreur chargement profil:", err);
    }
  }, [user]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  

  /* =========================
     SAVE BIO
  ========================= */

  const saveBio = async () => {
    try {
      await fetch(`${API}/auth/user/${user.id}/bio`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio }),
      });

      setProfile((prev) => ({ ...prev, bio }));
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     PHOTO
  ========================= */

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch(`${API}/auth/user/${user.id}/photo`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setProfile((prev) => ({
        ...prev,
        profile_picture: data.photo,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  /* =========================
     FAVORITES
  ========================= */

  const removeFavorite = async (bookId) => {
    try {
      await fetch(`${API}/auth/user/${user.id}/favorites/${bookId}`, {
        method: "DELETE",
      });

      setFavorites((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) {
    return <div className="profile-loading">Chargement...</div>;
  }

  return (
    <div className="profile-dashboard">
      {/* HERO */}
      <div className="profile-hero">
        <div className="avatar-wrapper">
          {profile.profile_picture ? (
            <img
              src={`${API}${profile.profile_picture}`}
              alt="Profil"
              className="profile-image"
            />
          ) : (
            <div className="avatar">
              {profile.first_name?.[0] || profile.username?.[0]}
            </div>
          )}

          <label className="edit-avatar">
            ✏️
            <input type="file" onChange={handlePhotoChange} hidden />
          </label>
        </div>

        <div className="hero-info">
          <h1>{profile.first_name || profile.username}</h1>
          <p>@{profile.username}</p>
          <span>{profile.email}</span>
          {profile.subscription && (
  <div className="subscription-badge">
    Abonnement : <strong>{profile.subscription.name}</strong>
    {profile.subscription.status === "active" ? " ✅" : " ❌"}
  </div>
)}

        </div>

        <div className="profile-stats">
          <div>
            <strong>{books.length}</strong>
            <span>Livres</span>
          </div>
          <div>
            <strong>{favorites.length}</strong>
            <span>Favoris</span>
          </div>
          <div>
            <strong>{orders.length}</strong>
            <span>Commandes</span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="profile-body">
        <div className="profile-sidebar">
          <button onClick={() => setActiveTab("overview")}>
            Vue générale
          </button>
          <button onClick={() => setActiveTab("favorites")}>
            Favoris
          </button>
          <button onClick={() => setActiveTab("cart")}>
            Panier
          </button>
          <button onClick={() => setActiveTab("orders")}>
            Commandes
          </button>
        </div>

        <div className="profile-content">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <>
              <div className="profile-card">
                <h2>Ma bio</h2>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Parle un peu de toi..."
                />
                <button onClick={saveBio}>Enregistrer</button>
              </div>

              <div className="profile-card">
                <h2>Livres en cours</h2>
                {books.length === 0 ? (
                  <p>Aucun livre en cours.</p>
                ) : (
                  books.map((book) => (
                    <div key={book.id} className="book-progress">
                      <span>{book.title}</span>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${book.progress}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* FAVORITES */}
          {activeTab === "favorites" && (
            <div className="profile-card">
              <h2>Mes favoris</h2>

              {favorites.length === 0 ? (
                <p>Aucun favori.</p>
              ) : (
                favorites.map((book) => (
                  <div key={book.id} className="favorite-card">
                    <div key={book.id} className="favorite-card">
  {book.cover && (
    <img
      src={`${API}${book.cover}`}
      alt={book.title}
      className="favorite-cover"
    />
  )}

  <div>
    <h4>{book.title}</h4>
    <p>{book.author}</p>
  </div>

  <button onClick={() => removeFavorite(book.id)}>
    Retirer
  </button>
</div>
                    
                    <button onClick={() => removeFavorite(book.id)}>
                      Retirer
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* CART */}
          {activeTab === "cart" && (
            <div className="profile-card">
              <h2>Mon panier</h2>
              {cart.length === 0 ? (
                <p>Panier vide.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id}>
                    {item.title} - {item.price}€
                  </div>
                ))
              )}
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div className="profile-card">
              <h2>Mes commandes</h2>
              {orders.length === 0 ? (
                <p>Aucune commande.</p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <span>Commande #{order.id}</span>
                    <span>{order.total} €</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
