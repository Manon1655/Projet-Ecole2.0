import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/books.css";

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h1>Votre panier est vide</h1>
        <p>Ajoutez des livres pour commencer votre lecture 📚</p>
        <button
          onClick={() => navigate("/library")}
          className="btn-primary"
        >
          Explorer la bibliothèque
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1 className="cart-title">
        Panier ({cart.length} article{cart.length > 1 ? "s" : ""})
      </h1>

      <div className="cart-layout">
        {/* LISTE PRODUITS */}
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-card">
              <img
                src={item.cover || "https://via.placeholder.com/100x150"}
                alt={item.title}
                className="cart-image"
              />

              <div className="cart-info">
                <h3>{item.title}</h3>
                <p className="author">{item.author}</p>
                <p className="price">{item.price.toFixed(2)}€</p>
              </div>

              <div className="cart-quantity">
                <button
                  onClick={() =>
                    updateCartQuantity(item.id, item.quantity - 1)
                  }
                >
                  −
                </button>

                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) =>
                    updateCartQuantity(
                      item.id,
                      parseInt(e.target.value) || 1
                    )
                  }
                />

                <button
                  onClick={() =>
                    updateCartQuantity(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>
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

          <button className="btn-checkout">
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
