import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/checkout.css";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price),
    0
  );

  const handlePayment = () => {
    if (cart.length === 0) return;

    setLoading(true);

    setTimeout(() => {
      clearCart(); // 🔥 vide le panier + localStorage
      navigate("/order-confirmation");
    }, 1500);
  };

  return (
    <div className="checkout-wrapper">
      <div className="checkout-card">
        
        {/* FORMULAIRE */}
        <div className="checkout-form">
          <h2>🔒 Paiement sécurisé</h2>

          <div className="card-logos">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>CB</span>
          </div> 
          <div className="form-group">
  <label>Nom complet</label>
    <input type="text" placeholder="Jean Dupont" required />
  </div>

  <div className="form-group">
    <label>Email</label>
    <input type="email" placeholder="email@exemple.com" required />
  </div>

  <div className="form-group">
    <label>Numéro de carte</label>
    <input type="text" placeholder="1234 5678 9012 3456" required />
  </div>

          <div className="card-row">
    <div className="form-group">
      <label>Expiration</label>
            <input type="text" placeholder="MM/AA" required />
    </div>

    <div className="form-group">
      <label>CVC</label>
      <input type="text" placeholder="123" required />
    </div>
          </div>

          <button
            className="btn-pay"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? "Traitement..." : `Payer ${total.toFixed(2)}€`}
          </button>

          {/* INFO BOX placée au bon endroit */}
          <div className="info-box">
            <p>📦 Livraison estimée : 2-3 jours ouvrés</p>  
            <p>🔒 Paiement 100% sécurisé</p>
            <p>↩ Retour gratuit sous 30 jours</p>
          </div>
        </div>

        {/* RÉSUMÉ */}
        <div className="checkout-summary">
  <h3>Résumé de commande</h3>

  {cart.map(item => (
    <div key={item.id} className="summary-item">
      <span>{item.title}</span>
      <span>{Number(item.price).toFixed(2)}€</span>
    </div>
  ))}

  <div className="summary-divider"></div>

  <div className="summary-total">
    <span>Total</span>
    <span>{total.toFixed(2)}€</span>
  </div>
</div>

      </div>
    </div>
  );
}