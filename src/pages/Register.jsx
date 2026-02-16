import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email et mot de passe sont obligatoires");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        username,
        email,
        password,
        firstName,
        lastName
    });

      if (result?.token) {
        navigate("/home");
      } else {
        setError("Erreur lors de l'inscription");
      }

    } catch (err) {
      setError("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>S'inscrire</h1>

        {error && <div className="error">{error}</div>}

          <input
            type="text"
            placeholder="Nom d'utilisateur *"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe *"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Prénom (optionnel)"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Nom (optionnel)"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>

        <p>
          Vous avez un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
