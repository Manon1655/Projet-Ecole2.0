import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/books.css";

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="books-container">
        <h1>Panier</h1>
        <p>Votre panier est vide</p>
        <button onClick={() => navigate("/library")} className="btn-primary">
          Continuer les achats
        </button>
      </div>
    );
  }

  return (
    <div className="books-container">
      <h1>Panier ({cart.length} article{cart.length > 1 ? 's' : ''})</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <img src={item.cover || "https://via.placeholder.com/100x150"} alt={item.title} />
              </div>
              
              <div className="cart-item-details">
                <h3>{item.title}</h3>
                <p className="author">{item.author}</p>
                <p className="price">{item.price}€</p>
              </div>

              <div className="cart-item-quantity">
                <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>-</button>
                <input 
                  type="number" 
                  value={item.quantity}
                  onChange={(e) => updateCartQuantity(item.id, parseInt(e.target.value) || 1)}
                  min="1"
                />
                <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</button>
              </div>

              <div className="cart-item-total">
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

        <div className="cart-summary">
          <h2>Résumé</h2>
          <div className="summary-row">
            <span>Sous-total:</span>
            <span>{total.toFixed(2)}€</span>
          </div>
          <div className="summary-row">
            <span>Livraison:</span>
            <span>Gratuite</span>
          </div>
          <div className="summary-total">
            <span>Total:</span>
            <span>{total.toFixed(2)}€</span>
          </div>
          <button className="btn-checkout">Procéder au paiement</button>
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
