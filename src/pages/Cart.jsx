import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/books.css";

export default function Cart() {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  /* ===============================
     CALCUL TOTAL
  ================================= */

  // without quantity support just sum prices and count items
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  const totalItems = cart.length;

  /* ===============================
     PANIER VIDE
  ================================= */

  if (cart.length === 0) {
    return (
      <div className="empty-state">
        {/* simple svg icon for empty cart */}
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
        <h1>Votre panier est vide</h1>
        <p>Ajoutez des livres pour commencer 📚</p>
        <button
          onClick={() => navigate("/library")}
          className="btn-primary"
        >
          Explorer la bibliothèque
        </button>
      </div>
    );
  }

  /* ===============================
     AFFICHAGE PANIER
  ================================= */

  return (
    <div className="cart-container">
      <h1 className="cart-title">
        Panier ({totalItems} article{totalItems > 1 ? "s" : ""})
      </h1>

      <div className="cart-layout">
        {/* LISTE DES PRODUITS */}
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-card">
              <img
                src={
                  item.cover ||
                  "https://via.placeholder.com/100x150"
                }
                alt={item.title}
                className="cart-image"
              />

              <div className="cart-info">
                <h3>{item.title}</h3>
                <p className="author">{item.author}</p>
                <p className="price">
                  {Number(item.price).toFixed(2)}€
                </p>
              </div>

              {/* quantity controls removed, always one copy per book */}
              <div className="cart-quantity">
                <span>1</span>
              </div>

              <div className="cart-total">
                {(item.price * item.quantity).toFixed(2)}€
              </div>

              <button
                className="btn-remove"
                onClick={() => removeFromCart(item.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* RÉSUMÉ */}
        <div className="cart-summary">
          <h2>Résumé de commande</h2>

          <div className="summary-row">
            <span>Sous-total</span>
            <span>{total.toFixed(2)}€</span>
          </div>

          <div className="summary-row">
            <span>Livraison</span>
            <span>Gratuite</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>{total.toFixed(2)}€</span>
          </div>

         <button
  className="btn-checkout"
  onClick={() => navigate("/checkout")}
>
  Procéder au paiement
</button>
          <button
            className="btn-secondary"
            onClick={() => navigate("/library")}
          >
            Continuer les achats
          </button>
        </div>
      </div>
    </div>
  );
}
