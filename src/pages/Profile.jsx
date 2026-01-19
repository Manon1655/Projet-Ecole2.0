import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/profile.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="profile-container">
        <h1>Vous devez être connecté</h1>
        <button onClick={() => navigate("/login")}>Aller à la connexion</button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1>Mon Profil</h1>
        <div className="profile-info">
          <p><strong>Utilisateur:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Déconnexion
        </button>
      </div>
    </div>
  );
}