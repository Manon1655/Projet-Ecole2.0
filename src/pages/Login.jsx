import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Tous les champs sont requis");
      return;
    }

    login({ email, username: email.split("@")[0] });
    navigate("/home");
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Connexion</h1>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            Se connecter
          </button>
        </form>
        <p>
          Pas de compte? <Link to="/register">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}