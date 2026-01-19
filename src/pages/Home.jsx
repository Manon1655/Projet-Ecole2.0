import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>Bienvenue {user ? user.username : "dans la Bibliothèque"}!</h1>
        <p>Découvrez une vaste collection de livres</p>
        <button onClick={() => navigate("/library")} className="btn-primary">
          Parcourir la bibliothèque
        </button>
      </div>
    </div>
  );
}