import { useEffect, useState } from "react";
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
  const [subscription, setSubscription] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const [
          profileRes,
          booksRes,
          ordersRes,
          favoritesRes,
          cartRes,
          subscriptionRes
        ] = await Promise.all([
          fetch(`${API}/auth/user/${user.id}`),
          fetch(`${API}/auth/user/${user.id}/books`),
          fetch(`${API}/auth/user/${user.id}/orders`),
          fetch(`${API}/auth/user/${user.id}/favorites`),
          fetch(`${API}/auth/user/${user.id}/cart`),
          fetch(`${API}/auth/user/${user.id}/subscription`)
        ]);

        const profileData = await profileRes.json();
        setProfile(profileData);
        setBio(profileData.bio || "");

        setBooks(await booksRes.json());
        setOrders(await ordersRes.json());
        setFavorites(await favoritesRes.json());
        setCart(await cartRes.json());
        setSubscription(await subscriptionRes.json());

      } catch (err) {
        console.error("Erreur chargement profil:", err);
      }
    };

    fetchData();
  }, [user]);

  const saveBio = async () => {
    try {
      await fetch(`${API}/auth/user/${user.id}/bio`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio })
      });
      alert("Bio enregistrée !");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch(`${API}/auth/user/${user.id}/photo`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      setProfile(prev => ({
        ...prev,
        profile_picture: data.photo
      }));

    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return <div className="profile-loading">Chargement...</div>;

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

          {subscription && (
            <div className="subscription-badge">
              {subscription.name}
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

      <div className="profile-body">

        {/* SIDEBAR */}
        <div className="profile-sidebar">
          <button onClick={() => setActiveTab("overview")}>Vue générale</button>
          <button onClick={() => setActiveTab("favorites")}>Favoris</button>
          <button onClick={() => setActiveTab("cart")}>Panier</button>
          <button onClick={() => setActiveTab("orders")}>Commandes</button>
        </div>

        {/* CONTENT */}
        <div className="profile-content">

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
                  books.map(book => (
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

          {activeTab === "favorites" && (
            <div className="profile-card">
              <h2>Mes favoris</h2>
              {favorites.length === 0
                ? <p>Aucun favori.</p>
                : favorites.map(fav => (
                    <div key={fav.id}>{fav.title}</div>
                  ))
              }
            </div>
          )}

          {activeTab === "cart" && (
            <div className="profile-card">
              <h2>Mon panier</h2>
              {cart.length === 0
                ? <p>Panier vide.</p>
                : cart.map(item => (
                    <div key={item.id}>
                      {item.title} - {item.price}€
                    </div>
                  ))
              }
            </div>
          )}

          {activeTab === "orders" && (
            <div className="profile-card">
              <h2>Mes commandes</h2>
              {orders.length === 0
                ? <p>Aucune commande.</p>
                : orders.map(order => (
                    <div key={order.id} className="order-card">
                      <span>Commande #{order.id}</span>
                      <span>{order.total} €</span>
                    </div>
                  ))
              }
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
