import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import "../styles/profile.css";

const API_BASE = "http://localhost:8080";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: ""
  });

  /* ===============================
     CHARGEMENT PROFIL
  ================================= */

  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user]);

  const fetchProfile = async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/auth/user/${userId}`);
      if (response.ok) {
        const data = await response.json();

        setProfileData(data);

        setFormData({
          prenom: data.prenom || "",
          nom: data.nom || "",
          email: data.email || ""
        });
      }
    } catch (error) {
      console.error("Erreur chargement profil :", error);
    }
  };

  if (!user) {
    return (
      <div className="profile-container">
        <h1>Vous devez être connecté</h1>
        <button onClick={() => navigate("/login")} className="btn-primary">
          Aller à la connexion
        </button>
      </div>
    );
  }

  /* ===============================
     LOGOUT
  ================================= */

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  /* ===============================
     HANDLE CHANGE
  ================================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">

        <div className="profile-header">
          <div className="profile-main-info">
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  placeholder="Prénom"
                  className="input-field"
                />
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  placeholder="Nom"
                  className="input-field"
                />
              </>
            ) : (
              <h1>
                {profileData?.prenom} {profileData?.nom}
              </h1>
            )}
            <p className="username">@{profileData?.email}</p>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-group">
            <h3>Informations</h3>

            {isEditing ? (
              <>
                <label>Email :</label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="input-field"
                />
              </>
            ) : (
              <p>
                <strong>Email :</strong> {profileData?.email}
              </p>
            )}
          </div>
        </div>

        <div className="profile-actions">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Modifier
              </button>

              <button
                onClick={handleLogout}
                className="btn-logout"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="btn-cancel"
            >
              Annuler
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
