import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import "../styles/profile.css";

const API_BASE = "http://localhost:8080/api";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(user || {});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.bio || "",
    profilePicture: user?.profilePicture || "",
  });

  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user?.id]);

  const fetchProfile = async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/auth/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          bio: data.bio || "",
          profilePicture: data.profilePicture || "",
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updated = await response.json();
        setProfileData(updated);
        setIsEditing(false);
        alert("Profil mise à jour avec succès!");
      } else {
        alert("Erreur lors de la mise à jour du profil");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* Section Photo et Infos Principales */}
        <div className="profile-header">
          <div className="profile-picture-wrapper">
            {formData.profilePicture ? (
              <img
                src={formData.profilePicture}
                alt="Photo de profil"
                className="profile-picture"
              />
            ) : (
              <div className="profile-picture-placeholder">
                <span>📸</span>
              </div>
            )}
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="profile-picture-input"
              />
            )}
          </div>

          <div className="profile-main-info">
            <div className="profile-names">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Prénom"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Nom"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </>
              ) : (
                <h1>
                  {profileData.firstName || "Prénom"}{" "}
                  {profileData.lastName || "Nom"}
                </h1>
              )}
            </div>
            <p className="username">@{profileData.username}</p>
          </div>
        </div>

        {/* Section Informations */}
        <div className="profile-details">
          <div className="detail-group">
            <h3>Informations Personnelles</h3>
            {isEditing ? (
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  disabled
                />

                <label>Téléphone:</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Numéro de téléphone"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="input-field"
                />

                <label>Bio:</label>
                <textarea
                  name="bio"
                  placeholder="À propos de vous..."
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="textarea-field"
                  rows="4"
                ></textarea>
              </div>
            ) : (
              <div className="info-display">
                <p>
                  <strong>Email:</strong> {profileData.email}
                </p>
                <p>
                  <strong>Téléphone:</strong>{" "}
                  {profileData.phoneNumber || "Non renseigné"}
                </p>
                <p>
                  <strong>Bio:</strong> {profileData.bio || "Aucune bio"}
                </p>
              </div>
            )}
          </div>

          {/* Section Abonnement */}
          <div className="detail-group subscription-group">
            <h3>Abonnement</h3>
            <div className="subscription-info">
              <div className="subscription-badge">
                {profileData.subscriptionName ? (
                  <>
                    <span className="badge-name">
                      {profileData.subscriptionName}
                    </span>
                    <button
                      onClick={() => navigate("/subscription")}
                      className="btn-change-subscription"
                    >
                      Changer d'abonnement
                    </button>
                  </>
                ) : (
                  <>
                    <span className="badge-free">Gratuit</span>
                    <button
                      onClick={() => navigate("/subscription")}
                      className="btn-upgrade"
                    >
                      S'abonner
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Section Statistiques */}
          <div className="detail-group stats-group">
            <h3>Statistiques</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-number">0</span>
                <span className="stat-label">Livres favorisés</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">0</span>
                <span className="stat-label">Avis postés</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">0</span>
                <span className="stat-label">Essais gratuits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'Actions */}
        <div className="profile-actions">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Modifier le profil
              </button>
              <button onClick={handleLogout} className="btn-logout">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSaveProfile} className="btn-save">
                Enregistrer les changements
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="btn-cancel"
              >
                Annuler
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}